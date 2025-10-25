const express = require("express")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")
const { useAuth } = require("../middleware/auth")

const userRouter = express.Router()

const USER_SAFE_INFO = "firstName lastName photoUrl about skills gender age"

userRouter.get("/user/requests/received", useAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const recievedRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_INFO)

    res.json({
      message: "Received connection requests fetched successfully",
      data: recievedRequests,
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

userRouter.get("/user/connections", useAuth, async (req, res) => {
  const loggedInUserId = req.user._id
  try {
    // accepted loggedin ne kri ho ya saamne wale ne kri ho dono cases me connection consider krna hai
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId, status: "accepted" },
        { toUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_INFO)
      .populate("toUserId", USER_SAFE_INFO)

    const data = connectionRequests.map((connReq) => {
      if (connReq.fromUserId._id.equals(loggedInUserId)) {
        return connReq.toUserId
      } else {
        return connReq.fromUserId
      }
    })

    res.json({
      message: "Connections fetched successfully",
      data: data,
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

userRouter.get("/feed", useAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50 : limit
    const skip = (page - 1) * limit

    // saari request nikali jisme ya to maine(loggedInUser) kisi ko request bheji ho ya kisi aur ne mujhe bheji ho
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId")

    // ek set banaya jisme connection requests me involved saare users ke ids daal diye
    const hideUsersFromFeed = new Set()
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString())
      hideUsersFromFeed.add(req.toUserId.toString())
    })

    // ab feed ke liye un users ko fetch kiya jinke ids hideUsersFromFeed me nahi hain and who is not the logged in user
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_INFO)
      .limit(limit)
      .skip(skip)

    res.send(feedUsers)
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }

  //   // All users who have any request with me (either direction)
  //   const sentToMe   = await ConnectionRequest.distinct("fromUserId", { toUserId: loggedInUser._id });
  //   const sentByMe   = await ConnectionRequest.distinct("toUserId",   { fromUserId: loggedInUser._id });

  //   // Exclude them + myself
  //   const excludeIds = [...new Set([...sentToMe, ...sentByMe, loggedInUser._id])];

  //   // Feed = users with no connection/request with me
  //   const users = await User.find(
  //     { _id: { $nin: excludeIds } },
  //     { firstName: 1, lastName: 1, avatar: 1 } // pick fields you need
  //   )
  //   .limit(20)  // simple pagination
  //   .lean();
})

module.exports = userRouter

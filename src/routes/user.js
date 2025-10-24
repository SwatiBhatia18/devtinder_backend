const express = require("express")
const ConnectionRequest = require("../models/connectionRequest")
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

module.exports = userRouter

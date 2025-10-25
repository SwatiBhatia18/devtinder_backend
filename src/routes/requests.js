const express = require("express")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")
const { useAuth } = require("../middleware/auth")

const requestsRouter = express.Router()


requestsRouter.post(
  "/request/send/:status/:userId",
  useAuth,
  async (req, res) => {
    try {
      const { status, userId } = req.params
      const fromUserId = req.user._id
      const toUserId = userId

      const allowedStatuses = ["interested", "ignored"]
      // only these two statuses are allowed for sending connection requests
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status: " + status,
        })
      }
      // check if toUserId exists or the hacker is trying to send request to a non-existing user
      const toUser = await User.findById(toUserId)
      if (!toUser) {
        return res.status(404).json({
          message: "User not found",
        })
      }
      // check if a connection request has already been sent by fromUserId to toUserId then the toUserId cannot send another request to fromUserId
      // also the same fromUserId can't send multiple requests to the same user
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      })

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists between these users",
        })
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      })

      const data = await connectionRequest.save()
      res.json({
        message: `${req.user.firstName} sent ${status} connection request to ${toUser.firstName}`,
        data: data,
      })
    } catch (err) {
      res.status(400).send("ERROR: " + err.message)
    }
  }
)

requestsRouter.post("/request/review/:status/:requestId", useAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params
    const loggedInUserId = req.user._id

    // only these two statuses are allowed for reviewing connection requests
    const allowedStatuses = ["accepted", "rejected"]
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status: " + status,
      })
    }
    
    // check if the connection request exists and is addressed to the logged-in user and is in 'interested' status
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested",
    })
    if (!connectionRequest) {
      return res.status(404).json({
        message: "Connection request not found",
      })
    }
    connectionRequest.status = status
    await connectionRequest.save()
    res.json({
      message: "Connection request " + status,
      data: connectionRequest,
    })
  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = requestsRouter

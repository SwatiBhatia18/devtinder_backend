const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  {
    timestamps: true,
  }
)

// this is compound indexing to optimize the search queries for connection requests between two users
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

// using pre-save hook which checks before saving a connection request
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this
    // Check if fromUserId and toUserId are the same
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself")
    }
    next()
})

module.exports = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
)
import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId) {
        throw new ApiError(400, "channelId is required")
    }
    const subscriberId = req.user._id

    const existing = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId
    })

    if (existing) {
        const unsubscribed = await Subscription.findByIdAndDelete(existing._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, unsubscribed, "Unsubscribed successfully")
            )
    } else {
        const newSubscribed = await Subscription.create({
            channel: channelId,
            subscriber: subscriberId
        })

        return res
            .status(200)
            .json(
                new ApiResponse(200, newSubscribed, "Subscribed successfully")
            )
    }
    // console.log(channelId)
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId) {
        throw new ApiError(400, "channelId is required")
    }

    const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'username fullname profileImage avatar')

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscribers, "Channel subscribers fetched successfully")
        )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!subscriberId) {
        throw new ApiError(400, "subscriberId is required")
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate("channel", "username fullname avatar ")

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully")
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content) {
        throw new ApiError(400, "Content is required to create a tweet")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user._id
    })

    if (!tweet) {
        throw new ApiError(500, "Failed to create tweet")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Tweet created successfully")
        )
    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
    const owner = req.user._id
    if (!owner) {
        throw new ApiError(400, "User not found")
    }

    const UserTweets = await Tweet
        .find({ owner: owner })
        .sort({ createdAt: -1 })

    if (!UserTweets) {
        throw new ApiError(404, "No tweets found for this user")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, UserTweets, "User tweets fetched successfully")
        )
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    if (!tweetId) {
        throw new ApiError(400, "Tweet not found")
    }
    if (!content) {
        throw new ApiError(400, "Content is required")
    }
    // console.log(content)
    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set: {
                content
            }
        }, { new: true }
    )

    if (!updatedTweet) {
        throw new ApiError(404, "Updation of tweet failed ")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedTweet, "Tweet Updated Successfully")
        )
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id is required")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet deletion failed")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedTweet, "Tweet deleted successfully")
        )
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
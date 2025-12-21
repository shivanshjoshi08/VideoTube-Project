import mongoose, { isValidObjectId, mongo } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "videoId is required")
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const like = await Like.findOne(
        {
            video: videoId,
            likedBy: req.user._id
        }
    )

    if (like) {
        await Like.findByIdAndDelete(like._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { Liked: false }, "Video Like removed successfully")
            )
    }

    await Like.create(
        {
            video: videoId,
            likedBy: req.user._id
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, { Liked: true }, "Like added successfully")
        )

    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!commentId)
        throw new ApiError(400, "commentId is required")

    if (!mongoose.Types.ObjectId.isValid(commentId))
        throw new ApiError(400, "commentId is not valid")

    const existingCommentLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if (existingCommentLike) {
        await Like.findByIdAndDelete(existingCommentLike._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { Liked: false }, "Comment Like removed Successfully")
            )
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { Liked: true }, "Comment Like added successfully")
        )
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiError(400, "tweetId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "tweetId is invalid")
    }

    const existingTweetLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if (existingTweetLike) {
        await Like.findByIdAndDelete(existingTweetLike._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, { Liked: false }, "Tweet Like removed successfully")
            )
    }

    await Like.create({
        tweetId: tweetId,
        userId: req.user._id
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { Liked: true }, "Tweet Like added successfully")
        )
    //TODO: toggle like on tweet
})

const getLikedVideos = asyncHandler(async (req, res) => {
    
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
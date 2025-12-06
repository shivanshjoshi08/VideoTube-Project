import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { getWatchHistory } from "./user.controller.js"
import { User } from "../models/user.model.js";
import api from "../../../frontend/src/utils/api.js"
import mongoose from "mongoose"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    const skip = (pageNumber - 1) * limitNumber
    const matchStage = { isPublished: true }

    if (query) {
        matchStage.$or = [
            {
                title: {
                    $regex: query,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: query,
                    $options: "i"
                }
            }
        ]
    }

    if (userId) {
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }
    let sortStage = { createdAt: -1 };

    if (sortBy) {
        sortStage = {
            [sortBy]: sortType === "asc" ? 1 : -1
        };
    }

    // PIPELINE
    const videos = await Video.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { fullname: 1, username: 1, avatar: 1 } }
                ]
            }
        },
        { $unwind: "$owner" },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: limitNumber }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Videos fetched successfully")
        );
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    if (!title || !description) {
        throw new ApiError(400, "Title and Description are required")
    }
    // console.log(req.files)
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    // console.log("videoLocalPath:", videoLocalPath);
    // console.log("thumbnailLocalPath:", thumbnailLocalPath);

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "video and thumbnail, both are required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!video || !thumbnail) {
        throw new ApiError(500, "Error uploading media")
    }
    // if (!req.user || !req.user._id) {
    //     throw new ApiError(401, "User not authenticated");
    // }

    const newVideo = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: video.duration,
        views: 0,
        isPublished: true,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(200, newVideo, "Video uploaded Successfully")
        )
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // console.log(req.params)
    if (videoId === "undefined") {
        throw new ApiError(400, "Video ID is required")
    }

    // const video = await Video.findById(videoId).select("-__v -createdAt -updatedAt -videoFile -thumbnail")
    const video = await Video.findById(videoId)
        .populate("owner", "fullname username avatar")  // only return needed fields
        .select("-__v");
    // console.log(video)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    video.views += 1
    await video.save()

    // console.log(req.user)
    // console.log("yaha tak chal raha hai")
    if (req.user) {
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: {
                watchHistory: video._id

            }
        })
    } else {
        console.log("yaha tak chal raha hai")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video fetched successfully")
        )
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailLocalPath = req.file?.path || null
    // console.log(req.body)

    if (!title && !description && !thumbnailLocalPath) {
        throw new ApiError(400, "At least one field (title, description, thumbnail) is required to update")
    }

    if (!videoId) {
        throw new ApiError(400, "Video Id is required")
    }
    let thumbnail
    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        if (!thumbnail?.url) {
            throw new ApiError(500, "Error uploading thumbnail")
        }
    }

    const video = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                title: title ? title : undefined,
                description: description ? description : undefined,
                thumbnail: thumbnail?.url || undefined
            }
        }, { new: true }
    )

    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    // console.log(video)
    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "video updated successfully")
        )
    // console.log(video)
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "Video Id is required")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if (!deletedVideo) {
        throw new ApiError(404, "Video not found")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedVideo, "Video deleted successfully")
        )
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // const { isPublished } = req.body  // always be undefined , because frontend is not sending it

    if (!videoId) {
        throw new ApiError(400, "Video Id is required")
    }
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const togglePublish = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        }, { new: true }
    )
    if (!togglePublish) {
        throw new ApiError(400, "Video not found")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, togglePublish, "Publich status toggled successfully")
        )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
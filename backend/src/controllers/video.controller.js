import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { getWatchHistory } from "./user.controller.js"
import { User } from "../models/user.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    // return
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
    // console.log(req.body)
    if (!videoId) {
        throw new ApiError(400, "Video Id is required")
    }

    const video = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            description,
        }
    })
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
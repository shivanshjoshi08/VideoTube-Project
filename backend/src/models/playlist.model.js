import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        // required: true,
        type: String
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
    ],
    owner: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", playlistSchema)
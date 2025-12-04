import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: trueF
    },
    description: {
        require: true,
        type: String
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", playlistSchema)
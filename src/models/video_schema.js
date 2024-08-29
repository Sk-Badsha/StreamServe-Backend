import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);

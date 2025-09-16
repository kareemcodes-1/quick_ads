import mongoose from "mongoose";


export type User = {
    // _id?: string,
    name: string,
    email: string,
    password: string;
}

export interface Workspace {
 _id?: string;
  name: string;
  url: string;
  createdAt: Date;
}

export interface GeneratedImage {
  description: string;
  imageBase64: string;
  user: mongoose.Types.ObjectId;
  workspace: mongoose.Types.ObjectId;
  createdAt: Date;
}



export interface AdItem {
  _id: string;
  imageBase64: string;
  description: string;
  original?: string;
  videoUrl: string,
  avatarVideoUrl: string
}
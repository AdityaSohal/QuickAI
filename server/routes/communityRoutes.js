/* This code snippet is setting up a router for handling various routes related to a community feature
in a Node.js application using Express framework. Here's a breakdown of what each part does: */
import express from "express";
import { auth } from "../middleware/auth.js";
import { upload } from "../configs/multer.js";
import { 
  postImageToCommunity, 
  getAllCommunityPosts, 
  toggleCommunityLike 
} from "../controllers/communityControllers.js";

const communityRouter = express.Router();

communityRouter.post("/post-image", auth, upload.single("image"), postImageToCommunity);
communityRouter.get("/posts", auth, getAllCommunityPosts);
communityRouter.post("/toggle-like", auth, toggleCommunityLike);

export default communityRouter; 
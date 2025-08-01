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
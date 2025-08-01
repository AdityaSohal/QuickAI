import express from "express";
import {
    getUserCreations,
    getAllUserCreations,
    getPublishedCreations,
    toggleLikeCreations,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/get-user-creations", getUserCreations);
router.get("/get-all-user-creations", getAllUserCreations);
router.get("/get-published-creations", getPublishedCreations);
router.post("/toggle-like-creations", toggleLikeCreations);

export default router;

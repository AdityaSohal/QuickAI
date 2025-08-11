/* This code snippet is setting up a router using the Express framework in a Node.js application. It
imports necessary functions from a userControllers.js file, such as getUserCreations,
getAllUserCreations, getPublishedCreations, and toggleLikeCreations. */
import express from "express";
import {
    getUserCreations,
    getAllUserCreations,
    getPublishedCreations,
    toggleLikeCreations,
} from "../controllers/userControllers.js";

/* This code snippet is setting up routes for a router using the Express framework in a Node.js
application. It creates a router instance using `express.Router()` and then defines different HTTP
routes using the router's methods. */
const router = express.Router();

router.get("/get-user-creations", getUserCreations);
router.get("/get-all-user-creations", getAllUserCreations);
router.get("/get-published-creations", getPublishedCreations);
router.post("/toggle-like-creations", toggleLikeCreations);

export default router;

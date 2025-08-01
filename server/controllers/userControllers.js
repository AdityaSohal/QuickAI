import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";

// ------------------ Get All User Creations (Private) ------------------
export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth();

        // Get only private creations (publish = false or null)
        const creations = await sql`
      SELECT * FROM creations 
        WHERE user_id = ${userId} AND (publish = false OR publish IS NULL)
        ORDER BY created_at DESC
    `;

        res.json({ success: true, creations });
    } catch (error) {
        console.error("GetUserCreations Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------ Get All User Creations (All - for dashboard count) ------------------
export const getAllUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth();

        // Get all creations for dashboard count
        const creations = await sql`
      SELECT * FROM creations 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `;

        res.json({ success: true, creations });
    } catch (error) {
        console.error("GetAllUserCreations Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------ Get Published Creations (Community) ------------------
export const getPublishedCreations = async (req, res) => {
    try {
        const { userId } = req.auth();

        // Get all published creations from all users with like counts
        const publishedCreations = await sql`
      SELECT 
        c.*,
        ARRAY_LENGTH(c.likes, 1) as like_count,
        CASE WHEN ${userId} = ANY(c.likes) THEN true ELSE false END as is_liked
      FROM creations c
      WHERE c.publish = true AND c.type = 'image'
      ORDER BY c.created_at DESC
    `;

        // Get user information from Clerk for each creation
        const creationsWithUserInfo = await Promise.all(
            publishedCreations.map(async (creation) => {
                try {
                    const user = await clerkClient.users.getUser(creation.user_id);
                    return {
                        ...creation,
                        first_name: user.firstName,
                        last_name: user.lastName
                    };
                } catch (error) {
                    console.error(`Error fetching user ${creation.user_id}:`, error);
                    return {
                        ...creation,
                        first_name: 'Unknown',
                        last_name: 'User'
                    };
                }
            })
        );

        res.json({ success: true, creations: creationsWithUserInfo });
    } catch (error) {
        console.error("GetPublishedCreations Error:", error.message);
        res.json({ success: false, message: error.message });
    }
};

// ------------------ Toggle Like / Unlike Creation ------------------
export const toggleLikeCreations = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { creationId } = req.body;

        if (!creationId) {
            return res.json({ success: false, message: "Creation ID is required" });
        }

        const creation = await sql`
      SELECT * FROM creations WHERE id = ${creationId}
    `;

        if (creation.length === 0) {
            return res.json({ success: false, message: "Creation not found" });
        }

        const currentLikes = creation[0].likes || [];
        const isLiked = currentLikes.includes(userId);

        if (isLiked) {
            // Unlike: remove user from likes array
            const newLikes = currentLikes.filter(id => id !== userId);
            await sql`
        UPDATE creations 
        SET likes = ${newLikes}, updated_at = NOW()
        WHERE id = ${creationId}
        `;
            return res.json({
                success: true,
                liked: false,
                message: "You unliked this creation.",
            });
        } else {
            // Like: add user to likes array
            const newLikes = [...currentLikes, userId];
            await sql`
        UPDATE creations 
        SET likes = ${newLikes}, updated_at = NOW()
        WHERE id = ${creationId}
        `;
            return res.json({
                success: true,
                liked: true,
                message: "You liked this creation!",
            });
        }
    } catch (error) {
        console.error("ToggleLike Error:", error.message);
        console.error("Full error:", error);
        res.json({
            success: false,
            message: error.message || "Something went wrong while toggling like.",
        });
    }
};

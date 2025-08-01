import { v2 as cloudinary } from "cloudinary";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ------------------ Post Image to Community ------------------
export const postImageToCommunity = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { description } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    if (!description || description.trim().length === 0) {
      return res.json({ success: false, message: "Description is required" });
    }

    // Upload image to Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(imageFile.path, {
      folder: "community",
      public_id: `community_${Date.now()}`,
    });

    // Save to database
    await sql`
      INSERT INTO community_posts (user_id, image_url, description, created_at)
      VALUES (${userId}, ${secure_url}, ${description.trim()}, NOW())
    `;

    // Clean up uploaded file
    const fs = await import('fs');
    fs.unlinkSync(imageFile.path);

    res.json({ 
      success: true, 
      message: "Image posted successfully",
      data: {
        imageUrl: secure_url,
        description: description.trim()
      }
    });
  } catch (error) {
    console.error("Error posting image to community:", error);
    res.json({ 
      success: false, 
      message: error.message || "Failed to post image to community" 
    });
  }
};

// ------------------ Get All Community Posts with Like Counts ------------------
export const getAllCommunityPosts = async (req, res) => {
  try {
    const { userId } = req.auth();

    // Get all community posts with like counts and user info
    const posts = await sql`
      SELECT 
        cp.*,
        COUNT(cl.id) as like_count,
        CASE WHEN EXISTS(SELECT 1 FROM community_likes WHERE user_id = ${userId} AND post_id = cp.id) THEN true ELSE false END as is_liked
      FROM community_posts cp
      LEFT JOIN community_likes cl ON cp.id = cl.post_id
      GROUP BY cp.id
      ORDER BY cp.created_at DESC
    `;

    // Get user information from Clerk for each post
    const postsWithUserInfo = await Promise.all(
      posts.map(async (post) => {
        try {
          const user = await clerkClient.users.getUser(post.user_id);
          return {
            ...post,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl
            }
          };
        } catch (error) {
          console.error(`Error fetching user ${post.user_id}:`, error);
          return {
            ...post,
            user: {
              id: post.user_id,
              firstName: 'Unknown',
              lastName: 'User',
              imageUrl: null
            }
          };
        }
      })
    );

    res.json({ success: true, posts: postsWithUserInfo });
  } catch (error) {
    console.error("GetAllCommunityPosts Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ------------------ Toggle Like on Community Post ------------------
export const toggleCommunityLike = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.body;

    if (!postId) {
      return res.json({ success: false, message: "Post ID is required" });
    }

    // Check if post exists
    const post = await sql`
      SELECT * FROM community_posts WHERE id = ${postId}
    `;

    if (post.length === 0) {
      return res.json({ success: false, message: "Post not found" });
    }

    // Check if user already liked the post
    const existingLike = await sql`
      SELECT * FROM community_likes 
      WHERE user_id = ${userId} AND post_id = ${postId}
    `;

    if (existingLike.length > 0) {
      // Unlike the post
      await sql`
        DELETE FROM community_likes 
        WHERE user_id = ${userId} AND post_id = ${postId}
      `;
      return res.json({
        success: true,
        liked: false,
        message: "You unliked this post."
      });
    } else {
      // Like the post
      await sql`
        INSERT INTO community_likes (user_id, post_id, created_at) 
        VALUES (${userId}, ${postId}, NOW())
      `;
      return res.json({
        success: true,
        liked: true,
        message: "You liked this post!"
      });
    }
  } catch (error) {
    console.error("ToggleCommunityLike Error:", error.message);
    res.json({
      success: false,
      message: "Something went wrong while toggling like."
    });
  }
}; 
/**
 * The provided JavaScript function is a middleware that checks if a user has a premium plan and sets
 * the user's free usage accordingly.
 * @param req - The `req` parameter in the code snippet represents the request object in an Express.js
 * middleware function. It contains information about the HTTP request such as headers, parameters,
 * body, query parameters, etc. In this context, the `req` object is used to extract user
 * authentication information and perform checks to
 * @param res - The `res` parameter in the code snippet represents the response object in Express.js.
 * It is used to send a response back to the client making the HTTP request. The response object
 * (`res`) has methods like `res.status()`, `res.json()`, and others that are used to send different
 * @param next - The `next` parameter in the `auth` middleware function is a callback function that is
 * used to pass control to the next middleware function in the stack. When called, it executes the next
 * middleware function. This is commonly used in Express.js middleware to move to the next middleware
 * in the chain.
 */
import { clerkClient } from "@clerk/express";

// middleware has to check whether the user has a premium plan
export const auth = async(req, res, next) => {
    try {
        const { userId, has } = await req.auth();
        const hasPremiumPlan = await has({ plan: 'premium' });
        const user = await clerkClient.users.getUser(userId);
        
        if (!hasPremiumPlan && user.privateMetadata?.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            });
            req.free_usage = 0;
        }
        
        req.plan = hasPremiumPlan ? 'premium' : 'free';
        req.userId = userId;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Authentication failed',
            error: error.message 
        });
    }
};
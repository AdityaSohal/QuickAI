/**
 * The function `connectCloudinary` sets up the configuration for connecting to the Cloudinary service
 * using the provided environment variables.
 */
import {v2 as Cloudinary} from 'cloudinary'

const connectCloudinary = async () => {
    Cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export default connectCloudinary;
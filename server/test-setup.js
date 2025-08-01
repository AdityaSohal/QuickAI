import "dotenv/config";

console.log("🔍 Environment Variables Check:");
console.log("==================================");

const requiredVars = {
  "OpenAI API Key": process.env.OPENAI_API_KEY,
  "Clipdrop API Key": process.env.CLIPDROP_API_KEY,
  "Cloudinary Cloud Name": process.env.CLOUDINARY_CLOUD_NAME,
  "Cloudinary API Key": process.env.CLOUDINARY_API_KEY,
  "Cloudinary API Secret": process.env.CLOUDINARY_API_SECRET,
  "Clerk Secret Key": process.env.CLERK_SECRET_KEY,
  "Database URL": process.env.DATABASE_URL,
};

let allConfigured = true;

Object.entries(requiredVars).forEach(([name, value]) => {
  const status = value ? "✅ Configured" : "❌ Missing";
  console.log(`${name}: ${status}`);
  if (!value) allConfigured = false;
});

console.log("==================================");
if (allConfigured) {
  console.log("🎉 All environment variables are configured!");
  console.log("✅ Your application should work properly now.");
} else {
  console.log("⚠️  Some environment variables are missing.");
  console.log("📝 Please check the README.md for setup instructions.");
  console.log("🔗 Get API keys from:");
  console.log("   - OpenAI: https://platform.openai.com/api-keys");
  console.log("   - Clipdrop: https://clipdrop.co/apis");
  console.log("   - Cloudinary: https://cloudinary.com/");
  console.log("   - Clerk: https://clerk.com/");
} 
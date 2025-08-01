import axios from "axios";

const API_KEY = "AIzaSyBjc-0_6lGeeXoCgw5O00NnCy1V-wGZVwM"; // Replace this with your actual key

async function listModels() {
  try {
    const response = await axios.get(
      "https://generativelanguage.googleapis.com/v1/models",
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY,
        },
      }
    );

    const models = response.data.models;
    console.log("Available models:");
    models.forEach((model) => console.log(model.name));
  } catch (error) {
    console.error("Failed to list models:", error.response?.data || error.message);
  }
}

listModels();

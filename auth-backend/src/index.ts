import app from "./app";
import { config } from "dotenv";
import { connectToDatabase } from "./mysql/connection";
import { initializeRedisConnection } from "./redis/connection";

config(); // Load environment variables from .env file

const init = async () => {
  try {
    await connectToDatabase();
    await initializeRedisConnection();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || 5001}`);
    });
  } catch (error) {
    console.log("Error initializing the application:", error);
    process.exit(1); // Exit the process with failure
  }
};

init();

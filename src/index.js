import dotenv from "dotenv";
import connectDB from "./db/dbconnect_promise.js";

dotenv.config({
  path: "./env",
});

connectDB();

/*
(async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      .then(() => {});
  } catch (error) {
    console.log("Error: ", err);
    throw err;
  }
})();

*/

import dotenv from "dotenv";
import connectDB from "./db/dbconnect_promise.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then((res) => {
    app.on("error", (error) => {
      console.log("Error on App while listening : ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is listening on PORT number: ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(`MongoDB Connection failed!!!`, err);
  });

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

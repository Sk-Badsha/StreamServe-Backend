import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  deleteUser,
} from "../controllers/user_controller.js";
import { upload } from "../middlewares/multer_middleware.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-user-details").put(verifyJWT, updateUserDetails);
router
  .route("/update-user-avatar")
  .put(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-user-cover-image")
  .put(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/delete-user").delete(verifyJWT, deleteUser);
export default router;

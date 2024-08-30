import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user_schema.js";
import { uploadOnCloudinary } from "../utils/FileUpload.js";
const registerUser = asyncHandler(async (req, res) => {
  // get user data from frontend
  const { username, email, fullName, password } = req.body;
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (!email.includes("@")) throw new ApiError(400, "Email is not valid");

  const existedUser = User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser)
    throw new ApiError(404, "User with email/username already exists");

  const avatarLocalPath = req.files?.avatar?.path;
  const coverImageLocalPath = req.files?.coverImage?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar is required");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    username: username.toLowerCase(),
    email,
    coverImage: coverImage?.url || "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering user");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user registered successfully"));
});

export { registerUser };

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

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser)
    throw new ApiError(404, "User with email/username already exists");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) throw new ApiError(400, `Avatar  is required`);
  //   console.log("avtarlocalfilepath", avatarLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  //   console.log("avatar", avatar);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Avatar local path is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
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

const loginUser = asyncHandler(async (req, res) => {
  // take user data
  // find if user exist with that info
  // find the password and decrypt the password and compare
  // generate access & refresh token
  // give that to the user and also save it
  // send response

  const { email, username, password } = req.body;
  if (!username && !email)
    throw new ApiError(400, "username or email is required");

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) throw new ApiError(404, "user doesn't exist");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const { acc_token, ref_token } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", acc_token, options)
    .cookie("refreshToken", ref_token, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          acc_token,
          ref_token,
        },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const acc_token = user.generateAccessToken();
    const ref_token = user.generateRefreshToken();

    user.refreshToken = ref_token;

    await user.save({ validateBeforeSave: false });
    return { acc_token, ref_token };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

export { registerUser, loginUser, logoutUser };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res)=>{

    // get user details from frontend
    //validation - not empty, valid email, valid password
    //check if user already exists: username or email
    //check for images, or avatar
    //upload images in cloudinary, avatar
    //create user object - create entry in db
    //remove password and refreshToken field from response
    // check for user creation
    // return response

    const {username, email, fullName, password} = req.body; //destructuring
    console.log(username, email, fullName, password);
    if(
        [username,email,fullName,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required");
    }
    const exitedUser = User.findOne({
        $or:[{ username },{ email }]
    })
    if(exitedUser){
        throw new ApiError(409,"User already exists");
    }
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar image is required");
   }
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400,"Failed to upload avatar");
   }

 const user =  await User.create({
    username : username.toLowerCase(),
    email : email.toLowerCase(),
    fullName,
    avatar:avatar.url || "",
    coverImage:coverImage?.url || "",
    password,
   })
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
  }
  return res.status(201).json(
    new ApiResponse(201,createdUser, "User registered successfully")
  )
})

export { registerUser, };

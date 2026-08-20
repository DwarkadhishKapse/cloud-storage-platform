import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (userData) => {
  const { username, email, password, firstName, lastName, phoneNumber } =
    userData;

  if (
    !username ||
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !phoneNumber
  ) {
    throw new ApiError(400, "All required fields are mandatory.");
  }

  const existingEmail = await prisma.user.findFirst({
    where: { email },
  });

  if (existingEmail) {
    throw new ApiError(409, "Email already exists.");
  }

  const existingUsername = await prisma.user.findFirst({
    where: { username },
  });

  if (existingUsername) {
    throw new ApiError(409, "Username already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let user;

  try {
    user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new ApiError(409, "Email, username, or phone number already exists.");
    }

    throw error;
  }

  const { password: _, ...safeUser } = user;

  return {
    success: true,
    message: "User registered successfully.",
    user: safeUser,
  };
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken(user.id);

  const { password: _, ...safeUser } = user;

  return {
    message: "Login successful.",
    token,
    user: safeUser,
  };
};

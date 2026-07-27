import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

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
    throw new Error("All required fields are mandatory.");
  }

  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const existingUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
    },
  });

  return {
    success: true,
    message: "User registered successfully.",
    user,
  };
};

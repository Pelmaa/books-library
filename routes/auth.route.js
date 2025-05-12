const express = require("express");
const { createJWTToken } = require("../utils/jwt.util");
const { readFile, writeFile } = require("../utils/file.util");
const verifyAuth = require("../middlewares/verifyAuth.middleware");

const authRoutes = express.Router();
const usersFilePath = "./data/users.json";
const revokedTokensFilePath = "./data/revoked-tokens.json";

authRoutes.post("/signin", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: `Body cannot be empty` });
  }

  const keys = Object.keys(req.body);
  const requireKeys = ["email", "password"];

  const missingKeys = requireKeys.filter((key) => !keys.includes(key));

  if (missingKeys.length > 0) {
    return res.status(400).json({
      message: `Please provide all information: ${missingKeys.join(",")}`,
    });
  }

  const allUsers = await readFile(usersFilePath);

  const { email, password } = req.body;

  const user = allUsers.find((item) => item.email === email);

  if (!user) {
    return res
      .status(404)
      .json({ message: `User not found with the provided email ${email}` });
  }
  if (user.password !== password) {
    return res
      .status(400)
      .json({ message: `The password you have provided is incorrect` });
  }

  delete user.password; // deleted the key password

  const token = createJWTToken(user);

  res.json({ token });
});

authRoutes.post("/signup", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: `Body cannot be empty` });
  }

  const keys = Object.keys(req.body);
  const requireKeys = ["name", "age", "email", "password"];

  const missingKeys = requireKeys.filter((key) => !keys.includes(key));

  if (missingKeys.length > 0) {
    return res.status(400).json({
      message: `Please provide all information: ${missingKeys.join(",")}`,
    });
  }

  const allUsers = await readFile(usersFilePath);

  const { email, password } = req.body;

  const user = allUsers.find((item) => item.email === email);

  if (user) {
    return res
      .status(400)
      .json({ message: `User already exist with provided email ${email}` });
  }
  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: `The password must be more than 5 char` });
  }

  allUsers.push(req.body);

  await writeFile(usersFilePath, allUsers);

  res.status(201).json({ message: `User with ${email} created successfully` });
});

authRoutes.delete("/signout", verifyAuth, async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  const allRevokedTokens = await readFile(revokedTokensFilePath);
  allRevokedTokens.push(token);
  await writeFile(revokedTokensFilePath, allRevokedTokens);

  res.status(204).json({
    message: `Signout successfully`,
  });
});

module.exports = authRoutes;

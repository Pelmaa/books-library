const { readFile } = require("../utils/file.util");
const { verifyJWTToken } = require("../utils/jwt.util");
const revokedTokensFilePath = "./data/revoked-tokens.json";

const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: `Please provide authorization header` });
  }
  if (!authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: `Please provide token in valid format` });
  }
  const token = authHeader.split(" ")[1]; //Get second element from the array
  console.log(token);
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: `Please provide token` });
  }

  const allRevokedTokens = await readFile(revokedTokensFilePath);
  if (allRevokedTokens.includes(token)) {
    return res.status(401).json({ message: `Token is already revoked` });
  }

  const data = verifyJWTToken(token);
  if (data.error) {
    return res
      .status(401)
      .json({ message: `Please provide valid token - ${data.message}` });
  }
  req.user = data;
  next();
};

module.exports = verifyAuth;

import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { username, password } = req.body;

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server ki login settings mukammal nahi" });
  }

  if (
    !username ||
    !password ||
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Username ya password ghalat hai" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
};
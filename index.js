const express = require("express");
const booksRoutes = require("./routes/books.route");

const authRoutes = require("./routes/auth.route");

const PORT = 3000;

const app = express();

app.use(express.json());

app.use("/books", booksRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

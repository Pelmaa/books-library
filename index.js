const express = require("express");
const booksRoutes = require("./routes/books.routes");

const PORT = 3000;

const app = express();
app.use(express.json());

app.use("/books", booksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const { readFile, writeFile } = require("../utils/file.util");
const verifyAuth = require("../middlewares/verifyAuth.middleware");
const filePath = "./data/books.json";

const booksRoutes = express.Router();

booksRoutes.get("/", async (req, res) => {
  const books = await readFile(filePath);
  res.send(books);
});

booksRoutes.get("/:id", async (req, res) => {
  const books = await readFile(filePath);
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: `book ${id} not found` });
  }
});

booksRoutes.post("/", verifyAuth, async (req, res) => {
  const books = await readFile(filePath);
  const newBook = req.body;

  const keys = Object.keys(newBook);
  const requireKeys = ["title", "author", "publishedYear"];

  const missingKeys = requireKeys.filter((key) => !keys.includes(key));

  if (missingKeys.length > 0) {
    return res.status(400).json({
      message: `Please provide all information: ${missingKeys.join(",")}`,
    });
  }

  if (typeof newBook.publishedYear !== "number") {
    return res.status(400).json({
      message: `publishedYear should be a number`,
    });
  }

  const id = Date.now();
  newBook.id = id;
  books.push(newBook);
  await writeFile(filePath, books);
  res.status(201).json({ message: "book created", book: newBook });
});

booksRoutes.put("/:id", verifyAuth, async (req, res) => {
  let books = await readFile(filePath);
  const id = Number(req.params.id);
  const newBook = req.body;
  const book = books.find((item) => item.id === id);
  const keys = Object.keys(newBook);
  const requireKeys = ["title", "author", "publishedYear"];
  const missingKeys = requireKeys.filter((key) => !keys.includes(key));

  if (missingKeys.length > 0) {
    return res.status(400).json({
      message: `Please provide all information: ${missingKeys.join(",")}`,
    });
  }

  if (typeof newBook.publishedYear !== "number") {
    return res.status(400).json({
      message: `published Year should be a number`,
    });
  }

  if (book) {
    books = books.map((item) => {
      if (item.id === id) {
        newBook.id = id; // Makes sure the updated book keeps the same ID
        return newBook;
      }
      return item;
    });
    await writeFile(filePath, books);
    res.json({
      message: `book ${id} updated successfully`,
      book: newBook,
    });
  } else {
    res.status(404).json({ message: `book ${id} not found` });
  }
});

booksRoutes.delete("/:id", verifyAuth, async (req, res) => {
  let books = await readFile(filePath);
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);

  if (book) {
    books = books.filter((item) => item.id !== id);
    await writeFile(filePath, books);
    res.json({ message: `book ${id} deleted successfully` });
  } else {
    res.status(404).json({ message: `book ${id} not found` });
  }
});

module.exports = booksRoutes;

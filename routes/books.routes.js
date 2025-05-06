const express = require("express");
const fs = require("node:fs/promises");
const booksRoutes = express.Router();
const filePath = "./data/books.json";

const readFile = async () => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.log(err);
    return [];
  }
};

const writeFile = async (data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.log(err);
  }
};

booksRoutes.get("/", async (req, res) => {
  const books = await readFile();
  res.send(books);
});

booksRoutes.get("/:id", async (req, res) => {
  const books = await readFile();
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: `Book ${id} not found` });
  }
});

booksRoutes.post("/", async (req, res) => {
  const books = await readFile();
  const newBook = req.body;
  // const { title, author, publishedYear } = req.body;

  // if (!title || !author || !publishedYear) {
  //   return res.status(400).send("Title, author and publishedYear are required");
  // }
  const keys = Object.keys(newBook);
  const requireKeys = ["title", "author", "publishedYear"];
  const missingKeys = requireKeys.filter((key) => !keys.includes(key));

  if (missingKeys.length > 0) {
    return res.status(400).json({
      message: `Please provide all information: ${missingKeys.join(",")}`,
    });
  }
  if (typeof newBook.publishedYear !== "number") {
    return res.status(400).send("publishedYear must be a valid number");
  }
  id = Date.now();
  newBook.id = id;
  books.push(newBook);
  await writeFile(books);
  res.status(201).json({ message: "New book added", book: newBook });
});

booksRoutes.put("/:id", async (req, res) => {
  let books = await readFile();

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
    return res.status(400).send("publishedYear must be a valid number");
  }

  if (book) {
    books = books.map((item) => {
      if (item.id === id) {
        newBook.id = id;
        return newBook;
      }
      return item;
    });

    await writeFile(books);
    res.json({
      message: `Book ${id} updated successfully`,
      book: newBook,
    });
  } else {
    res.status(404).json({ message: `Book ${id} not found` });
  }
});

booksRoutes.delete("/:id", async (req, res) => {
  let books = await readFile();
  const id = Number(req.params.id);
  const book = books.find((item) => item.id === id);

  if (book) {
    books = books.filter((item) => item.id !== id);
    await writeFile(books);
    res.json({ message: `Book ${id} deleted successfully` });
  } else {
    res.status(404).json({ message: `Book with ${id} not found` });
  }
});

module.exports = booksRoutes;

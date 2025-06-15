const express = require("express");
const { BookModel } = require("../model/book.model");
const { auth, isAdmin, isSeller } = require("../middleware/auth.middleware");

const bookRouter = express.Router();

// GET all books with optional filters (all users)
bookRouter.get("/books", auth, async (req, res) => {
    try {
        const { category, author } = req.query;
        let query = {};
        if (category) query.category = category;
        if (author) query.author = author;
        let books = await BookModel.find(query).populate('owner', 'name email');
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// GET book by ID (all users)
bookRouter.get("/books/:id", auth, async (req, res) => {
    try {
        let book = await BookModel.findById(req.params.id).populate('owner', 'name email');
        if (!book) return res.status(404).json({ msg: "No book available with given id" });
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Seller/Admin: add new book
bookRouter.post("/books", auth, isSeller, async (req, res) => {
    try {
        let newBook = new BookModel({ ...req.body, owner: req.user._id });
        await newBook.save();
        res.status(201).json({ msg: "New Book Added...", book: newBook });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Seller/Admin: update book (only own books for seller)
bookRouter.patch("/books/:id", auth, isSeller, async (req, res) => {
    try {
        let book = await BookModel.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: "Book not found" });
        if (req.user.role !== "admin" && String(book.owner) !== String(req.user._id)) {
            return res.status(403).json({ msg: "Not allowed to update this book" });
        }
        await BookModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ msg: `Book with ID:${req.params.id} updated` });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Seller/Admin: delete book (only own books for seller)
bookRouter.delete("/books/:id", auth, isSeller, async (req, res) => {
    try {
        let book = await BookModel.findById(req.params.id);
        if (!book) return res.status(404).json({ msg: "Book not found" });
        if (req.user.role !== "admin" && String(book.owner) !== String(req.user._id)) {
            return res.status(403).json({ msg: "Not allowed to delete this book" });
        }
        await BookModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: `Book with ID:${req.params.id} has been Deleted` });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin: get all books (no filter)
bookRouter.get("/allbooks", auth, isAdmin, async (req, res) => {
    try {
        const books = await BookModel.find().populate('owner', 'name email');
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = {
    bookRouter
};
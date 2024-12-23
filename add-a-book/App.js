const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Path to the books.json file
const booksFilePath = path.join(__dirname, 'books.json');

// API endpoint to add a new book
app.post('/add-book', (req, res) => {
    const newBook = req.body;

    // Read the current books data from the books.json file
    fs.readFile(booksFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading books data', error: err });
        }

        let books = [];
        if (data) {
            books = JSON.parse(data);
        }

        // Add the new book to the books array
        books.push(newBook);

        // Write the updated books array back to the books.json file
        fs.writeFile(booksFilePath, JSON.stringify(books, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving the book', error: err });
            }
            res.status(200).json({ message: 'Book added successfully', book: newBook });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

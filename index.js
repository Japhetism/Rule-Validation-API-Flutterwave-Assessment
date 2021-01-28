const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const port = 4000;

let books = [];

app.use(cors())

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/books', (req, res) => {
    books = books.sort((a, b) => (a.date_created < b.date_created) ? 1 : -1)
    res.json(books);
});

app.post('/books', (req, res) => {
    let book = req.body;
    book.date_created = new Date()
    book.date_updated = new Date()
    books.push(book);
    res.send('Book is added to the database')
})

app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn
    for(let book of books) {
        if(book.isbn === isbn){
            res.json(book)
            return
        }
    }
    res.status(400).send(`Book with isbn ${isbn} not found.`);
})

app.delete('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn
    books = books.filter(i => {
        if(i.isbn !== isbn) {
            console.log(i)
            return i
        }
    })
    console.log(books)
    res.status(400).send(`Book with isbn ${isbn} not found.`)
})

app.put('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const newBook = req.body
    for(let i = 0; i < books.length; i++) {
        let book = books[i]
        if(book.isbn === isbn) {
            books[i] = newBook
            res.send(`Book with isbn ${isbn} is updated`)
            return
        }
    }
    res.status(400).send(`Book with isbn ${isbn} not found`)
})

app.listen(port, () => console.log(`Hello world app listening on port ${port}`))
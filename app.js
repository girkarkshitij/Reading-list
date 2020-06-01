//Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const bookList = document.querySelector('#book-list');
        const newBook = document.createElement('tr');
        newBook.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td class="isbn">${book.isbn}</td>
        <td><a href="#" class="btn-delete">X</a></td>
        `;
        bookList.append(newBook);
    }

    static deleteBook(target) {
        if (target.classList.contains('btn-delete'))
            target.parentElement.parentElement.remove();
    }

    static showAlert(message, color) {
        const div = document.createElement('div');
        div.className = `alert ${color}`;
        const text = document.createTextNode(message);
        div.appendChild(text);
        const form = document.querySelector('#book-form');
        const container = document.querySelector('.form-container');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearAll() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//Store Class (Local Storage)
class Store {
    static getBooks() {
        if (localStorage.getItem('books') === null) return [];
        else return JSON.parse(localStorage.getItem('books'));
    }

    static addBook(newBook) {
        const books = Store.getBooks();
        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(target) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === target)
                books.splice(index, 1);
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event : Display Books after refresh
window.addEventListener('DOMContentLoaded', (e) => {
    UI.displayBooks();
});

//Event : Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all details.', 'red');
    } else {
        const book = new Book(title, author, isbn);
        UI.addBookToList(book);
        UI.showAlert('Book Added Successfully', 'green');
        UI.clearAll();
        Store.addBook(book);
    }
});

//Event : Remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
    const row = e.target.parentElement.parentElement.querySelector('.isbn').innerHTML;
    Store.removeBook(row);
    UI.deleteBook(e.target);
    UI.showAlert('Book removed successfully', 'green');
});

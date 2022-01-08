/*
class book for holding books data
will act as a model class
*/
class Book {
    constructor(json) {
        this.name = json['name']
        this.isbn = json['isbn']
        this.authors = json['authors']
        this.numberOfPages = json['numberOfPages']
        this.publisherName = json['publisher']
        this.releaseDate = json['released']
        this.characters = json['characters']
    }
}

// Global variables
let books = []
let characters = []


//Function to get a book from Ice and Fire Api and parse it into a book object
async function getBookResponse(index) {
    var response = await fetch(`https://anapioficeandfire.com/api/books/${index}`)
    return (new Book(await response.json()))
}
//Function to get characters for a book and parse it
async function getCharacterResponse(url) {
    var response = await fetch(url)
    return await response.json()
}

// Function used to get number of books, as per requirement 50 books are required
// But the api only returned books till index 12 so repeating same function
async function getBooks() {
    for (let i = 1; i < 12; i++) {
        let response = await getBookResponse(i);
        books.push(response)
        console.log(`Pushed Book ${response}`);
    }
    showBooks()
}

// Function to get characters list from api and push them into local array
async function getCharacters(book) {
    characters.length = 0
    for (let i = 0; i < book.characters.length; i++) {
        let response = await getCharacterResponse(book.characters[i]);
        characters.push(response['name'])
        if (i == 5) {
            break;
        }
    }
}


//Function to show books in html by appending a card item to a div element
let showBooks = () => {
    var rowElement = document.getElementById('row');
    books.forEach(book => {
        rowElement.innerHTML = rowElement.innerHTML + `
        <div class="col-md-3">
        <div class="card my-3" onclick="bookOnTap(${books.indexOf(book)})">
            <img class="card-img-top" src="book.png" alt="">
            <div class="card-body" >
                <h4 class="card-title">${book.name}</h4>
                <p class="card-text">ISBN No: ${book.isbn}</p>
                <p class="card-text">No. of Pages: ${book.numberOfPages}</p>
                <p class="card-text">Author: ${book.authors[0]}</p>
                <p class="card-text">Publisher: ${book.publisherName}</p>
            </div>
        </div>
    </div>
    `
    })

}

// Function to handle the onclick event of the card
let bookOnTap = async (index) => {

    // Showing a loading indicator

    // Created a local copy of current body
    var temp = document.body.innerHTML;
    //Added the code for progress indicator and styled it to be in center
    document.body.innerHTML = `<div style = "position: absolute; top: 50%; right: 50%; transform: translateY(-50%, 50%)" class="spinner-border text-success">
    <span class="visually-hidden"></span>
</div>`
    //Getting data from the server
    let book = books[index];
    await getCharacters(book)
    //Got data from the server

    //Restoring body and hiding the spinner
    document.body.innerHTML = temp;

    //Adding a pop up modal to display the characters list
    document.body.innerHTML += `
    <div id="myModal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">${book.name}</h4>
                </div>
                <div class="modal-body">
                    <p>Characters:</p>
                    ${characters[0]}<br>
                    ${characters[1]}<br>
                    ${characters[2]}<br>
                    ${characters[3]}<br>
                    ${characters[4]}<br>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>

        </div>
    </div>`
    $("#myModal").modal()
    console.log(books[index].name);

}

getBooks().then(() => getBooks().then(() => getBooks()))
alert('Click on particular book for their characters')
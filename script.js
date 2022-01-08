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

let books = []
let characters = []

async function getBookResponse(index) {
    var response = await fetch(`https://anapioficeandfire.com/api/books/${index}`)
    return (new Book(await response.json()))
}

async function getCharacterResponse(url) {
    var response = await fetch(url)
    return await response.json()
}

async function getBooks() {
    for (let i = 1; i < 12; i++) {
        let response = await getBookResponse(i);
        books.push(response)
        console.log(`Pushed Book ${response}`);
    }
    for (let i = 1; i < 12; i++) {
        let response = await getBookResponse(i);
        books.push(response)
        console.log(`Pushed Book ${response}`);
    }
    showBooks()
}

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

let showBooks = () => {
    var rowElement = document.getElementById('row');
    books.forEach(book => {
        rowElement.innerHTML = rowElement.innerHTML + `
        <div class="col-md-3">
        <div class="card my-3" onclick="bookOnTap(${books.indexOf(book)})">
            <img class="card-img-top" src="http://res.freestockphotos.biz/pictures/14/14345-illustration-of-an-open-book-pv.png" alt="">
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

let bookOnTap = async (index) => {
    var temp = document.body.innerHTML;
    document.body.innerHTML = `<div style = "position: absolute; top: 50%; right: 50%; transform: translateY(-50%, 50%)" class="spinner-border text-success">
    <span class="visually-hidden"></span>
</div>`
    let book = books[index];
    await getCharacters(book)
    document.body.innerHTML = temp;
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

getBooks()
// alert('Click on particular book for their characters')
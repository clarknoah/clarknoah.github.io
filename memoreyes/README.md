# memoreyes
Memoreyes is a flashcard Web App!

# How to Use the App

> [Memoreyes Deployed Page](https://clarknoah.github.io/memoreyes/index.html)

Out of the box, this app starts with the `Things to Remember about Hildi` deck. You can use either the keyboard or the buttons provided in order to flip and to determine whether or not you know/don't know the answer to a flip card.

**Key**
Flip Card: `spacebar`
Don't Know Card: `D`
Know Card: `K`

The App will iterated through the unreviewed cards until there is nothing left. Then it will cycle through all of cards you missed. When the sidenav is open, a tracker is provided to inform you of what cards you have yet to review/passed/failed, as well as a Key for keyboard inputs (for you highspeed typers!).

## How the Code Works
The App works right out of the box, and relies on the `Memoreyes` class in order to run properly.


The following Javascript initializes the App (this is for example purpose only, the code is already provided in the `main.js`file)


```Javascript
//Initializes the Memoreyes Class
let memoreyes = new Memoreyes();

//Initialize a Deck Class and import deck from array
let dogDeck = new Deck("Things to Remember about Hildi").createDeckFromArray(hildiDeck);


// Create Text Deck
let randomDeck  = new Deck("Test Deck").createRandomCards(14);


// Add Decks to Memoreyes class
memoreyes.addDeck(dogDeck);
memoreyes.addDeck(randomDeck);


//Populate Navbar with Decks Available
memoreyes.domPopulateDecksInNavBar();

```



> Open `index.html`




## Adding Additional Decks

Additional decks can be added by running the following lines of code

```Javascript
let newDeck = new Deck("New Deck").createRandomCards(42);

memoreyes.domPopulateDecksInNavBar();

```


## Deck Format
In order to create your own deck, use the following model:

```Javascript
let importDeck = [
  [
    `text to be displayed on front of flashcard`,//required
    `text to be displayed on back of flashcard`,//required
    `relative url (from index.html root) for front image`//optional
    `relative url (from index.html root) for back imnage`//optional
  [
    //REPEAT ABOVE
  ],
];
```

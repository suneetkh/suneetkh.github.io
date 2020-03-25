var varbj = {}; // global variable to hold all of the variables for the blackjack app; creating object of named values


// Stores necessary fields to be used later

varbj.messagearea = document.getElementById('messagearea');
varbj.buttonBox = document.getElementById('buttonBox');
varbj.phandtext = document.getElementById('phand');
varbj.dhandtext = document.getElementById('dhand');
varbj.playcount = document.getElementById('playcount');
varbj.newgame = document.getElementById('newgame');
varbj.pcards = document.getElementById('pcards');
varbj.dcards = document.getElementById('dcards');
varbj.hitButton = document.getElementById('hit');
varbj.stayButton = document.getElementById('stay');
varbj.playButton = document.getElementById('play');
varbj.stats = document.getElementById('stats');

// initializing variables with arrays for hands/cards etc.
varbj.playerHand = [];
varbj.dealerHand = [];
varbj.deck = [];

varbj.suits = ['clubs <span class="bold">&#9827</span>',
    'diamonds <span class="redcard">&#9830</span>',
    'hearts <span class="redcard">&#9829</span>',
    'spades <span class="bold">&#9824</span>'];

varbj.values = ["Ace",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Jack",
    "Queen",
    "King"];

varbj.gameStatus = 0; // flag 0 means that game has not been started yet
varbj.games = 0; // the number of games played
varbj.wins = 0;  // number of wins
varbj.defeats = 0; // number of defeats
varbj.ties = 0;  // number of ties

// paramenetrs for a card: suits, values and names
function card(suit, value, name) { //this method to be used while building deck
    this.suit = suit; // string of clubs/diamonds/hearts/spades
    this.value = value; // Number: 1 - 10
    this.name = name; // string value of full card name
};


var newGame = function () {
    varbj.newgame.classList.add("hidden"); // remove newgame button and show hit/stay buttons

    // reset text and variables for newgame
    varbj.dcards.innerHTML = "";
    varbj.pcards.innerHTML = "";
    varbj.playerHand = [];
    varbj.dealerHand = [];
    varbj.gameStatus = 0; //0 means the game has not yet started yet

    // Make the new deck
    varbj.deck = buildDeck();

    // Deal two cards to the player
    varbj.playerHand.push(varbj.deck.pop()); //firstly pop/removes 1st card from deck and pushes/gives to player 
    varbj.playerHand.push(varbj.deck.pop()); //Secondly pop/removes 2nd card from deck and pushes/gives to player 

    // check if player wins
    if (handTotalValue(varbj.playerHand) === 21) { //check strict 21 meaning checking datatype and compare 2 values
        varbj.games += 1;
        varbj.gameStatus = 1; // to cause the dealer's hand to be drawn face up
        varbj.wins += 1; //increase win counter
        displayCards();
        varbj.messagearea.innerHTML = "Yay! You won &#128512 You got 21 on your initial hand!";
        counter();           //keeps track of how many games played
        varbj.gameStatus = 2; // game is won
        return;
    }

    // Deal two cards to the dealer
    varbj.dealerHand.push(varbj.deck.pop()); //firstly pop/removes 1st card from deck and pushes/gives to dealer 
    varbj.dealerHand.push(varbj.deck.pop()); //secondaly pop/removes 2nd card from deck and pushes/gives to dealer 

    // check if dealers wins    
    if (handTotalValue(varbj.dealerHand) === 21) {
        varbj.games += 1;
        varbj.defeats += 1;
        varbj.gameStatus = 1; // to cause the dealer's hand to be drawn face up
        displayCards();
        varbj.messagearea.innerHTML = "Oops! You lost &#128546 The dealer had 21 on their initial hand.";
        counter();
        varbj.gameStatus = 2; // game is won
        return;
    }

    // draw the hands if no one won on the initial deal
    displayCards();
    varbj.buttonBox.classList.remove("hidden"); // show hit/stay buttons
    varbj.messagearea.innerHTML = "Initial hands are dealt!";

};

//function to build a new deck
var buildDeck = function () {
    var deck = [];

    // looping through suits and values, building cards and adding them to the deck
    for (var a = 0; a < varbj.suits.length; a++) {
        for (var b = 0; b < varbj.values.length; b++) {
            var cardValue = b + 1;
            var cardTitle = "";
            //if card is J,Q,K, make its value 10
            if (cardValue > 10) {
                cardValue = 10;
            }
            if (cardValue != 1) {
                cardTitle += (varbj.values[b] + " of " + varbj.suits[a] + " (" + cardValue + ")");
            }
            else {
                cardTitle += (varbj.values[b] + " of " + varbj.suits[a] + " (" + cardValue + " or 11)"); //Ace can be 1 or 11
            }
            var newCard = new card(varbj.suits[a], cardValue, cardTitle);
            deck.push(newCard); //pushing new card to deck


        }
    }
    deck = shuffle(deck);  //Shuffle is required after building a new deck.
    return deck;
};

// Update the screen with the contents of the player and dealer hands
var displayCards = function () {
    var fillhtml = "";
    var ptotal = handTotalValue(varbj.playerHand); //total of player's hand
    var dtotal = handTotalValue(varbj.dealerHand); //total of dealer's hand
    fillhtml += "<ul>";
    for (var i = 0; i < varbj.playerHand.length; i++) {
        fillhtml += "<li>" + varbj.playerHand[i].name + "</li>";
    }
    fillhtml += "</ul>"
    varbj.pcards.innerHTML = fillhtml;
    varbj.phandtext.innerHTML = "You (" + ptotal + ")"; // update player hand total
    if (varbj.dealerHand.length == 0) {
        return;
    }

    // clear the html string, re-do for the dealer, depending on if player presses stay button or not
    fillhtml = "";
    if (varbj.gameStatus === 0) { //if the game result is not known
        fillhtml += "<ul><li>[Hidden Card]</li>";
        varbj.dhandtext.innerHTML = "Dealer (" + varbj.dealerHand[1].value + " + Hidden Card)"; // hiding value while a card is face down
    }
    else {
        varbj.dhandtext.innerHTML = "Dealer (" + dtotal + ")"; // update dealer hand total
    }

    for (var i = 0; i < varbj.dealerHand.length; i++) {
        // if the dealer hasn't had any new cards, don't display their face-down card
        // skip their first card, which will be displayed as hidden card
        if (varbj.gameStatus === 0) {
            i += 1;
        }
        fillhtml += "<li>" + varbj.dealerHand[i].name + "</li>";
    }
    fillhtml += "</ul>"
    varbj.dcards.innerHTML = fillhtml;

};

// this method returns the total value of the hand 
var handTotalValue = function (hand) {
    //console.log("value of hand");
    var total = 0;
    var aceFlag = 0; // track the number of aces in the hand
    for (var i = 0; i < hand.length; i++) {
        total += hand[i].value;
        if (hand[i].value == 1) {
            aceFlag += 1;
        }
    }
    // For each ace in the hand, add 10 if it is not causing a bust
    for (var j = 0; j < aceFlag; j++) {
        if (total + 10 <= 21) {
            total += 10;
        }
    }
    return total;
}

// Shuffles the new deck
var shuffle = function (deck) {
    // console.log("Begin shuffle...");
    var shuffledDeck = [];
    var deckL = deck.length;
    for (var a = 0; a < deckL; a++) {
        var randomCard = getRandomNum(0, (deck.length));
        shuffledDeck.push(deck[randomCard]);
        deck.splice(randomCard, 1); // replaces 1 element 
    }
    return shuffledDeck;
}

var getRandomNum = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


// Game begins on pressing new button button
varbj.playButton.addEventListener("click", newGame);

// When hit button is pressed

varbj.hitButton.addEventListener("click", function () {
    // disable hit button if  game is won
    if (varbj.gameStatus === 2) {
        return;
    }

    // deal a card to the player and draw the hands
    varbj.playerHand.push(varbj.deck.pop());
    displayCards();


    var handVal = handTotalValue(varbj.playerHand);
    if (handVal > 21) {
        bustgame();
        return;
    }
    else if (handVal === 21) {
        win();
        return;
    }
    varbj.messagearea.innerHTML = "Press Hit or Stay to proceed!</p>";
    return;
});

// When Stay button is pressed

varbj.stayButton.addEventListener("click", function stayLoop() {
    // disable stay button if game is already won

    if (varbj.gameStatus === 2) {
        return;
    }
    else if (varbj.gameStatus === 0) // if stay button is pressed
    {

        varbj.buttonBox.classList.add("hidden"); // hides hit and stay buttons
        var handVal = handTotalValue(varbj.dealerHand);
        varbj.gameStatus = 1; // enter the 'stay' loop which means now the dealer will reveal his hidden card
        varbj.messagearea.innerHTML = "Dealer reveals his/her hidden card";
        displayCards();
        setTimeout(stayLoop, 1000); // Dealer hits after 1 second
    }
    else if (varbj.gameStatus === 1) {

        // If dealer has less than 17, then dealer will hit
        var handVal = handTotalValue(varbj.dealerHand);
        if (handVal > 16 && handVal <= 21) // dealer stays
        {
            displayCards();
            var playerVal = handTotalValue(varbj.playerHand);
            if (playerVal > handVal) {
                win();
                return;
            }
            else if (playerVal < handVal) {
                bustgame();
                return;
            }
            else {
                tiegame();
                return;
            }
        }
        if (handVal > 21) {
            win();
            return;
        }
        else // hit
        {
            varbj.messagearea.innerHTML = "Dealer hits!";
            varbj.dealerHand.push(varbj.deck.pop());
            displayCards();
            setTimeout(stayLoop, 1000); // delater hits after 1 sec
            return;
        }
    }
});

var win = function () {
    varbj.games += 1;
    varbj.wins += 1;
    var messagetext = "";
    varbj.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotalValue(varbj.playerHand);
    var dealerTotal = handTotalValue(varbj.dealerHand);
    if (playerTotal === 21) {
        messagetext = "Your hand's value is 21!";
    }
    else if (dealerTotal > 21) {
        messagetext = "Dealer busted with " + dealerTotal + "!";
    }
    else {
        messagetext = "You had " + playerTotal + " and the dealer had " + dealerTotal + ".";
    }
    varbj.messagearea.innerHTML = "Yay! You won &#128512<br>" + messagetext + "<br>Press 'New Game' to play again.<br>";
    counter();
}

var bustgame = function () {
    varbj.games += 1;
    varbj.defeats += 1;
    var messagetext = "";
    varbj.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotalValue(varbj.playerHand);
    var dealerTotal = handTotalValue(varbj.dealerHand);
    if (playerTotal > 21) {
        messagetext = "You busted with " + playerTotal + ".";
    }
    else {
        messagetext = "You had " + playerTotal + " and the dealer had " + dealerTotal + ".";
    }
    varbj.messagearea.innerHTML = "Oops! You lost &#128546<br>" + messagetext + "<br>Press 'New Game' to play again.<br>";
    counter();
}

var tiegame = function () {
    varbj.games += 1;
    varbj.ties += 1;
    var messagetext = "";
    varbj.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotalValue(varbj.playerHand);
    varbj.messagearea.innerHTML = "It's a tie at " + playerTotal + " points each &#128528<br>Press 'New Game' to play again.<br>";
    counter();
}

// updates counter of games played
var counter = function () {
    varbj.playcount.innerHTML = "<p>" + varbj.games + " Games Played &#128202</p>";
    //varbj.stats.innerHTML = "<p>" + varbj.wins + " Wins(s) " + varbj.defeats + " Defeat(s) " + varbj.ties + " Draw(s)</p>";
    varbj.stats.innerHTML = "<p>Wins: " + varbj.wins + " Defeats: " + varbj.defeats + " Ties: " + varbj.ties + "</p>";
    varbj.newgame.classList.remove("hidden");
    varbj.buttonBox.classList.add("hidden");
}
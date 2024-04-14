let display = document.getElementById('display');
let dealerDisplay = document.getElementById('dealerDisplay');
let hitButton = document.getElementById('hitButton');
let standButton = document.getElementById('standButton');
let resetButton = document.getElementById('resetButton');
let startButton = document.getElementById('startButton');
let submitButton = document.getElementById('submitButton');
let betText = document.getElementById('betText');
let enter = document.getElementById('enter');
let moneyAmount = document.getElementById('moneyAmount');

//all my buttons and elements above
//________________________________________________________________________________________________________

//Here are functions that occur when the page first loads:


waitTilStart(); //only allows start button to be displayed and hides others (calls method below)

let deck = [ //creation of deck (face cards are 10)
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, // Ace through 10 (hearts,spades,clubs,diamonds)
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, // Ace through 10
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, // Ace through 10
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, // Ace through 10
];

shuffle(); //calls method that shuffles deck
// console.log(deck); check if shuffled

let total = 0;              //card sum total for user
let dealerTotal = 0;        //card sum total for dealer
let gambleMoney = 2500;     //Current amount of gambling money
let bet = 0;                //Current bet;

//____________________________________________________________________________________________________________


startButton.onclick = function() { //When the start button is clicked
    afterStart();                  //call function (from below);
}

submitButton.onclick = function() { //When submit button is clicked

    bet = Number(betText.value);    //put the value from the user inputted text into variable "bet"
    // console.log(bet); test

    if (isNaN(bet)) //if "bet" is not a number then ...
    {
        alert("Not a number!"); //alert the user this message
        return; //return cancels the rest of the function (everything below this within the button's function does not occur)
    }


    if (bet <= 0) //if the bet is 0 or under 0... (invalid bet)
    {
        alert("Not a valid bet! You cannot bet 0 or negative numbers")
        return; //cancels the rest of the function and reinput of "bet" is needed to go again
    }


    if (gambleMoney - bet < 0) //if your bet exceeds the amount of money you currently have...
    {
        alert("Betting over your total money");
        return; //cancel the rest of the function and reinput of "bet" is needed to go again
    }


    gambleMoney -= bet;                         //After a valid bet is cast, it is subtracted from your current total money
    moneyAmount.textContent = gambleMoney;      //(JAVASCRIPT) (Changes the text content of your money to reflect how much you have left after your bet)


    appear();                                   //(Calls method below to make the 3 buttons appear (HIT, STAND, RESET))
    dealerAdd();                                //(Calls method below to add 1 card to the dealer's sum)
    // console.log(dealerTotal); function check


    dealerDisplay.textContent = Number(dealerTotal); //(JAVASCRIPT) (dealer card sum is only updated for the first card)

    dealerAdd();                                     //Calls method below to add the 2nd card to the dealer's sum (doesnt show up to user);


    selfAdd();                                       //calls method below to add 1st card to USER sum
    selfAdd();                                       //calls method below to add 2nd card to USER sum
    // console.log(dealerTotal); test
}



hitButton.onclick = function() {                    //when hit button is clicked
    selfAdd();                                      //calls method below to add 1 more card to USER sum
    // console.log(total);   test              
    setTimeout(function() {                         //(JAVASCRIPT) (Adds a delay before a function occurs)
        if (total >= 21)                 //if USER sum is exactly 21 or exceeds 21...forced to challenge the dealer
        {
            dealerChallenge();           //Calls method to compare USER sum to dealer sum; 
        }
    }, 300);
}

standButton.onclick = function() {       //when stand button is clicked
    dealerChallenge();                   //challenge the dealer
}   


resetButton.onclick = function() {      //when the reset button is clicked
    waitTilStart();                     //call method below which resets the visibility of buttons (only start is shown and the rest of the buttons are hidden)
    gambleMoney = 2500;
    moneyAmount.textContent = gambleMoney;
    gameReset();                        //Calls method below which resets the entire game (EVEN the gambling total);
    

}



function shuffle() {                                //function for shuffling the deck at the start of each game and after each play

    for (let i = deck.length - 1;i > 0; i --)       // For loop from last index to first 
    {
        const j = Math.floor(Math.random() * (i));  //Math.random() * i (where 'j' refers to random index number generated from 1 to "i")
        [deck[i], deck[j]] = [deck[j], deck[i]];    //swaps the cards at the random j index and the i index
    }
}



function dealerAdd() {
    let rand = Number(deck.pop());                  //"Pops" the last card of the deck off and sets rand to it. "Popped" card disappears from the deck until the deck resets 
    dealerTotal += rand;                            // dealerTotal = dealerTotal + rand (adds dealer's total and the new card)
    // console.log(rand);
}

function selfAdd() {
    let rand2 = Number(deck.pop());                 //"Pops" the last card of the deck off and sets rand to it. "Popped" card disappears from the deck until the deck resets
    total += rand2;                                 //total = total + rand2;
    display.textContent = Number(total);            //(JAVASCRIPT) (changes USER sum display)
}

function dealerHit(){
    while (dealerTotal <= 16 && dealerTotal < total)            //The dealer continues to draw another card if the dealer's sum is less than or equal to 16 (trying to beat the player)
    {                                                           // AND if the dealer sum is greater than the USER sum
        dealerAdd();                                            //calls function to add card to dealer's sum
        dealerDisplay.textContent = Number(dealerTotal);
    }
}
function dealerChallenge() {                                    //function for challenging the dealer;
    dealerDisplay.textContent = Number(dealerTotal);
    dealerHit();                                                //calls function from above that will


    if (total == 21 && dealerTotal == 21)                       //(IMPORTANT THAT THIS CONDITION IS FIRST) (The only way the dealer can tie with you when you get a sum of 21 is if the dealer also gets 21)
    {
        alert("You both got 21! Tie!");
        ifTie();                                                //calls function below if there is a tie between the USER and the DEALER
        gameReset();                                            //Resets game back to start (DOES NOT RESET YOUR BET MONEY)
        return;                                                 //Cancels the rest of the function below (because you already resetted the game)
    }


    else if (total == 21)                                       //If you get here, that means your total is equal to 21 but your dealer's sum is not
    {
        alert("You have 21! You win!");                         
        ifWin();                                                //Call function below that rewards you when you win
        gameReset();                                            //calls function to reset game (DOES NOT RESET USER'S MONEY)
        return;                                                 //cancels the rest of the function
    }


    else if (total > 21)                                        //if USER's total is greater than 21 then USER has lost;
    {
        alert("You've exceeded 21! You lose!");
        ifLose();                                               //calls function below when you lose (The function checks if you have no more money after losing)
        gameReset();                                            //calls function to reset game (DOES NOT RESET USER'S MONEY)
        return;                                                 //cancels the rest of the function
    }


    setTimeout(function() {                                     //(JAVASCRIPT) (puts a delay before function);

        if (dealerTotal > 21)                                   //If the dealer's sum exceeds 21 then USER has won!
        {
            alert("Dealer exceeded 21! You win!");
            ifWin();                                            //calls function below when USER has won
        }           


        else if (total < dealerTotal)                           //if the dealer's sum is greater than USER's then USER loses
        {
            alert("Dealer beat you! You Lose!");
            ifLose();                                           //call function below when USER has lost
        }
        else if (total == dealerTotal)                          //if DEALER sum and USER sum is the same
        {
            alert("Tie! Go Again!")
            ifTie();                                            //calls function below when USER has tied
        }

        else                                                    //Any other case than the two above means that USER sum is greater than DEALER sum (USER wins)
        {   
            alert("You beat the dealer! You win!");
            ifWin();                                            //call function below when USER has won
        }
        gameReset();                                            //resets the game so USER can keep playing
    }, 1500);
}



function gameReset() {                                          //Resets game to allow USER to keep playing
    waitTilStart();                                             //Resets button visibility (only start button is showing)
    total = 0;                                                  //set USER sum back to 0;
    dealerTotal = 0;                                            //set DEALER sum back to 0;
    display.textContent = Number(total);                        //(JAVASCRIPT) changes USER sum display back to 0;
    dealerDisplay.textContent = Number(dealerTotal);            //(JAVASCRIPT) changes DEALER sum display back to 0;
    resetDeck();                                                //call function to reset deck to 52 cards and reshuffled
    // console.log(deck);
}


function waitTilStart()                                         //(JAVASCRIPT) resets visibility of buttons
{
    standButton.style.display = 'none';
    resetButton.style.display = 'none';
    hitButton.style.display = 'none';
    startButton.style.display = 'block';

    submitButton.style.display = 'none';
    betText.style.display = 'none';
    enter.style.display = 'none';

}

function afterStart() {                                         //(JAVASCRIPT) shows the USER the bet button and input options and makes the start button disappear
    submitButton.style.display = 'block';
    betText.style.display = 'block';
    enter.style.display = 'block';

    startButton.style.display = 'none';
}

function appear()                                               //(JAVASCRIPT) after the user has bet, the game function buttons will appear and the bet buttons disappear
{
    standButton.style.display = 'block';
    resetButton.style.display = 'block';
    hitButton.style.display = 'block';
    startButton.style.display = 'none';

    submitButton.style.display = 'none';
    betText.style.display = 'none';
    enter.style.display = 'none';
}

function resetDeck()                                            // Resets the deck to default
{
    deck = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, // Ace through 10 (hearts,spades,clubs,diamonds)
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, // Ace through 10
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, // Ace through 10
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, // Ace through 10
    ];
    shuffle();          //shuffles the deck after it is reset
}

function ifWin()        //if USER wins
{
    bet *= 2;                                           //double the bet (bet = bet * 2)
    gambleMoney += bet;                                 //add doubled bet to USER's gamble money
    moneyAmount.textContent = Number(gambleMoney);      //(JAVASCRIPT) updates the display of USER's money
}

function ifTie() //if USER ties
{
    gambleMoney += bet;                                 //returns the casted bet money back to the USER
    moneyAmount.textContent = Number(gambleMoney);      //(JAVASCRIPT) updates the display of USER's money
}


function ifLose(){             //if USER loses (bet has already been subtracted from USER's money so this exists to 
                               //check if USER has lost all their money and cannot continue the game)

    if (gambleMoney <= 0)                               //if USER has no money after losing
    {
        alert("You have no more money!")
        alert("Game is resetting!");

        gambleMoney = 2500;
        moneyAmount.textContent = gambleMoney;
        setTimeout(function(){                          //(JAVASCRIPT) delays the subsequent function)
            gameReset();                                //RESET OF THE GAME (resets GAMBLE MONEY TOO)
        }, 1000)
    }
}





<template>
    <div class="table__game-finished" v-if="gameDone">
        <span class="table__game-finished-status">{{ getStatusOfGame }}</span>
        <button class="table__game-finished-button" @click="newGame">PLAY AGAIN</button> 
    </div>
    
    <div v-else class="table">     
        <div class="table__score-dealer">
            <h2 class="table__participant">
                <span>DEALER</span>
                <span v-if="!playerDone" class="table__sum">Hidden sum</span>
                <span v-if="playerDone" class="table__sum">Sum: {{  totalSum(dealersCards) }}</span>      <!-- show dealers sum if player hit stay --> 
            </h2>

            <RouterLink :to="{ name: 'home'}">
                <img src="/images/exit.svg" alt="exit" class="table__exit">
            </RouterLink>
        </div>

        <main class="table__game">
            <section class="dealer">
                <div v-if="!playerDone" class="dealer__card--first">dealers hidden card</div>

                <div v-else class="dealer__cards"  v-for="(card, index) in dealersCards">
                    <img v-if="playerDone && index === 0" :src="card.image" :alt="card.code" class="dealer__card">
                    <img v-if="index > 0" :src="card.image" :alt="card.code" class="dealer__card">   
                </div>
            </section>

            <span class="table__status" v-if="!gameDone">{{ getStatusOfGame }}</span>

            <section class="player">    
                <div class="player__cards" v-for="card in playersCards">
                    <img :src="card.image" :alt="card.code" class="player__card">
                </div>
            </section>

            <div class="table__buttons">
                <button class="table__button" @click="drawCard(playersCards)">HIT ME</button>
                <button class="table__button" @click="dealersTurn">STAY</button>
            </div>
        </main>

        <section class="table__score-player">
            <div class="table__deck">
                <span class="table__deck-remaining">{{ remainingCards }}</span>
                <span class="table__deck-text">cards left</span>
            </div>

            <h2 class="table__participant"> 
                <span>YOU</span>
                <span class="table__sum">Sum: {{  totalSum(playersCards) }} </span>
            </h2>
        </section>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                deckId: '',
                gameStatus: '',
                dealersCards: [],
                playersCards: [],
                remainingCards: '',
                gameDone: false,
                playerDone: false,
                clicked: false,
                playAgainClicked: false,
                error: ''
            }
        },

        created() {
            // default table setup for first round
            if (!this.playAgainClicked) {
                this.setUpTable();
            }
        },

        computed: {
            getStatusOfGame() {
                /* check blackjack by default */
                if (this.dealersCards.length === 2 && this.dealersCards.length === 2) {
                    /* this.checkBlackJackByDefault(); */
                    if (this.totalSum(this.dealersCards) === 21 &&  this.totalSum(this.playersCards) !== 21 ) {
                    this.playerFinished();
                    this.gameFinished();
                    return this.gameStatus = 'BLACK JACK! Dealer wins...';

                } else {
                    if (this.totalSum(this.dealersCards) !== 21 &&  this.totalSum(this.playersCards) === 21) {
                        this.playerFinished();
                        this.gameFinished();
                        return this.gameStatus = 'BLACK JACK! Congrats, you win';
                        }
                    }
                } 

                /* check blackjack  dealer */
               if (this.totalSum(this.dealersCards) === 21 &&  this.totalSum(this.playersCards) !== 21 ) {
                    this.playerFinished();
                    this.gameFinished();
                    return this.gameStatus = 'BLACK JACK! Dealer wins...';
                
                /* check blackjack player */
                } else if (this.totalSum(this.dealersCards) !== 21 &&  this.totalSum(this.playersCards) === 21 ) {
                    this.playerFinished();
                    this.gameFinished();
                    return this.gameStatus = 'BLACK JACK! Congrats, you win';

                /* handle if both have blackjack */
                } else if (this.totalSum(this.dealersCards) === 21 &&  this.totalSum(this.playersCards) === 21) {
                    this.playerFinished();
                    this.gameFinished();
                    return this.gameStatus = 'BLACK JACK! Both have 21, but dealer still wins...';

                /* check if anyone is busted */
                } else { 
                    if (this.totalSum(this.dealersCards) > 21 ) {
                       this.playerFinished();
                       this.gameFinished(); 
                       return this.gameStatus = 'Dealer is busted, you win!';
                       
                    }  else {
                        if (this.totalSum(this.playersCards) > 21  ) {
                            this.playerFinished();
                            this.gameFinished();
                            return this.gameStatus = "You're busted, dealer wins...";
                        }
                    }
                }

                /* check who's winner when no one has blackjack or busted */
                if (this.playerDone && this.totalSum(this.dealersCards) < 21 && this.totalSum(this.playersCards) < 21) {
                    if (this.totalSum(this.dealersCards) > this.totalSum(this.playersCards)) {
                        this.gameFinished();
                        return this.gameStatus = 'Dealer is closest to 21 and wins!';

                    } else if (this.totalSum(this.dealersCards) === this.totalSum(this.playersCards)) {
                        this.gameFinished();
                        return this.gameStatus = 'Equal score, nobody wins'

                    } else {
                        this.gameFinished();
                        return this.gameStatus = 'Congrats, you are closest to 21 and win!';
                    }   
                }
                return this.gameStatus = 'None has Black Jack yet'; 
            },
        },

        methods: {
            async setUpTable() {
                /* fetch a new deck of cards with unique id */
                const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
                const response = await fetch(url);

                try {
                    if (response.ok) {
                        const { deck_id } = await response.json();
                        this.deckId = deck_id;
                    } else {
                        if (response.status === 404) {
                            throw new Error("Can't find url")
                        } else if (response.status === 500) {
                            throw new Error("Server error")
                        } else {
                            throw new Error("something went wrong");
                        }
                    }
                } catch (error) {
                    this.error = error.message;
                }

                /* draw four cards from deck for default table setup */
                const defaultCardsUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=4`;
                const defaultCardsResponse = await fetch(defaultCardsUrl);

                try {
                    await this.handleResponseDefaultCard(defaultCardsResponse);
                } catch(error) {
                    this.error = error.message
                }
            },

            async handleResponseDefaultCard(defaultCardsResponse) {
                if (defaultCardsResponse.ok) {
                    const data = await defaultCardsResponse.json();
                    /* add two cards to dealer */
                    this.dealersCards[0] = data.cards[0];
                    this.dealersCards[1] = data.cards[1];

                    /* add two cards to player */
                    this.playersCards[0] = data.cards[2];
                    this.playersCards[1] = data.cards[3];
                    // give value by index instead of push to replacecards when player clicks 'play again' (new fetch)

                    this.remainingCards = data.remaining; //update remaing cards in deck
                } else {
                    if (response.status === 404) {
                        throw new Error("Can't find url")
                    } else if (response.status === 500) {
                        throw new Error("Server error")
                    } else {
                        throw new Error("something went wrong");
                    }
                }
            },

            async drawCard(cardList) {
                // fetch 1 card from current deck each time player clicks 'hit me'
                const drawUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`;
                const drawResponse = await fetch(drawUrl);

                try {
                    await this.handleResponseDrawCard(drawResponse, cardList);
                } catch(error) {
                    this.error = error.message
                } 
            },

            async handleResponseDrawCard(drawResponse, cardList) {
                if (drawResponse.ok) {
                    const cardData = await drawResponse.json();

                    /* add card to correct list */
                    if (cardList === this.dealersCards) {
                        this.dealersCards.push(cardData.cards[0]);
                    } else {
                        if (cardList === this.playersCards) {
                            this.playersCards.push(cardData.cards[0]);
                        }
                    }
                    return this.remainingCards = cardData.remaining;       /* update remaining cards in stack*/
                } else {
                    if (response.status === 404) {
                        throw new Error("Can't find url")
                    } else if (response.status === 500) {
                        throw new Error("Server error")
                    } else {
                        throw new Error("something went wrong");
                    }
                }
            },

            async dealersTurn() {
                this.playerFinished();

                if (this.playerDone ) {
                    // if player is done and dealer total sum under 17, it must draw a card
                    while (this.totalSum(this.dealersCards) < 17 ) {
                       this.totalSum(this.dealersCards)                

                       await this.drawCard(this.dealersCards);
                       this.gameStatus = 'Dealer trekker har trukket kort';
                    }
               }     
            },

            checkBlackJackByDefault() {
                if (this.totalSum(this.dealersCards) === 21 &&  this.totalSum(this.playersCards) !== 21 ) {
                    this.playerFinished();
                    this.gameFinished();
                    return this.gameStatus = 'BLACK JACK! Dealer wins...';

                } else {
                    if (this.totalSum(this.dealersCards) !== 21 &&  this.totalSum(this.playersCards) === 21) {
                    this.playerFinished();
                    this.gameFinished();
                    return this.gameStatus = 'BLACK JACK! Congrats, you win';
                    }
                }
            },

            totalSum(cardList) { 
                let totalSum = 0;
                cardList.forEach(card => {
                    if (card.value === 'JACK' || card.value === 'QUEEN' || card.value === 'KING') {
                        totalSum += 10

                        /* ace conditions */
                    } else if (card.value === 'ACE' && cardList.length >= 2) {  /* if ace and not default table */
                        if ((totalSum + 11) > 21) {
                            totalSum += 1
                        } else {
                            totalSum += 11;
                        }      
                        
                    } else {
                        const valueAsNumer = parseInt(card.value);  /* parse value from API to number in order to add sum */
                        totalSum += valueAsNumer;
                    }
                })

                /* update correct total sum */
                if (cardList === this.dealersCards) {
                    return totalSum;
                } else {
                    if (cardList === this.playersCards){
                        return totalSum;
                    }
                }
            },

            playerFinished() {
                // show dealers points
                setTimeout(() => {
                    this.playerDone = !this.playerDone; 
                }, 100);
            },

            gameFinished() {
                // wait to show new game overlay, for user to se full table with points
                setTimeout(() => {
                    this.gameDone = !this.gameDone; 
                }, 800);
            },

            newGame() {
                // reset game values
                this.playAgainClicked = true;
                this.playerDone = false;
                this.gameDone = false;

                // remove drawn cards from previous game
                this.playersCards.length = 2;
                this.dealersCards.length = 2;
                
                this.setUpTable(); // set up table again
            },
        }
    }
</script>

<style>
    .table__game {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: -5%;
    }

    .dealer, .player {
        display: flex;
        align-items: center;
    }

    .dealer__card--first{       /* covers dealers first card until player hits 'stay' or game over */
        display: flex;
        justify-content: center;
        align-items: center;
        height: 190px;
        width: 140px;
        font-family: var(--second-font);
        font-size: 2em;
        color: var(--light);
        background-color: var(--dark);
        padding: var(--medium);
        margin: var(--margin-small);
        border-radius: 8px;
        border: 2px solid var(--light);
    }

    .dealer__card, .player__card {
        padding: var(--small);
        height: 212px;
        width: 165px;
    }

    .table__score-dealer, .table__score-player {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--small);
    }

    .table__score-player {
        position: absolute;
        display: flex;
        justify-content: space-between;
        width: 100%;
        bottom: 35%;
        padding: var(--medium);
    }

    .table__score-player--responsive {
        visibility: hidden;
        display: flex;
        justify-content: space-between;
        width: 100%;
        bottom: 180;
        padding: var(--medium);
    }

    .table__status {
        font-size: 2em;
        font-family: var(--second-font);
        color: var(--light);
        padding: var(--medium);
    }

    .table__deck {  
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 200px;
        width: 140px;
        font-family: var(--main-font);
        font-size: 3.2em;
        color: var(--light);
        background-color: var(--dark);
        border-radius: var(--corner-radius);
    }

    .table__deck-text {
        font-family: var(--second-font);
        font-size: 0.4em;
    }

    .table__buttons {
        display: flex;
    }

    .table__button {
        width: 225px;
        height: 60px;
        padding: var(--small);
        font-size: var(--button-text);
        font-family: var(--main-font);
        background-color: var(--main-color);
        border-radius: var(--corner-radius);
        border: none;
        margin: var(--medium) var(--small);
        cursor: pointer;
    }
    
    .table__button:hover {
        color: var(--light);
        background-color: var(--dark);
    } 

    .table__participant {
        display: flex;
        flex-direction: column;
        font-size: 2.7em;
        font-family: var(--main-font);
        color: var(--main-color);
        padding: var(--medium);
    }

    .table__exit {
        padding: var(--medium);
    }

    .table__sum {
        font-family: var(--second-font);
        font-size: 0.5em;
        color: var(--light);
    }

    .table__game-finished {
        position: absolute; /* for layover effect */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 2;
        height: 100vh;
        width: 100vw;
        opacity: 98%;   /* fix with rgba */
        background-color: var(--dark);
    }

    .table__game-finished-button {
        z-index: 1;
        width: 350px;
        height: 80px;
        font-family: var(--main-font);
        font-size: var(--button-text);
        background: var(--main-color);
        border: none;
        border-radius: var(--corner-radius);
        padding: var(--small);
        cursor: pointer;
    }

    .table__game-finished-button:hover {
        color: var(--main-color);
        background: var(--dark);
        border: 2px solid var(--main-color);
    }

    .table__game-finished-status {
        font-size: 3em;
        font-family: var(--second-font);
        font-weight: 1000;
        color: var(--light);
        padding-bottom: var(--medium);
    }


    /********* RESPONSIVE ***********/         
    @media screen and (max-width: 900px) { 
        .table__game {
            margin-top: 15%;
        }

        .table__deck {
            position: absolute;
            flex-direction: row;
            justify-content: space-evenly;
            font-size: 1.5em;
            background-color: transparent;
            height: 0%;
            left: 10;    
        }

        .table__deck-text {
            font-size: 0.8em;
            background-color: none;
        } 

        .table__participant {
            align-items: center;
            flex-direction: row;
            font-size: 1.8em;
            color: var(--light);
        }

        .table__score-dealer, .table__score-player {
            height: 50px;
            background-color: var(--dark);
            padding: 4%;
        }

        .table__score-dealer {
            margin-bottom: 3%;
        }

        .table__score-player {
            bottom: 0;
            justify-content: flex-end;
        }

        .dealer__card, .player__card {
            padding: var(--small);
            height: 190px;
            width: 150px;
        }

        .dealer__card--first {
            height: 170px;
            width: 125px;
           
        }

        .table__sum {
            padding-left: var(--small);
            font-size: 0.8em;
        }
    }

    @media screen and (max-width: 650px) { 
        .table__buttons {
            margin: var(--medium);
            flex-direction: column;
        }

        .table__button {
            margin: var(--small);
        }

        .table__score-player {
            position: fixed;
            bottom: 0;
        }
    }
</style>

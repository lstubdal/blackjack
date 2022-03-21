<template>
<!--     <div class="table__game-finished" v-if="gameDone">
        <p class="table__game-finished-status">{{ getStatusOfGame }}</p>
        
        <RouterLink :to="{ name: 'home' }">
            <button class="table__game-finished-button">PLAY AGAIN</button>
        </RouterLink>
    </div> -->

    <div class="table">     
       <div class="table__score-dealer">
           <h2 class="table__participant"> 
               <span>DEALER</span>
                <div v-if="!playerDone" class="table__sum">Hidden sum</div>
                <div v-if="playerDone" class="table__sum">Sum: {{  totalSum(dealersCards) }}</div>       <!-- show dealers sum if player hit stay --> 
            </h2>

            <RouterLink :to="{ name: 'home'}">
                <img src="/images/exit.svg" alt="exit" class="table__exit">
            </RouterLink>
        </div>

        <main class="table__game">
            <div class="dealer">
                <div v-if="!playerDone" class="dealer__card--first">dealers hidden card</div>
                <div class="dealer__cards"  v-for="(card, index) in dealersCards">
                    <img v-if="playerDone && index === 0" :src="card.image" :alt="card.code" class="dealer__card">
                    <img v-if="index > 0" :src="card.image" :alt="card.code" class="dealer__card">    <!-- kanskje??? :class="`dealer__card + index ${playerDone && index === 0 ? 'dealer__first-card' : ''}`" -->
                </div>
            </div>

            <div class="table__status" v-if="!gameDone">{{ getStatusOfGame }}</div>

            <div class="player">    <!-- section -->
                <div class="player__cards" v-for="card in playersCards">
                    <img :src="card.image" :alt="card.code" class="player__card">
                </div>
            </div>

            <div class="table__buttons">
                <button class="table__button" @click="drawCard(playersCards)">HIT ME</button>
                <button class="table__button" @click="dealersTurn">STAY</button>
            </div>
        </main>

        <div class="table__score-player">
            <div class="table__deck">
                <div class="table__deck-remaining">{{ remainingCards }}</div>
                <div class="table__deck-text">cards left</div>
            </div>

            <h2 class="table__participant"> 
                <span>YOU</span>
                <span class="table__sum">Sum: {{  totalSum(playersCards) }} </span>
            </h2>
        </div>

     <!--    <div class="table__score-player--responsive">
            <div class="table__deck">
                <div class="table__deck-remaining">{{ remainingCards }}</div>
                <div class="table__deck-text">cards left</div>
            </div>

            <h2 class="table__participant"> 
                <span>YOU</span>
                <span class="table__sum">Sum: {{  totalSum(playersCards) }} </span>
            </h2>
        </div> -->
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
                clicked: false
            }
        },

        created() {
            this.setUpTable();
        },

        computed: {
            getStatusOfGame() {
                /* check blackjack by default */
                if (this.dealersCards.length === 2 && this.dealersCards.length === 2) {
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

                /* check black jack  */
               if (this.totalSum(this.dealersCards) === 21 &&  this.totalSum(this.playersCards) !== 21 ) {
                    this.playerFinished();
                    this.gameFinished();
                    return this.gameStatus = 'BLACK JACK! Dealer wins...';
                
                } else if (this.totalSum(this.dealersCards) !== 21 &&  this.totalSum(this.playersCards) === 21 ) {
                    this.playerFinished();
                    this.gameFinished();
                    return this.gameStatus = 'BLACK JACK! Congrats, you win';

                } else if (this.totalSum(this.dealersCards) === 21 &&  this.totalSum(this.playersCards) === 21) {
                    this.playerFinished();
                    this.gameFinished();
                    return this.gameStatus = 'BLACK JACK! Both have 21, but dealer still wins...';

                } else { /* check if anyone is busted */
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

                /* check winner when no one has blackjack or busted */
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
                const { deck_id } = await response.json();

                this.deckId = deck_id;

                /* draw four cards from deck for default table */
                const defaultCardsUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=4`;
                const defaultCardsResponse = await fetch(defaultCardsUrl);
                const data = await defaultCardsResponse.json();

                /* add two cards to dealer */
                this.dealersCards.push(data.cards[0]);
                this.dealersCards.push(data.cards[1]);

                /* add two cards to player */
                this.playersCards.push(data.cards[2]);
                this.playersCards.push(data.cards[3]);

                this.remainingCards = data.remaining;
            },

            async drawCard(cardList) {
                const drawUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`;
                const drawResponse = await fetch(drawUrl);
                const cardData = await drawResponse.json();
                
                /* add card to correct list */
                if (cardList === this.dealersCards) {
                    this.dealersCards.push(cardData.cards[0]);
                    console.log('dealer trekker kort')
                } else {
                    if (cardList === this.playersCards) {
                        this.playersCards.push(cardData.cards[0]);
                        console.log('spiller trekker kort');
                    }
                }
                this.remainingCards = cardData.remaining;       /* update remaining cards in stack*/
            },

            async dealersTurn() {
                this.playerFinished();

                if (this.playerDone ) {
                    while (this.totalSum(this.dealersCards) < 17 ) {
                       this.totalSum(this.dealersCards)                 /* call on function to update sum  */

                       await this.drawCard(this.dealersCards);
                       this.gameStatus = 'Dealer trekker har trukket kort';
                       
                        console.log('dealer ferdig');
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
                            console.log('totalsum 1', totalSum);
                        } else {
                            totalSum += 11;
                            console.log('totalsum 11', totalSum);
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

            updateGameStatus(newUpdate) {
                this.gameStatus = newUpdate;
            },

            playerFinished() {
                setTimeout(() => {
                    this.playerDone = !this.playerDone; 
                }, 100);
            },

            gameFinished() {
                setTimeout(() => {
                    this.gameDone = !this.gameDone; 
                }, 800);
            },

            newGame() {
                
                /* this.setUpTable() */
            },

            exit() {
                // reset game
                //get a new deck of cards
                // reset deckId variable
                // reset players cards arrays
            },
        }
    }
</script>

<style>

    .table {
        height: 100vh;
        width: 100vw;
       /*  display: flex;
        flex-direction: column;
        justify-content: space-between; */
    }

    .table__game {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: -1%;
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


    /********* RESPONSIVE ***********/         
    @media screen and (max-width: 900px) { 

        .table__game {
            margin-top: 20%;
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
    
    }

</style>

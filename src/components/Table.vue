<template>
    <div class="table"> 
        <div class="table__game-finished" v-if="gameDone">
            <p class="table__game-finished-status">{{ getStatusOfGame }}</p>
            <RouterLink :to="{ name: 'home' }">
                <button @clicked="test" class="table__game-finished-button">PLAY AGAIN</button>
            </RouterLink>
        </div>

        <RouterLink :to="{ name: 'home'}">
            <img src="/images/exit.svg" alt="exit" class="table__exit">
        </RouterLink>

        <h2 class="table__participants table__participants--dealer"> DEALER
            <div v-if="playerDone" class="table__sum">Sum: {{  totalSum(dealersCards) }}</div>       <!-- show dealers sum if player hit stay --> 
        </h2>

        <div class="dealer">
            <div v-if="!playerDone" class="dealer__first-card">dealers hidden card</div>
            <div class="dealer__cards"  v-for="(card, index) in dealersCards">
                <img v-if="playerDone && index === 0" :src="card.image" :alt="card.code" class="dealer__card">
                <img v-if="index > 0" :src="card.image" :alt="card.code" class="dealer__card">    <!-- kanskje??? :class="`dealer__card + index ${playerDone && index === 0 ? 'dealer__first-card' : ''}`" -->
            </div>
        </div>

        <div class="table__deck">
            <div class="table__deck-remaining">{{ remainingCards }}</div>
            <div class="table__deck-text">cards left</div>
        </div>

        <div class="table__status">{{ getStatusOfGame }}</div>

        <h2 class="table__participants table__participants--you"> YOU
            <div class="table__sum">Sum: {{  totalSum(playersCards) }} </div>
        </h2>

        <div class="player">    <!-- section -->
            <div class="player__cards" v-for="card in playersCards">
                <img :src="card.image" :alt="card.code" class="player__card">
            </div>
        </div>

        <div class="table__buttons">
            <button class="table__button" @click="drawCard(playersCards)">HIT ME</button>
            <button class="table__button" @click="dealersTurn">STAY</button>
        </div>

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
                    } else if (card.value === 'ACE' && cardList.length >= 2) {
                        totalSum += 11
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
                }, 300);
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
            test() {
                console.log('clicked')
            }
        }
    }
</script>

<style>
    .table {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center; 
        height: 100vh;
        width: 100vw;
    }

    .table__game-finished {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        z-index: 2;
        height: 100vh;
        width: 100vw;
        opacity: 98%;
        background-color: var(--dark);
    }

    .table__game-finished-button {
        position: absolute;
        z-index: 1;
        width: 350px;
        height: 80px;
        font-family: var(--main-font);
        font-size: var(--button-size);
        background: var(--main-color);
        border: none;
        border-radius: var(--corner-radius);
        padding: var(--small);
        margin-left: -12%;
        cursor: pointer;
    }

    .table__game-finished-button:hover {
        color: var(--main-color);
        background: var(--dark);
        border: 2px solid var(--main-color);
    }

    .table__game-finished-status {
        position: absolute;
        font-size: 3em;
        font-family: var(--second-font);
        font-weight: 1000;
        color: var(--light);
        padding-bottom: 200px;
    }

    .table__exit {
        position: absolute;
        top: 30;
        right: 30;
    }

    .table__participants {
        position: absolute;
        z-index: 2;
        font-size: 3.5em;
        font-family: var(--main-font);
        color: var(--main-color);
    }

    .table__participants--dealer {
        top: 50;
        left: var(--side-margin);
    }

    .table__participants--you {
        top: 350;
        right: var(--side-margin);
    }

    .table__deck {
        position: absolute;
        left: var(--side-margin);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 220px;
        width: 160px;
        font-family: var(--main-font);
        font-size: 3.2em;
        color: var(--light);
        background-color: var(--dark);
        border-radius: var(--corner-radius);
    }

    .table__deck-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: var(--second-font);
        font-size: 0.4em;
    }

    .dealer, .player {
        display: flex;
        justify-content: center;
    }

    .dealer__cards {
        display: flex;
        justify-content: center;
    }

    .dealer__card, .player__card {
        padding: var(--small);
        height: 63%;
    }

    .dealer__first-card{       /* cover dealers first card until player hits 'stay' */
        display: flex;
        justify-content: center;
        align-items: center;
        width: 140px;
        font-family: var(--second-font);
        border-radius: 8px;
        padding: var(--medium);
        font-size: 2em;
        height: 190px;
        color: var(--light);
        background-color: var(--dark);
        margin-top: 10px;
        border: 2px solid var(--light);
    }

    .table__sum {
        position: absolute;
        font-family: var(--second-font);
        font-size: 0.5em;
        color: var(--light);
    }

    .table__buttons {
        position: absolute;
        bottom: 40;
        margin-top: var(--top-large);
    }

    .table__button {
        width: 225px;
        height: 60px;
        padding: var(--small);
        font-size: var(--button-text);
        font-family: var(--main-font);
        cursor: pointer;
        border-radius: var(--corner-radius);
        background-color: var(--main-color);
        border: none;
        margin: 0px var(--small);
    }
    
    .table__button:hover {
        color: var(--light);
        background-color: var(--dark);
    } 


    .table__button {
        width: 225px;
        height: 60px;
        padding: var(--small);
        font-size: 1.7em;
        font-family: var(--main-font);
        cursor: pointer;
        border-radius: var(--corner-radius);
        background-color: var(--main-color);
        border: none;
        margin: 0px var(--small);
    }
    
    .table__button:hover {
        color: var(--light);
        background-color: var(--dark);
    } 

    .table__status {
        position: absolute;
        font-size: 2em;
        font-family: var(--second-font);
        color: var(--light);
        padding-bottom: var(--extra-large);
    }
</style>

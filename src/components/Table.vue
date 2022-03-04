<template>
    <div class="table"> <!-- semantikk -->
        <div class="table__game-finished" v-if="gameFinished">
            <RouterLink :to="{ name: 'home'}">
                <button>PLAY AGAIN</button>
            </RouterLink>
        </div>

        <RouterLink :to="{ name: 'home'}">
            <img src="/images/exit.svg" alt="exit" class="table__exit">
        </RouterLink>

        <h2 class="table__participants table__participants--dealer">{{ participants[0] }} 
            <div  class="table__sum">Sum: {{  totalSum(dealersCards) }}</div>       <!-- show dealers sum if player hit stay --> <!-- v-if="!playerDone" -->
        </h2>

        <div class="dealer">
            <div v-if="playerDone" class="dealer__first-card">dealers hidden card</div>
            <div class="dealer__cards"  v-for="(card, index) in dealersCards">
                <img v-if="!playerDone && index === 0" :src="card.image" :alt="card.code" class="dealer__card">
                <img v-if="index > 0" :src="card.image" :alt="card.code" class="dealer__card">    <!-- kanskje??? :class="`dealer__card + index ${playerDone && index === 0 ? 'dealer__first-card' : ''}`" -->
            </div>
        </div>

        <div class="table__deck">
            <div class="table__deck-remaining">{{ remainingCards }}</div>
            <div class="table__deck-text">cards left</div>
        </div>

        <div class="table__status">{{ getStatusOfGame }}</div>

        <h2 class="table__participants table__participants--you">{{ participants[1] }}
            <div class="table__sum">Sum: {{  totalSum(playersCards) }} </div>
        </h2>

        <div class="player">    <!-- section -->
            <div class="player__cards" v-for="card in playersCards">
                <img :src="card.image" :alt="card.code" class="player__card">
            </div>
        </div>

        <div class="table__buttons">
            <button class="table__button" @click="drawCardPlayer">{{ buttonText[0] }}</button>
            <button class="table__button" @click="showDealersCard">{{ buttonText[1] }}</button>
        </div>

    </div>
</template>

<script>
    
    export default {
        data() {
            return {
                participants: ['DEALER', 'YOU'],
                buttonText: ['HIT ME', 'STAY'],
                gameStatus: '',
                deckId: '',
                dealersCards: [],
                playersCards: [],
                /* dealersSum: 0,
                playersSum: 0, */
                remainingCards: '',
                blackjack: 21,
                gameFinished: false,
                playerDone: false,
                dealerDrawsCard: false
            }
        },

        created() {
            this.setUpTable();
        },

        computed: {
             dealersDrawsCard() {
                return this.dealersDrawsCard = !this.dealerDrawsCard
            },

            getStatusOfGame() {
                
                if (this.totalSum(this.dealersCards) === 21 &&  this.totalSum(this.playersCards) !== 21 ) {
                    this.playerDone = !this.playerDone;
                    return this.gameStatus = 'BLACK JACK! Dealer wins...';
                
                } else if (this.totalSum(this.dealersCards) !== 21 &&  this.totalSum(this.playersCards) === 21 ) {
                    this.playerDone = !this.playerDone;
                    return this.gameStatus = 'BLACK JACK! Dealer wins...';

                } else if (this.totalSum(this.dealersCards) === 21 &&  this.totalSum(this.playersCards) === 21) {
                    this.playerDone = !this.playerDone;
                    return this.gameStatus = 'BLACK JACK! Both have 21, but dealer still wins...';

                } else {
                    return this.gameStatus = 'None has Black Jack yet';
                }
            },

            /* check status of default tabole */
            defaultTable() {
                
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

            async drawCardDealer() {
                
            /* when player stays, make dealer draw card while sum is under 17 */
                while (this.dealersTotalSum < 17 && this.playerDone ) {
                    const drawUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`;
                    const drawResponse =  await fetch(drawUrl);
                    const cardData = await drawResponse.json();
                    
                     setTimeout( () => {
                        this.dealersCards.push(cardData.cards[0]);
                        this.remainingCards = cardData.remaining;       /* update */
                    }, 2000) 
                    
                    this.dealersSum = 0;    /* reset sum for each time player draws a card */

                    console.log('etter push ', this.dealersCards.length);

                }        
            },

            async drawCardPlayer() {
                const drawUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`;
                const drawResponse = await fetch(drawUrl);
                const cardData = await drawResponse.json();
                
                console.log('før push ', this.playersCards.length);
                this.playersCards.push(cardData.cards[0]);
                this.playersSum = 0;    /* reset sum for each time player draws a card */
                console.log('etter push ', this.playersCards.length);

                this.remainingCards = cardData.remaining;       /* update */
            },

            showDealersCard() {
                this.drawCardDealer();
                this.dealerFinished();
                
            },


            totalSum(cardList) { 
                let totalSum = 0;

                cardList.forEach(card => {
                    if (card.value === 'JACK' || card.value === 'QUEEN' || card.value === 'KING') {
                        totalSum += 10
                    } else if (card.value === 'ACE' && cardList.length >= 2) {
                        totalSum += 11
                    } else {
                        const valueAsNumer = parseInt(card.value);
                        totalSum += valueAsNumer;
                    }
                })
                console.log('totalSum', totalSum)
                return totalSum;
            },

            exit() {
                // reset game
                //get a new deck of cards
                // reset deckId variable
                // reset players cards arrays
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
        position: absolute;
        z-index: 2;
        height: 100vh;
        width: 100vw;
        opacity: 90%;
        background-color: var(--dark);
    }

    .table__exit {
        position: absolute;
        top: 30;
        right: 30;
    }

    .table__participants {
        position: absolute;
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

    .table__status {
        position: absolute;
        font-size: 2em;
        font-family: var(--second-font);
        color: var(--light);
        padding-bottom: var(--extra-large);
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
</style>

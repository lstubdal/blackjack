<template>
    <div class="table">
        <RouterLink :to="{ name: 'home'}">
            <img src="/images/exit.svg" alt="exit" class="table__exit">
        </RouterLink>

        <h2 class="table__participants table__participants--dealer">{{ participants[0] }}</h2>

        <div class="dealer">
            <div v-for="card in dealersCards">
                <img :src="card.image" :alt="card.code" class="table__card">
            </div>
        </div>

        <div class="table__deck">
            <div class="table__deck-remaining">48</div>
            <div class="table__deck-text">cards left</div>
        </div>

        <div class="table__status"> status of game</div>

        <h2 class="table__participants table__participants--you">{{ participants[1] }}</h2>

        <div class="player">
            <div class="player__cards" v-for="card in playersCards">
                <img :src="card.image" :alt="card.code" class="table__card">
            </div>
        </div>

         <div class="table__buttons">
                <button class="table__button">{{ buttonText[0] }}</button>
                <button class="table__button">{{ buttonText[1] }}</button>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                participants: ['DEALER', 'YOU'],
                buttonText: ['HIT ME', 'STAY'],
                gameStatus: ['No one has Black Jack', 'Dealers turn...'],
                deckId: '',
                dealersCards: [],
                playersCards: [],
                remainingCards: ''
            }
        },

        created() {
            this.setUpTable();
        },

        methods: {
            async setUpTable() {

                /* fetch a new deck of cards with unique id */
                const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
                const response = await fetch(url);
                const { deck_id } = await response.json();

                this.deckId = deck_id;

                /* draw four cards from deck for default table */
                const drawUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=4`;
                const drawResponse = await fetch(drawUrl);
                const data = await drawResponse.json();

                console.log('kort igjen', data.remaining);
                console.log('cards', data.cards);

                this.dealersCards.push(data.cards[0]);
                this.dealersCards.push(data.cards[1]);
                console.log('DEALERS KORT', this.dealersCards.length);

                this.playersCards.push(data.cards[2]);
                this.playersCards.push(data.cards[3]);
                console.log('PLAYER KORT', this.dealersCards.length);
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
        height: 230px;
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
    }

    .table__status {
        position: absolute;
        font-size: 2.5em;
        font-family: var(--second-font);
        color: var(--light);
        padding-bottom: var(--extra-large);
    }

    .table__card {
        padding: var(--small);
        height: 65%;
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
</style>
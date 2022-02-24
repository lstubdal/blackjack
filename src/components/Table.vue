<template>
    <div class="table">
        <img src="/images/exit.svg" alt="exit" class="table__exit">
        <h2 class="table__participants table__participants--dealer">{{ participants[0] }}</h2>

        <div class="dealer">
            <div class="dealer__cards">
                dealer cards
            </div>
        </div>

        <div class="table__deck">
            <div class="table__deck-remaining">48</div>
            <div class="table__deck-text">cards left</div>
        </div>

        <div class="table__status"> status of game</div>

        <h2 class="table__participants table__participants--you">{{ participants[1] }}</h2>

        <div class="player">
            <div class="player__cards">
                player cards
            </div>

            <div class="player__buttons">
                <button class="player__button">{{ buttonText[0] }}</button>
                <button class="player__button">{{ buttonText[1] }}</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                participants: ['DEALER', 'YOU'],
                buttonText: ['HIT ME', 'STAY'],
                gameStatus: ['No one has Black Jack', 'Dealers turn...']
            }
        },

        methods: {
            
        }
    }
</script>

<style>
    .table {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
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
    
    .table__status {
        font-size: 2.5em;
        font-family: var(--second-font);
        color: var(--light);
    }

    .player__cards {
        text-align: center;
    }

    .player__buttons {
        margin-top: var(--top-large);
    }

    .player__button {
        width: 225px;
        height: 60px;
        padding: var(--small);
        font-size: 1.7em;
        font-family: var(--main-font);
        cursor: pointer;
        border-radius: var(--corner-radius);
        background-color: var(--main-color);
        border: none;
        margin: 0px var(--medium);
    }
    
    .player__button:hover {
        color: var(--light);
        background-color: var(--dark);
    } 
</style>
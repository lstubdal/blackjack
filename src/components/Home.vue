<template>
    <div class="home">
        <p class="home__headline"> {{ headline }} </p>
        <h1 class="home__title"> {{ title }} </h1>

        <button class="home__button" @click="startGame">START GAME</button>     
    </div>
</template>

<script>
    export default {
        data() {
            return {
                headline: "Let's play",
                title: 'BLACK JACK',  
            }
        },

        methods: {
            startGame() {
                this.$router.push('table');
            },
        }
    }
</script>

<style>
    .home {
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    
    .home__headline {
        color: var(--light);
        font-size: 3em;
        font-weight: 200;
        font-family: var(--second-font);
        padding: var(--medium);
    }

    .home__title {
        color: var(--main-color);
        font-size: 7em;
        font-family: var(--main-font);
        text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
    }

    .home__button {
        width: 20%;
        padding: 25px;
        font-size: 2em;
        font-family: var(--main-font);
        background-color: var(--main-color);
        border-radius: var(--corner-radius);
        border: none;
        cursor: pointer;
        margin: 5%;
    }

    .home__button:hover, .home__button--clicked {
        color: var(--light);
        background-color: var(--dark);
    }

    /********* RESPONSIVE ***********/ 
    @media screen and (max-width: 900px) {
        .home__headline {
            font-size: 2em;
        }

        .home__title {
            font-size: 5em;
        }

        .home__button {
            width: 30%;
        }
    }
</style>
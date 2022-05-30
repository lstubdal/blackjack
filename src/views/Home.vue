<template>
    <div class="home">
        <p class="home__headline"> {{ headline }} </p>
        <h1 class="home__title"> {{ title }} </h1>

        <RouterLink :to="{name: 'table'}" class="home__link" @click="startGame">START GAME</RouterLink>     
    </div>
</template>

<script>
    export default {
        data() {
            return {
                headline: "Let's play",
                title: 'BLACK JACK',  
            }
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

    .home__link {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30%;
        font-size: 2em;
        font-family: var(--main-font);
        color: var(--dark);
        background-color: var(--main-color);
        border-radius: var(--corner-radius);
        border: none;
        text-decoration: none;
        cursor: pointer;
        padding: 25px;
        margin: 5%;
    }

    .home__link:hover, .home__link--clicked {
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

        .home__link {
            width: 40%;
        }
    }
</style>
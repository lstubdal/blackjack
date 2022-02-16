<template>
    <div class="table">
        <p class="table__headline"> {{ headline }} </p>
        <h1 class="table__title"> {{ title }} </h1>

        <div class="selectPlayers">
            <p class="selectPlayers__message"> {{ selectTotalPlayers.message }} </p>
            <select class="selectPlayers__selector" @change="getTotalPlayers($event)">    
                <option value="placeholder">Select</option>
                <option value="1"> {{ selectTotalPlayers.totalPlayers[0] }}</option>
                <option value="2"> {{ selectTotalPlayers.totalPlayers[1] }}</option>
                <option value="3"> {{ selectTotalPlayers.totalPlayers[2] }}</option>
            </select>
        </div>

        <button class="table__button" @click="goToPlayer">START GAME</button>     
    </div>
</template>

<script>
    export default {
        data() {
            return {
                headline: "Let's play",
                title: 'BLACK JACK',
                selectTotalPlayers: {
                    message: 'How many players?',
                    totalPlayers: [1, 2, 3]
                },
                totalPlayers: ''
                
            }
        },

        computed: {
            checkTotalPlayers() {
                if (this.totalPlayers > 1 ) {
                    return true 
                } else {
                    return false
                }
            }
        }, 

        methods: {
            getTotalPlayers(event) {       /* get value of option when button clicked */
                this.totalPlayers = event.target.value;
                console.log(event.target.value);
                return this.totalPlayers;
            },

            goToPlayer() {
                if (this.totalPlayers < 1 ) {
                    console.log('not selected');
                }

                if (this.totalPlayers > 1) {
                    this.$router.push('multiplePlayer');
                } else {
                    
                    if (this.totalPlayers === 1) {
                        this.$router.push('singlePlayer');
                    }
                }
            }
        }
    }
</script>

<style>
    .table {
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    
    .table__headline {
        color: var(--light);
        font-size: 4em;
        font-weight: 200;
        font-family: var(--second-font);
    }

    .table__title {
        color: var(--main-color);
        font-size: 9em;
        font-family: var(--main-font);
    }

    .selectPlayers {
        padding: var(--gap-large);
        text-align: center;
    }

    .selectPlayers__message {
        font-family: var(--second-font);
        font-weight: 200;
        font-size: 3em;
        color: var(--light);
        padding: var(--gap-medium);
    }

    .selectPlayers__selector {
        width: 30%;
        height: 60px;
        font-size: 2em;
        text-align: center;
        padding: 10px;
        border-radius: var(--corner-radius);
    }

    .table__button {
        width: 25%;
        padding: 30px;
        font-size: 2em;
        cursor: pointer;
        border-radius: var(--corner-radius);
        background-color: var(--main-color);
        margin: 5%;
    }

    
</style>
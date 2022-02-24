<template>
    <div class="singlePlayer">
        <div class="singlePlayer__title"> {{ title }}</div>
        <div class="singlePlayer__default-cards">
            
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                title: 'Single player',
                deckId: '',
                cards: [],
                sum: 0
            }
        },

        created() {
            this.setUpTable();
        },

        computed: { 
            totalSum() {
                this.cards.forEach(card => {
                    if (card.value === 'JACK' || card.value === 'QUEEN' || card.value === 'KING') {
                        this.sum += 10;

                    } else if (card.value === 'ACE') {
                            
                    } else {
                        this.sum += card.value;
                    }

                })
            }
        },

        methods: {
            async setUpTable() {  

                /* get full deck of cards and its id */
                const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
                const response = await fetch(url);
                const { deck_id } = await response.json();

                this.deckId = deck_id;
                console.log('KORTSTOKK HENTET', this.deckId)

                /* draw two cards for the player to begin with */
                const drawUrl = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=2`;
                const drawResponse = await fetch(drawUrl);
                const data = await drawResponse.json();
                

                console.log('kort trukket', data.remaining);
                console.log('cards', data.cards )

                this.cards.push(data.cards[0]);
                this.cards.push(data.cards[1]);

                console.log('liste', this.cards.length );
                this.cards.forEach(card => {
                    console.log('CODE', card.code)
                })
            },


        }
    }
</script>

<style>
    .singlePlayer {
        font-size: 4em;
        font-family: var(--main-font);
        color: var(--main-color);
        padding: var(--large);
    }
</style>

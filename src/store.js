export default {
    state() {
        return {
            playerMode: [
                { type: 'singel', id: 0 },
                { type: 'several', id: 1}
            ]
        }
    },

    getPlayerMode(state) {
        return state.playerMode;
    }
}
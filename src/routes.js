import TableView from './views/TableView.vue';
import PlayerView from './views/PlayerView.vue';
import SinglePlayerView from './views/SinglePlayerView.vue';
import MultiplePlayerView from './views/MultiplePlayerView.vue';

export default [
	{ name: 'tableview', 			path: '/', 						component: TableView },
/* 	{ name: 'singlePlayer', 		path: '/single-player', 		component: SinglePlayerView, 		},
	{ name: 'multiplePlayers', 		path: '/multiple-player', 		component: MultiplePlayerView, 		}, */
	{ name: 'player', 				path: '/:player_mode', 			component: PlayerView, 		props: true}
]
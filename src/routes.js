import TableView from './views/TableView.vue';
import HomeView from './views/HomeView.vue';

/* import SinglePlayerView from './views/SinglePlayerView.vue';
import MultiplePlayerView from './views/MultiplePlayerView.vue'; */

export default [
	{ name: 'home', 				path: '/', 							component: HomeView },
	{ name: 'tableview', 			path: '/table', 				component: TableView },
/* 	{ name: 'singlePlayer', 		path: '/single-player', 		component: SinglePlayerView, 		},
	{ name: 'multiplePlayers', 		path: '/multiple-player', 		component: MultiplePlayerView, 		}, 
	{ name: 'player', 				path: '/:player_mode', 			component: PlayerView, 		props: true} */
]
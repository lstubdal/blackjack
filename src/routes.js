import Table from './views/Table.vue';
import Home from './views/Home.vue';

export default [
	{ 
		name: 'home',
		path: '/', 					
		component: Home 
	},
	{ 
		name: 'table', 			
		path: '/table', 			
		component: Table 
	}
]
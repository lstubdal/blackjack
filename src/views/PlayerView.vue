<template>
    <!-- PAGE!! -> {{ $route.params.player_mode }} -->
    <SinglePlayer v-if="$route.params.player_mode === 'singlePlayer'" />
    <MultiplePlayer v-if="$route.params.player_mode === 'multiplePlayer'" />
</template>

<script>
    import SinglePlayer from '../components/SinglePlayer.vue';
    import MultiplePlayer from '../components/MultiplePlayer.vue';

    export default {
       components: {
           SinglePlayer,
           MultiplePlayer 
       }
    }
    
</script>

<style>
</style>

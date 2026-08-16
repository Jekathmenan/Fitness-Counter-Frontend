<script setup>
    import Header from '@/components/template/Header.vue';
    import { ref, onMounted } from 'vue';
    import { useFlashStore } from '@/stores/flash';
    import apiClient from '@/api/client';
    import { Pencil, Trash2 } from 'icons';

    const flashStore = useFlashStore();
    const exercises = ref({});
    
</script>
<template>
    <Header title="Übungen verwalten"
        path="/core-data"
        urlText="Zur&uuml;ck zu den Stammdaten"
        addText="Hinzuf&uuml;gen"
        addPath="/core-data/exercises/add"

</template>
<style lang="css" scoped>
</style>
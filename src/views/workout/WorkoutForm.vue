<script setup>
    import Header from '@/components/template/reusable/Header.vue';
    import WorkoutExerciseCard from '@/components/template/workout/WorkoutExerciseCard.vue';
    import AddExercise from '@/components/template/workout/AddExercise.vue';
    import ConfirmModal from '@/components/template/reusable/ConfirmModal.vue';
    import { onMounted, ref } from 'vue';
    import { useFlashStore } from '@/stores/flash';
    import apiClient from '@/api/client';

    const flash = useFlashStore();
    const workout = ref([]);
    const workoutExercises = ref([]);
    const allExercises = ref([]);
    const showAddModal = ref(false);
    const itemToDelete = ref([]);
    const allowDelete = ref(false);
    const isDeleteModalOpen = ref(false);

    // Lädt das aktive Training
    const retrieveActiveWorkout = async () => {
        try {
            // Lade die aktive Training
            const activeRes = await apiClient.get("workout/active");
            workout.value = activeRes.data;

            // Starte neues Training, wenn noch keins läuft
            if (!workout.value || Object.keys(workout.value).length === 0) {
                const startRes = await apiClient.post("workout/start", {});
                workout.value = startRes.data;
            }

            workoutExercises.value = workout.value.workoutExercises;
        } 
        catch (error) {
            flash.setFlash("Fehler beim Laden des Trainings.", "error",);
            console.error(error);
        }
    };
    
    // Lädt alle verfügbaren Übungen
    const retrieveAllExercises = async () => {
        try {
            // Lese alle Übungen aus
            const response = await apiClient.get("exercise/");
            allExercises.value = response.data;
        } catch (error) {
            flash.setFlash("Fehler beim Laden der Übungen.", "error");
            console.error(error);
        }
    };

    // Lädt alle Übungen des aktiven Trainings
    const retrieveActiveExercises = async () => {
        try {
            // Lade alle Trainingsübungen des aktiven Trainings
            const response = await apiClient.get("workout/active/exercises");
            workoutExercises.value = response.data.workoutExercises;
        } catch (error) {
            flash.setFlash("Fehler beim Laden der Übungen.", "error");
            console.error(error);
        }
    };

    

    // Zeigt "Übung einfügen"-Karte an
    const showModal = async () => {
        retrieveAllExercises();
        showAddModal.value = true;
    }; 

    // Fügt eine Übung zum Training hinzu
    const addExercise = async (exercise) => {
        try {
            // Blende "Übung einfügen"-Karte aus
            showAddModal.value = false;

            // Bereite RequestBody vor
            let workoutId = workout.value.id;
            let exerciseName = exercise.name;

            // Füge neue Übung zum Training ein
            await apiClient.post("/workout/"+ workoutId+"/exercise", {
                name: exerciseName
            });

            // Lade aktive Übungen neu
            retrieveActiveExercises();
        } catch (error) {
            flash.setFlash("error", "&Uuml;bung konnte nicht eingefügt werden.");
            console.error(error);
        }
    }

    // Öffnet "Löschen"-Karte
    const openDeleteModal =  (exercise) => {
        itemToDelete.value = exercise;
        allowDelete.value = exercise?.workoutSets?.length == 0 || (exercise?.workoutSets?.length == 1 && exercise?.workoutSets[0].weight == 0 && exercise?.workoutSets[0].reps == 0);
        isDeleteModalOpen.value = true;
    };

    // Löscht die Übung aus der Übung
    const handleDeleteConfirm = async () => {
        try {
            if (itemToDelete?.value.workoutSets?.length >= 0) {
                
                // Lösche Übung
                await apiClient.delete("workout/" +  workout.value.id + "/exercise/" + itemToDelete.value.id);

                // Lade aktive Übungen neu
                retrieveActiveExercises();

                // Schliesse "Löschen"-Karte
                isDeleteModalOpen.value = false;
            }
        } catch (error) {
            flash.setFlash("Fehler beim Löschen der Übung.", "error");
            console.error(error);
        }
    };
    
    onMounted(async () => {
        // Lade das aktive Training, sobald diese Seite/Komponente geladen wird
        await retrieveActiveWorkout();
    });
</script>
<template>
    <Header 
        title="Training erfassen"
        backToUrl="/workout"
        backToUrlText="Zur&uuml;ck zur &Uuml;bersicht"
        insertAction
        insertText="&Uuml;bung einfügen"
        @insertClicked="showModal"
    />

    <AddExercise 
        v-if="showAddModal" 
        :exercises="allExercises"
        @close="showAddModal = false"
        @confirm="addExercise"
        
    />

    <div class="flex flex-wrap justify-start items-start w-full gap-4 p-4" >
        <WorkoutExerciseCard 
            v-for="ex in workoutExercises" :key="ex.id"     
            :workoutExercise="ex" 
            @deleteClicked="openDeleteModal(ex)"
            @workoutChanged="retrieveActiveExercises"
        />
    </div>

    <ConfirmModal
        :is-open="isDeleteModalOpen"
        title="Übung löschen?"
        :message="allowDelete ? 'Möchten Sie die Übung wirklich aus dem Training entfernen?' : 
        'Übung wird bereits verwendet und kann nicht gelöscht werden!'"
        :item="itemToDelete"
        :displayName ="itemToDelete?.exercise?.name"
        :allowDelete="allowDelete"
        @close="isDeleteModalOpen = false"
        @confirm="handleDeleteConfirm"
    />
</template>

<style>
    .fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
    .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
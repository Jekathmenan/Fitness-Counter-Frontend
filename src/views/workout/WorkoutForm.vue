<script setup>
    import Header from '@/components/template/reusable/Header.vue';
    import WorkoutExerciseCard from '@/components/template/workout/WorkoutExerciseCard.vue';
    import AddExercise from '@/components/template/workout/AddExercise.vue';
    import { onMounted, ref, computed, onUnmounted } from 'vue';
    import { useFlashStore } from '@/stores/flash';
    import apiClient from '@/api/client';
    import { useRouter } from 'vue-router';

    const flash = useFlashStore();
    const router = useRouter();
    const workout = ref(null);
    const workoutExercises = ref([]);
    const allExercises = ref([]);
    const showAddModal = ref(false);

    const now = ref(new Date());
    let timerInterval = null;

    const elapsedTime = computed(() => {
        const start = new Date(workout.value?.startTime);
        const diff = Math.max(0, now.value - start); 

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor(diff / (1000 * 60 * 60));

        const pad = (num) => String(num).padStart(2, '0');

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    });

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

    const stopWorkout = async () => {
        try {
            const response = await apiClient.post("workout/end/" + workout.value?.id);
            flash.setFlash("Training beendet", "success");
            router.push({
                name: "workout"
            })
        } catch (error) {
            flash.setFlash("Fehler beim Beenden des Trainings.", "error");
            console.error(error);
        }
    };
    
    onMounted(async () => {
        // Lade das aktive Training, sobald diese Seite/Komponente geladen wird
        await retrieveActiveWorkout();
        timerInterval = setInterval(() => {
            now.value = new Date();
        }, 1000);
    });

    onUnmounted(() => {
        if (timerInterval) clearInterval(timerInterval);
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
        :headerTextRight="elapsedTime"
        showSecondaryButton
        @secondaryButtonClicked="stopWorkout"
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
            :workoutId="workout.id"
            @workoutDeleted="retrieveActiveExercises"
            @workoutChanged="retrieveActiveExercises"
        />
    </div>
    
</template>

<style>
    .fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
    .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
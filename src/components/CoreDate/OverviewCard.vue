<script setup>
    import { ChevronRight } from 'lucide-vue-next';
    const props = defineProps({
        title: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        urlText: {
            type: String,
            required: true
        }
    });
</script>
<template>
    <div class="mr-[25px] bg-gray-800 min-h-[250px] min-w-[350px] border-4 border-solid border-gray-800 flex justify-center items-center
        flex-col mx-0 my-[20px] rounded-lg hover:scale-101
        shadow-[0_0_10px_rgba(255,255,255,0.4)]">
        <h3 class="font-bold mb-[5px] text-xl text-white">{{ title }}</h3>
        <router-link class="group inline-flex items-center mt-3 text-blue-400 font-medium hover:text-blue-300 transition-colors" :to="path">
            {{ urlText }}
            <ChevronRight class="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </router-link>
    </div>
</template>
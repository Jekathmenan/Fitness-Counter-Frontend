<script setup>
    import { ArrowLeft, CirclePlus } from 'icons';
    const props = defineProps({
      title: {
        type: String,
        required: true
      },
      path: {
        type: String,
        required: false
      },
      urlText: {
        type: String,
        required: false
      },
      spanText: {
        type: String,
        required: false
      },
      addText: {
        type: String,
        required: false
      }
    });
</script>

<template>
  <header class="py-6 px-8 border-b border-slate-700">
    <!-- Back Button als dezenter Link -->
    <router-link v-if="path"
      :to="path" 
      class="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors duration-200 mb-4"
    >
      <ArrowLeft class="w-4 h-4 mr-2" />
      {{ urlText ? urlText : "Zurück zur Übersicht" }}
    </router-link>

    <!-- Haupttitel -->
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-white tracking-tight">
        {{ title }} <span class="text-sm font-normal text-slate-500 ml-2">{{ spanText }}</span>
      </h1>

      <button v-if="addText" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
        <router-link class="flex" to="/core-data/body-parts/add"><span class="mr-2">{{ addText }} </span><CirclePlus class="w-5 h-5" /></router-link>
      </button>
    </div>
  </header>
</template>
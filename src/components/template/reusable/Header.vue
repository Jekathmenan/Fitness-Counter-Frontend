<script setup>
    import { ArrowLeft, CirclePlus } from 'icons';
    const emit = defineEmits(["insertClicked"]);
    const props = defineProps({
      title: {
        type: String,
        required: true
      },
      backToUrl: {
        type: String,
        required: false
      },
      backToUrlText: {
        type: String,
        required: false
      },
      additionalTitle: {
        type: String,
        required: false
      },
      insertText: {
        type: String,
        required: false
      },
      insertPath: {
        type: String,
        required: false
      }, 
      insertAction: {
        type: Boolean
      }   
    });

    const handleClick = () => {
      emit("insertClicked");
    };
</script>

<template>
  <header class="py-6 px-8 border-b border-slate-700">
    <!-- Back Button als dezenter Link -->
    <router-link v-if="backToUrl"
      :to="backToUrl" 
      class="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors duration-200 mb-4"
    >
      <ArrowLeft class="w-4 h-4 mr-2" />
      {{ backToUrlText ? backToUrlText : "Zurück zur Übersicht" }}
    </router-link>

    <!-- Haupttitel -->
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-white tracking-tight">
        {{ title }} <span class="text-sm font-normal text-slate-500 ml-2">{{ additionalTitle }}</span>
      </h1>

      <button v-if="insertText && (insertPath || insertAction)" @click="handleClick" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
        <router-link v-if="insertPath" class="flex" :to="insertPath"><span class="mr-2">{{ insertText }} </span><CirclePlus class="w-5 h-5" /></router-link>
        <span v-if="insertAction" class="flex" ><span class="mr-2">{{ insertText }} </span><CirclePlus class="w-5 h-5" /></span>
      </button>
    </div>
  </header>
</template>


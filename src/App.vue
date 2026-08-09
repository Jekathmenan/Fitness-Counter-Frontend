<script setup>
  import Nav from '@/components/template/Nav.vue';
  import Footer from '@/components/template/Footer.vue';
  import FlashMessage from './components/template/FlashMessage.vue';
</script>
<template>
  <div class="app-container">
    <Nav class="bg-gray-900" />
    <main class="bg-gray-800 text-gray-300" >
      <div class="content">
        <router-view></router-view>

      </div>
    </main>
    <FlashMessage />
    <Footer />
  </div>
</template>

<style>

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: sans-serif;
  }

  
</style>

<style scoped>

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }

  .content {
    padding: 40px;
  }
</style>
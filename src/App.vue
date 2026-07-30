<script setup>
  import Nav from '@/components/template/Nav.vue';
  import Footer from '@/components/template/Footer.vue';
</script>
<template>
  <div class="app-container">
    <Nav />
    <main>
      <div class="content">
        <router-view></router-view>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: large !important;
  }


  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: sans-serif;
  }

  
</style>

<style scoped>
  
  :deep() {
    --primary-dark: #2c3e50;
    --accent-warm: beige;
    --transition-speed: 0.3s;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  

  main {
    flex: 1;
    background-color: var(--accent-warm);
  }

  .content {
    padding: 40px;
  }

  
</style>
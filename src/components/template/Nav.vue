<script setup>
</script>
<template>
    <nav>
      <div class="nav-section left">
        <router-link class="nav-link" to="/">Home</router-link>
        <router-link class="nav-link" to="/ueber-uns">Über uns</router-link>
      </div>
      <div class="nav-section right">
        <router-link class="nav-link right-link" to="/login">Anmelden</router-link>
        <router-link class="nav-link right-link" to="/register">Konto erstellen</router-link>
      </div>
    </nav>
</template>

<style lang="css" scoped>
  nav {
    padding: 15px 40px;
    background: var(--primary-dark);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-link {
    color: white;
    text-decoration: none;
    display: inline-block;
    transition: transform var(--transition-speed) ease, color var(--transition-speed);
  }

  .nav-link:hover {
    transform: scale(1.05);
    color: var(--accent-warm);
  }

  .left .nav-link {
    margin-right: 30px;
  }
  .right-link {
    background-color: var(--accent-warm);
    color: var(--primary-dark);
    border-radius: 25px;
    padding: 8px 20px;
    width: fit-content;
    text-align: center;
    margin-left: 15px;
  }

  .right-link:hover {
    background-color: white;
    font-weight: bold;
  }
  .router-link-active {
    border-bottom: 2px solid var(--accent-warm);
  }

  .right-link.router-link-active {
    border-bottom: none;
    background-color: white;
    box-shadow: 0 0 10px rgba(255,255,255,0.3);
  }
</style>
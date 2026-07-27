<script setup>
</script>
<template>
    <footer>
      <a target="_blank" class="github-link" href="https://github.com/Jekathmenan">Jekathmenan Selvarajah</a>
      &copy; 2026
    </footer>
</template>
<style scoped>
  footer {
    background-color: var(--primary-dark);
    color: white;
    padding: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .github-link {
    color: var(--accent-warm);
    text-decoration: none;
    margin-right: 15px;
    transition: transform var(--transition-speed);
  }

  .github-link:hover {
    transform: scale(1.1);
    text-decoration: underline;
  }
</style>
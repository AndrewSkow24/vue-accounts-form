<template>
  <div id="app">
    <AccountForm />
  </div>
</template>

<script setup lang="ts">
import AccountForm from "./components/AccountForm.vue";
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    sans-serif;
}

#app {
  min-height: 100vh;
  padding: 1rem;
}
</style>

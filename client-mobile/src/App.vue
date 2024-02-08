<template>
  <router-view/>
  <nav>
    <router-link to="/">Notes</router-link>
    <router-link to="/tasks">Tasks</router-link>
    <router-link to="/settings">Settings</router-link>
  </nav>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: "Noto Sans", sans-serif;
}
nav {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 20px;
  background-color: #fff;
  width: calc(100vw - 40px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px #000 solid;

  a {
    color: #000;
    text-decoration: none;
  }
  a.router-link-active {
    text-decoration: underline;
  }
}
</style>
<script setup>
import {useDataStores} from "@/stores/DataStore";

const dataStore = useDataStores();

dataStore.init();
</script>
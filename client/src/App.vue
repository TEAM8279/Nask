<template>
  <div class="view">
    <nav class="laptop">
      <router-link to="/">Notes</router-link>
      <router-link to="/tasks">Tasks</router-link>
      <router-link to="/settings">Settings</router-link>
    </nav>
    <router-view/>
  </div>
  <nav class="mobile">
    <router-link to="/">Notes</router-link>
    <router-link to="/tasks">Tasks</router-link>
    <router-link to="/settings">Settings</router-link>
  </nav>
  <div class="nonetwork" v-if="networkFailed">
    ⚠ no network = no save
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: "Noto Sans", sans-serif;
}
nav {
  &.mobile {
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
  }

  a {
    color: #000;
    text-decoration: none;
  }
  a.router-link-active {
    text-decoration: underline;
  }
}

.nonetwork {
  background-color: red;
  font-size: 18px;
  width: 220px;
  padding: 5px;
  border-radius: 4px;
  margin: auto;
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

div.view {
  display: flex;
  flex-direction: row;
  height: 100vh;

  nav.laptop {
    display: none;
    flex-direction: column;
    border-right: solid 1px #000;

    a {
      padding: 20px 20px 0 20px;
      min-width: 100px;
    }
  }
}

@media screen and (min-width: 512px) {
  nav.mobile {
    display: none;
  }
  div.view nav.laptop {
    display: flex;
  }
}
</style>
<script setup>
import {useDataStores} from "@/stores/DataStore";
import {storeToRefs} from "pinia";

const dataStore = useDataStores();

const {networkFailed} = storeToRefs(dataStore)

setInterval(dataStore.checkNetwork, 1000)

dataStore.init();
</script>
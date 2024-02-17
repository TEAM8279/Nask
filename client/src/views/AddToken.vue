<template>
  <div class="server" v-if="step === 0">
    <h2>Choose a name</h2>
    <div class="container boxed">
      <input type="text" v-model="name">
      <p>Name of the keeper</p>
    </div>
    <nav>
      <button @click="nameNext">Next</button>
    </nav>
  </div>
  <div class="server" v-if="step === 1">
    <h2>Choose a server</h2>
    <div class="container">
      <input type="radio" name="server" value="default" id="serverc1" v-model="serverType">
      <label for="serverc1">Default server</label>
    </div>
    <div class="container boxed">
      <div>
        <input type="radio" name="server" value="custom" id="serverc2" v-model="serverType">
        <label for="serverc2">Custom server</label>
      </div>
      <input type="text" v-if="serverType==='custom'" v-model="serverUrl">
      <p v-if="serverType==='custom'">Url of the api root</p>
    </div>
    <nav>
      <button @click="serverNext">Next</button>
    </nav>
  </div>
  <div class="token" v-if="step === 2">
    <h2>Choose a token</h2>
    <div class="container">
      <input type="radio" name="token" value="default" id="token1" v-model="tokenType">
      <label for="token1">Generate a new one</label>
    </div>
    <div class="container boxed">
      <div>
        <input type="radio" name="token" value="custom" id="token2" v-model="tokenType">
        <label for="token2">My own token</label>
      </div>
      <input type="text" v-if="tokenType==='custom'" v-model="token">
      <p v-if="tokenType==='custom'">Your token</p>
    </div>
    <nav>
      <button class="prev" @click="tokenPrevious">Previous</button>
      <button @click="tokenNext">Next</button>
    </nav>
  </div>
  <div class="finished" v-if="step === 3">
    Successfully added a new token
    <nav>
      <button @click="finished">Okay</button>
    </nav>
  </div>
</template>

<script setup>
import {ref} from "vue";
import router from "@/router";
import {useDataStores} from "@/stores/DataStore";

const step = ref(0);
const datastore = useDataStores();
const serverType = ref("default");
const tokenType = ref("default");
const serverUrl = ref("https://");
const token = ref("");
const name = ref("");

const nameNext = () => {
  if (name.value.length > 2) {
    step.value = 1;
  }
}

const serverNext = () => {
  const pattern = /^https:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/[\w-./?%&=]*)?$/;

  if (pattern.test(serverUrl.value) || serverType.value==='default') {
    step.value = 2;
  } else {
    alert("The url need to be https and valid")
  }
}
const tokenPrevious = () => {
  step.value = 1;
}
const tokenNext = () => {
  if (token.value.length > 5 && tokenType.value==='custom' || tokenType.value==='default') {
    if (tokenType.value==='default') {
      token.value = null;
    }
    if (serverType.value==='default') {
      serverUrl.value = null;
    }
    datastore.setName(name.value);
    datastore.setServerUrl(serverUrl.value);
    datastore.setToken(token.value);
    step.value = 3;
  }
}
const finished = () => {
  datastore.init()
  router.push('/')
}
</script>

<style scoped lang="scss">
.server, .token {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  h2 {
    padding: 40px 0;
  }

  .container {
    padding: 10px;
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-size: 18px;

    &.boxed {
      flex-direction: column;
      align-items: center;

      input {
        font-size: 18px;
        margin: 10px 0 0 0;
      }

      p {
        font-size: 14px;
      }
    }

    label {
      padding-left: 10px;
    }
  }

  button {
    padding: 10px;
    margin: 20px 0 0 0;

    &.prev {
      border: none;
      background-color: transparent;
    }
  }
}
</style>
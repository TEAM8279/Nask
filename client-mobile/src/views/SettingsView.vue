<template>
  <div class="tokenEditor" v-if="edition">
    <form>
      <label for="token">Use your token</label>
      <input type="text" name="token" id="token" v-model="token"/>
      <button type="submit" @click="dataStore.setToken(token); edition=false;">Save</button>
    </form>
    <p>Or generate a new one</p>
    <button @click="dataStore.setToken(); edition=false;">Generate</button>
  </div>
  <div class="main">
    <div class="head">
      <div class="info">
        <h1>Settings</h1>
      </div>
    </div>
    <div class="head">
      <div class="info">
        <h2>Token</h2>
      </div>
      <div class="add" v-if="dataStore.getToken() === false">
        <button>+</button>
      </div>
    </div>
    <p class="token">{{ dataStore.getToken() }}</p>
  </div>
</template>

<style lang="scss" scoped>
div.main {
  padding: 10px;

  div.head {
    padding-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .add {
      button {
        font-size: 30px;
        padding: 5px;
        margin: 0;
        border: none;
        background-color: transparent;
      }
    }
  }

  div.body {
    padding-bottom: 60px;
    a.note {
      display: block;
      padding: 10px;
      border: 1px solid #000;
      margin-bottom: 10px;

      .title, .extract {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .extract {
        padding-bottom: 5px;
      }

      .date {
        font-size: 70%;
      }
    }
  }
}
.token {
  word-break: break-word;
}

.tokenEditor {
  position: fixed;
  z-index: 2000;
  background-color: white;
  width: 100vw;
  height: 100vh;
  text-align: center;


  form {
    margin: auto;
    display: flex;
    flex-direction: column;
    max-width: 300px;
    font-size: 18px;
    padding-bottom: 30px;
    padding-top: 30px;
    label {
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 10px;
    }

  }

  button {
    padding: 10px;
    margin-top: 20px;
  }

  p {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 10px;
  }


}
</style>
<script setup>
import {useDataStores} from "../stores/DataStore";
import {ref} from "vue";

const dataStore = useDataStores()

const edition = ref(!dataStore.tokenInitialised);
const token = ref("");
</script>
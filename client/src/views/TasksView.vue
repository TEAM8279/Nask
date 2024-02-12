<template>
  <div class="main">
    <div class="head">
      <div class="info">
        <h1>Tasks</h1>
        <p class="counter">{{ tasksCounter }} tasks to do</p>
      </div>
      <div class="add">
        <button @click="dataStore.addTask()">+</button>
      </div>
    </div>
    <div class="body">
      <div class="task" v-for="task in tasks" :key="task.key">
        <div class="tinfo">
          <input type="checkbox" v-model="task.done" @click.prevent="task.done = true; dataStore.updateTasks()">
          <input type="text" v-model="task.task" @mouseleave="dataStore.updateTasks()" @focusout="dataStore.updateTasks()">
        </div>
        <p class="date">{{ new Date(task.timestamp*1000).toUTCString().slice(0, 16) }}</p>
      </div>
      <p>Done ({{doneTasksCounter}})</p>
      <div class="task done" v-for="task in doneTasks" :key="task.key">
        <div class="tinfo">
          <input type="checkbox" v-model="task.done" @click.prevent="task.done=false; dataStore.updateTasks()">
          <h2>{{ task.task }}</h2>
        </div>
        <p class="date">{{ new Date(task.timestamp*1000).toUTCString().slice(0, 16) }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.main {
  padding: 10px;
  width: 100%;

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

    .task {
      padding: 10px;
      border: 1px solid #000;
      margin-bottom: 10px;

      &.done {
        background-color: #aaa;
      }

      .date {
        font-size: 70%;
      }

      .tinfo {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-bottom: 5px;

        h2 {
          font-size: 20px;
        }

        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: black;
          margin-right: 10px;
        }
        input[type="text"] {
          width: 100%;
          font-size: 20px;
          font-weight: bold;
          border: none;

          &:focus {
            background-color: #eee;
            border: none;
          }
        }
      }
    }
  }
}
</style>

<script setup>
import {useDataStores} from "@/stores/DataStore";
import {storeToRefs} from "pinia";

const dataStore = useDataStores();

const {tasksCounter, tasks, doneTasks, doneTasksCounter} = storeToRefs(dataStore)
</script>

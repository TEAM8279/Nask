<template>
  <div class="editor" v-if="edition">
    <div class="banner">
      <button @click="edition = false;oldNote={};newNote={}">⧼</button>
      <button @click="edition=false;dataStore.updateNoteContent(oldNote, newNote);">✓</button>
    </div>
    <input
        type="text"
        v-model="newNote.title"
        class="title"
        @focusout="dataStore.updateNoteContent(oldNote, newNote);oldNote={...newNote}"
    >
    <textarea
        v-model="newNote.note"
        class="content"
        @focusout="dataStore.updateNoteContent(oldNote, newNote);oldNote={...newNote}"
    ></textarea>
  </div>
  <div class="main">
    <div class="head">
      <div class="info">
        <h1>Notes</h1>
        <p class="counter">{{ name }} - {{ notesCounter }} notes</p>
      </div>
      <div class="add">
        <button @click="newNote={title: 'New note', note: '', timestamp: Date.now()/1000, tags: []};oldNote=null;edition=true">+</button>
      </div>
    </div>
    <div class="body">
      <a @pointerdown="holdOnNote" @pointerup="releaseOnNote(note)" class="note" v-for="note in notes" :key="note.key">
          <h2 class="title">{{ note.title }}</h2>
          <p class="extract">{{ note.note }}</p>
          <p class="date">{{ new Date(note.timestamp*1000).toUTCString().slice(0, 16) }}</p>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
a, button {
  cursor: pointer;
}
.editor {
  position: fixed;
  background-color: white;
  width: 100vw;
  height: 100vh;
  top: 0;
  left:0;
  z-index: 2000;

  .banner {
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px black;

    button {
      font-size: 25px;
      font-weight: bold;
      background-color: transparent;
      border: none;
      padding: 5px;
    }
  }

  input {
    width: calc(100% - 20px);
    font-size: 20px;
    font-weight: bold;
    margin: 10px;
  }

  textarea {
    width: calc(100vw - 20px);
    margin: 10px;
    height: calc(100vh - 140px);
    min-width: calc(100vw - 20px);
    max-width: calc(100vw - 20px);
    min-height: calc(100vh - 140px);
    max-height: calc(100vh - 140px);
  }
}
div.main {
  padding: 10px;
  width: calc(100% - 20px);

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

@media screen and (min-width: 512px) {
  div.main {
    width: calc(100% - 162px);
  }
}
</style>

<script setup>
import {useDataStores} from "@/stores/DataStore";
import {storeToRefs} from "pinia";
import {ref} from "vue";
import router from "@/router";

const dataStore = useDataStores();

if (!dataStore.tokenInitialised) {
  router.push('/addtoken')
}

const edition = ref(false);
const oldNote = ref({})
const newNote = ref({})
const isHolding = ref(0)

const holdOnNote = () => {
  isHolding.value = Date.now();
}

const releaseOnNote = (note) => {
  if ((Date.now() - isHolding.value) > 500) {
    if(confirm("Delete the note ?")) {
      dataStore.deleteNote(note)
    }
  } else {
   edition.value = true;
   oldNote.value = {...note};
   newNote.value ={...note}
  }
}

const {notesCounter, notes, name} = storeToRefs(dataStore)
</script>
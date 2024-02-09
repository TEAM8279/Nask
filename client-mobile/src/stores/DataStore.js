import { defineStore } from 'pinia';
import axios from "axios";
import router from "@/router";


export const useDataStores = defineStore('data', {
    state: () => (
        {
            storedNotes: [],
            storedTasks: [],
            tokenInitialised: true
        }
    ),
    getters: {
        notesCounter: state => state.storedNotes.length,
        notes: state => state.storedNotes,
        tasksCounter: state => state.storedTasks.filter(t => t.done===false).length,
        doneTasksCounter: state => state.storedTasks.filter(t => t.done===true).length,
        doneTasks: state => state.storedTasks.filter(t => t.done===true),
        tasks: state => state.storedTasks.filter(t => t.done===false),
    },
    actions: {
        init () {
            const token = this.getToken();
            if (token) {
                axios.get("https://nask.8279.ch/api/datas", {
                    headers: { Authorization: `Bearer ${token}` }
                }).then((r) => {
                    console.log(r)
                    this.storedNotes = r.data.notes
                    this.storedTasks = r.data.tasks
                });
            } else {
                this.tokenInitialised = false;
                router.push('/settings')
            }
        },
        getToken() {
            const token = localStorage.getItem("token");
            if (token !== undefined) {
                return token;
            }
            this.tokenInitialised = false;
            return false;
        },
        setToken (token=null) {
            console.log(token)
            if (token===null) {
                axios.get("https://nask.8279.ch/api/token").then((r) => {
                    console.log(r.data)
                    token = r.data.token
                    localStorage.setItem("token", token);
                    this.tokenInitialised = true;
                    this.init();
                    router.push('/')
                });
            } else {
                localStorage.setItem("token", token);
                this.init();
                router.push('/')
            }
        },
        updateNotes (oldNote, newNote) {
            if (oldNote===null) {
                this.storedNotes.unshift(newNote);
            } else {
                let temp = this.storedNotes.find(n => n.title===oldNote.title && n.note===oldNote.note && n.timestamp===oldNote.timestamp)
                temp.title = newNote.title;
                temp.note = newNote.note;
            }
            const token = this.getToken();
            if (token) {
                axios.post("https://nask.8279.ch/api/notes",{
                    notes: JSON.stringify(this.storedNotes)
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((r) => {
                    console.log(r)
                    this.init()
                });
            }
        },
        updateTasks () {
            const token = this.getToken();
            if (token) {
                axios.post("https://nask.8279.ch/api/tasks",{
                    tasks: JSON.stringify(this.storedTasks)
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((r) => {
                    console.log(r)
                    this.init()
                });
            }
        },
        addTask () {
            this.storedTasks.unshift({
                done: false,
                task: "New task",
                timestamp: Date.now() / 1000
            })
        }
    },
})
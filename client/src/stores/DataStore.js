import { defineStore } from 'pinia';
import axios from "axios";
import router from "@/router";


export const useDataStores = defineStore('data', {
    state: () => (
        {
            storedNotes: [],
            storedTasks: [],
            tokenInitialised: true,
            networkFailed: false,
            currentServerUrl: "",
            currentServerToken: "",
            currentName: ""
        }
    ),
    getters: {
        notesCounter: state => state.storedNotes.length,
        notes: state => state.storedNotes,
        tasksCounter: state => state.storedTasks.filter(t => t.done===false).length,
        doneTasksCounter: state => state.storedTasks.filter(t => t.done===true).length,
        doneTasks: state => state.storedTasks.filter(t => t.done===true),
        tasks: state => state.storedTasks.filter(t => t.done===false),
        token: state => state.currentServerToken,
        name: state => state.currentName
    },
    actions: {
        checkNetwork() {
            if (this.currentServerUrl !== "") {
                axios.get(this.currentServerUrl + "/api/cĥeck").then(() => {
                    this.networkFailed = false;
                }).catch(() => {
                    this.networkFailed = true;
                })
            }
        },
        init () {
            this.getTokenAndUrl()
            if (this.currentServerToken) {
                axios.get(this.currentServerUrl + "/api/datas", {
                    headers: { Authorization: `Bearer ${this.currentServerToken}` }
                }).then((r) => {
                    this.storedNotes = r.data.notes
                    this.storedTasks = r.data.tasks
                    localStorage.setItem("notes", JSON.stringify(this.storedNotes))
                    localStorage.setItem("tasks", JSON.stringify(this.storedTasks))
                    this.networkFailed = false;
                }).catch(() => {
                    this.networkFailed = true;
                    this.storedNotes = JSON.parse(localStorage.getItem("notes"))
                    this.storedTasks = JSON.parse(localStorage.getItem("tasks"))
                });
            } else {
                this.tokenInitialised = false;
                router.push('/settings')
            }
        },
        getTokenAndUrl() {
            const token = JSON.parse(localStorage.getItem("token"));
            console.log(token)
            if (token !== null) {
                this.currentServerToken = token.token;
                this.currentServerUrl = token.url;
                this.currentName = token.name;
            } else {
                this.tokenInitialised = false;
            }
        },
        setName(pName) {
            this.currentName = pName
        },
        setServerUrl(url=null) {
            if (url===null) {
                this.currentServerUrl = "https://nask.8279.ch";
            } else {
                this.currentServerUrl = url
            }
        },
        setToken (token=null) {
            if (token===null) {
                axios.get(this.currentServerUrl + "/api/token").then((r) => {
                    token = r.data.token
                    localStorage.setItem("token", JSON.stringify({name: this.currentName, token: token, url: this.currentServerUrl}));
                    this.tokenInitialised = true;
                    this.init();
                    this.networkFailed = false;
                    router.push('/')
                }).catch(() => {
                    this.networkFailed = true;
                    this.init()
                });
            } else {
                localStorage.setItem("token", JSON.stringify({name: this.currentName, token: token, url: this.currentServerUrl}));
                this.init();
                this.tokenInitialised = true;
                router.push('/')
            }
        },
        updateNotes () {
            if (this.currentServerToken) {
                axios.post(this.currentServerUrl + "/api/notes",{
                    notes: JSON.stringify(this.storedNotes)
                }, {
                    headers: {
                        Authorization: `Bearer ${this.currentServerToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(() => {
                    this.init()
                    this.networkFailed = false;
                }).catch(() => {
                    this.networkFailed = true;
                    this.init()
                });
            }
        },
        updateNoteContent (oldNote, newNote) {
            if (oldNote===null) {
                this.storedNotes.unshift(newNote);
            } else {
                let temp = this.storedNotes.find(n => n.title===oldNote.title && n.note===oldNote.note && n.timestamp===oldNote.timestamp)
                temp.title = newNote.title;
                temp.note = newNote.note;
            }
            this.updateNotes()
        },
        deleteNote(note) {
            this.storedNotes.splice(this.storedNotes.indexOf(note), 1);
            this.updateNotes();
        },
        updateTasks () {
            if (this.currentServerToken) {
                axios.post(this.currentServerUrl + "/api/tasks",{
                    tasks: JSON.stringify(this.storedTasks)
                }, {
                    headers: {
                        Authorization: `Bearer ${this.currentServerToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(() => {
                    this.init()
                    this.networkFailed = false;
                }).catch(() => {
                    this.networkFailed = true;
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
        },
        deleteTask(task) {
            this.storedTasks.splice(this.storedTasks.indexOf(task), 1);
            this.updateTasks();
        }
    },
})
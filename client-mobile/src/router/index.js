import { createRouter, createWebHashHistory } from 'vue-router'
import NotesView from "@/views/NotesView.vue";
import TasksView from "@/views/TasksView.vue";
import SettingsView from "@/views/SettingsView.vue";

const routes = [
  {
    path: '/notes',
    name: 'Notes',
    component: NotesView,
    alias: ['', '/']
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TasksView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

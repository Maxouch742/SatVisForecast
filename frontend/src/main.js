import { createApp } from 'vue'
import App from './App.vue'
import  'bulma/css/bulma.css'; // import bulma for easy CSS styling
import { createPinia } from 'pinia';
import { createWebHistory , createRouter } from 'vue-router'
import AboutItem from './components/AboutItem.vue'
import Home from './components/Home.vue'


const routes = [
    {
      path: '/',
      component: Home
    },
    {
      path: '/home', 
      name: 'Home',
      component: Home
    },
    {
      path: '/about', 
      name: 'About project',
      component: AboutItem
    },
  ]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// to handle global events such as click on map
const pinia = createPinia();

createApp(App).use(pinia)
              .use(router)
              .mount('#app')
              

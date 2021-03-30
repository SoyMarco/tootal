import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Home from '../views/Home.vue'
import Pacientes from "../components/Pacientes.vue";
import Login from "../components/Login.vue";
import Unknow from "../components/PerfilPaciente/Unknow.vue";
import PerfilPaciente from "../components/PerfilPaciente/PerfilPaciente.vue";

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		meta: {
			doctor: true,
		},
	},
	{
		path: "/pacientes",
		name: "pacientes",
		component: Pacientes,
		meta: {
			doctor: true,
		},
	},
	{
		path: "/paciente/:id",
		name: "paciente",
		component: PerfilPaciente,
		meta: {
			doctor: true,
			paciente: true,
		},
	},
	{
		path: "/login",
		name: "login",
		component: Login,
		meta: {
			loguear: true,
		},
	},
	{
		path: "/unknown",
		name: "unknown",
		component: Unknow,
		meta: {
			libre: true,
		},
	},
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  /* Primero se logguea para poder hacer las rutas */
  store.dispatch("autoLogin");
  /* CON Login */
  if (store.state.usuario ){
    if (to.matched.some(record => record.meta.doctor)){
      next();
    } else if  (to.matched.some(record => record.meta.libre)){
      next();
    }else{
      /* Pagina no encontrada */
      next({
        path: '/unknown',
        
      })
    }
    /* SIN Login */
  }else if (to.matched.some(record => record.meta.libre)){
      next();
    } else if (to.matched.some(record => record.meta.loguear)) {
      next()
    }else{
       /* Pagina no encontrada */
       next({
        path: '/login',
        
      })
  }
})


export default router

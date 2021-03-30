<template>
  <v-layout>
    <v-flex>
      <!-- Mientras carga -->
      <v-sheet class="pa-3" v-if="loadingPaciente">
        <v-skeleton-loader
          class="mx-auto"
          max-width="3000"
          type="card"
        ></v-skeleton-loader>
      </v-sheet>
      <div v-else>
        <perfil v-if="pacienteData" :pacienteData="pacienteData" />
        <Unknow v-else />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import Perfil from "./Perfil";
import Unknow from "./Unknow";
import axios from "axios";

export default {
  components: { Perfil, Unknow },
  data: () => ({
    avatar: false,
    loadingPaciente: true,
    pacienteData: "",
  }),
  computed: {
   
    Perfil() {
      return true;
    },
    Unknow() {
      return true;
    },
  },

  created() {
    this.buscarPaciente();
  },
  methods: {
    async buscarPaciente() {
      const me = this;
      await axios
        .put("/paciente/query", { id: this.$route.params.id })
        .then(function (response) {
          if (!response.data == "") {
            console.log(response.data)
             me.pacienteData = response.data;
            me.loadingPaciente = false;
          } else {
            me.loadingPaciente = false;
          }
        });
    },
  },
};
/* Consultas GQL */
/*  apollo: {
    getPaciente: {
      query: GET_PACIENTE,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
    },
  }, */
</script>

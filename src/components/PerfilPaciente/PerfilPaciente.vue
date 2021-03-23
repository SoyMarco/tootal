<template>
  <v-layout>
    <v-flex >
    <!-- Mientras carga -->
      <v-sheet class="pa-3" v-if="$apollo.loading">
        <v-skeleton-loader
          class="mx-auto"
          max-width="3000"
          type="card"
        ></v-skeleton-loader>
      </v-sheet>
    <div v-else>
      <perfil 
      v-if="pacienteData"
      :pacienteData="pacienteData"
      />
      <Unknow v-else />
    </div>
    </v-flex>
  </v-layout>
</template>

<script>
import gql from "graphql-tag";
import { GET_PACIENTE } from "../../gql/paciente";
import Perfil from "./Perfil";
import Unknow from "./Unknow";

export default {
  components: { Perfil, Unknow },
  data: () => ({
    avatar: false,
  }),
  computed: {
    pacienteData() {
      return this.getPaciente;
    },
    Perfil() {
      return true;
    },
    Unknow() {
      return true;
    },
  },
  /* Consultas Simplificadas */
   apollo: {
    getPaciente: {
      query: GET_PACIENTE,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
    },
  },
};
</script>

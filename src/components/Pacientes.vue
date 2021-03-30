<template>
  <v-layout align-start>
    <v-flex>
      <!-- tabla PCIENTES -->
      <v-col v-if="tablaPacientes == 0">
        <v-card>
          <v-toolbar color="blue darken-4" dark>
            <v-toolbar-title class="font-weight flex"
              ><v-icon>how_to_reg</v-icon>Pacientes
              <v-btn
                class="cerrar"
                rounded
                color="primary"
                @click="abrirCrudPaciente()"
                ><v-icon>person_add</v-icon>Agregar</v-btn
              >
            </v-toolbar-title>
          </v-toolbar>
          <!-- escribir nombre paciente -->
          <v-card-text>
            <v-container>
              <!--   <v-row>
                <v-col cols="12" xs="12" sm="12" md="12">
                  <v-text-field
                    v-model="dataCita.paciente"
                    label="Paciente"
                    prepend-icon="account_circle"
                    class="font-weight-bold"
                  ></v-text-field>
                </v-col>
              </v-row> -->

              <!-- inicia tabla busqueda cliente -->

              <v-text-field
                v-model="search"
                prepend-inner-icon="search"
                label="Buscar paciente"
                hide-details
                autofocus
                outlined
                color="primary"
                rounded
              ></v-text-field>

              <v-data-table
                :headers="headersPacientes"
                :items="pacientesList"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:[`item.id`]="{ item }">
                  <router-link
                    :to="{ name: 'paciente', params: { id: item.id } }"
                  >
                    <v-btn color="primary" dark rounded small>
                      <strong>{{ item.id }} </strong>
                    </v-btn></router-link
                  >
                </template>
                <!-- nombre -->
                <template v-slot:[`item.name`]="{ item }">
                  <router-link
                    :to="{ name: 'paciente', params: { id: item.id } }"
                  >
                  <strong color="primary"
                    >{{ item.name }}
                  </strong>
                  </router-link
                  >
                </template>
                <!-- telefono -->
                <template v-slot:[`item.phone`]="{ item }">
                  <strong>{{ item.phone }} </strong>
                </template>
                <!-- registrar -->
                <template v-slot:[`item.registrar`]="{ item }">
                  <v-btn
                    @click="abrirCitasVue(item)"
                    outlined
                    rounded
                    color="primary"
                    ><v-icon>book_online</v-icon>Cita</v-btn
                  >
                 <!--  <v-btn
                    @click="agregarPago(item)"
                    outlined
                    rounded
                    color="green darken-4"
                    ><v-icon>monetization_on</v-icon>Pago</v-btn
                  > -->
                  <v-btn
                    @click="editCrudPaciente(item)"
                    outlined
                    rounded
                    color="yellow darken-4"
                    ><v-icon>border_color</v-icon>Edit</v-btn
                  >
                </template>

                <!-- Si no encuentra pacientes -->
                <template v-slot:no-data>
                  <v-data-table
                    :hide-default-header="true"
                    :hide-default-footer="true"
                    loading
                    loading-text="No se han encontrado Pacientes..."
                  ></v-data-table>
                  <v-btn color="primary" @click="listarPacientes()">
                    Recargar
                  </v-btn>
                </template>
              </v-data-table>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Termina tabla PACIENTES -->

      <!-- inicia editar agregar CITA -->
      <v-dialog
        v-model="CrudCitasVue"
        transition="dialog-top-transition"
        persistent
      >
        <crud-citas-vue
          componente="paciente"
          :itemProps="itemPropsCita"
        ></crud-citas-vue>
      </v-dialog>
      <!-- termina editar agregar CITA -->

      <!-- inicia componente crudCitas -->
      <v-dialog
        v-model="crudPaciente"
        transition="dialog-top-transition"
        persistent
      >
        <crud-paciente componente="paciente" :itemProps="itemPropsPaciente">
        </crud-paciente>
      </v-dialog>
      <!-- termina componente crudCitas -->
    </v-flex>
  </v-layout>
  
</template>

<script>
import axios from "axios";
import moment from "moment";
import CrudCitasVue from "./CrudCitas";
import CrudPaciente from "./CrudPaciente";

export default {
  components: { CrudCitasVue, CrudPaciente },
  data: () => ({
    crudPacienteOpen: 0,
    tablaPacientes: 0,
    search: "",
    paciente: "",
    itemPropsCita: [],
    itemPropsPaciente: [],
    headersPacientes: [
      { text: "Id", value: "id", sortable: true },
      { text: "Nombre", value: "name", sortable: true },
      { text: "Telefono", value: "phone", sortable: false },
      { text: "Registrar", value: "registrar", sortable: false },
    ],
    pacientesList: [],
  }),

  computed: {
    CrudCitasVue() {
      return this.$store.state.CrudCitasVue;
    },
    crudPaciente() {
      return this.$store.state.crudPaciente;
    },
  },

  watch: {
    /*   dataCita(val) {
      val || this.closeCitaModal();
    },
    editEstatus(val) {
      val || this.closeEditEstatus();
    }, */
    crudPaciente() {
      if (this.$store.state.crudPaciente == false) {
        this.listarPacientes();
      }
    },
  },

  created() {
    this.listarPacientes();
  },

  methods: {
    listarPacientes() {
      const me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("/paciente/list", configuracion)
        .then(function (response) {
          me.pacientesList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    crearCita(item) {},
    abrirCrudPaciente() {
      this.$store.state.crudPaciente = true;
      this.crudPacienteOpen = 1;
    },
    cerrarCrudPaciente() {
      this.$store.state.crudPaciente = false;
    },

    abrirCitasVue(item) {
      this.itemPropsCita = item;
      this.$store.commit("abrirCitasVue");
    },
    editCrudPaciente(item) {
      this.itemPropsPaciente = item;
      this.$store.commit("abrirPacientesVue");
    },
  },
};
</script>

<style>
.bordes {
  border-radius: 50px 0px 25px 0px;
}
</style>
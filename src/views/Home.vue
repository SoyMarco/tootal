<template >
  <v-layout align-start>
    <v-flex>
      <!--   seleccionar fecha -->
      <v-col>
        <v-card color="blue darken-4" dark outlined elevation="24" shaped>
          <v-col cols="12" sm="12" md="12">
            <ul>
              <h1 v-if="timelineModal == 0">Tabla</h1>
              <h1 v-else-if="timelineModal == 1">Timeline</h1>
              <h2>{{ fechaValue2 }}</h2>
            </ul>
            <v-dialog
              transition="dialog-top-transition"
              ref="selectFechaModal"
              v-model="selectFechaModal"
              :return-value.sync="fechaHoy"
              persistent
              max-width="600"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="fechaHoy"
                  label="Citas del día:"
                  prepend-inner-icon="book_online"
                  readonly
                  outlined
                  rounded
                  color="white"
                  v-bind="attrs"
                  v-on="on"
                  class="font-weight-black centered-input"
                  id="fechaElegida"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="fechaHoy"
                scrollable
                full-width
                color="green darken-4"
                header-color="primary darken-1"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="red"
                  outlined
                  class="font-weight-bold"
                  @click="selectFechaModal = false"
                >
                  <v-icon>cancel</v-icon>
                  Cerrar
                </v-btn>
                <v-btn
                  color="primary"
                  outlined
                  class="font-weight-bold"
                  @click="
                    $refs.selectFechaModal.save(fechaHoy),
                      selectFecha(),
                      (snackbar = true)
                  "
                >
                  <v-icon>search</v-icon>
                  Buscar
                </v-btn>
              </v-date-picker>
            </v-dialog>
            <br />
            <!-- Botones -->
            <v-bottom-navigation
              grow
              absolute
              dark
              background-color="primary"
              class="navigation"
            >
              <v-btn v-if="timelineModal == 1" @click="timelineModal = 0">
                <span>TABLA</span>
                <v-icon color="white">toc</v-icon>
              </v-btn>
              <v-btn v-else-if="timelineModal == 0" @click="timelineModal = 1">
                <span>Timeline</span>
                <v-icon color="white">timeline</v-icon>
              </v-btn>
              <v-btn
                v-if="btnEspera === 1"
                :elevation="btnElevation"
                color="white"
                ><v-progress-circular
                  :size="50"
                  :color="btnColor"
                  indeterminate
                  v-if="btnCheck == 0"
                ></v-progress-circular>
                <v-icon v-else-if="btnCheck == 1" :size="50" :color="btnColor"
                  >check_circle</v-icon
                >
                <v-icon v-else-if="btnCheck == 2" :size="50" :color="btnColor"
                  >wifi_off</v-icon
                >
              </v-btn>
              <v-divider vertical></v-divider>
              <v-btn @click="nuevaCitaVue()">
                <span>NUEVA CITA</span>
                <v-icon color="white">event_available</v-icon>
              </v-btn>
            </v-bottom-navigation>
          </v-col>
        </v-card>
      </v-col>
      <!--  termina seleccionar fecha -->

      <!-- PEÑITAS -->
      <v-col v-if="timelineModal == 0">
        <v-card>
          <!--   titulo de tabla -->
          <v-toolbar dark color="blue darken-4">
            <v-toolbar-title class="font-weight-bold">PEÑITAS</v-toolbar-title>
          </v-toolbar>

          <!-- INICIA TABLA PEÑITAS -->
          <v-data-table
            :headers="headers"
            :items="citasP"
            :hide-default-footer="true"
          >
            <template v-slot:[`item.dr`]="{ item }">
              <v-avatar>
                <img v-bind:src="'https://tootaldental.com/' + item.drImg" />
              </v-avatar>
              <v-chip color="white" darken>
                {{ item.dr }}
              </v-chip>
            </template>

            <template v-slot:[`item.s_time`]="{ item }">
              <v-chip color="white" darken @click="editarHoraDirect(item)">
                <v-icon class="font-weight-black">access_time</v-icon>
                <strong>{{ item.s_time }} </strong>
              </v-chip>
            </template>

            <template v-slot:[`item.paciente`]="{ item }">
              <v-chip color="primary" outlined>
                <v-icon class="font-weight-black">person</v-icon>
                <strong>{{ item.paciente }}</strong>
              </v-chip>
            </template>

            <template v-slot:[`item.status`]="{ item }">
              <v-btn
                rounded
                v-if="item.status == 'Pending Confirmation'"
                color="yellow darken-4"
                dark
                outlined
                @click="editarEstatus(item)"
              >
                <v-icon class="font-weight-black">timer</v-icon>
                Pendiente
              </v-btn>
              <v-btn
                rounded
                v-else-if="item.status == 'Cancelled'"
                color="red darken-4"
                dark
                outlined
                @click="editarEstatus(item)"
              >
                <v-icon class="font-weight-black">cancel</v-icon>
                Cancelado
              </v-btn>
              <v-btn
                rounded
                v-else-if="item.status == 'Confirmed'"
                color="primary"
                dark
                outlined
                @click="editarEstatus(item)"
              >
                <v-icon class="font-weight-black">check_box</v-icon>
                Confirmó
              </v-btn>
              <v-btn
                rounded
                v-else-if="item.status == 'Treated'"
                color="green"
                dark
                outlined
                bold
                @click="editarEstatus(item)"
              >
                <v-icon class="font-weight-black">star</v-icon>
                Tratado
              </v-btn>

              <v-btn
                rounded
                outlined
                color="yellow darken-3"
                class="ma-2"
                @click="editCrudCitas(item)"
              >
                <v-icon> border_color </v-icon>
                <span>Editar</span>
              </v-btn>
            </template>

            <template v-slot:no-data>
              <h2 v-if="btnEspera == 0">No hay registro de citas</h2>
              <v-btn color="primary" @click="listarP()"> Recargar </v-btn>
            </template>
          </v-data-table>
          <!-- TERMINA TABLA PEÑITAS -->
        </v-card>
      </v-col>
      <!-- Termina PEÑITAS -->

      <!-- LAGO -->
      <v-col v-if="timelineModal == 0">
        <v-card>
          <!--   titulo -->
          <v-toolbar dark color="blue darken-4">
            <v-toolbar-title class="font-weight-bold">LAGO</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <!-- INICIA TABLA LAGO -->
          <v-data-table
            :headers="headers"
            :items="citasL"
            :hide-default-footer="true"
          >
            <template v-slot:[`item.dr`]="{ item }">
              <v-avatar>
                <img v-bind:src="'https://tootaldental.com/' + item.drImg" />
              </v-avatar>
              <v-chip color="white" darken>
                {{ item.dr }}
              </v-chip>
            </template>

            <template v-slot:[`item.s_time`]="{ item }">
              <v-chip color="white" darken>
                <v-icon class="font-weight-black">access_time</v-icon>
                <strong>{{ item.s_time }} </strong>
              </v-chip>
            </template>

            <template v-slot:[`item.paciente`]="{ item }">
              <v-chip color="primary" outlined>
                <v-icon class="font-weight-black">person</v-icon>
                {{ item.paciente }}
              </v-chip>
            </template>

            <template v-slot:[`item.status`]="{ item }">
              <v-btn
                rounded
                v-if="item.status == 'Pending Confirmation'"
                color="yellow darken-4"
                dark
                outlined
                @click="editarEstatus(item)"
              >
                <v-icon class="font-weight-black">timer</v-icon>
                Pendiente
              </v-btn>
              <v-btn
                rounded
                v-else-if="item.status == 'Cancelled'"
                color="red darken-4"
                dark
                outlined
                @click="editarEstatus(item)"
              >
                <v-icon class="font-weight-black">cancel</v-icon>
                Cancelado
              </v-btn>
              <v-btn
                rounded
                v-else-if="item.status == 'Confirmed'"
                color="primary"
                dark
                outlined
                @click="editarEstatus(item)"
              >
                <v-icon class="font-weight-black">check_box</v-icon>
                Confirmó
              </v-btn>
              <v-btn
                rounded
                v-else-if="item.status == 'Treated'"
                color="green"
                dark
                outlined
                bold
                @click="editarEstatus(item)"
              >
                <v-icon class="font-weight-black">star</v-icon>
                Tratado
              </v-btn>

              <v-btn
                fab
                outlined
                small
                color="yellow darken-3"
                class="ma-2"
                :loading="loading"
                @click="editCrudCitas(item)"
              >
                <v-icon> border_color </v-icon>
              </v-btn>
            </template>

            <template v-slot:no-data>
              <h2 v-if="btnEspera == 0">No hay registro de citas</h2>
              <v-btn color="primary" @click="listarL()"> Recargar </v-btn>
            </template>
          </v-data-table>
          <!-- TERMINA TABLA LAGO -->
        </v-card>
      </v-col>
      <!-- Termina LAGO -->

      <!-- Editar ESTATUS -->
      <v-dialog
        v-model="editEstatus"
        max-width="500px"
        transition="dialog-top-transition"
      >
        <v-card>
          <v-toolbar color="primary" dark
            ><v-spacer></v-spacer>
            <v-toolbar-title class="font-weight flex"
              ><v-icon>border_color</v-icon>Editar Estado Cita

              <v-icon class="cerrar" @click="closeEditEstatus()" rounded
                >cancel</v-icon
              >
            </v-toolbar-title></v-toolbar
          >

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" xs="12" sm="12" md="12">
                  <v-text-field
                    v-model="dataCita.paciente"
                    label="Paciente"
                    readonly
                    prepend-inner-icon="person"
                    class="font-weight-bold"
                    rounded
                    outlined
                  ></v-text-field>
                </v-col>

                <v-col cols="12" xs="12" sm="12" md="6">
                  <v-btn
                    rounded
                    x-large
                    color="yellow darken-4"
                    dark
                    @click="editarEstatusSelect1()"
                    class="font-weight-black"
                    outlined
                  >
                    <v-icon class="font-weight-black">timer</v-icon>
                    Pendiente
                  </v-btn>
                </v-col>

                <v-col cols="12" xs="12" sm="12" md="6">
                  <v-btn
                    x-large
                    rounded
                    color="red darken-4"
                    dark
                    class="font-weight-black"
                    outlined
                    @click="editarEstatusSelect2()"
                  >
                    <v-icon class="font-weight-black">cancel</v-icon>
                    Canceló
                  </v-btn>
                </v-col>

                <v-col cols="12" xs="12" sm="12" md="6">
                  <v-btn
                    x-large
                    rounded
                    color="primary"
                    dark
                    class="font-weight-black"
                    outlined
                    @click="editarEstatusSelect3()"
                  >
                    <v-icon class="font-weight-black">check_box</v-icon>
                    Confirmó
                  </v-btn>
                </v-col>

                <v-col cols="12" xs="12" sm="12" md="6">
                  <v-btn
                    x-large
                    rounded
                    color="green"
                    dark
                    class="font-weight-black"
                    outlined
                    @click="editarEstatusSelect4()"
                  >
                    <v-icon class="font-weight-bold">star_border</v-icon>
                    Tratado
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Editar ESTATUS -->

      <!-- TIMELINE -->
      <v-container v-if="timelineModal == 1">
        <v-timeline
          :dense="$vuetify.breakpoint.smAndDown"
          align-top
          v-if="this.citas.length > 0"
        >
          <v-timeline-item
            v-for="cita in timeline"
            :key="cita.id"
            :color="cita.remarks == 'Peñitas' ? 'pink' : 'teal'"
            :icon="cita.remarks == 'Peñitas' ? 'group_work' : 'waves'"
            fill-dot
            large
          >
            <v-card
              :color="cita.remarks == 'Peñitas' ? 'pink' : 'teal'"
              dark
              elevation="24"
            >
              <v-card-title class="title"
                ><h3>{{ cita.remarks }}</h3>
                ..
                <h3>
                  {{ cita.s_time }}
                </h3></v-card-title
              >
              <v-card-text class="white text--primary">
                <ul>
                  <li>
                    <b>Paciente:</b> <br />
                    <b>{{ cita.paciente }}</b>
                  </li>
                  <br />
                  <li>
                    Dr(a):
                    <br />
                    {{ cita.dr }}
                    <br />
                    <v-avatar>
                      <img
                        v-bind:src="'https://tootaldental.com/' + cita.drImg"
                      />
                    </v-avatar>
                  </li>
                </ul>
                <br />

                <!-- botones de STATUS -->
                <v-btn
                  rounded
                  v-if="cita.status == 'Pending Confirmation'"
                  color="yellow darken-4"
                  dark
                  outlined
                  @click="editarEstatus(cita)"
                >
                  <v-icon class="font-weight-black">timer</v-icon>
                  Pendiente
                </v-btn>
                <v-btn
                  rounded
                  v-else-if="cita.status == 'Cancelled'"
                  color="red darken-4"
                  dark
                  outlined
                  @click="editarEstatus(cita)"
                >
                  <v-icon class="font-weight-black">cancel</v-icon>
                  Cancelado
                </v-btn>
                <v-btn
                  rounded
                  v-else-if="cita.status == 'Confirmed'"
                  color="primary"
                  dark
                  outlined
                  @click="editarEstatus(cita)"
                >
                  <v-icon class="font-weight-black">check_box</v-icon>
                  Confirmó
                </v-btn>
                <v-btn
                  rounded
                  v-else-if="cita.status == 'Treated'"
                  color="green"
                  dark
                  outlined
                  bold
                  @click="editarEstatus(cita)"
                >
                  <v-icon class="font-weight-black">star</v-icon>
                  Tratado
                </v-btn>
                <!-- termina botones de STATUS -->
                <v-btn
                  rounded
                  outlined
                  color="yellow darken-3"
                  class="ma-2"
                  @click="editCrudCitas(cita)"
                >
                  <v-icon> border_color </v-icon>
                  <span>Editar</span>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
        <h1 v-else-if="btnEspera == 0">No hay citas en esta fecha</h1>
      </v-container>
      <!-- termina TIMELINE -->

      <v-dialog v-model="pacienteComponent" transition="dialog-top-transition" persistent>
        <paciente />
      </v-dialog>

    <!-- Editar y Agregar CITA Modal -->
      <v-dialog v-model="CrudCitasVue" transition="dialog-top-transition" persistent>
        <crud-citas-vue
          :componente="componente"
          :itemProps="itemProps"
        ></crud-citas-vue>
      </v-dialog>
      <!--Termina Editar CITA -->

    </v-flex>
  </v-layout>
</template>

<script>
/* COMIENZA CODIGO */
import axios from "axios";
import moment from "moment";
import "moment/locale/es-us";
import Paciente from "../components/Pacientes";
import CrudCitasVue from "../components/CrudCitas";

export default {
  components: { Paciente, CrudCitasVue },
  data: () => ({
    componente: "",
    itemProps: [],
    pacienteComponent: 0,
    valid: false,
    friends: ["Sandra Adams", "Britta Holt"],
    citasP: [],
    citasL: [],
    citas: [],
    timelineModal: 1,
    headers: [
      { text: "Hora", value: "s_time", sortable: false },
      { text: "Dr(a)", value: "dr", sortable: false },
      { text: "Paciente", value: "paciente", sortable: false },
      { text: "Status", value: "status", sortable: false },
    ],
    date: new Date().toISOString().substr(0, 10),
    modalCalendario: false,
    elegirPacienteModal: false,
    horaReloj: null,
    modalReloj: false,
    btnEspera: 0,
    btnColor: "primary",
    btnCheck: 0,
    btnElevation: 0,
    loading: false,
    citaModal: 0,
    editEstatus: 0,
    dateCalen: 0,
    imagenDr: "uploads/escudo.gif",
    selectFechaModal: 0,
    fechaHoy: moment().format("YYYY-MM-DD"),
    fechaValue: moment().format("YYYY-MM-DD"),
    fechaUnix: parseInt(Date.now() / 1000),
    fechaValue2: moment().format("LLLL"),
    search: "",
    docList: [],
    pacientesList: [],
    lugares: ["Peñitas", "Lago"],
    categorias: [],
    picker: new Date().toISOString().substr(0, 10),
    rules: {
      paciente: [(val) => (val || "").length > 0 || "Dato requerido"],
      dr: [(val) => (val || "").length > 0 || "Dato requerido"],
      fecha: [(val) => (val || "").length > 0 || "Dato requerido"],
      hora: [(val) => (val || "").length > 0 || "Dato requerido"],
      lugar: [(val) => (val || "").length > 0 || "Dato requerido"],
    },
    modificarAgregar: -1,
    dataCita: {
      id: "",
      paciente: "",
      pacienteId: "",
      dr: "",
      drId: "",
      imgDr: "",
      fecha: "",
      fechaUnix: "",
      hora: "",
      hora12: "",
      lugar: "",
      estatus: "",
      adModal: 0,
      adAccion: 0,
      adId: "",
    },
    defaultCita: {
      id: "",
      paciente: "",
      pacienteId: "",
      dr: "",
      drId: "",
      imgDr: "",
      fecha: "",
      fechaUnix: "",
      hora: "",
      hora12: "",
      lugar: "",
      estatus: "",
      adModal: 0,
      adAccion: 0,
      adId: "",
    },
    citaFull: {
      paciente: "null",
      dr: "null",
      lugar: "null",
    },
    snackbar: false,
    text: "My timeout is set to 2000.",
    timeout: 2000,
  }),

  computed: {
    formTitle() {
      return this.modificarAgregar === -1 ? "New Item" : "Edit Item";
    },
    timeline() {
      return this.citas.slice().reverse();
    },

    CrudCitasVue() {
      return this.$store.state.CrudCitasVue;
    },

    listarCitas() {
      return this.$store.state.listarCitas;
    },
  },

  watch: {
    dataCita(val) {
      val || this.closeCitaModal();
    },
    editEstatus(val) {
      val || this.closeEditEstatus();
    },
    /* listar */
    listarCitas: function () {
      if (this.$store.state.listarCitas == true) {
        this.listar();
        this.$store.state.listarCitas = 0;
      }
    },
  },

  created() {
    this.cambioFecha();
    this.listar();
  },

  methods: {
    selectFecha() {
      this.cambioFecha1();
      this.listar();
    },

    async colorBtn() {
      this.btnCheck = 1;
      this.btnColor = "success";
      this.btnElevation = "24";
      await new Promise((resolve) => setTimeout(resolve, 3000));
      this.btnColor = "primary";

      this.btnElevation = "0";
      this.btnEspera = false;
      this.btnCheck = false;
    },
    async colorBtn2() {
      this.btnCheck = 2;
      this.btnColor = "red";
      this.btnElevation = "24";
      await new Promise((resolve) => setTimeout(resolve, 6000));
      this.btnColor = "primary";

      this.btnElevation = "0";
      this.btnEspera = false;
      this.btnCheck = false;
    },

    cambioFecha() {
      //this.fechaValue = document.getElementById("fechaElegida");

      this.fechaUnix = moment(this.fechaHoy, "YYYY-MM-DD").unix();
    },
    cambioFecha1() {
      this.fechaValue = document.getElementById("fechaElegida");

      this.fechaUnix = moment(this.fechaValue.value, "YYYY-MM-DD").unix();
      this.fechaValue2 = moment(this.fechaValue.value, "YYYY-MM-DD").format(
        "LLLL"
      );
    },

    getColor(estado) {
      if (estado) {
        return "green";
      } else {
        return "red";
      }
    },

    listarP() {
      this.listarDrs();
      let fecha1 = parseInt(this.fechaUnix - 8500);
      let fecha2 = parseInt(this.fechaUnix + 8500);
      const me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "/citas/listP",
          {
            fecha1,
            fecha2,
          },
          configuracion
        )
        .then(function (response) {
          me.citasP = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarL() {
      let fecha1 = parseInt(this.fechaUnix - 8500);
      let fecha2 = parseInt(this.fechaUnix + 8500);
      const me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "/citas/listL",
          {
            fecha1,
            fecha2,
          },
          configuracion
        )
        .then(function (response) {
          me.citasL = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    listarT() {
      this.listarDrs();
      let fecha1 = parseInt(this.fechaUnix - 8500);
      let fecha2 = parseInt(this.fechaUnix + 8500);
      const me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "/citas/listT",
          {
            fecha1,
            fecha2,
          },
          configuracion
        )
        .then(function (response) {
          me.citas = response.data;
          me.colorBtn();
        })
        .catch(function (error) {});
    },
    limpiarDataCita() {
      this.dataCita.id = "";
      this.dataCita.paciente = "";
      this.dataCita.pacienteId = "";
      this.dataCita.dr = "";
      this.dataCita.drID = "";
      this.dataCita.imgDr = "";
      this.dataCita.fecha = "";
      this.dataCita.hora = "";
      this.dataCita.hora12 = "";
      this.dataCita.lugar = "";
      this.dataCita.estatus = "";
      this.dataCita.adModal = 0;
      this.dataCita.adAccion = 0;
      this.dataCita.adId = "";
    },

    guardarCita() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      /*   if (this.validar()) {
        return;
      } */
      if (this.dataCita.modificarAgregar == -1) {
        //CODIGO PARA EDITAR
        axios
          .put(
            "/citas/updateCita",
            {
              id: this.dataCita.id,
              dr: this.dataCita.drId,
              fecha: this.dataCita.fechaUnix,
              hora: this.dataCita.hora12,
              lugar: this.dataCita.lugar,
            },
            configuracion
          )
          .then(function (response) {
            me.limpiarDataCita();
            me.closeCitaModal();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //CODIGO PARA GUARDAR
        axios
          .post(
            "/citas/add",
            {
              paciente: this.dataCita.pacienteId,
              doctor: this.dataCita.drId,
              fecha: this.dataCita.fechaUnix,
              hora: this.dataCita.hora12,
              lugar: this.dataCita.lugar,
              momentoRegistro: moment().format("L LTS"),
              status: "Pending Confirmation",
            },
            configuracion
          )
          .then(function (response) {
            me.limpiarDataCita();
            me.closeCitaModal();
            me.listar();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    editCrudCitas(item) {
      this.itemProps = item;
      this.componente = "editar";
      this.$store.commit("abrirCitasVue");

      /* this.dataCita.id = item.id;
      this.dataCita.paciente = item.paciente;
      this.dataCita.dr = item.dr;
      this.dataCita.drImg = item.drImg;
      this.dataCita.fecha = moment.unix(item.date).format("YYYY-MM-DD");
      this.dataCita.hora = item.s_time.replace(/[. ]/g, "");
      this.dataCita.lugar = item.remarks; */

      /*  this.dataCita.modificarAgregar = -1;
      this.citaModal = true; */
    },

    nuevaCitaVue() {
      this.componente = "nueva";
      this.$store.state.CrudCitasVue = true;
    },

    editarEstatus(item) {
      this.dataCita.id = item.id;
      this.dataCita.paciente = item.paciente;
      /* this.dataCita.dr = item.dr;
      this.dataCita.drImg = item.drImg;
      this.dataCita.fecha = item.date;
      this.dataCita.hora = item.s_time;
      this.dataCita.lugar = item.remarks; */
      this.editEstatus = 1;
      this.dataCita.modificarAgregar = -1;
    },

    //ACTIVAR O DESACTIVAR CATEGORIA
    activarDesactivar(accion, item) {
      this.dataCita.adModal = 1;
      this.dataCita.adNombre = item.nombre;
      this.dataCita.adId = item.id;
      if (item.estado == 1) {
        this.dataCita.adAccion = 1;
      } else if (item.estado == 2) {
        this.dataCita.adAccion = 2;
      } else {
        this.dataCita.adModal = 0;
      }
    },
    activarDesactivarCerrar() {
      this.dataCita.adModal = 0;
    },
    //ACTIVAR
    activar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("/categoria/activar", { id: this.dataCita.adId }, configuracion)
        .then(function (response) {
          me.dataCita.adModal = 0;
          me.dataCita.adAccion = 0;
          me.dataCita.adNombre = "";
          me.dataCita.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //DESACTIVAR
    desactivar() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("/categoria/desactivar", { id: this.dataCita.adId }, configuracion)
        .then(function (response) {
          me.dataCita.adModal = 0;
          me.dataCita.adAccion = 0;
          me.dataCita.adNombre = "";
          me.dataCita.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    deleteItemConfirm() {
      this.desserts.splice(this.modificarAgregar, 1);
      this.closeEditEstatus();
    },

    closeCitaModal() {
      this.citaModal = false;
      this.$nextTick(() => {
        this.dataCita = Object.assign({}, this.defaultCita);
        this.modificarAgregar = -1;
      });
    },

    closeEditEstatus() {
      this.editEstatus = false;
      this.$nextTick(() => {
        this.dataCita = Object.assign({}, this.defaultCita);
        this.modificarAgregar = -1;
      });
    },

    editarEstatusSelect1() {
      this.editEstatus = false;
      this.btnEspera = 1;
      this.dataCita.estatus = "Pending Confirmation";
      this.modificarEstatus();
    },
    editarEstatusSelect2() {
      this.editEstatus = false;
      this.btnEspera = 1;
      this.dataCita.estatus = "Cancelled";
      this.modificarEstatus();
    },
    editarEstatusSelect3() {
      this.editEstatus = false;
      this.btnEspera = 1;
      this.dataCita.estatus = "Confirmed";
      this.modificarEstatus();
    },
    editarEstatusSelect4() {
      this.editEstatus = false;
      this.btnEspera = 1;
      this.dataCita.estatus = "Treated";
      this.modificarEstatus();
    },

    modificarEstatus() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put(
          "/citas/updateEstatus",
          { id: this.dataCita.id, status: this.dataCita.estatus },
          configuracion
        )
        .then(function (response) {
          me.limpiarDataCita();
          me.listar();
          me.closeEditEstatus();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    cambioHora(dataCita) {
      this.dataCita.hora = moment(dataCita.hora).format("HHmma");
      this.modalReloj = false;
    },
    modificarCita() {
      if (this.$refs.form.validate() == true) {
        this.dataCita.drId = this.$refs.selectDr.selectedItems[0].id;
        this.dataCita.fechaUnix = moment(
          this.dataCita.fecha,
          "YYYY-MM-DD"
        ).unix();
        this.dataCita.hora12 = moment(this.dataCita.hora, "HH:mm").format("LT");
        this.dataCita.hora12 = this.dataCita.hora12.replace(/[. ]/g, "");
        this.guardarCita();
        this.citaModal = false;
      }
    },
    agregarCita() {
      if (this.$refs.form.validate() == true) {
        this.dataCita.drId = this.$refs.selectDr.selectedItems[0].id;
        this.dataCita.fechaUnix = moment(
          this.dataCita.fecha,
          "YYYY-MM-DD"
        ).unix();
        this.dataCita.hora12 = moment(this.dataCita.hora, "HH:mm").format("LT");
        this.dataCita.hora12 = this.dataCita.hora12.replace(/[. ]/g, "");
        this.guardarCita();
        this.citaModal = false;
      }
    },

    listarDrs() {
      const me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("/doctor/list", configuracion)
        .then(function (response) {
          me.docList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
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
    listar() {
      this.btnEspera = 1;
      this.listarT();
      this.listarP();
      this.listarL();
    },

    editarHoraDirect(item) {
      this.editCrudCitas(item);
    },
    abrirPacienteModal() {
      this.elegirPacienteModal = true;

      if (this.pacientesList === undefined || this.pacientesList.length == 0) {
        this.listarPacientes();
      }
    },
    cerrarPacienteModal() {
      this.elegirPacienteModal = false;
    },
  },
};
</script>

<style>
.cerrar {
  float: right;
}
@media (max-width: 600px) {
  .v-data-table td:last-child {
    border-bottom: #000058 solid 2px !important;
  }
}
.v-date-picker {
  font: bold !important;
}

.navigation {
  border-radius: 0px 0px 25px 0px;
}
</style>
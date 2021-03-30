<template>
  <v-layout>
    <v-flex>
      <!-- Editar y Agregar CITA Modal -->
      <v-dialog
        transition="dialog-top-transition"
        v-model="CrudCitasVue"
        max-width="500px"
        class="modalCitaModal"
        persistent
      >
        <v-card class="citaModal" shaped>
          <v-toolbar color="primary" dark class="titulocitaModal"
            ><v-spacer></v-spacer>
            <!-- if cita o modif -->
            <v-toolbar-title
              class="font-weight flex"
              v-if="dataCita.modificarAgregar == -1"
            >
              <v-icon>border_color</v-icon>
              <span> Editar Cita</span>

              <v-btn
                class="cerrar"
                @click="closeCitaModal()"
                rounded
                dark
                outlined
                small
                ><v-icon>cancel</v-icon>cerrar</v-btn
              >
            </v-toolbar-title>

            <v-toolbar-title class="font-weight flex" v-else>
              <v-icon>event_available</v-icon>
              <span> Nueva Cita</span>

              <v-btn
                class="cerrar"
                @click="closeCitaModal()"
                rounded
                dark
                outlined
                small
                ><v-icon>cancel</v-icon>cerrar</v-btn
              >
            </v-toolbar-title>
          </v-toolbar>

          <v-card-text class="contenidocitaModal">
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <!-- paciente -->
                  <!-- if cita o modif -->
                  <v-col cols="12" sm="12" md="12" style="padding-bottom: 0px">
                    <v-text-field
                      v-if="dataCita.modificarAgregar == -1"
                      v-model="dataCita.paciente"
                      label="Paciente"
                      readonly
                      prepend-inner-icon="person"
                      class="font-weight-black"
                      outlined
                      rounded
                      required
                      :rules="rules.paciente"
                    ></v-text-field>
                    <v-text-field
                      v-else
                      v-model="dataCita.paciente"
                      label="Paciente"
                      :readonly="dataCita.pacienteId > 0 ? 'readonly' : false"
                      clear-icon="cancel"
                      clearable
                      prepend-inner-icon="person"
                      class="font-weight-black"
                      outlined
                      rounded
                      color="green darken-4"
                      :rules="rules.paciente"
                      @click:clear="clearPaciente"
                      autofocus
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row v-if="!dataCita.paciente">
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    style="padding-top: 0px; padding-bottom: 30px"
                  >
                    <v-btn
                      outlined
                      color="primary"
                      class="cerrar"
                      @click="abrirCrudPaciente()"
                      ><v-icon>person_add_alt_1</v-icon> Agregar</v-btn
                    >
                    <v-btn
                      outlined
                      color="primary"
                      class="cerrar"
                      @click="abrirPacienteModal()"
                      style="margin-right: 10px"
                    >
                      <v-icon>person_search</v-icon> Buscar</v-btn
                    >
                  </v-col>
                </v-row>

                <v-row v-else style="padding-top: 0px; padding-bottom: 20px">
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="dataCita.pacienteId > 0"
                    dark
                    color="green darken-4"
                    outlined
                    rounded
                    class="font-weight-black"
                    large
                  >
                    <v-icon>person</v-icon>
                    ID: {{ dataCita.pacienteId }}
                  </v-btn>
                  <h2
                    v-else
                    style="padding-top: 0px; padding-bottom: 30px"
                    class="green--text text--darken-4"
                  >
                    Este paciente se agregará como nuevo.
                  </h2>
                </v-row>

                <!-- calendario -->
                <v-col cols="12" style="padding-top: 12px; padding-bottom: 0px">
                  <v-dialog
                    transition="dialog-top-transition"
                    ref="modCalendario"
                    v-model="modalCalendario"
                    :return-value.sync="dataCita.fecha"
                    persistent
                    width="400px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dataCita.fecha"
                        label="Fecha de la cita"
                        prepend-inner-icon="book_online"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        rounded
                        required
                        :rules="rules.fecha"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="dataCita.fecha"
                      scrollable
                      color="green darken-4"
                      header-color="primary darken-1"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        color="red darken-4"
                        outlined
                        class="font-weight-bold"
                        @click="modalCalendario = false"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="primary darken-4"
                        outlined
                        class="font-weight-bold"
                        @click="$refs.modCalendario.save(dataCita.fecha)"
                      >
                        Aceptar
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <!-- termina calendario -->

                <!-- reloj -->
                <v-col cols="12" style="padding-top: 0px; padding-bottom: 0px">
                  <v-dialog
                    transition="dialog-top-transition"
                    ref="modReloj"
                    v-model="modalReloj"
                    :return-value.sync="dataCita.hora"
                    persistent
                    width="300px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dataCita.hora"
                        label="Hora de la cita"
                        prepend-inner-icon="access_alarm"
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        readonly
                        rounded
                        required
                        :rules="rules.hora"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="modalReloj"
                      v-model="dataCita.hora"
                      full-width
                      scrollable
                      format="ampm"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        outlined
                        color="red darken-4"
                        class="font-weight-bold"
                        @click="modalReloj = false"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        outlined
                        color="primary darken-4"
                        class="font-weight-bold"
                        @click="$refs.modReloj.save(dataCita.hora)"
                      >
                        Aceptar
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <!-- termina reloj -->

                <!-- seleccionar lugar -->
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  style="padding-top: 0px; padding-bottom: 0px"
                >
                  <v-select
                    v-model="dataCita.lugar"
                    :items="lugares"
                    :rules="rules.lugar"
                    color="primary"
                    label="Lugar"
                    outlined
                    required
                    rounded
                    prepend-inner-icon="add_location"
                  ></v-select>
                </v-col>
                <!-- dr -->

                <!--  <v-col cols="2" sm="2" md="2" style=" padding-bottom: 0px;">
                    <v-avatar size="50" v-if="dataCita.drImg">
                      <img
                        v-bind:src="
                          'https://tootaldental.com/' + dataCita.drImg
                        "
                      />
                    </v-avatar>
                    <v-avatar size="50" v-else>
                      <img
                        v-bind:src="'https://tootaldental.com/uploads/escudo.gif'"
                      />
                    </v-avatar>
                  </v-col> -->

                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  style="padding-top: 0px; padding-bottom: 0px"
                >
                  <v-select
                    v-model="dataCita.dr"
                    :hint="dataCita.name"
                    :items="docList"
                    item-text="name"
                    item-value="name"
                    :rules="rules.dr"
                    color="primay"
                    label="Dr(a)"
                    required
                    ref="selectDr"
                    outlined
                    rounded
                    prepend-inner-icon="assignment_ind"
                  >
                  </v-select>
                </v-col>
                <v-row>
                  <!-- mensaje de validacion -->
                  <v-col
                    cols="12"
                    sm="12"
                    xs="12"
                    md="12"
                    v-show="dataCita.valida"
                  >
                    <div
                      class="red--text"
                      v-for="v in dataCita.validaMensaje"
                      :key="v"
                      v-text="v"
                    ></div>
                  </v-col>
                </v-row>

                <!-- botones finales de modal -->
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    color="red darken-4"
                    outlined
                    rounded
                    @click="closeCitaModal()"
                    class="font-weight-bold"
                  >
                    <v-icon>cancel</v-icon>
                    Cerrar
                  </v-btn>

                  <!-- if cita o modif -->
                  <v-btn
                    v-if="dataCita.modificarAgregar == -1"
                    outlined
                    rounded
                    :disabled="!valid"
                    :color="colorBtnSave"
                    :loading="loadingSave"
                    class="font-weight-bold"
                    @click="editarCita()"
                  >
                    <v-icon>{{ btnSave }}</v-icon>
                    Editar
                  </v-btn>

                  <v-btn
                    v-else
                    outlined
                    rounded
                    :disabled="!valid"
                    :color="colorBtnSave"
                    :loading="loadingSave"
                    class="font-weight-bold"
                    @click="agregarCita()"
                  >
                    <v-icon>{{ btnSave }}</v-icon>
                    {{ msjSave }}
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!--Termina Editar CITA -->

      <!--Elegir Paciente Modal -->
      <v-dialog
        v-model="elegirPacienteModal"
        max-width="600px"
        transition="dialog-top-transition"
      >
        <v-card>
          <v-toolbar color="primary" dark
            ><v-spacer></v-spacer>
            <v-toolbar-title class="font-weight flex"
              ><v-icon>how_to_reg</v-icon>Selecciona paciente
              <v-icon class="cerrar" @click="cerrarPacienteModal()" rounded
                >cancel</v-icon
              >
            </v-toolbar-title></v-toolbar
          >
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
                rounded
              ></v-text-field>

              <v-data-table
                :headers="headersPacientes"
                :items="pacientesList"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:[`item.id`]="{ item }">
                  <v-btn
                    color="primary"
                    dark
                    rounded
                    @click="selectPaciente(item)"
                    small
                  >
                    <strong>{{ item.id }} </strong>
                  </v-btn>
                </template>

                <template v-slot:[`item.name`]="{ item }">
                  <strong @click="selectPaciente(item)"
                    ><v-icon color="primary">how_to_reg</v-icon>{{ item.name }}
                  </strong>
                </template>

                <template v-slot:[`item.phone`]="{ item }">
                  <strong>{{ item.phone }} </strong>
                </template>

                <!-- <template v-slot:[`item.elegir`]="{ item }">
                  <v-btn
                    color="primary"
                    dark
                    rounded
                    outlined
                    @click="selectPaciente(item)"
                  >
                    <v-icon>how_to_reg</v-icon>
                    Elegir
                  </v-btn>
                </template> -->

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

              <!-- boton para cancelar -->
              <v-row>
                <v-spacer></v-spacer>
                <v-col cols="4" xs="4" sm="4" md="4">
                  <v-btn
                    rounded
                    color="red darken-4"
                    dark
                    class="font-weight-black"
                    outlined
                    @click="cerrarPacienteModal"
                  >
                    <v-icon class="font-weight-black">cancel</v-icon>
                    Cancelar
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- termina Elegir Paciente Modal-->

      <!-- inicia componente CrudCitas -->
      <v-dialog
        v-model="CrudPaciente"
        transition="dialog-top-transition"
        persistent
         v-if="dataCita.pacienteId < 1"
      >
        <crud-paciente componente="CrudCitas"> </crud-paciente>
      </v-dialog>
      <!-- termina componente CrudCitas -->
    </v-flex>
  </v-layout>
</template>

<script>
/* COMIENZA CODIGO */
import axios from "axios";
import moment from "moment";
import CrudPaciente from "./CrudPaciente";

export default {
  components: { CrudPaciente },
  props: ["componente", "itemProps"],
  data: () => ({
    btnSave: "save",
    colorBtnSave: "green darken-4",
    msjSave: "Guardar",
    modificarAgregar: -1,
    valid: false,
    modalCalendario: false,
    modalReloj: false,
    elegirPacienteModal: false,
    loadingSave: false,
    CrudPacienteOpen: 0,
    search: "",
    lugares: ["Peñitas", "Lago"],
    docList: [],
    pacientesList: [],
    headersPacientes: [
      { text: "Id", value: "id", sortable: true },
      { text: "Nombre", value: "name", sortable: true },
      { text: "Telefono", value: "phone", sortable: false },
    ],
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
      ip: "187.190.163.116",
      password: "$2y$08$IS3amhsiIeft4/MkDiEwgeNIHBdgUxbqPePdAYt0H4IR3Y0Tyx4jK",
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
      ip: "187.190.163.116",
      password: "$2y$08$IS3amhsiIeft4/MkDiEwgeNIHBdgUxbqPePdAYt0H4IR3Y0Tyx4jK",
    },
    rules: {
      paciente: [(val) => (val || "").length > 0 || "Dato requerido"],
      dr: [(val) => (val || "").length > 0 || "Dato requerido"],
      fecha: [(val) => (val || "").length > 0 || "Dato requerido"],
      hora: [(val) => (val || "").length > 0 || "Dato requerido"],
      lugar: [(val) => (val || "").length > 0 || "Dato requerido"],
    },
  }),

  computed: {
    CrudCitasVue() {
      return this.$store.state.CrudCitasVue;
    },
    CrudPaciente() {
      return this.$store.state.crudPaciente;
    },
    cambioPacienteId() {
      return this.$store.state.data.pacienteId;
    },
  },

  watch: {
    dataCita(val) {
      val || this.closeCitaModal();
    },
    editEstatus(val) {
      val || this.closeEditEstatus();
    },
    itemProps() {
      if (this.itemProps) {
        this.propsCita();
      }
    },
    CrudCitasVue() {
      if (this.$store.state.CrudCitasVue == true) {
        this.propsCita();
      }
    },
    cambioPacienteId() {
      if (this.$store.state.data.pacienteId > 0) {
        this.dataCita.pacienteId = this.$store.state.data.pacienteId;
        this.dataCita.paciente = this.$store.state.data.pacienteName;
      }
    },
  },

  created() {
    /*    this.cambioFecha();
    this.listarP();
    this.listarL(); */
    this.listarDrs();
    this.propsCita();
  },

  methods: {
    propsCita() {
      this.limpiarDataCita();
      let item = this.$props.itemProps;
      /* datos de "paciente" componente */
      if (this.$props.componente == "paciente") {
        this.dataCita.paciente = item.name;
        this.dataCita.pacienteId = item.id;
        this.dataCita.fecha = moment(this.fechaHoy).format("YYYY-MM-DD");
        this.dataCita.hora = "12:00PM";
        this.dataCita.modificarAgregar = 1;
      } else if (this.$props.componente == "editar") {
        this.dataCita.id = item.id;
        this.dataCita.paciente = item.paciente;
        this.dataCita.pacienteId = item.patient;
        this.dataCita.dr = item.dr;
        this.dataCita.drImg = item.drImg;
        this.dataCita.fecha = moment.unix(item.date).format("YYYY-MM-DD");
        this.dataCita.hora = item.s_time.replace(/[. ]/g, "");
        this.dataCita.lugar = item.remarks;
        this.dataCita.modificarAgregar = -1;
      } else if (this.$props.componente == "nueva") {
        this.dataCita.fecha = moment(this.fechaHoy).format("YYYY-MM-DD");
        this.dataCita.hora = "12:00PM";
        this.dataCita.modificarAgregar = 1;
      }
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

    listarCitas() {
      this.$store.state.listarCitas = 1;
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

    selectPaciente(item) {
      this.dataCita.pacienteId = item.id;
      this.dataCita.paciente = item.name;
      this.elegirPacienteModal = false;
    },

    editCitaModal(item) {
      this.dataCita.id = item.id;
      this.dataCita.paciente = item.paciente;
      this.dataCita.dr = item.dr;
      this.dataCita.drImg = item.drImg;
      this.dataCita.fecha = moment.unix(item.date).format("YYYY-MM-DD");
      this.dataCita.hora = item.s_time.replace(/[. ]/g, "");
      this.dataCita.lugar = item.remarks;
      this.dataCita.modificarAgregar = -1;
    },

    guardarCita() {
      let me = this;
      me.loadingSave = "loading";
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
            me.listarCitas();
            me.closeCitaModal();
            me.loadingSave = false;
          })
          .catch(function (error) {
            console.log(error);
            me.btnSaveError();
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
            me.listarCitas();
            me.closeCitaModal();
            me.loadingSave = false;
          })
          .catch(function (error) {
            console.log(error);
            me.btnSaveError();
          });
      }
    },

    propsCita2(item) {
      this.dataCita.id = item.id;
      this.dataCita.paciente = item.paciente;
      this.dataCita.dr = item.dr;
      this.dataCita.drImg = item.drImg;
      this.dataCita.fecha = moment.unix(item.date).format("YYYY-MM-DD");
      this.dataCita.hora = item.s_time.replace(/[. ]/g, "");
      this.dataCita.lugar = item.remarks;
      this.dataCita.modificarAgregar = -1;
      this.citaModal = true;
    },

    editarCita() {
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

    async agregarCita() {
      if (this.$refs.form.validate() == true && this.dataCita.pacienteId > 0) {
        this.agregarDataCita();
        this.guardarCita();
      } else if (
        this.$refs.form.validate() == true &&
        !this.dataCita.pacienteId
      ) {
        this.agregarDataCita();
        let espera = await this.guardarPaciente();
        this.guardarCita(espera);
      }
    },

    agregarDataCita() {
      this.dataCita.drId = this.$refs.selectDr.selectedItems[0].id;
      this.dataCita.fechaUnix = moment(
        this.dataCita.fecha,
        "YYYY-MM-DD"
      ).unix();
      this.dataCita.hora12 = moment(this.dataCita.hora, "HH:mm").format("LT");
      this.dataCita.hora12 = this.dataCita.hora12.replace(/[. ]/g, "");
      this.citaModal = false;
    },

   async guardarPaciente() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      /*  CODIGO PARA GUARDAR PACIENTE */
    await  axios
        .post(
          "/paciente/add",
          {
            ip_address: this.dataCita.ip,
            password: this.dataCita.password,
            username: this.dataCita.paciente,
            created_on: this.dataCita.fechaUnix,
            name: this.dataCita.paciente,
            email: this.dataCita.email,
            doctor: this.dataCita.drId,
            address: this.dataCita.lugar,
            phone: this.dataCita.telefono,
            sex: this.dataCita.sexo,
            birthdate: this.fnacimiento,
            age: this.dataCita.edad,
            bloodgroup: this.dataCita.sangre,
            add_date: moment().format("LLL"),
            registration_time: this.dataCita.fechaUnix,
            how_added: 1,
          },
          configuracion
        )
        .then(function (response) {
          me.dataCita.pacienteId = response.data.pacienteId;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    abrirPacienteModal() {
      this.elegirPacienteModal = true;
      if (
        this.pacientesList === undefined ||
        this.pacientesList.length == 0 ||
        this.CrudPacienteOpen === 1
      ) {
        this.listarPacientes();
      }
    },

    abrirCrudPaciente() {
      this.$store.commit("abrirPacientesVue");
      this.CrudPacienteOpen = 1;
    },

    cerrarCrudPaciente() {
      this.$store.state.CrudPaciente = false;
    },

    cerrarPacienteModal() {
      this.elegirPacienteModal = false;
    },

    closeCitaModal() {
      this.$store.commit("cerrarCitasVue");
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

    clearPaciente() {
      this.$store.state.data.pacienteId = 0;
      this.$store.state.data.pacienteName = "";
      this.dataCita.paciente = 0;
      this.dataCita.pacienteId = "";
    },

    async btnSaveError() {
      this.loadingSave = false;
      this.btnSave = "wifi_off";
      this.colorBtnSave = "yellow darken-4";
      this.msjSave = "INTENTE MÁS TARDE";
      await new Promise((resolve) => setTimeout(resolve, 9000));
      this.btnSave = "save";
      this.colorBtnSave = "green darken-4";
      this.msjSave = "Guardar";
    },
  },
};
</script>
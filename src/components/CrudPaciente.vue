<template>
  <v-layout>
    <v-flex>
      <!-- editar y agregar PACIENTE -->
      <v-dialog
        transition="dialog-top-transition"
        v-model="crudPaciente"
        max-width="800px"
        class="modalCitaModal"
        persistent
      >
        <v-card
          class="citaModal"
          elevation="24"
          shaped
          :loading="loadingData"
          :disabled="disabledData"
        >
          <v-toolbar color="primary" dark class="titulocitaModal"
            ><v-spacer></v-spacer>

            <!-- titulo de componente -->
            <!-- if agregar o modificar -->
            <v-toolbar-title
              class="font-weight flex"
              v-if="dataPaciente.modificarAgregar == -1"
            >
              <v-icon>border_color</v-icon>
              <span> Editar Paciente</span>

              <v-btn
                class="cerrar"
                @click="cerrarCrudPaciente()"
                rounded
                dark
                outlined
                small
                ><v-icon>cancel</v-icon>cerrar</v-btn
              >
            </v-toolbar-title>

            <v-toolbar-title class="font-weight flex" v-else>
              <v-icon>person_add_alt_1</v-icon>
              <span> Agregar Paciente</span>

              <v-btn
                class="cerrar"
                @click="cerrarCrudPaciente()"
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
                <!-- paciente -->
                <v-row>
                  <v-col cols="12" sm="12" md="12" style="padding-bottom: 0px">
                    <v-text-field
                      v-model="dataPaciente.paciente"
                      label="Nombre del Paciente**"
                      prepend-inner-icon="person_add_alt_1"
                      class="font-weight-black"
                      outlined
                      rounded
                      required
                      color="green"
                      :rules="rules.paciente"
                      autofocus
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- boton guardar paciente 1 -->
                <v-row
                  v-if="
                    dataPaciente.paciente && dataPaciente.modificarAgregar > 0
                  "
                  style="
                    padding-top: 0px;
                    padding-bottom: 20px;
                    padding-right: 20px;
                  "
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    :disabled="!valid"
                    :color="colorBtnSave"
                    :loading="loadingSave"
                    outlined
                    rounded
                    @click="agregarPaciente()"
                    class="font-weight-bold"
                  >
                    <v-icon>{{ btnSave }}</v-icon>
                    {{ msjSave }}
                  </v-btn>
                </v-row>
                <!-- email -->

                <v-row>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    style="padding-top: 0px; padding-bottom: 0px"
                  >
                    <v-text-field
                      v-model="dataPaciente.email"
                      label="Correo"
                      prepend-inner-icon="alternate_email"
                      class="font-weight-black"
                      outlined
                      rounded
                      required
                      :rules="rules.email"
                    ></v-text-field>
                  </v-col>
                  <!-- telefono -->
                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    style="padding-top: 0px; padding-bottom: 0px"
                  >
                    <v-text-field
                      v-model="dataPaciente.telefono"
                      label="Telefono"
                      prepend-inner-icon="phone"
                      class="font-weight-black"
                      outlined
                      rounded
                      required
                      :rules="rules.telefono"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- sexo -->
                <v-row>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    style="padding-top: 0px; padding-bottom: 0px"
                  >
                    <v-select
                      v-model="dataPaciente.sexo"
                      :items="sexo"
                      item-text="name"
                      item-value="name"
                      :rules="rules.sexo"
                      color="primay"
                      label="sexo"
                      required
                      ref="selectSexo"
                      outlined
                      rounded
                      prepend-inner-icon="attribution"
                    >
                    </v-select>
                  </v-col>

                  <!-- tipo de sagre -->

                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    style="padding-top: 0px; padding-bottom: 0px"
                  >
                    <v-select
                      v-model="dataPaciente.sangre"
                      :items="sangre"
                      item-text="name"
                      item-value="name"
                      :rules="rules.sangre"
                      label="Tipo de sangre"
                      required
                      ref="selectSangre"
                      color="primay"
                      outlined
                      rounded
                      prepend-inner-icon="bloodtype"
                    >
                    </v-select>
                  </v-col>
                </v-row>

                <!-- edad -->
                <v-row>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    style="padding-top: 0px; padding-bottom: 0px"
                  >
                    <v-text-field
                      v-model="dataPaciente.edad"
                      label="Edad"
                      prepend-inner-icon="date_range"
                      class="font-weight-black"
                      outlined
                      rounded
                      required
                      type="number"
                      :rules="rules.edad"
                    ></v-text-field>
                  </v-col>

                  <!-- fecha nacimiento -->
                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    style="padding-top: 0px; padding-bottom: 0px"
                  >
                    <v-menu
                      ref="selectNacimiento"
                      v-model="selectNacimiento"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="fnacimiento"
                          label="Fecha de Nacimiento"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          color="primay"
                          outlined
                          rounded
                          prepend-inner-icon="date_range"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        ref="picker"
                        v-model="fnacimiento"
                        :max="new Date().toISOString().substr(0, 10)"
                        min="1950-01-01"
                        @change="save"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <br />

                <!-- seleccionar lugar -->
                <v-row>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    style="padding-top: 0px; padding-bottom: 0px"
                  >
                    <v-select
                      v-model="dataPaciente.lugar"
                      :items="lugares"
                      :rules="rules.lugar"
                      color="primary"
                      label="Consultorio"
                      outlined
                      required
                      rounded
                      prepend-inner-icon="add_location"
                    ></v-select>
                  </v-col>

                  <!-- dr -->
                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    md="6"
                    style="padding-top: 0px; padding-bottom: 0px"
                  >
                    <v-select
                      v-model="dataPaciente.dr"
                      :hint="dataPaciente.name"
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
                </v-row>

                <!-- botones finales de modal -->
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    cente
                    color="red darken-4"
                    outlined
                    rounded
                    @click="cerrarCrudPaciente()"
                    class="font-weight-bold"
                  >
                    <v-icon>cancel</v-icon>
                    cancelar
                  </v-btn>

                  <!-- if cita o modif -->
                  <v-btn
                    v-if="this.dataPaciente.modificarAgregar == -1"
                    :color="colorBtnSave"
                    :loading="loadingSave"
                    outlined
                    rounded
                    @click="modificarPaciente()"
                    class="font-weight-bold"
                  >
                    <v-icon>{{ btnSave }}</v-icon>
                    Modificar
                  </v-btn>

                  <v-btn
                    :disabled="!valid"
                    v-else
                    :color="colorBtnSave"
                    :loading="loadingSave"
                    outlined
                    rounded
                    @click="agregarPaciente()"
                    class="font-weight-bold"
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
    </v-flex>
  </v-layout>
</template>

<script>
/* COMIENZA CODIGO */
import axios from "axios";
import moment from "moment";

export default {
  props: ["componente", "itemProps"],
  data: () => ({
    loadingData: false,
    disabledData: false,
    btnSave: "save",
    colorBtnSave: "green darken-4",
    msjSave: "Guardar",
    loadingSave: false,
    valid: "",
    modalCalendario: false,
    paciente: false,
    docList: [],
    lugares: ["Peñitas", "Lago"],
    sangre: ["O+", "O-"],
    sexo: ["Femenino", "Masculino", "No Definido"],
    fnacimiento: null,
    selectNacimiento: false,
    rules: {
      paciente: [(val) => (val || "").length > 4 || "Dato requerido"],
      email: [(v) => (v || "") < 70 || /.+@.+\..+/.test(v) || "Email invalido"],
      telefono: [(val) => (val || "").length < 12 || "Telefono invalido"],
      edad: [(val) => (val || "") < 150 || "Edad no valida"],
    },
    dataPaciente: {
      id: "",
      paciente: "",
      pacienteId: "",
      email: "",
      telefono: "",
      sexo: "",
      sangre: "",
      edad: "",
      dr: "",
      drId: "",
      fecha: "",
      fechaUnix: "",
      lugar: "",
      adId: "",
      ip: "187.190.163.116",
      password: "$2y$08$IS3amhsiIeft4/MkDiEwgeNIHBdgUxbqPePdAYt0H4IR3Y0Tyx4jK",
      modificarAgregar: 1,
    },
    defaultPaciente: {
      id: "",
      paciente: "",
      pacienteId: "",
      email: "",
      telefono: "",
      sexo: "",
      sangre: "",
      edad: "",
      dr: "",
      drId: "",
      fecha: "",
      fechaUnix: "",
      lugar: "",
      adId: "",
      ip: "187.190.163.116",
      password: "$2y$08$IS3amhsiIeft4/MkDiEwgeNIHBdgUxbqPePdAYt0H4IR3Y0Tyx4jK",
      modificarAgregar: 1,
    },
  }),

  computed: {
    crudPaciente() {
      return this.$store.state.crudPaciente;
    },
    cambioPacienteId() {
      return this.$store.state.data.pacienteId;
    },
  },

  watch: {
    crudPaciente() {
      if (this.$store.state.crudPaciente === true) {
        this.propsPaciente();
      }
    },
    cambioPacienteId() {
      if (this.$store.state.data.pacienteId > 0) {
        this.dataPaciente.pacienteId = this.$store.state.data.pacienteId;
        this.dataPaciente.paciente = this.$store.state.data.pacienteName;
      }
    },
    selectNacimiento(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },

  created() {
    this.listarDrs();

    this.propsPaciente();
  },

  methods: {
    propsPaciente() {
      this.limpiarDataPaciente();
      let item = this.$props.itemProps;
      /* datos de "paciente" componente */
      if (this.$props.componente === "paciente") {
        this.dataPaciente.id = item.id;
        this.buscarPaciente();
      }else if (this.$props.componente === "CrudCitas") {
        this.dataPaciente.modificarAgregar = 1;
        this.paciente = 1;
      }
    },
    pageLoadingTrue() {
      this.loadingData = "loading";
      this.disabledData = "disabled";
    },
    pageLoadingFalse() {
      this.loadingData = false;
      this.disabledData = false;
    },
    guardarPaciente() {
      let me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      if (this.dataPaciente.modificarAgregar == -1) {
        //CODIGO PARA EDITAR
        axios
          .put(
            "/paciente/update",
            {
              id: this.dataPaciente.id,
              name: this.dataPaciente.paciente,
              email: this.dataPaciente.email,
              doctor: this.dataPaciente.drId,
              address: this.dataPaciente.lugar,
              phone: this.dataPaciente.telefono,
              sex: this.dataPaciente.sexo,
              birthdate: this.fnacimiento,
              age: this.dataPaciente.edad,
              bloodgroup: this.dataPaciente.sangre,
              ion_user_id: this.paciente.ion_user_id,
              add_date: moment().format("LLLL"),
              registration_time: this.dataPaciente.fechaUnix,
              how_added: 1,
            },
            configuracion
          )
          .then(function (response) {
            /* me.limpiardataPaciente();
            me.listarCitas();
            me.cerrarCrudPaciente(); */
            me.loadingSave = false;
            me.cerrarCrudPaciente();
            me.limpiarDataPaciente();
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        //CODIGO PARA GUARDAR
        axios
          .post(
            "/paciente/add",
            {
              ip_address: this.dataPaciente.ip,
              password: this.dataPaciente.password,
              username: this.dataPaciente.paciente,
              created_on: this.dataPaciente.fechaUnix,
              name: this.dataPaciente.paciente,
              email: this.dataPaciente.email,
              doctor: this.dataPaciente.drId,
              address: this.dataPaciente.lugar,
              phone: this.dataPaciente.telefono,
              sex: this.dataPaciente.sexo,
              birthdate: this.fnacimiento,
              age: this.dataPaciente.edad,
              bloodgroup: this.dataPaciente.sangre,
              add_date: moment().format("LLL"),
              registration_time: this.dataPaciente.fechaUnix,
              how_added: 1,
            },
            configuracion
          )
          .then(function (response) {
            /* me.limpiardataPaciente();
            me.listarCitas();
            me.closeCitaModal(); */
            me.loadingSave = false;
            me.$store.state.data.pacienteId = response.data.pacienteId;
            me.$store.state.data.pacienteName = me.dataPaciente.paciente;
            me.cerrarCrudPaciente();
            me.limpiarDataPaciente();
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    buscarPaciente() {
      this.pageLoadingTrue();
      const me = this;
      let header = { Token: this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("/paciente/query", { id: this.dataPaciente.id }, configuracion)
        .then(function (response) {
          me.pageLoadingFalse();
          if (!response.data == "") {
            me.paciente = response.data;
            me.agregarDataPaciente();
          } else {
            console.log(response);
          }
        });
    },

    agregarDataPaciente() {
      /* buscar nombre del Dr en el Array con el ID */
      let drQueSeBusca = this.paciente.doctor;
      let drNombre = "";
      function buscarDoc(bDocs) {
        if (bDocs.id == drQueSeBusca) {
          drNombre = bDocs.name;
        }
      }
      this.docList.forEach(buscarDoc);

      /* asignar los valores de la consulta a los locales */

      this.dataPaciente.id = this.paciente.id;
      this.dataPaciente.pacienteId = this.paciente.ion_user_id;
      this.dataPaciente.paciente = this.paciente.name;
      this.dataPaciente.email = this.paciente.email;
      this.dataPaciente.telefono = this.paciente.phone;
      this.dataPaciente.sexo = this.paciente.sex;
      this.dataPaciente.sangre = this.paciente.bloodgroup;
      this.dataPaciente.edad = this.paciente.age;
      this.dataPaciente.drId = this.paciente.doctor;
      this.dataPaciente.dr = drNombre;
      this.fnacimiento = this.paciente.birthdate;
      this.dataPaciente.fechaUnix = this.paciente.registration_time;
      this.dataPaciente.lugar = this.paciente.address;
      this.dataPaciente.ip = this.paciente.id;
      this.dataPaciente.modificarAgregar = -1;
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

    agregarPaciente() {
      if (this.$refs.form.validate() == true) {
        try {
          this.loadingSave = "loading";
          this.dataPaciente.drId = this.$refs.selectDr.selectedItems[0].id;
        } catch (error) {
          this.loadingSave = "loading";
        }

        try {
          /* guardar cita */
          this.dataPaciente.fechaUnix = moment(Date.now()).unix();
          this.guardarPaciente();
        } catch (error) {
          this.btnSaveError();
        }
      }
    },

    modificarPaciente() {
      if (this.$refs.form.validate() == true) {
        try {
          this.loadingSave = "loading";
          this.dataPaciente.drId = this.$refs.selectDr.selectedItems[0].id;
        } catch (error) {
          this.loadingSave = "loading";
        }

        try {
          /* guardar cita */
          this.dataPaciente.fechaUnix = moment(Date.now()).unix();
          this.guardarPaciente();
        } catch (error) {
          this.btnSaveError();
        }
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
    save(fnacimiento) {
      this.$refs.selectNacimiento.save(fnacimiento);
    },
    cerrarCrudPaciente() {
      this.limpiarDataPaciente(); 
      this.$store.state.crudPaciente = false;
      
    },
    limpiarDataPaciente() {
     this.dataPaciente = this.defaultPaciente
    },
  },
};
</script>
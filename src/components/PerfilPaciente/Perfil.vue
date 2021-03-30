<template>
  <v-layout>
    <v-flex>
      <v-card-text>
        <v-container style="padding-top: 0px">
          <v-row>
            <!-- IMAGEN AVATAR -->
            <v-col cols="12" xs="12" sm="12" md="3" style="padding-top: 0px">
              <v-img
                class="avatarPaciente"
                max-width="200"
                max-height="200"
                aspect-ratio="1"
                :src="
                  avatar
                    ? require('@/assets/png/logo.png')
                    : require('@/assets/png/avatar.png')
                "
              ></v-img>
            </v-col>
            <!-- INFORMACION PACIENTE -->
            <v-col cols="12" xs="12" sm="12" md="9">
              <v-card elevation="5">
                <!-- titulo -->
                <v-toolbar>
                  <v-toolbar-title class="font-weight flex">
                    <span>
                      {{ paciente.name ? `${paciente.name}` : "Error" }}
                    </span>
                    <span class="cerrar">ID: {{ $route.params.id }}</span>
                  </v-toolbar-title>
                </v-toolbar>
                <v-card-text> {{paciente.registration_time ?
                  `Ultimo cambio: ${ultimoCambio}`
                  :
                  "No se han registrado cambios"}}</v-card-text>

                <!-- Expandible (datos personales) -->
                <v-card-actions>
                  <v-btn
                    @click="abrirCitasVue()"
                    color="blue darken-3"
                    outlined
                  ><v-icon>book_online</v-icon>
                    Nueva cita
                  </v-btn>
                  <v-btn
                    @click="editCrudPaciente()"
                    color="blue darken-3"
                    outlined
                    class="cerrar"
                  >
                    <v-icon>settings</v-icon>Editar datos</v-btn
                  >
                  <v-spacer></v-spacer>

                  <v-btn icon @click="showDatos = !showDatos">
                    <v-icon>{{
                      showDatos ? "mdi-chevron-up" : "mdi-chevron-down"
                    }}</v-icon>
                  </v-btn>
                </v-card-actions>

                <v-expand-transition v-if="paciente">
                  <div v-show="showDatos">
                    <v-divider></v-divider>
                    <!-- 1 Dentro de showDatos -->

                    <v-card-text>
                      <p>
                        {{ paciente ? "" : "No hay datos registrados" }}
                      </p>
                      <p>
                        {{ paciente.email ? `Correo: ${paciente.email}` : "" }}
                      </p>
                      <p>
                        {{ paciente.tel ? `Telefono: ${paciente.tel}` : "" }}
                      </p>
                      <p>{{ paciente.edad ? `Edad: ${paciente.edad}` : "" }}</p>
                      <p>{{ paciente.sexo ? `Sexo: ${paciente.sexo}` : "" }}</p>
                      <p>
                        {{
                          paciente.fNacimiento
                            ? `Fecha de Nacimiento: ${paciente.fNacimiento}`
                            : ""
                        }}
                      </p>
                      <p>
                        {{
                          paciente.tipoSangre
                            ? `Tipo de Sangre: ${paciente.tipoSangre}`
                            : ""
                        }}
                      </p>
                      <p>
                        {{
                          paciente.ocupacion
                            ? `Ocupacion: ${paciente.ocupacion}`
                            : ""
                        }}
                      </p>
                      <p>
                        {{
                          paciente.consultorio
                            ? `Consultorio: ${paciente.consultorio}`
                            : ""
                        }}
                      </p>
                      <p>{{ paciente.dr ? `Dr(a): ${paciente.dr}` : "" }}</p>

                      <p>
                        {{
                          paciente.nameFamiliar
                            ? `Familiar guardado: ${paciente.nameFamiliar}`
                            : ""
                        }}
                      </p>
                      <p>
                        {{
                          paciente.telFamiliar
                            ? `Telefono de Familiar: ${paciente.telFamiliar}`
                            : ""
                        }}
                      </p>
                      <p>
                        {{
                          paciente.domicilio
                            ? `Domicilio: ${paciente.domicilio}`
                            : ""
                        }}
                      </p>
                      <p>
                        {{
                          paciente.motivoConsulta
                            ? `MotivoConsulta: ${paciente.motivoConsulta}`
                            : ""
                        }}
                      </p>
                      <p>
                        {{
                          paciente.description
                            ? `Descripcion: ${paciente.description}`
                            : ""
                        }}
                      </p>
                      <p>
                        {{
                          paciente.password
                            ? `Contraseña: ${paciente.password}`
                            : ""
                        }}
                      </p>
                    </v-card-text>
                    <!-- 2 Dentro de showDatos -->
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <!-- inicia editar agregar CITA -->
      <v-dialog
        v-model="CrudCitasVue"
        transition="dialog-top-transition"
        persistent
      >
        <crud-citas-vue
          componente="paciente"
          :itemProps="itemProps"
        ></crud-citas-vue>
      </v-dialog>
      <!-- termina editar agregar CITA -->

      <!-- inicia componente crudCitas -->
      <v-dialog
        v-model="crudPaciente"
        transition="dialog-top-transition"
        persistent
      >
        <crud-paciente :componente="componente" :itemProps="itemProps">
        </crud-paciente>
      </v-dialog>
      <!-- termina componente crudCitas -->
    </v-flex>
  </v-layout>
</template>

<script>
import CrudCitasVue from "../CrudCitas";
import CrudPaciente from "../CrudPaciente";
import moment from "moment";

export default {
  components: { CrudCitasVue, CrudPaciente },
  props: ["pacienteData"],
  data: () => ({
    avatar: false,
    showDatos: false,
    paciente: "",
    componente: "",
    ultimoCambio: "",
    itemProps:"",
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
    pacienteData() {
      if (this.pacienteData) {
        this.propsCita();
      }
    },
  },
  created() {
    this.propsCita();
     this.fechaCambio();
  },
  methods: {
    propsCita() {
      this.paciente = this.$props.pacienteData;
      this.itemProps = this.$props.pacienteData;
    },
    editCrudPaciente() {
      console.log(this.itemProps)
      this.componente = "paciente";
      this.$store.commit("abrirPacientesVue");
    },
    abrirCitasVue() {
      this.$store.commit("abrirCitasVue");
    },
    fechaCambio(){
    
this.ultimoCambio = moment.unix("1616401200").format('LL');

    },
  },
};
</script>

<style>
.avatarPaciente {
  border-radius: 50%;
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  object-position: center center;
  margin: auto;
  height: 30vw;
  width: 30vw;
}
</style>

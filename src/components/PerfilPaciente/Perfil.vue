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
                    <span> Marco Antonio Salazar Ramirez </span>
                    <span class="cerrar">ID: {{ $route.params.id }}</span>
                  </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-btn color="blue darken-3" outlined class="cerrar">
                    <v-icon>settings</v-icon>Editar datos</v-btn
                  >
                  Ultimo cambio: 22-Marzo-2021
                </v-card-text>

                <!-- Expandible (datos personales) -->
                <v-card-actions>
                  <v-btn
                    color="blue darken-3"
                    text
                    @click="showDatos = !showDatos"
                  >
                    Datos del paciente
                  </v-btn>

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
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ["pacienteData"],
  data: () => ({
    avatar: false,
    showDatos: false,
    paciente: "",
  }),
  computed: {},
  watch: {
     pacienteData() {
      if (this.pacienteData) {
        this.propsCita();
      }
    }, 
  },
  created() {
    this.propsCita();
  },
  methods: {
    propsCita() {
      this.paciente = this.$props.pacienteData;
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

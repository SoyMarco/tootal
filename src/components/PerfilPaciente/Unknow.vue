<template>

   <v-card  class="mx-auto my-1">
            <v-img
              :src="require('@/assets/jpg/404.jpg')"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
               
               max-height="2000"
            >
              <v-card-title >Pagina no encontrada</v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>home</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>person_search</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>sms</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
         
</template>


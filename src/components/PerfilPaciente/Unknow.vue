<template>

   <v-card  class="mx-auto "
      max-height="700"
      elevation="24"
      max-width="500"
   >
            <v-img
              :src="require('@/assets/jpg/404.jpg')"
              class="white--text align-end"
              gradient="rgba(0,0,0,.1), rgba(0,0,0,.5)"
               max-height="500"

            >
              <v-card-title >PAGINA NO ENCONTRADA</v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                 <router-link
                    :to="{ name: 'home' }"
                  >
                <v-icon>home</v-icon>
                 </router-link>
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


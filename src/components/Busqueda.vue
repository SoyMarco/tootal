<template>
     <v-autocomplete
     v-model="model"
     :items="items"
     item-text="name"
     item-value="symbol"
     :loading="isLoading"
     :search-input.sync="search"
            color="white"
            rounded
            outlined
            label="Buscar paciente"
            class="busqueda"
            prepend-inner-icon="search"
            clearable
          >
          <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              Busca un
              <strong>Paciente</strong>
            </v-list-item-title>
          </v-list-item>
        </template>
        <template v-slot:selection="{ attr, on, item, selected }">
          <v-chip
            v-bind="attr"
            :input-value="selected"
            color="blue-grey"
            class="white--text"
            v-on="on"
          >
            <v-icon left>
              mdi-bitcoin
            </v-icon>
            <span v-text="item.name"></span>
          </v-chip>
        </template>
        <template v-slot:item="{ item }">
          <v-list-item-avatar
            color="indigo"
            class="headline font-weight-light white--text"
          >
            {{ item.name.charAt(0) }}
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="item.symbol"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-bitcoin</v-icon>
          </v-list-item-action>
        </template>
          
          </v-autocomplete>
</template>

<script>
import axios from "axios"
export default {
    data: () => ({
busqueda: "",
items: [],
isLoading: "",
search: "",
 entries: [],se,
    model: null,
    search: null,
    }),

    
    watch: {
    
    search (val) {
      // Items have already been loaded
      if (this.items.length > 0){

      this.isLoading = true

      // Lazily load input items

      const me = this;
      axios
        .put(
          "/paciente/query",
          { id: this.busqueda },
        )
        .then(function (response) {
          if (!response.data == "") {
            me.items = response.data;
            conosle.log(response.data)
          } else {
            console.log(response); 
          }
        });
    
}

      /* fetch('https://api.coingecko.com/api/v3/coins/list')
        .then(res => res.clone().json())
        .then(res => {
          this.items = res
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false)) */
    },
  },
}
</script>
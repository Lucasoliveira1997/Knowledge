<template>
  <div class="home">
    <PageTitle icon="fa fa-home" main="Dashboard" sub="Base de Conhecimento" />
    <div class="stats-components">
      <Stats title="Categorias" :qtde="stat.categories" icon="fa fa-folder" color="#d54d50" />
      <Stats title="Artigos" :qtde="stat.articles" icon="fa fa-file" color="#3bc480" />
      <Stats title="Usuários" :qtde="stat.users" icon="fa fa-user" color="#3282cd" />
    </div>
  </div>
</template>

<script>
import PageTitle from "../templates/PageTitle";
import Stats from "./Stats";
import axios from 'axios'
import { baseApiUrl } from '@/global'

export default {
  name: "Home",
  components: { PageTitle, Stats },
  data: function() {
      return {
          stat: {}
      }
  },
  methods: {
      getStats: function() {
          axios.get(`${baseApiUrl}/status`).then(resp => this.stat = resp.data)
      }
  },
  mounted() {
      this.getStats()
  }
};
</script>

<style>
    .stats-components {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        /* margin: 5px; */
    }
</style>
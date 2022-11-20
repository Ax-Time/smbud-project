<template>
    <v-container class="mt-10">
      <p class="text-h2">Articles</p>
      <v-data-table
        :headers="headers"
        :items="articles"
        :options.sync="options"
        :server-items-length="totalArticles"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, 40, 50]
        }"
        :loading="loading"
        class="elevation-1 mt-10"
      >
        <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="$router.push('/article/' + item._id)"
            >
              mdi-eye
            </v-icon>
        </template>

      </v-data-table>
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ArticlesView',
  data () {
    return {
      totalArticles: 0,
      articles: [],
      loading: true,
      options: {},
      headers: [
        {
          text: 'Title',
          align: 'start',
          sortable: false,
          value: 'metadata.title'
        },
        { text: 'Publication Year', sortable: false, value: 'metadata.pub_year' },
        { text: 'Open', sortable: false, value: 'actions' }
      ]
    }
  },
  watch: {
    options: {
      handler () {
        this.getDataFromApi()
      },
      deep: true
    }
  },
  created () {
    this.getDataFromApi()
  },
  methods: {
    async getDataFromApi () {
      this.loading = true
      const { page, itemsPerPage } = this.options

      console.log(this.options)

      const { data } = await axios.get(
        `http://localhost:3000/articles?pageNumber=${page}&nPerPage=${itemsPerPage}`
      )

      this.articles = data.result
      this.totalArticles = data.totalArticles

      this.loading = false
    }
  }
}
</script>

<style scoped></style>

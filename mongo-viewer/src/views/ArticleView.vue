<template>
  <v-container>
    <v-progress-circular
      v-if="loading"
      :size="70"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular>
    <div v-else>
      <p class="text-h3 ma-10">{{title}}</p>

      <div v-for="(section, index) in article.sections" :key="index">
        <p class="text-h4">
          {{`${index + 1}`}}.
          {{ section.title }}
        </p>
        <p class="ml-4 text-body-2">{{ section.full_text }}</p>
        <div v-for="(sub, index2) in section.sub" :key="index2">
          <p class="text-h6 ml-4">{{`${index + 1}.${index2 + 1}`}} {{ sub.title }}</p>
          <p class="ml-8 text-body-2">
            {{ sub.full_text }}
          </p>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="js">
import axios from 'axios'
export default {
  name: 'ArticleView',
  data () {
    return {
      article: [],
      title: '',
      loading: true
    }
  },
  async created () {
    const articleID = this.$route.params.articleID
    const { data } = await axios.get(
      `http://20.160.120.145:3000/articles/${articleID}`
    )

    this.title = data.title
    this.article.sections = []

    data.result.forEach((section) => {
      // is a section
      if (section.chapter.length === 0) {
        section.sub = []
        this.article.sections.push(section)
      } else {
        // finds the section
        const sectionIndex = this.article.sections.findIndex((s) => s.title === section.chapter[0])

        console.log(sectionIndex)
        if (sectionIndex > -1) {
          this.article.sections[sectionIndex].sub.push(section)
        } else /* new section */{
          this.article.sections.push({ title: section.chapter[0], full_text: '', sub: [section] })
        }
      }
    })

    this.loading = false
  }
}
</script>

<style scoped></style>

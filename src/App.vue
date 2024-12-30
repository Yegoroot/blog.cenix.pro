<template>
  <v-app>
    <v-main>
      <v-container>
        <h1 class="text-h4 mb-4">Список постов</h1>
        <PostList />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import PostList from '@/components/PostList.vue'
</script> 
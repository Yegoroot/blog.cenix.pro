<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="store.searchQuery" label="Поиск постов" prepend-icon="mdi-magnify" clearable />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
          Добавить пост
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-virtual-scroll :items="store.filteredPosts" height="400" item-height="64">
          <template #default="{ item: post }">
            <v-list-item :key="post.id" :value="post" @mouseover="hoveredId = post.id" @mouseleave="hoveredId = null"
              :class="{ 'bg-light-blue-lighten-5': hoveredId === post.id }">
              <template #default>
                <v-list-item-title>
                  <v-text-field v-model="post.name" variant="plain" hide-details
                    @blur="handleUpdate(post.id, post.name)" />
                </v-list-item-title>
              </template>

              <template #append>
                <v-btn icon="mdi-delete" variant="text" color="error" @click="store.deletePost(post.id)" />
              </template>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-pagination v-model="store.currentPage" :length="store.totalPages" :total-visible="7"></v-pagination>
      </v-col>
    </v-row>

    <!-- Диалог добавления поста -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Добавить новый пост</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newPostName" label="Название поста" required
                  :rules="[v => !!v || 'Название обязательно']" @keyup.enter="handleAdd"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeDialog">
            Отмена
          </v-btn>
          <v-btn color="primary" variant="text" @click="handleAdd" :disabled="!newPostName">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import postsData from '@/data.json'

const store = usePostsStore()
const hoveredId = ref<string | null>(null)
const dialog = ref(false)
const newPostName = ref('')

onMounted(() => {
  store.initializePosts(postsData.posts)
})

const handleUpdate = (id: string, newName: string) => {
  store.updatePost(id, newName)
}

const handleAdd = () => {
  if (newPostName.value) {
    store.addPost(newPostName.value)
    closeDialog()
  }
}

const closeDialog = () => {
  dialog.value = false
  newPostName.value = ''
}
</script>

<style scoped>
.v-list-item:hover {
  cursor: pointer;
}
</style>
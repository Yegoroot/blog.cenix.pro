<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="store.searchQuery" label="Поиск постов" prepend-icon="mdi-magnify" class="search-field px-4" variant="outlined" rounded="lg" clearable density="comfortable" hide-details />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn color="primary" prepend-icon="mdi-plus" class="add-button" rounded="lg" elevation="2" @click="dialog = true">
          Добавить пост
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="posts-container" elevation="3" rounded="lg">
          <v-virtual-scroll :items="store.filteredPosts" height="400" item-height="64">
            <template #default="{ item: post }">
              <v-list-item :key="post.id" :value="post" @mouseover="hoveredId = post.id" @mouseleave="hoveredId = null" :class="{ 'hovered-item': hoveredId === post.id }" class="post-item" rounded="lg">
                <template #default>
                  <v-list-item-title>
                    <v-text-field v-model="post.name" variant="plain" hide-details class="post-title" @blur="handleUpdate(post.id, post.name)" />
                  </v-list-item-title>
                </template>

                <template #append>
                  <v-btn icon="mdi-delete" variant="text" color="error" class="delete-button" @click="store.deletePost(post.id)" />
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-pagination v-model="store.currentPage" :length="store.totalPages" :total-visible="7" class="pagination"></v-pagination>
      </v-col>
    </v-row>

    <!-- Диалог добавления поста -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="dialog-card" rounded="lg">
        <v-card-title>
          <span class="text-h5">Добавить новый пост</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newPostName" label="Название поста" required variant="outlined" rounded="lg" :rules="[v => !!v || 'Название обязательно']" @keyup.enter="handleAdd"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" rounded="lg" @click="closeDialog">
            Отмена
          </v-btn>
          <v-btn color="primary" variant="text" rounded="lg" @click="handleAdd" :disabled="!newPostName">
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

#input-0 {
  padding: 8px 16px;
}

.posts-container {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.post-item {
  margin: 8px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.hovered-item {
  background: #e3f2fd !important;
  border-color: #90caf9;
  transform: translateX(4px);
}

.post-title {
  font-size: 1.1rem;
}

.search-field {
  max-width: 600px;
  margin: 0 auto;
  padding: 8px 16px;
}


.add-button {
  transition: transform 0.2s ease;
}

.add-button:hover {
  transform: scale(1.02);
}

.delete-button {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.delete-button:hover {
  opacity: 1;
  transform: scale(1.1);
}

.pagination {
  margin-top: 20px;
}

.dialog-card {
  padding: 16px;
}

:deep(.v-list-item__content) {
  padding: 8px 0;
}

:deep(.v-field__input) {
  padding: 8px 16px;
}
</style>
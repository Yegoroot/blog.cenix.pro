import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Post } from '@/types'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<Post[]>([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 50

  const filteredPosts = computed(() => {
    const filtered = posts.value.filter(post => 
      post.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )

    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    
    return filtered.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(posts.value.length / itemsPerPage)
  )

  function setPage(page: number) {
    currentPage.value = page
  }

  function initializePosts(initialPosts: Post[]) {
    const savedPosts = localStorage.getItem('posts')
    if (savedPosts) {
      posts.value = JSON.parse(savedPosts)
    } else {
      posts.value = initialPosts
      savePosts()
    }
  }

  function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts.value))
  }

  function addPost(name: string = 'Новый пост') {
    const newPost: Post = {
      id: crypto.randomUUID(),
      name
    }
    posts.value.unshift(newPost)
    savePosts()
  }

  function updatePost(id: string, newName: string) {
    const post = posts.value.find(p => p.id === id)
    if (post) {
      post.name = newName
      savePosts()
    }
  }

  function deletePost(id: string) {
    posts.value = posts.value.filter(post => post.id !== id)
    savePosts()
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  return {
    posts,
    filteredPosts,
    searchQuery,
    currentPage,
    totalPages,
    initializePosts,
    addPost,
    updatePost,
    deletePost,
    setSearchQuery,
    setPage
  }
}) 
<template>

    <div class="admin-page" v-if="isLoggedIn">
      <h2>Admins</h2>
      <button @click="logout">로그아웃</button>

      <RouterLink v-if="isLoggedIn" to="/admin/users">
        <button class="user-btn">유저 목록 보기</button>
      </RouterLink>

      <RouterLink v-if="isLoggedIn" to="/admin/feedbacks">
        <button class="user-btn">피드백 목록 보기</button>
      </RouterLink>

      <RouterLink v-if="isLoggedIn" to="/admin/projects">
        <button class="user-btn">프로젝트 목록 보기</button>
      </RouterLink>

      <RouterLink v-if="isLoggedIn" to="/admin/tech">
        <button class="user-btn">Tech 목록 보기</button>
      </RouterLink>
    </div>

    <div v-else>
      <p>로그인이 필요합니다.</p>
    </div>


</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo, logoutProcess } from '@/utils/AuthUtil.js'

const router = useRouter()


const isLoggedIn = computed(() => {
  return !!localStorage.getItem('accessToken')
})



</script>

<style scoped>

h2 {
  color: #343a40;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  padding: 10px 18px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
}

.logout-btn:hover {
  background-color: #c82333;
}

.user-btn {
  background-color: #007bff;
  color: white;
}

.user-btn:hover {
  background-color: #0056b3;
}
</style>

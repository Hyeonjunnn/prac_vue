<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <span class="navbar-brand ps-2">TodoList App</span>

    <!-- 🔔 알림 도착 문구 -->
    <span v-if="showAlert" class="text-warning ms-3 fw-bold animate-blink">알림이 도착했어요!</span>

    <button class="navbar-toggler" type="button" @click="isNavShow = !isNavShow">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div :class="isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/"> Home </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/about"> About </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/post"> 게시판 </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/team"> 팀 </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/messages/list"> 쪽지 </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/project"> 프로젝트 </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/reports/write"> 신고 </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/reports"> 신고 리스트 </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/login"> Login </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/users"> Users </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin"> Admins </router-link>
        </li>

        <!-- 🔔 알림 버튼 & 알림 박스 -->
        <li class="nav-item position-relative">
          <button class="btn btn-warning" @click="showNoti = !showNoti">🔔</button>
          <NotificationBox v-if="showNoti" class="position-absolute end-0 mt-2" />
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NotificationBox from '@/pages/NotificationBox.vue'
import { eventBus } from '@/libs/eventBus'

const isNavShow = ref(false)
const showNoti = ref(false)
const showAlert = ref(false)

// 🔔 NotificationBox.vue에서 알림이 오면 이벤트 수신
onMounted(() => {
  eventBus.on('new-notification', () => {
    showAlert.value = true
    setTimeout(() => {
      showAlert.value = false
    }, 3000) // 3초 깜빡임
  })
})
</script>

<style scoped>
@keyframes blink {
  0%   { opacity: 1; }
  50%  { opacity: 0; }
  100% { opacity: 1; }
}

.animate-blink {
  animation: blink 0.7s ease-in-out 3;
}
</style>
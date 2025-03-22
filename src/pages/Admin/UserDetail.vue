<template>
  <div v-if="user" class="user-detail-container">
    <h1>{{ user.username }}님의 정보</h1>
    <table class="user-detail-table">
      <tbody>
      <tr>
        <th>권한</th>
        <td>{{ user.role }}</td>
      </tr>
      <tr>
        <th>이메일</th>
        <td>{{ user.email }}</td>
      </tr>
      <tr>
        <th>전화번호</th>
        <td>{{ user.phoneNum }}</td>
      </tr>
      <tr>
        <th>정지 여부</th>
        <td>{{ user.banned ? '정지됨' : '활성' }}</td>
      </tr>
      <tr>
        <th>비밀번호 오류 횟수</th>
        <td>{{ user.passwordErrorCount }}</td>
      </tr>
      <tr>
        <th>생성일</th>
        <td>{{ user.createdAt }}</td>
      </tr>
      <tr>
        <th>수정일</th>
        <td>{{ user.updateAt }}</td>
      </tr>
      <tr>
        <th>상태</th>
        <td>{{ user.status }}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <button @click="goToUserComments" class="comment-btn">모든 댓글 가져오기</button>
  <button @click="goToUserPosts" class="comment-btn">모든 게시글 가져오기</button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const userNo = route.params.userNo;
const user = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:8087/admin/user/${userNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    user.value = res.data;
  } catch (error) {
    console.error('유저 정보를 불러오는 데 실패했습니다:', error);
  }
});

const goToUserComments = () => {
  router.push(`/admin/user/${userNo}/comments`);
};

const goToUserPosts = () => {
  router.push(`/admin/user/${userNo}/post`);
};
</script>

<style scoped>
.user-detail-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}

.user-detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.user-detail-table th,
.user-detail-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
  vertical-align: top;
  background-color: #fff;
}

.user-detail-table th {
  background-color: #f0f0f0;
  width: 30%;
}
</style>

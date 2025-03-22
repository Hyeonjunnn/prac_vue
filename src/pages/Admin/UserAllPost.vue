<template>
  <div class="user-post-list">
    <h2>{{ userName }} 님의 게시글 목록</h2>

    <!-- 🔹 BoardType 선택 드롭다운 추가 -->
    <label for="boardType">게시판 선택:</label>
    <select id="boardType" v-model="boardType">
      <option value="NOTICE">공지 게시판</option>
      <option value="FREE">자유 게시판</option>
      <option value="PROJECT_RECRUIT">프로젝트 모집 게시판</option>
    </select>

    <div v-if="posts.length === 0">게시글이 없습니다.</div>

    <table v-else>
      <thead>
      <tr>
        <th>번호</th>
        <th>제목</th>
        <th>게시판</th>
        <th>상태</th>
        <th>조회수</th>
        <th>북마크</th>
        <th>댓글</th>
        <th>작성일</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="post in posts" :key="post.postNo">
        <td>{{ post.postNo }}</td>
        <td>{{ post.title }}</td>
        <td>{{ post.boardType }}</td>
        <td>{{ post.postStatus }}</td>
        <td>{{ post.viewCount }}</td>
        <td>{{ post.bookmarkCount }}</td>
        <td>{{ post.commentCount }}</td>
        <td>{{ formatDate(post.createdAt) }}</td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="currentPage === 0" @click="fetchPosts(currentPage - 1)">이전</button>
      <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
      <button :disabled="currentPage + 1 >= totalPages" @click="fetchPosts(currentPage + 1)">다음</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute();
const userNo = route.params.userNo;

const posts = ref([]);
const userName = ref('');
const currentPage = ref(0);
const totalPages = ref(1);
const boardType = ref(localStorage.getItem("boardType") || 'FREE'); // 기본값 설정 (필요시 변경 가능)


const fetchUserName = async () => {
  try{

    const res = await axios.get(`http://localhost:8087/admin/user/${userNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });
    userName.value = res.data.username;
  } catch (error) {
    console.error('유저 정보를 불러오는 중 오류 발생:', error);
  }
};

const fetchPosts = async (page = 0) => {
  try {
    await fetchUserName();
    const res = await axios.get(`http://localhost:8087/admin/user/${userNo}/post`, {
      params: {
        boardType: boardType.value,
        page: page,
        size: 10,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    });

    posts.value = res.data.content;

    totalPages.value = res.data.totalPages;
    currentPage.value = res.data.number;

  } catch (error) {
    console.error('게시글을 불러오는 중 오류 발생:', error);
  }
};

watch(boardType, (newVal) => {
  localStorage.setItem("boardType", newVal);
  posts.value = [];
  currentPage.value = 0; // Reset to first page
  fetchPosts(0);
});

onMounted(() => {
  fetchPosts();
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}
</script>

<style scoped>
.user-post-list {
  padding: 20px;
}

label {
  font-weight: bold;
  margin-right: 10px;
}

select {
  padding: 5px;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}
</style>

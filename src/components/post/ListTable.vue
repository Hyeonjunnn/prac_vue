<template>
  <div class="main-container">
    <div class="table-container">
      <div class="table-wrapper">
        <table class="custom-table">
          <!-- 제목 -->
          <thead class="table-header">
            <tr>
              <th class="header-cell">번호</th>
              <th class="header-cell">제목</th>
              <th class="header-cell">글쓴이</th>
              <th class="header-cell">작성일</th>
            </tr>
          </thead>
          <!-- 내용 -->
          <tbody>
            <tr v-for="(post, i) in paginatedPosts" :key="i" @click="ditailePage(post.postNo)" class="table-row">
              <td class="body-cell">{{ post.postNo }}</td>
              <td class="body-cell">{{ post.title }}</td>
              <td class="body-cell">{{ post.userName }}</td>
              <td class="body-cell">{{ new Date(post.createdAt).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListTable",
  props: {
    // 부모로 부터 받아오는 값들
    // 기본 데이터 배열
    posts: {
      type: Array,
      default: () => [], // 기본값을 빈 배열로 설정
      required: true,
    },
  },
  computed: {
    // 페이징 처리된 페이지를 반환
    paginatedPosts() {
      return this.posts; // posts 배열 직접 반환
    },
  },
  methods: {
    // 상세 글 보기
    ditailePage(no) {
      this.$router.push(`/post/${no}`);
    },
  },
};
</script>

<style scoped>
.main-container {
  margin-top: 1rem;
}

.table-container {
  margin-top: 1.5rem;
}

.table-wrapper {
  margin: 1.5rem 0;
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 0.375rem; /* rounded-md */
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1); /* shadow */
}

.custom-table {
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

.table-header {
  border-bottom: 1px solid #e5e7eb; /* border-b */
}

.header-cell {
  padding: 0.75rem 1.25rem; /* px-5 py-3 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  text-transform: uppercase;
  color: #f3f4f6; /* text-gray-100 */
  background-color: #4f46e5; /* indigo-800 */
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.table-row:hover {
  background-color: #e5e7eb; /* hover:bg-gray-200 */
}

.body-cell {
  padding: 1rem 1.5rem; /* px-6 py-4 */
  font-size: 1.125rem; /* text-lg */
  color: #6b7280; /* text-gray-500 */
  border-bottom: 1px solid #e5e7eb; /* border-b */
}

.body-cell:first-child {
  font-weight: 500; /* 강조를 위해 font 추가 */
}

.body-cell:hover {
  color: #374151; /* text-gray-700 */
}
</style>

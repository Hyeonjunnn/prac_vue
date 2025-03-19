<template>
  <div>
    <!-- 분류바 -->
    <div class="category-bar">
      <button @click="changeBoardType('NOTICE')" class="category-button">공지</button>
      <button @click="changeBoardType('PROJECT_RECRUIT')" class="category-button">프로젝트</button>
      <button @click="changeBoardType('FREE')" class="category-button">자유</button>
      <router-link to="/post/write">
        <button class="category-button">글 작성</button>
      </router-link>
    </div>

    <!-- 검색바 -->
    <div>
      <div class="search-bar">
        <div class="flex">
          <div class="relative">
            <select v-model="size" @change="fetchPostList" class="select-box">
              <option>10</option>
              <option>20</option>
              <option>30</option>
            </select>
          </div>
          <div class="relative">
            <select v-model="postSortOption" @change="fetchPostList" class="select-box">
              <option value="LATEST">최신순</option>
              <option value="BOOKMARK">북마크</option>
              <option value="VIEW">조회수</option>
              <option value="COMMENT">댓글</option>
            </select>
          </div>
          <div class="relative">
            <select v-model="selectOption" class="select-box">
              <option value="">전체</option>
              <option value="TITLE">제목</option>
              <option value="CONTENT">내용</option>
              <option value="USERNAME">유저이름</option>
            </select>
          </div>
        </div>
        <div class="relative block mt-2 sm:mt-0">
          <input v-model="searchQuery" @keydown.enter="fetchPostList" placeholder="검색어를 입력해주세요" class="search-input" />
        </div>
      </div>
    </div>

    <!-- 테이블 -->
    <ListTable v-if="postList.content && postList.content.length > 0" :posts="postList.content" />
    <div v-else class="text-center mt-4">검색 결과가 없습니다.</div>

    <!-- 페이징 -->
    <PageNav v-if="postList.content && postList.content.length > 0" :current-page="page" :items-per-page="parseInt(size)" :total-pages="postList.totalPages" @set-page="setPage" />
  </div>
</template>

<script>
import ListTable from "@/components/post/ListTable.vue";
import PageNav from "@/components/post/PageNav.vue";
import axios from "axios";
export default {
  name: "PostView",
  components: {
    ListTable,
    PageNav,
  },
  data() {
    return {
      postList: [], // 초기 데이터 정의
      boardType: "FREE", // 페이지 분류
      postSortOption: "LATEST", // 정렬 순서

      page: 1, // 초기 페이지 번호
      size: 10, // 초기 페이지 사이즈

      searchQuery: "", // 검색어
      selectOption: "", // 검색 옵션
    };
  },
  mounted() {
    // 컴포넌트가 마운트 될 때 실행되는 라이프사이클 훅
    this.fetchPostList(); // 데이터 가져오는 메소드 호출
  },
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        this.fetchPostList(); // 라우트가 변경될 때 데이터 가져오기
      }
    },
  },
  methods: {
    // 데이터를 가져오는 메소드
    async fetchPostList() {
      // 기본 요청 파라미터
      const params = {
        boardType: this.boardType,
        postSortOption: this.postSortOption,
        page: this.page - 1, // 현재 페이지 번호 -1 (0 기반 인덱스)
        size: this.size,
      };

      // 검색 조건이 있을 경우 파라미터에 추가
      if (this.searchQuery && this.selectOption) {
        params.option = this.selectOption;
        params.keyword = this.searchQuery;
      }

      await axios
        .get("http://localhost:8087/posts/search", {params})
        .then((response) => {
          if (response.status === 200) {
            this.postList = response.data;
          } else {
            alert("데이터 조회 실패");
          }
        })
        .catch((error) => {
          console.error("데이터를 불러오는 중, 오류 발생 :", error); // 오류 처리
          // 오류 발생 시 postList 초기화 및 페이지 번호 초기화
          this.postList = {content: []};
          this.page = 1;
          this.fetchPostList(); // 데이터 재 호출
        });
    },
    // 분류별로 데이터를 가져오는 메소드
    changeBoardType(type) {
      this.boardType = type;
      this.page = 1; // 페이지 초기화
      this.searchQuery = ""; // 검색 초기화
      this.fetchPostList(); // 데이터 재 호출
    },
    // 페이징 시 값 변경 메소드
    setPage(page) {
      this.page = page; // 부모 컴포넌트에서 페이지 업데이트
      this.fetchPostList(); // 데이터 재 호출
    },
  },
};
</script>

<style scoped>
.category-bar {
  display: flex;
  padding: 1rem;
  gap: 1rem;
  overflow-x: auto;
}

.category-button {
  padding: 0.5rem 1rem;
  font-weight: 500;
  text-transform: capitalize;
  color: white;
  background-color: #4f46e5; /* indigo-600 */
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.category-button:hover {
  background-color: #4338ca; /* indigo-500 */
}

.search-bar {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.select-box {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e0; /* gray-400 */
  border-radius: 0.375rem;
  background-color: white;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 2.5rem;
  border: 1px solid #cbd5e0; /* gray-400 */
  border-radius: 0.375rem;
}
</style>

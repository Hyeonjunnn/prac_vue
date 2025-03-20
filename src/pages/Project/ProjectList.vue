<template>
  <div>
    <!-- 분류바 -->
    <div class="category-bar">
      <router-link to="/post/write">
        <button class="category-button">팀 생성</button>
      </router-link>
    </div>

    <!-- 검색바 -->
    <SearchBar :size-options="sizeOptions" :post-sort-options="postSortOptions" :select-options="selectOptions" @search="handleSearch" />

    <!-- 테이블 -->
    <div class="main-container">
      <div class="table-container">
        <div class="table-wrapper">
          <table class="custom-table">
            <!-- 제목 -->
            <thead class="table-header">
              <tr>
                <th class="header-cell width-80">번호</th>
                <th class="header-cell">프로젝트</th>
                <th class="header-cell width-350">팀</th>
                <th class="header-cell">간단 소개</th>
                <th class="header-cell">상태</th>
              </tr>
            </thead>
            <!-- 내용 -->
            <tbody>
              <tr v-for="(post, i) in paginatedPosts" :key="i" @click="ditailePage(post.no)" class="table-row">
                <td class="body-cell">{{ post.no }}</td>
                <td class="body-cell">{{ post.name }}</td>
                <td class="body-cell">{{ post.teamName }}</td>
                <td class="body-cell">{{ post.content }}</td>
                <td class="body-cell">{{ post.projectStatus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 페이징 -->
    <PageNav v-if="postList.content && postList.content.length > 0" :current-page="page" :items-per-page="parseInt(size)" :total-pages="postList.totalPages" @set-page="setPage" />
  </div>
</template>

<script>
import PageNav from "@/components/common/PageNav.vue";
import SearchBar from "@/components/common/SearchBar.vue";
import axios from "axios";
export default {
  name: "PostView",
  components: {
    PageNav,
    SearchBar,
  },
  data() {
    return {
      postList: [], // 초기 데이터 정의
      postSortOption: "LATEST", // 정렬 순서

      page: 1, // 초기 페이지 번호
      size: 10, // 초기 페이지 사이즈

      searchQuery: "", // 검색어
      selectOption: "", // 검색 옵션

      paginatedPosts: [], // 페이징된 게시글

      // 검색창 데이터---------------
      // 항목 개수
      sizeOptions: [10, 20, 30],
      // 정렬 옵션
      postSortOptions: [
        {value: "LATEST", label: "최신순"},
        {value: "VIEW", label: "조회수"},
      ],
      // 검색 옵션
      selectOptions: [
        {value: "", label: "전체"},
        {value: "TITLE", label: "제목"},
        {value: "CONTENT", label: "내용"},
        {value: "PROJECT_TECHS", label: "기술명"},
      ],
    };
  },
  computed: {
    paginatedPosts() {
      return this.postList.content || []; // 추가
    },
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
        projectSortOption: this.postSortOption,
        page: this.page - 1, // 현재 페이지 번호 -1 (0 기반 인덱스)
        size: this.size,
      };

      // 검색 조건이 있을 경우 파라미터에 추가
      if (this.searchQuery && this.selectOption) {
        params.option = this.selectOption;
        params.keyword = this.searchQuery;
      }

      await axios
        .get("http://localhost:8087/project", {params})
        .then((response) => {
          if (response.status === 200) {
            this.postList = response.data;
          } else {
            alert("데이터 조회 실패");
          }
        })
        .catch((error) => {
          console.error("데이터를 불러오는 중, 오류 발생함 초기화"); // 오류 처리
          // 오류 발생 시 postList 초기화 및 페이지 번호 초기화
          this.postList = {content: []};
          this.page = 1;
        });
    },
    // 페이징 시 값 변경 메소드
    setPage(page) {
      this.page = page; // 부모 컴포넌트에서 페이지 업데이트
      this.fetchPostList(); // 데이터 재 호출
    },
    // 검색 컴포넌트에서 전달된 검색 조건 처리
    handleSearch(searchParams) {
      this.size = searchParams.size;
      this.postSortOption = searchParams.postSortOption;
      this.selectOption = searchParams.selectOption;
      this.searchQuery = searchParams.searchQuery;
      this.page = 1; // 검색 시 페이지 초기화
      this.fetchPostList();
    },
    ditailePage(no) {
      this.$router.push(`/projects/${no}`);
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

.width-350 {
  width: 350px;
  text-align: left;
}

.width-80 {
  width: 80px;
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

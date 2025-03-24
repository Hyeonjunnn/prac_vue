<template>
    <div>

        <!-- 분류바 -->
        <div class="category-bar">
            <router-link :to="ScheduleWrite">
                <button class="category-button">스케줄 추가</button>
            </router-link>
        </div>

        <!-- 검색바 -->
        <SearchBar :size-options="sizeOptions" :searchFalse="true" @search="handleSearch" />

        <!-- 테이블 -->
        <div class="main-container">
            <div class="table-container">
                <div class="table-wrapper">
                    <table class="custom-table">
                        <!-- 제목 -->
                        <thead class="table-header">
                            <tr>
                                <th class="header-cell width-80">번호</th>
                                <th class="header-cell">일정명</th>
                                <th class="header-cell">담당자</th>
                                <th class="header-cell">상태</th>
                                <th class="header-cell">시작시간</th>
                                <th class="header-cell">마감시간</th>
                            </tr>
                        </thead>
                        <!-- 내용 -->
                        <tbody>
                            <tr v-for="(post, i) in paginatedPosts" :key="i" @click="detailePage(post.scheduleNo)"
                                class="table-row">
                                <td class="body-cell">{{ post.scheduleNo }}</td>
                                <td class="body-cell">{{ post.title }}</td>
                                <td class="body-cell">{{ post.createdBy }}</td>
                                <td class="body-cell">{{ post.status }}</td>
                                <td class="body-cell">{{ new Date(post.startDate).toLocaleDateString() }}</td>
                                <td class="body-cell">{{ new Date(post.endDate).toLocaleDateString() }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 페이징 -->
        <PageNav v-if="postList.content && postList.content.length > 0" :current-page="page"
            :items-per-page="parseInt(size)" :total-pages="postList.totalPages" @set-page="setPage" />
    </div>
</template>

<script setup>
import PageNav from "@/components/common/PageNav.vue";
import SearchBar from "@/components/common/SearchBar.vue";
import {getUserInfo} from "@/utils/AuthUtil.js";
import axios from "axios";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from 'vue-router'
import ScheduleWrite from "./ScheduleWrite.vue";

const postList = ref({ content: [] });
const scheduleSortOption = ref("");
const page = ref(1);
const size = ref(10);

const sizeOptions = ref([10, 20, 30]);
const scheduleSortOptions = ref([{ value: "START_DATE", label: "최신순" }]);

const paginatedPosts = computed(() => postList.value.content || []);

const route = useRoute();
const router = useRouter();

const teamNo = route.params.teamNo;

const fetchPostList = async () => {
    const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getUserInfo().accessToken,
            },
        };
  const params = {
    scheduleSortOption: scheduleSortOption.value,
    page: page.value - 1,
    size: size.value,
  };

  try {
    const response = await axios.get(`http://localhost:8087/schedules/team/${teamNo}`, { 
        params, // params 객체 전달 (key와 value가 같으면 축약 가능)
        headers: config.headers, // headers 전달);
    });

    if (response.status === 200) {
      console.log(response.data);
      postList.value = response.data;
    } else {
      alert("데이터 조회 실패");
    }
  } catch (error) {
    console.error("데이터를 불러오는 중, 오류 발생함 초기화");
    console.log(error);
    postList.value = { content: [] };
    page.value = 1;
  }
};

const setPage = (newPage) => {
  page.value = newPage;
  fetchPostList();
};

const handleSearch = (searchParams) => {
  scheduleSortOption.value = searchParams.scheduleSortOption;
  size.value = searchParams.size;
  page.value = 1;
  fetchPostList();
};

const detailePage = (scheduleNo) => {
    console.log(scheduleNo);
    router.push({
    name: 'ScheduleDeteil',
    params: {
      teamNo: teamNo,
      scheduleNo: scheduleNo,
    },
  });
};

onMounted(() => {
  fetchPostList();
});

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      fetchPostList();
    }
  }
);
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
    background-color: #4f46e5;
    /* indigo-600 */
    border-radius: 0.375rem;
    transition: background-color 0.2s ease;
}

.category-button:hover {
    background-color: #4338ca;
    /* indigo-500 */
}

.select-box {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #cbd5e0;
    /* gray-400 */
    border-radius: 0.375rem;
    background-color: white;
}

.search-input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 2.5rem;
    border: 1px solid #cbd5e0;
    /* gray-400 */
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
    border-radius: 0.375rem;
    /* rounded-md */
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    /* shadow */
}

.custom-table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
}

.table-header {
    border-bottom: 1px solid #e5e7eb;
    /* border-b */
}

.width-350 {
    width: 350px;
    text-align: left;
}

.width-80 {
    width: 80px;
}

.header-cell {
    padding: 0.75rem 1.25rem;
    /* px-5 py-3 */
    font-size: 0.875rem;
    /* text-sm */
    font-weight: 500;
    /* font-medium */
    text-transform: uppercase;
    color: #f3f4f6;
    /* text-gray-100 */
    background-color: #4f46e5;
    /* indigo-800 */
}

.table-row {
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

.table-row:hover {
    background-color: #e5e7eb;
    /* hover:bg-gray-200 */
}

.body-cell {
    padding: 1rem 1.5rem;
    /* px-6 py-4 */
    font-size: 1.125rem;
    /* text-lg */
    color: #6b7280;
    /* text-gray-500 */
    border-bottom: 1px solid #e5e7eb;
    /* border-b */
}

.body-cell:first-child {
    font-weight: 500;
    /* 강조를 위해 font 추가 */
}

.body-cell:hover {
    color: #374151;
    /* text-gray-700 */
}
</style>

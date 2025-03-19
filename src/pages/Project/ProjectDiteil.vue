<template>
    <div>
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">
            <!-- Author Section -->
            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar" class="w-12 h-12 rounded-full" />
                <div>
                    <h3 class="font-semibold">팀 / {{ project.teamName }}</h3>
                    <p class="text-gray-500 text-sm">번호 {{ project.no }}, 상태 {{ project.projectStatus }}</p>
                </div>
            </div>

            <!-- Main Content -->
            <div class="space-y-6">
                <!-- 제목 -->
                <h1 class="text-3xl font-bold text-black">
                    {{ project.name }}
                </h1>

                <!-- 내용 -->
                <div class="prose max-w-none text-black">
                    <p class="text-gray-500 leading-relaxed">
                        {{ project.content }}
                    </p>
                </div>
            </div>
            <!-- Tags 샘플로 남겨둠 -->
            <!-- <div class="mt-8 flex flex-wrap gap-2">
        <span
          class="px-3 py-1 bg-gray-50 dark:bg-[#252731] rounded-full text-sm text-indigo-500"
          >#WebDevelopment</span
        >
        <span
          class="px-3 py-1 bg-gray-50 dark:bg-[#252731] rounded-full text-sm text-indigo-500"
          >#Programming</span
        >
        <span
          class="px-3 py-1 bg-gray-50 dark:bg-[#252731] rounded-full text-sm text-indigo-500"
          >#TechTrends</span
        >
      </div> -->
            <!-- 수정 삭제 -->
            <div>
                <br />
                <button class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none" @click="goToEditPage">수정</button>
                <button class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none" @click="confirmDelete(project.no)">삭제</button>
            </div>
            <span>조회수: {{ project.view }}</span>
        </div>
    </div>
</template>
<script>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import axios from "axios";
export default {
    name: "ProjectDiteil",
    setup() {
        // 초기 데이터 설정
        const route = useRoute(); // 현재 URL 정보 가져옴
        const router = useRouter(); // 경로 이동 (라우트를 이동하거나 상태 변경할때 사용)
        const projectNo = route.params.projectNo; // 경로에 포함된 번호를 가져옴
        const project = ref({}); // 반응형 데이터 선언

        // 상세 정보 가져와서 project에 넣음
        axios
            .get(`http://localhost:8087/project/${projectNo}`)
            .then((response) => {
                if (response.status === 200) {
                    project.value = response.data;
                } else {
                    alert("데이터 조회 실패");
                }
            })
            .catch((error) => {
                console.error("데이터를 불러오는 중, 오류 발생함");
            });

        // 게시글 수정용 데이터
        const goToEditPage = () => {
            router.push({
                name: "AddProject",
                query: {
                    projectNo: project.value.projectNo,
                    name: project.value.name,
                    content: project.value.content,
                    boardType: project.value.boardType,
                },
            });
        };

        // 메소드 반환
        return {
            project,
            goToEditPage,
        };
    },
    methods: {
        // 삭제 확인 창
        confirmDelete(projectNo) {
            if (confirm("정말로 삭제하시겠습니까?")) {
                // 삭제 처리 로직 호출
                this.deleteProjectData(projectNo);
            }
        },
        // 게시글 삭제
        deleteProjectData(projectNo) {
            axios
                .delete(`/project/${projectNo}`)
                .then(() => {
                    // 게시글을 삭제한 후 기존 페이지로 돌려보냄
                    this.$router.push("/projects");
                })
                .catch((error) => {
                    console.error("게시글 삭제 실패", error);
                });
        },
    },
};
</script>

<style scoped>
/* 전체 컨테이너 */
.max-w-7xl {
    max-width: 80rem; /* 1280px */
}

.w-full {
    width: 100%;
}

.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.p-4 {
    padding: 1rem; /* 16px */
}

.bg-white {
    background-color: #ffffff;
}

/* 작성자 섹션 */
.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.space-x-4 {
    margin-left: 1rem; /* 16px */
}

.mb-6 {
    margin-bottom: 1.5rem; /* 24px */
}

.w-12 {
    width: 3rem; /* 48px */
}

.h-12 {
    height: 3rem; /* 48px */
}

.rounded-full {
    border-radius: 9999px;
}

.font-semibold {
    font-weight: 600;
}

.text-gray-500 {
    color: #6b7280;
}

.text-sm {
    font-size: 0.875rem; /* 14px */
    line-height: 1.25rem; /* 20px */
}

/* 메인 컨텐츠 */
.space-y-6 {
    margin-top: 1.5rem; /* 24px */
    margin-bottom: 1.5rem; /* 24px */
}

.text-3xl {
    font-size: 1.875rem; /* 30px */
    line-height: 2.25rem; /* 36px */
}

.font-bold {
    font-weight: 700;
}

.text-black {
    color: #000000;
}

.prose {
    max-width: none;
}

.leading-relaxed {
    line-height: 1.625;
}

/* 태그 (샘플) */
.mt-8 {
    margin-top: 2rem; /* 32px */
}

.flex-wrap {
    flex-wrap: wrap;
}

.gap-2 {
    gap: 0.5rem; /* 8px */
}

.px-3 {
    padding-left: 0.75rem; /* 12px */
    padding-right: 0.75rem; /* 12px */
}

.py-1 {
    padding-top: 0.25rem; /* 4px */
    padding-bottom: 0.25rem; /* 4px */
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.rounded-full {
    border-radius: 9999px;
}

.text-indigo-500 {
    color: #6366f1;
}

/* 수정 삭제 버튼 */
.text-white {
    color: #ffffff;
}

.bg-indigo-600 {
    background-color: #4f46e5;
}

.rounded-md {
    border-radius: 0.375rem; /* 6px */
}

.hover\:bg-indigo-500:hover {
    background-color: #6366f1;
}

.focus\:outline-none:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
}

.text-gray-700 {
    color: #374151;
}

.bg-gray-200 {
    background-color: #e5e7eb;
}

.hover\:bg-gray-300:hover {
    background-color: #d1d5db;
}

/* 조회수 */
span {
    display: inline;
}
</style>

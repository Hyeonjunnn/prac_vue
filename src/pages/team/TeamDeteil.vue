<template>
    <div>
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">
            <!-- Author Section -->
            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar" class="w-12 h-12 rounded-full" />
                <div>
                    <h3 class="font-semibold">{{ team.name }}</h3>
                    <p class="text-gray-500 text-sm">
                        {{ team.info }}
                        {{ team.status }}
                    </p>
                </div>
            </div>

            <!-- Main Content -->
            <div v-if="project.name">
                <ProjectInfo :project="project" />
            </div>

            <div class="space-y-6" v-else>
                <h2>아직 프로젝트가 생성되지 않았습니다.</h2>
                <div v-if="leader">
                    <router-link to="/project/write">
                        <button class="category-button">프로젝트 생성</button>
                    </router-link>
                </div>
            </div>

            <!-- 팀원 신청 버튼 -->
            <div v-if="(team.status === 'OPEN') & !leader">
                <button class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none" @click="confirmJoin(team.no)">가입 신청</button>
            </div>

            <!-- 수정 삭제 -->
            <div v-if="leader">
                <br />
                <button class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none" @click="goToEditPage">수정</button>
                <button class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none" @click="confirmDelete(team.no)">삭제</button>
            </div>
        </div>
    </div>
</template>
<script>
import {useRoute, useRouter} from "vue-router";
import {getUserInfo} from "@/utils/AuthUtil.js";
import {ref} from "vue";
import axios from "axios";
import ProjectInfo from "@/components/project/ProjectInfo.vue";

export default {
    name: "TeamDiteil",
    components: {
        ProjectInfo,
    },
    setup() {
        // 초기 데이터 설정
        const route = useRoute(); // 현재 URL 정보 가져옴
        const router = useRouter(); // 경로 이동 (라우트를 이동하거나 상태 변경할때 사용)
        const teamNo = route.params.teamNo; // 경로에 포함된 번호를 가져옴
        const team = ref({}); // 반응형 데이터 선언
        const project = ref({});
        const leader = ref(false); // 팀장 확인

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getUserInfo().accessToken,
            },
        };

        // 상세 정보 가져와서 team에 넣음
        axios.get(`http://localhost:8087/team/${teamNo}`).then((response) => {
            team.value = {
                no: response.data.team.no,
                name: response.data.team.team.teamName,
                info: response.data.team.team.teamIntroduce,
                status: response.data.team.team.projectStatus,
            };
            project.value = response.data.project;

            return axios
                .get(`http://localhost:8087/team/${teamNo}/leader-role`, config)
                .then((response) => {
                    if (response.status === 200) {
                        leader.value = true; // 팀장 확인됨
                    }
                })
                .catch((error) => {
                    console.log(error.response.data.message);
                });
        });

        // 팀 수정용 데이터
        const goToEditPage = () => {
            router.push({
                name: "TeamWrite",
                query: {
                    teamNo: team.value.no,
                    teamName: team.value.name,
                    teamIntroduce: team.value.info,
                    projectStatus: team.value.status,
                },
            });
        };

        // 메소드 반환
        return {
            team,
            project,
            leader,
            goToEditPage,
        };
    },
    methods: {
        // 삭제 확인 창
        confirmDelete(teamNo) {
            if (confirm("정말로 삭제하시겠습니까?")) {
                // 삭제 처리 로직 호출
                this.deletePostData(teamNo);
            }
        },
        // 팀 삭제
        async deletePostData(teamNo) {
            const url = `http://localhost:8087/team/${teamNo}`;
            const token = getUserInfo().accessToken;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            await axios
                .delete(url, config)
                .then(() => {
                    alert("팀이 삭제되었습니다.");
                    // 팀을 삭제한 후 기존 페이지로 돌려보냄
                    this.$router.push("/team");
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        },

        // 팀 가입 신청 확인 창
        confirmJoin(teamNo) {
            if (confirm("해당 팀에 가입을 신청하시겠습니까?")) {
                this.teamJoinRequest(teamNo);
            }
        },

        // 팀 가입 신청
        async teamJoinRequest(teamNo) {
            const url = `http://localhost:8087/team/${teamNo}/join-request`;
            const token = getUserInfo().accessToken;
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            await axios
                .post(url, teamNo, config)
                .then(() => {
                    alert("가입 신청이 완료되었습니다!");
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
        },
    },
};
</script>

<style scoped>
/* Author Section */
.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.space-x-4 > * + * {
    margin-left: 1rem;
}

.mb-6 {
    margin-bottom: 1.5rem;
}

.w-12,
.h-12 {
    width: 3rem;
    height: 3rem;
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
    font-size: 0.875rem;
}

/* Main Content */
.space-y-6 > * + * {
    margin-top: 1.5rem;
}

.text-3xl {
    font-size: 1.875rem;
}

.font-bold {
    font-weight: 700;
}

.text-black {
    color: #000;
}

.prose p {
    color: #6b7280;
    line-height: 1.625;
}

.max-w-none {
    max-width: none;
}

/* 수정 삭제 버튼 */
.mt-4 {
    margin-top: 1rem;
}

.px-3,
.py-1 {
    padding: 0.25rem 0.75rem;
}

.text-white {
    color: #fff;
}

.bg-indigo-600 {
    background-color: #4f46e5;
}

.rounded-md {
    border-radius: 0.375rem;
}

.hover\:bg-indigo-500:hover {
    background-color: #4338ca;
}

.focus\:outline-none:focus {
    outline: none;
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

/* 댓글 부분 */
.comment-section {
    margin-top: 1rem;
}

.comment-count {
    font-weight: 600;
}
</style>

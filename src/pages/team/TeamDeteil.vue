<template>
    <div class="max-w-7xl w-full mx-auto p-4 bg-white">
      <!-- Author Section -->
      <div class="flex items-center space-x-4 mb-6">
        <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar" class="w-12 h-12 rounded-full" />
        <div>
          <h3 class="font-semibold">{{ team.name }}</h3>
          <p class="text-gray-500 text-sm">{{ team.info }} {{ team.status }}</p>
        </div>
      </div>
  
      <!-- 프로젝트 정보 -->
      <div>
        <ProjectInfo :project="project" v-if="project.name" />
        <div class="space-y-6" v-else>
          <h2>아직 프로젝트가 생성되지 않았습니다.</h2>
          <div v-if="isLeader">
            <router-link :to="{ name: 'ProjectWrite', query: { teamNo: team.no } }">
              <button class="category-button">프로젝트 생성</button>
            </router-link>
          </div>
        </div>
      </div>
  
      <!-- 가입 신청 -->
      <div v-if="team.status === 'OPEN' && !isLeader">
        <button class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                @click="confirmJoin(team.no)">
          가입 신청
        </button>
      </div>
  
      <!-- 팀 스케줄 -->
      <div v-if="isMember">
        <router-link :to="{ name: 'ScheduleList', params: { teamNo: team.no } }">
          <button class="category-button">팀 스케줄</button>
        </router-link>
      </div>
  
      <!-- 수정 삭제 -->
      <div v-if="isLeader" class="mt-4">
        <button class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500" @click="goToEditPage">수정</button>
        <button class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300" @click="confirmDelete(team.no)">삭제</button>
      </div>
    </div>
  </template>
  
  <script>
  import { useRoute, useRouter } from "vue-router";
  import { getUserInfo } from "@/utils/AuthUtil.js";
  import { ref } from "vue";
  import axios from "axios";
  import ProjectInfo from "@/components/project/ProjectInfo.vue";
  
  export default {
    name: "TeamDiteil",
    components: { ProjectInfo },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const teamNo = route.params.teamNo;
      const team = ref({});
      const project = ref({});
      const isLeader = ref(false);
      const isMember = ref(false);
      const leaderUsername = ref("");
  
      const token = getUserInfo().accessToken;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          teamNo: teamNo,
        },
      };
  
      // 팀 정보
      axios.get(`http://localhost:8087/team/${teamNo}`).then((res) => {
        team.value = {
          no: res.data.team.no,
          name: res.data.team.team.teamName,
          info: res.data.team.team.teamIntroduce,
          status: res.data.team.team.projectStatus,
        };
        project.value = res.data.project;
      });
  
      // 리더/멤버 여부
      axios.get(`http://localhost:8087/team/leader-role`, config).then((res) => {
        if (res.data.isLeader) {
          isLeader.value = true;
          isMember.value = true;
        } else if (res.data.isMember) {
          isMember.value = true;
        }
      });
  
      // 리더 username
      axios.get(`http://localhost:8087/team/${teamNo}/leader-username`, config).then((res) => {
        leaderUsername.value = res.data;
      });
  
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
  
      return { team, project, isLeader, isMember, leaderUsername, goToEditPage };
    },
    methods: {
      confirmDelete(teamNo) {
        if (confirm("정말로 삭제하시겠습니까?")) {
          this.deletePostData(teamNo);
        }
      },
      async deletePostData(teamNo) {
        const token = getUserInfo().accessToken;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        await axios.delete(`http://localhost:8087/team/${teamNo}`, config)
          .then(() => {
            alert("팀이 삭제되었습니다.");
            this.$router.push("/team");
          })
          .catch((err) => alert(err.response.data.message));
      },
      confirmJoin(teamNo) {
        if (confirm("해당 팀에 가입을 신청하시겠습니까?")) {
          this.teamJoinRequest(teamNo);
        }
      },
      async teamJoinRequest(teamNo) {
        const token = getUserInfo().accessToken;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        await axios.post(`http://localhost:8087/team/${teamNo}/join-request`, teamNo, config)
          .then(async () => {
            alert("가입 신청이 완료되었습니다!");
  
            const messageData = {
              receiverUsername: this.leaderUsername,
              content: `${this.team.no} 팀에 가입 신청했습니다. 검토 부탁드립니다.`,
            };
            await axios.post("http://localhost:8087/messages", messageData, config)
              .then(() => alert("쪽지가 자동으로 전송되었습니다!"))
              .catch(err => alert("쪽지 전송 실패: " + (err.response?.data?.message || err.message)));
          })
          .catch(err => alert(err.response.data.message));
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

.space-x-4>*+* {
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
.space-y-6>*+* {
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

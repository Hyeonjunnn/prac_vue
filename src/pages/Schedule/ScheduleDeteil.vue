<template>
    <div>
        <div class="max-w-7xl w-full mx-auto p-4 bg-white">
            <div class="flex items-center space-x-4 mb-6">
                <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar"
                    class="w-12 h-12 rounded-full" />
                <div>
                    <h3 class="font-semibold">{{ schedules.createdBy }}</h3>
                </div>
            </div>
            <div class="space-y-6">
                <h1 class="text-3xl font-bold text-black">{{ schedules.title }}</h1>

                <div class="prose max-w-none text-black">
                    <p class="text-gray-500 leading-relaxed">{{ schedules.description }}</p>
                </div>
            </div>

            <div>
                상태 {{ schedules.status }} <br />
                시작 {{ schedules.startDate }} <br />
                끝 {{ schedules.endDate }} <br />
            </div>

            <div>
                <br />
                <button
                    class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
                    @click="goToEditPage">
                    수정
                </button>
                <button
                    class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                    @click="confirmDelete(schedules.scheduleNo)">
                    삭제
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { getUserInfo } from '@/utils/AuthUtil.js';
import { ref } from 'vue';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const teamNo = route.params.teamNo;
const scheduleNo = route.params.scheduleNo;
const schedules = ref({});

const config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getUserInfo().accessToken,
  },
};

axios
  .get(`http://localhost:8087/schedules/${scheduleNo}`, config)
  .then((response) => {
    console.log(response.data);
    schedules.value = response.data;
  })
  .catch((error) => {
    alert(error.response.data.message);
    console.log(error);
  });

const goToEditPage = () => {
  router.push({
    name: 'ScheduleWrite',
    query: {
      scheduleNo: scheduleNo,
      title: schedules.value.title,
      startDate: schedules.value.startDate,
      endDate: schedules.value.endDate,
      description: schedules.value.description,
      status: schedules.value.status,
    },
  });
};

const confirmDelete = (scheduleNo) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    deletePostData(scheduleNo);
  }
};

const deletePostData = async (scheduleNo) => {
  const url = `http://localhost:8087/schedules/${scheduleNo}`;
  const token = getUserInfo().accessToken;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };
  try {
    await axios.delete(url, config);
    alert('스케줄이 삭제되었습니다.');
    router.push(`/schedule/team/${teamNo}`);
  } catch (error) {
    alert(error.response.data.message);
  }
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

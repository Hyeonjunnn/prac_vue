<template>
    <div>
        <div class="mt-8">
            <div class="mt-4">
                <div class="p-6 bg-white rounded-md shadow-md">
                    <h2 class="text-lg font-semibold text-gray-700 capitalize">
                        {{ isEditMode ? "스케줄 수정" : "스케줄 생성" }}
                    </h2>

                    <form @submit.prevent="submitPostData">
                        <div class="grid grid-cols-1 gap-6 mt-4">
                            <div>
                                <label class="text-gray-700" for="title">제목</label>
                                <input
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                                    type="text" v-model="title" />
                            </div>

                            <div>
                                <label class="text-gray-700" for="description">내용</label>
                                <textarea
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                                    v-model="description"></textarea>
                            </div>

                            <div class="form-group">
                                <label htmlFor="status" class="text-gray-700">상태</label>
                                <select id="status"
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                                    v-model="status">
                                    <option value="PENDING">시작전</option>
                                    <option value="IN_PROGRESS">진행중</option>
                                    <option value="COMPLETED">완료</option>
                                </select>
                            </div>

                            <div>
                                <label class="text-gray-700" for="startDate">시작시간</label>
                                <input
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                                    type="datetime-local" v-model="startDate" />
                            </div>

                            <div>
                                <label class="text-gray-700" for="endDate">마감시간</label>
                                <input
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                                    type="datetime-local" v-model="endDate" />
                            </div>
                        </div>


                        <div class="flex justify-end mt-4">
                            <button type="submit"
                                class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
                                {{ isEditMode ? "수정" : "저장" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import {getUserInfo} from "@/utils/AuthUtil.js";
import {ref, onMounted} from "vue";

export default {
    name: "ScheduleWrite",
    setup() {
        const route = useRoute(); // 현재 URL 정보 가져옴
        const router = useRouter(); // 경로 이동
        const scheduleNo = ref(route.query.scheduleNo || "");
        const title = ref(route.query.title || ""); // 현재 URL에 값이 존재한다면 삽입 아니면 공백
        const description = ref(route.query.description || "");
        const status = ref(route.query.status || "PENDING");
        const teamNo = route.params.teamNo;
        const isEditMode = ref(!!route.query.title); // 수정모드 확인용 (!!은 강제로 Boolean 타입변경)
        const startDate = ref("");
        const endDate = ref("");

        console.log(teamNo);

        onMounted(() => {
        if (isEditMode.value) {
            startDate.value = new Date(route.query.startDate).toISOString().slice(0, 16);
            endDate.value = new Date(route.query.endDate).toISOString().slice(0, 16);
        } else {
            // 생성 모드인 경우 오늘 날짜로 기본값 설정
            const today = new Date();
            startDate.value = today.toISOString().slice(0, 16);
            endDate.value = today.toISOString().slice(0, 16);
        }
        });
        // 작성/ 수정 한 값을 처리하는 메소드
        const submitPostData = () => {
            const params = {
                teamNo: teamNo,
                title: title.value,
                startDate: startDate.value + ":00.000Z",
                endDate: endDate.value + ":00.000Z",
                description: description.value,
                status: status.value,
            };
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + getUserInfo().accessToken,
                },
            };

            if (isEditMode.value) {
                axios
                    .put(`http://localhost:8087/schedules/${scheduleNo.value}`, params, config)
                    .then(() => {
                        alert("스케줄이 수정되었습니다.");
                        router.push(`/schedule/team/${teamNo}/deteil/${scheduleNo.value}`); // 수정 후 상세 페이지로 이동
                    })
                    .catch((error) => {
                        alert(error.response.data.message);
                    });
            } else {
                axios
                    .post("http://localhost:8087/schedules", params, config)
                    .then((response) => {
                        alert("스케줄이 생성되었습니다.");
                        router.push(`/schedule/team/${teamNo}/deteil/${response.data.scheduleNo}`); // 작성 후 상세 페이지로 이동
                    })
                    .catch((error) => {
                        alert(error.response.data.message);
                        console.log(error);
                    });
            }
        };

        return {
            title,
            description,
            status,
            isEditMode,
            teamNo,
            submitPostData,
            startDate,
            endDate,
        };
    },
};
</script>

<style scoped>
.mt-8 {
    margin-top: 2rem;
}

.mt-4 {
    margin-top: 1rem;
}

.p-6 {
    padding: 1.5rem;
}

.bg-white {
    background-color: #fff;
}

.rounded-md {
    border-radius: 0.375rem;
}

.shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.text-lg {
    font-size: 1.125rem;
}

.font-semibold {
    font-weight: 600;
}

.text-gray-700 {
    color: #374151;
}

.capitalize {
    text-transform: capitalize;
}

.grid {
    display: grid;
}

.grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
}

.gap-6 {
    gap: 1.5rem;
}

.w-full {
    width: 100%;
}

.border-gray-200 {
    border-color: #e5e7eb;
}

.focus\:border-indigo-600:focus {
    border-color: #4f46e5;
}

.focus\:ring:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-opacity-40:focus {
    --tw-ring-opacity: 0.4;
}

.focus\:ring-indigo-500:focus {
    --tw-ring-color: #6366f1;
}

.flex {
    display: flex;
}

.justify-end {
    justify-teamintroduce: flex-end;
}

.px-4,
.py-2 {
    padding: 0.5rem 1rem;
}

.text-gray-200 {
    color: #e5e7eb;
}

.bg-gray-800 {
    background-color: #1f2937;
}

.hover\:bg-gray-700:hover,
.focus\:bg-gray-700:focus {
    background-color: #374151;
}

.focus\:outline-none:focus {
    outline: none;
}

.form-group {
    margin-top: 0.5rem;
}
</style>

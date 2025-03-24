<template>
    <div>
        <div class="mt-8">
            <div class="mt-4">
                <div class="p-6 bg-white rounded-md shadow-md">
                    <h2 class="text-lg font-semibold text-gray-700 capitalize">
                        {{ isEditMode ? "프로젝트 수정" : "프로젝트 생성" }}
                    </h2>

                    <form @submit.prevent="submitForm">
                        <div class="grid grid-cols-1 gap-6 mt-4">
                            <div>
                                <label class="text-gray-700" for="name">제목</label>
                                <input
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                                    type="text" v-model="name" />
                            </div>

                            <div>
                                <label class="text-gray-700" for="content">내용</label>
                                <textarea
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                                    v-model="content"></textarea>
                            </div>

                            <div class="form-group">
                                <label htmlFor="projectStatus" class="text-gray-700">프로젝트 타입</label>
                                <select id="projectStatus"
                                    class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                                    v-model="projectStatus">
                                    <option value="OPEN">공개</option>
                                    <option value="CLOSED">닫힘</option>
                                    <option value="IN_PROGRESS">진행중</option>
                                    <option value="COMPLETE">완료</option>
                                </select>
                            </div>

                            <ProjectTechList :initialTechs="initialTechs" @selectedTechs="handleSelectedTechs" />
                            <p>선택된 기술 번호: {{ selectedTechs }}</p>
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
import {ref} from "vue";
import ProjectTechList from "@/components/project/ProjectTechList.vue";

export default {
    name: "ProjectWrite",
    components: {
        ProjectTechList,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const name = ref(route.query.name || "");
        const content = ref(route.query.content || "");
        const projectStatus = ref(route.query.projectStatus || "OPEN");
        const projectNo = ref(route.query.projectNo || null);
        const teamNo = ref(route.query.teamNo || null);
        const isEditMode = ref(!!route.query.name);
        const initialTechs = ref(route.query.techsNo) // 초기 기술 번호 목록
        const selectedTechs = ref([]); // 선택된 기술 목록

        console.log(initialTechs);

        const handleSelectedTechs = (techs) => {
            selectedTechs.value = techs.map(item => item.no);; // 기술 배열 갱신
        };

        const submitForm = () => {
            const params = {
                name: name.value,
                content: content.value,
                projectStatus: projectStatus.value,
                teamNo: teamNo.value,
                techsNo: selectedTechs.value, // 선택된 기술 목록 추가
            };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + getUserInfo().accessToken,
                },
            };

            const requestUrl = isEditMode.value ? `http://localhost:8087/project/${projectNo.value}?projectStatus=${projectStatus.value}` : "http://localhost:8087/project";

            axios
                .post(requestUrl, params, config)
                .then(() => {
                    alert(`프로젝트가 ${isEditMode.value ? "수정" : "작성"}되었습니다.`);
                    if (isEditMode.value) {
                        router.push(`/project/${projectNo.value}`);
                    } else {
                        router.push(`/team/${teamNo.value}`);
                    }
                })
                .catch((error) => {
                    alert(error.response.data.message);
                    console.log(error);
                    console.log(params);
                });
        };

        return {
            name,
            content,
            projectStatus,
            projectNo,
            isEditMode,
            selectedTechs,
            initialTechs,
            submitForm,
            handleSelectedTechs,
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
    justify-content: flex-end;
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

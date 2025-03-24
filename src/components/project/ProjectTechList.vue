<template>
    <div>
        <input type="text" v-model="searchQuery" placeholder="기술 검색" @keyup.enter="selectFirstTech"
            @input="filterTechs" />
        <ul v-if="filteredTechs.length > 0">
            <li v-for="tech in filteredTechs" :key="tech.no" @click="selectTech(tech)">
                {{ tech.techName }}
            </li>
        </ul>
        <div>
            <span v-for="tech in selectedTechs" :key="tech.no">
                {{ tech.techName }}
                <button @click="removeTech(tech)">X</button>
            </span>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import {getUserInfo} from "@/utils/AuthUtil.js";

export default {
    name: "ProjectTechList",

    props: {
        initialTechs: {
            type: Array,
            default: () => [],
        }
    },

    data() {
        return {
            techs: [],
            filteredTechs: [],
            searchQuery: "",
            selectedTechs: [],
        };
    },
    mounted() {


        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getUserInfo().accessToken,
            },
        };
        axios
            .get("http://localhost:8087/techs/get", config)
            .then((response) => {
                this.techs = response.data;
                // 초기 선택 상태 설정
                this.selectedTechs = this.techs.filter((tech) => this.initialTechs.includes(tech.techName));
            })
            .catch((error) => {
                alert(error.response.data.message); // 오류 메시지만 표시
                console.log(error);
                console.log(config);
            });
    },
    emits: ["selectedTechs"], // 이벤트 이름 변경
    watch: {
        selectedTechs: {
            handler(newVal, oldVal) {
                if (newVal.length > 0) {
                    this.$emit("selectedTechs", this.selectedTechs);
                }
            },
            deep: true,
        },
    },
    methods: {
        // 필터링
        filterTechs() {
            const filtered = this.techs.filter((tech) => tech.techName.toLowerCase().includes(this.searchQuery.toLowerCase()));
            this.filteredTechs = filtered.slice(0, 10); // 필터링 결과 10개 제한
        },
        // 선택한 기술
        selectTech(tech) {
            // 기술을 선택하면 배열에 넣음
            this.selectedTechs.push(tech);
            this.searchQuery = "";
            this.filteredTechs = [];
        },
        removeTech(tech) {
            // 선택한 값을 배열에서 지움
            this.selectedTechs = this.selectedTechs.filter((t) => t.no !== tech.no);
            this.$emit("selectedTechs", this.selectedTechs);
        },
        selectFirstTech() {
            if (this.filteredTechs.length > 0) {
                this.selectTech(this.filteredTechs[0]);
            }
        },
    },
};
</script>

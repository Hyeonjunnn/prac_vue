<template>
    <div class="container">
        <h2>전체 신고 목록</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>신고 번호</th>
                    <th>신고자</th>
                    <th>신고 대상</th>
                    <th>신고 유형</th>
                    <th>상태</th>
                    <th>등록일</th>
                    <th>상세</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="report in reports" :key="report.no">
                    <td>{{ report.no }}</td>
                    <td>{{ report.reporterId }}</td>
                    <td>{{ report.reportedId }}</td>
                    <td>{{ report.reportType }}</td>
                    <td>{{ report.status }}</td>
                    <td>{{ report.reportTime }}</td>
                    <td><button @click="viewReport(report.no)" class="btn btn-info">상세보기</button></td>
                </tr>
            </tbody>
        </table>

        <!-- 페이지네이션 버튼 -->
        <div class="pagination">
            <button @click="fetchReports(currentPage - 1)" :disabled="currentPage === 1">이전</button>
            <button @click="fetchReports(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "ReportList",
    data() {
        return {
            reports: [], // 신고 리스트
            totalReports: 0, // 총 신고 수
            currentPage: 1, // 현재 페이지
            perPage: 10, // 페이지당 항목 수
            totalPages: 1, // 전체 페이지 수
        };
    },
    methods: {
        // 신고 목록 가져오기
        async fetchReports(page = 1) {
    try {
        const token = getUserInfo().accessToken;
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.get("http://localhost:8087/reports-list", {
            params: {
                page: page - 1, // 페이지 번호는 0부터 시작
                size: this.perPage,
            },
            ...config
        });
        
        this.reports = response.data.content; // 페이지 내용
        this.totalReports = response.data.totalElements; // 총 신고 수
        this.totalPages = response.data.totalPages; // 전체 페이지 수
        this.currentPage = page; // 현재 페이지 업데이트 
    } catch (error) {
        console.error("신고 목록을 가져오는 데 실패했습니다.", error);
    }
},

// 신고 상세 보기
viewReport(reportNo) {
    this.$router.push(`/reports/${reportNo}`);
}
,
    },
    mounted() {
        this.fetchReports(); // 컴포넌트가 마운트되면 목록을 가져옴
    },
};
</script>

<style scoped>
.table {
    margin-top: 20px;
}

.pagination {
    text-align: center;
    margin-top: 20px;
}

.pagination button {
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
}

.pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
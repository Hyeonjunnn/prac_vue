<template>
    <div class="container">
        <h2>전체 신고 목록</h2>

        <!-- 검색 바 -->
        <div class="search-container">
            <input type="text" v-model="searchUserId" placeholder="유저 ID 입력">
            <button @click="searchReports" class="btn btn-primary">검색</button>
            <button @click="fetchReports(1, true)" class="btn btn-secondary">전체보기</button>
        </div>

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
                    <td>{{ getStatusText(report.reportStatus) }}</td>
                    <td>{{ report.reportTime }}</td>
                    <td><button @click="viewReport(report.no)" class="btn btn-info">상세보기</button></td>
                </tr>
            </tbody>
        </table>

        <!-- 페이지네이션 -->
        <div class="pagination">
            <button @click="fetchReports(currentPage - 1)" :disabled="currentPage === 1">〈</button>

            <button v-for="page in getPageRange()" :key="page" @click="fetchReports(page)"
                :class="{ active: currentPage === page }">
                {{ page }}
            </button>

            <button @click="fetchReports(currentPage + 1)" :disabled="currentPage === totalPages">〉</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { getUserInfo } from "../../utils/AuthUtil";

export default {
    name: "ReportList",
    data() {
        return {
            reports: [],
            totalReports: 0,
            currentPage: 1,
            perPage: 10,
            totalPages: 1,
            searchUserId: "", // 검색어 저장
            isSearching: false // 검색 중인지 여부
        };
    },
    methods: {
        // 신고 목록 가져오기
        async fetchReports(page = 1, reset = false) {
            try {
                const token = getUserInfo().accessToken;
                const config = {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json',
                    }
                };

                let url = "http://localhost:8087/reports-list";
                let params = {
                    page: page - 1,
                    size: this.perPage,
                };

                // 검색 상태가 아니거나 '전체보기'를 누르면 기본 URL로 변경
                if (this.isSearching && !reset) {
                    url = `http://localhost:8087/reports/user/${this.searchUserId}`;
                } else {
                    this.isSearching = false; // 전체 목록 조회 상태로 변경
                    this.searchUserId = ""; // 검색어 초기화
                }

                const response = await axios.get(url, { params, ...config });

                this.reports = response.data.content;
                this.totalReports = response.data.totalElements;
                this.totalPages = response.data.totalPages;
                this.currentPage = page;

                // 페이지 상태를 URL에 반영
                this.$router.push({ query: { page: this.currentPage } });

            } catch (error) {
                alert(error.response.data.message);
                if (error.response.status === 500) {
                    window.location.href = "http://localhost:3011";
                }
                return;
            }
        },

        // 유저 ID로 신고 검색
        searchReports() {
            if (!this.searchUserId) {
                alert("검색할 유저 ID를 입력하세요.");
                return;
            }
            this.isSearching = true;
            this.fetchReports(1);
        },

        getPageRange() {
            const range = [];
            const start = Math.floor((this.currentPage - 1) / 5) * 5 + 1;
            const end = Math.min(start + 4, this.totalPages);

            for (let i = start; i <= end; i++) {
                range.push(i);
            }
            return range;
        },

        // 신고 상태 변환
        getStatusText(status) {
            const statusMap = {
                'PENDING': '처리 중',
                'COMPLETED': '처리 완료',
                'ONLY_BANNED': '사용자 밴 (게시글 유지)',
                'BANNED': '사용자 밴 + 모든 작성한 글 삭제'
            };
            return statusMap[status] || status;
        },

        // 신고 상세 보기
        viewReport(reportNo) {
            this.$router.push(`/reports/${reportNo}`);
        }
    },
    mounted() {
        // URL에서 페이지 쿼리 파라미터를 읽어서 초기화
        const queryPage = parseInt(this.$route.query.page) || 1;
        this.currentPage = queryPage;
        this.fetchReports(this.currentPage);
    }
};
</script>

<style scoped>
.table {
    margin-top: 20px;
}

.search-container {
    margin-bottom: 15px;
}

.search-container input {
    padding: 8px;
    width: 200px;
    margin-right: 10px;
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

.pagination .active {
    font-weight: bold;
    color: white;
    background-color: #007bff;
}
</style>
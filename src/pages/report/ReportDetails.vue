<template>
    <div class="container">
      <h2>신고 상세</h2>
      <div v-if="report">
        <div class="report-info">
          <h3>신고 번호: {{ report.no }}</h3>
          <p><strong>신고자 ID:</strong> {{ report.reporterId }}</p>
          <p><strong>신고 대상 ID:</strong> {{ report.reportedId }}</p>
          <p><strong>신고 타입:</strong> {{ report.reportType }}</p>
          <!-- 신고 상태 셀렉트박스 -->
          <p><strong>신고 상태:</strong>
            <select v-model="reportStatus">
              <option v-for="status in reportStatuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </p>
          
          <!-- 신고 내용 -->
          <p><strong>신고 내용:</strong> {{ report.content }}</p>
          
          <!-- 관리자 메모 수정 -->
          <p><strong>관리자 메모:</strong>
            <textarea v-model="reportComment" placeholder="관리자 메모를 입력하세요"></textarea>
          </p>
  
          <!-- 신고 URL -->
          <p><strong>신고 URL:</strong> <a :href="report.url" target="_blank">{{ report.url }}</a></p>
          
          <!-- 날짜 표시 -->
          <p><strong>등록일:</strong> {{ formatDate(report.reportTime) }}</p>
          <p><strong>신고 처리일:</strong> 
            {{ report.commentTime ? formatDate(report.commentTime) : '처리 중' }}
          </p>
          
          <!-- 등록 버튼 -->
          <button @click="updateReport" class="update-button">수정 등록</button>
        </div>
      </div>
      <div v-else>
        <p>신고 상세 정보를 불러오는 중입니다...</p>
      </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getUserInfo } from '../../utils/AuthUtil'; // 토큰을 가져오는 유틸리티 함수

export default {
  setup() {
    const route = useRoute();
    const reportNo = route.params.reportNo; // 라우트에서 reportNo 가져오기
    const report = ref(null); // 반응형 변수 선언
    const reportStatuses = ['PENDING', 'COMPLETED', 'ONLY_BANNED', 'BANNED']; // ReportStatus Enum 값
    const reportStatus = ref('PENDING'); // 신고 상태
    const reportComment = ref(''); // 관리자 메모

    // 신고 상세 정보를 가져오는 함수
    const fetchReportDetail = async () => {
      if (!reportNo) {
        console.error("reportNo가 없습니다.");
        return;
      }

      try {
        const token = getUserInfo().accessToken; // 인증 토큰 가져오기
        const config = {
          headers: {
            'Authorization': 'Bearer ' + token, // 토큰을 헤더에 포함
          }
        };
        const response = await axios.get(`http://localhost:8087/reports/${reportNo}`, config);
        report.value = response.data; // 신고 상세 정보 저장
        reportStatus.value = report.value.reportStatus; // 상태 초기화
        reportComment.value = report.value.comment; // 메모 초기화
      } catch (error) {
        console.error("신고 상세 정보를 불러오는 데 실패했습니다.", error);
      }
    };

    // 신고 업데이트 (상태와 메모를 수정한 후)
    const updateReport = async () => {
      try {
        const token = getUserInfo().accessToken;
        const config = {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
          }
        };

        // ReportAdminResDto 형태로 요청 본문 생성
        const updateData = {
          comment: reportComment.value,
          status: reportStatus.value,
        };

        const response = await axios.put(`http://localhost:8087/reports/${reportNo}`, updateData, config);
        console.log("신고 수정 성공:", response.data);
        alert("수정된 신고 내용이 저장되었습니다.");
      } catch (error) {
        console.error("신고 수정 실패:", error);
        alert("수정하는 데 실패했습니다.");
      }
    };

    // 날짜 형식 변환 (초 단위까지)
    const formatDate = (date) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(date).toLocaleString('ko-KR', options);
    };

    onMounted(fetchReportDetail); // 컴포넌트가 마운트될 때 실행

    return { 
      report, 
      formatDate, 
      reportStatuses, 
      reportStatus, 
      reportComment, 
      updateReport 
    };
  }
};
</script>

<style scoped>
.report-info {
  margin-top: 20px;
}
.report-info p {
  font-size: 16px;
  margin: 5px 0;
}
textarea {
  width: 100%;
  height: 80px;
  margin: 10px 0;
  padding: 10px;
  font-size: 14px;
}
button.update-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
button.update-button:hover {
  background-color: #45a049;
}
</style>
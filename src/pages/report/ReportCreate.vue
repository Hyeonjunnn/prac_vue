<template>
    <div class="row">
      <div class="col p-3">
        <h2>신고하기</h2>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label for="reportedId">신고할 대상 ID :</label>
          <input type="text" class="form-control" id="reportedId" v-model="reportItem.reportedId" placeholder="ID를 입력해주세요" />
        </div>
        <div class="form-group">
          <label for="reportType">신고 유형 :</label>
          <select class="form-control" id="reportType" v-model="reportItem.reportType" placeholder="신고 유형을 선택해주세요">
            <option value="USER_REPORT">유저 신고</option>
            <option value="POST_REPORT">게시글 신고</option>
            <option value="MESSAGE_REPORT">쪽지 신고</option>
            <option value="OTHER">기타</option>
          </select>
        </div>
        <div class="form-group">
          <label for="content">신고 내용 :</label>
          <textarea class="form-control" rows="3" id="content" v-model="reportItem.content" placeholder="신고 내용을 입력해주세요"></textarea>
        </div>
        <div class="form-group">
          <label for="url">관련 URL :</label>
          <input type="text" class="form-control" id="url" v-model="reportItem.url" placeholder="URL을 입력해주세요" />
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-primary m-1" @click="sendReport">
            제출
          </button>
          <button type="button" class="btn btn-secondary m-1" @click="cancelReport">
            취소
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import { getUserInfo } from "@/utils/AuthUtil.js";
  
  export default {
    name: "ReportCreate",
    setup() {
      const router = useRouter();
      const reportItem = reactive({
        reportedId: "",
        reportType: "",
        content: "",
        url: "",
      });
  
      const sendReport = async () => {
        try {
          const userInfo = getUserInfo();
  
          const url = "http://localhost:8087/reports";
          const data = {
            reportedId: reportItem.reportedId,
            reportType: reportItem.reportType,
            content: reportItem.content,
            url: reportItem.url,
          };
          const token = userInfo.accessToken;
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          };
  
          const response = await axios.post(url, data, config);
  
          if (response.status === 200) {
            alert("신고가 성공적으로 접수되었습니다.");
            window.location.href = "http://localhost:3011/";
          } else {
            alert("신고 접수 실패");
          }
        } catch (error) {
          alert((error.response?.data?.message || error));
        //  alert 좋다
        }
      };
  
      const cancelReport = () => {
        router.push("/reports"); // 신고 목록 페이지로 이동
      };
  
      return {
        reportItem,
        sendReport,
        cancelReport,
      };
    },
  };
  </script>
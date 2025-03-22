<template>
  <div>
    <textarea v-model="commentContent" placeholder="댓글을 입력하세요"></textarea>
   <div class="comment-write-btnBox">
     <button @click="submitComment" class="comment-create-btn">댓글 등록</button>
   </div>
  </div>
</template>

<script>
import axios from "axios";
import { getUserInfo } from "@/utils/AuthUtil.js";

export default {
  name: "CommentCreate",
  props: {
    postNo: {
      type: Number,
      required: true
    }
  },
  data() {
    return { commentContent: "" };
  },
  methods: {
    async submitComment() {
      console.log(' postNo 값:', this.postNo);
      console.log(' 댓글 내용:', this.commentContent);

      if (!this.commentContent.trim()) {
        alert("댓글 내용을 입력하세요.");
        return;
      }

      try {
        const token = getUserInfo()?.accessToken;
        if (!token) {
          alert("로그인 상태를 확인해주세요.");
          return;
        }

        const response = await axios.post(
            `http://localhost:8087/posts/${this.postNo}/comments`,
            { postNo: this.postNo,
                   content: this.commentContent },
            { headers: { Authorization: `Bearer ${token}` } });

        console.log('응답 데이터:', response.data);

        this.$emit("commentAdded", response.data);

        this.commentContent = '';
        //alert("댓글이 작성되었습니다.");
        //this.$emit("commentAdded", response.data)
      } catch (error) {
        console.error('댓글 작성 실패:', error.response?.data || error.message);
        alert("댓글 작성 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
      }
    }
  }
};
</script>

<style scoped>
textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.comment-write-btnBox{
  display: flex;
  justify-content: flex-end;
}


.comment-create-btn{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
  width: 110px;
  height: 45px;
}
.comment-create-btn:hover {
  background-color: #45a049;
}
</style>
<template>
  <div class="mt-6 p-4 bg-gray-100 rounded-md">
    <h3 class="font-semibold text-lg mb-2">댓글 작성</h3>
    <textarea
        v-model="commentContent"
        placeholder="댓글을 입력하세요"
        class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows="3"
    ></textarea>
    <button
        @click="submitComment"
        class="mt-2 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
    >
      등록
    </button>
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
      required: true,
    },
  },
  data() {
    return {
      commentContent: "",
    };
  },
  methods: {
    async submitComment() {
      if (!this.commentContent.trim()) {
        alert("댓글 내용을 입력하세요.");
        return;
      }

      const token = getUserInfo().accessToken;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      try {
        await axios.post(
            `http://localhost:8087/posts/${this.postNo}/comments`,
            { content: this.commentContent },
            config
        );
        alert("댓글이 등록되었습니다.");
        this.commentContent = "";
        this.$emit("commentAdded"); // 댓글 추가 후 상위 컴포넌트에 알림
      } catch (error) {
        alert(error.response.data.message);
      }
    },
  },
};
</script>

<style scoped>
textarea {
  resize: none;
}
</style>

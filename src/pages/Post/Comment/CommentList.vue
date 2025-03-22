<template>
  <div>
    <div v-if="comments.length === 0">댓글이 없습니다.</div>
    <div v-else>
      <CommentItem
          v-for="comment in comments"
          :key="comment.commentNo"
          :comment="comment"
          @commentUpdated="fetchComments"
          @commentDeleted="handleCommentDeleted"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CommentItem from "@/pages/Post/Comment/CommentItem.vue";
import {ref} from "vue";

export default {
  name: "CommentList",
  components: { CommentItem },
  props: {
    postNo: {
      type: Number,  // 🚨 실무 기준: postNo는 항상 Number로 처리
      required: true
    }
  },
  data() {
    return {  comments: ref([]) };
  },
  mounted() {
    console.log('🔎 postNo 확인:', this.postNo);
    this.fetchComments();
  },
  methods: {
    async fetchComments() {
      try {
        const response = await axios.get(`http://localhost:8087/posts/${this.postNo}/comments`);
        console.log('✅ 댓글 데이터:', response.data);  // ✅ 응답 확인
        this.comments = Array.isArray(response.data) ? response.data : response.data.content;
      } catch (error) {
        console.error("❌ 댓글 불러오기 실패:", error);
      }
    },
    // 🔥 댓글 삭제 시 리스트에서 제거하고 상위 컴포넌트에 이벤트 전달
    handleCommentDeleted(deletedCommentNo) {
      this.comments = this.comments.filter(comment => comment.commentNo !== deletedCommentNo);
      this.$emit('commentDeleted'); // 🔥 상위 컴포넌트(PostDetail.vue)에 전달
    }
  }
};
</script>
<template>
  <div>
    <h3>댓글 목록</h3>
    <div v-if="comments.length">
      <CommentItem
          v-for="comment in comments"
          :key="comment.commentNo"
          :commentItem="comment"
          @commentDeleted="removeComment"
      />
    </div>
    <p v-else>등록된 댓글이 없습니다.</p>
  </div>
</template>

<script>
import axios from 'axios';
import CommentItem from './CommentItem.vue';

export default {
  name: 'CommentList',
  components: { CommentItem },
  data() {
    return {
      comments: []
    };
  },
  mounted() {
    this.fetchComments();
  },
  methods: {
    async fetchComments() {
      const postNo = this.$route.params.postNo;
      const url = `http://localhost:8087/posts/${postNo}/comments`;

      try {
        const response = await axios.get(url);
        this.comments = response.data;  // API 응답이 배열이라면 정상 작동
      } catch (error) {
        alert('댓글 목록 불러오기 실패');
      }
    },

    //서버 데이터 일관성 유지 위해 fetchComments() 호출 추가
    async removeComment(commentNo) {
      try {
        await axios.delete(`http://localhost:8087/comments/${commentNo}`);
        alert('댓글이 삭제되었습니다.');
        await this.fetchComments();  // 서버 데이터 새로고침으로 정합성 유지
      } catch (error) {
        alert('댓글 삭제 실패');
      }
    }
  }
};


</script>


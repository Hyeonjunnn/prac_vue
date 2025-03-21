<template>
  <div class="comment-item">
    <div class="comment-list-box">
      <div class="comment-info-box">
        <p>{{comment.userName}}</p>
        <p>{{comment.createdAt}}</p>
      </div>

      <p>{{ comment.content }}</p>
    </div>


    <!-- 수정 및 삭제 버튼 (작성자나 관리자만 보임) -->
    <div v-if="isEditable">
      <button @click="deleteComment">삭제</button>
      <button @click="toggleEdit">수정</button>
      <div v-if="editMode">
        <textarea v-model="editedContent"></textarea>
        <button @click="updateComment">수정 완료</button>
      </div>
    </div>

    <div class="like-bnt-box">
      <!-- 좋아요 버튼 -->
      <button @click="toggleLike" :class="{ liked: comment.liked }">
        좋아요 {{ comment.likeCount }}
      </button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { getUserInfo } from '@/utils/AuthUtil.js';


export default {
  name: "CommentItem",
  props: { comment: { type: Object, required: true } },
  data() {
    return {
      editMode: false,
      editedContent: '',
      currentUserNo: null // 사용자 id 저장
    };
  },
  watch: {
    comment: {
      handler(newVal) {
        this.editedContent = newVal.content;
        this.currentUserNo = Number(getUserInfo()?.userNo);
        // 🔥 댓글 데이터가 변경될 경우 사용자 정보 다시 확인
      },
      immediate: true
    }
  },
  computed: {
    isEditable() {
      return this.comment.userNo === this.currentUserNo;
    },
    isDeletable() {  // ✅ 삭제는 '작성자' + '관리자'만 가능하도록 수정
      const userInfo = getUserInfo();
      return this.comment.userNo === this.currentUserNo || userInfo?.role === 'ADMIN';
    }
  },
  mounted() {
    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.userNo) {
      console.warn("❗ 사용자 정보가 없습니다. 로그인 여부를 확인하세요.");
      return;
    }

    console.log('✅ 사용자 정보:', userInfo);
    this.currentUserNo = Number(userInfo.userNo);
  },

  methods: {
    async deleteComment() {
      if (!this.isDeletable) {
        alert("❌ 삭제 권한이 없습니다.");
        return;
      }

      if (confirm('정말로 삭제하시겠습니까?')) {
        try {
          await axios.delete(`http://localhost:8087/comments/${this.comment.commentNo}`, {
            headers: {
              Authorization: `Bearer ${getUserInfo().accessToken}`
            }
          });
          this.$emit('commentUpdated');
        } catch (error) {
          alert('❌ 댓글 삭제 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
        }
      }
    },
    toggleEdit() {
      this.editMode = !this.editMode;
    },
    async updateComment() {
      try {
        await axios.post(`http://localhost:8087/comments/${this.comment.commentNo}/update`, {
          content: this.editedContent
        }, {
          headers: {
            Authorization: `Bearer ${getUserInfo().accessToken}`
          }
        });
        this.editMode = false;
        this.$emit('commentUpdated');
      } catch (error) {
        alert('❌ 댓글 수정 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
      }
    },
    async toggleLike() {
      try {
        const response = await axios.post(`http://localhost:8087/comments/${this.comment.commentNo}/like`, {}, {
          headers: {
            Authorization: `Bearer ${getUserInfo().accessToken}`
          }
        });

        alert(response.data);
        this.$emit('commentUpdated');
      } catch (error) {
        alert('❌ 좋아요 처리 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
      }
    }
  }
};
</script>

<style scoped>
.comment-item {
  display: block;
  border: 1px solid #e5e7eb;
  padding: 1rem;

}

.comment-info-box{
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  margin-right: 20px;
}

.comment-info-box>p{
  margin-right: 20px;
}



.like-bnt-box{
  display: flex;
  justify-content: flex-end;
}

.liked {

  color: red;
  font-weight: bold;

}


</style>
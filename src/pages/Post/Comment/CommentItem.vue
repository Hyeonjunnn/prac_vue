<template>
  <div class="comment-item">
    <div class="comment-list-box">

      <div class="comment-info-box">
        <p>{{comment.userName}}</p>
        <!-- updatedAt이 존재하면 updatedAt 표시, 없으면 createdAt 표시 -->
        <p>{{ formatDate(comment.updatedAt || comment.createdAt) }}</p>
      </div>
      <!--  댓글 본문을 바로 수정할 수 있도록 추가 -->
      <div v-if="editMode">
        <textarea v-model="editedContent" class="edited-content-box"></textarea>
      </div>
      <p v-else>{{ comment.content }}</p>

    </div>


    <!-- 수정/취소 버튼 전환 로직 추가 -->
    <div v-if="isEditable || isDeletable">
      <div v-if="editMode">
        <button @click="updateComment">수정 완료</button>
        <button @click="cancelEdit">수정 취소</button>
      </div>
      <div v-else>
        <button v-if="isEditable" @click="toggleEdit">수정</button>
        <button v-if="isDeletable" @click="deleteComment">삭제</button>
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
import { getUsernameFromToken, getUserInfo } from "@/utils/AuthUtil.js";
import dayjs from 'dayjs';



export default {
  name: "CommentItem",
  props: { comment: { type: Object, required: true } },
  data() {
    return {
      editMode: false,
      editedContent: '',
      originalContent:'', // 원본 댓글 저장
      currentUsername: null
    };
  },
  watch: {
    comment: {
      handler(newVal) {
        this.editedContent = newVal.content;
        this.originalContent = newVal.content;  // 초기값 저장
       this.currentUsername = getUsernameFromToken();


      },
      immediate: true
    }
  },
  computed: {
    isEditable() {
      return this.comment.userName === this.currentUsername;
    },
    isDeletable() {
      const userInfo = getUserInfo();
      return this.comment.userName === this.currentUsername || userInfo?.role === 'ADMIN';
    }
  },
  mounted() {
    const userInfo = getUserInfo();
    console.log('🔎 getUserInfo()에서 반환한 사용자 정보:', userInfo);

    if (!userInfo) {
      console.warn("❗ 사용자 정보가 없습니다. 로그인 여부를 확인하세요.");
      return;
    }

    this.currentUsername = getUsernameFromToken();
    console.log('✅ this.currentUsername:', this.currentUsername);
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
          this.$emit('commentDeleted', this.comment.commentNo);
        } catch (error) {
          alert('❌ 댓글 삭제 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
        }
      }
    },
    toggleEdit() {
      this.editMode = true;           // 수정 모드 활성화
      this.editedContent = this.comment.content;  // 원본 내용 복사
    },
    cancelEdit() {  // 추가 (수정 취소 기능)
      this.editMode = false;          // 수정 모드 비활성화
      this.editedContent = this.originalContent; // 원래 내용 복원
    },

    async updateComment() {
      try {

        console.log('🟡 전달될 댓글 데이터:', {
          content: this.editedContent,
          postNo: this.comment.postNo
        });
        const response = await axios.post(`http://localhost:8087/comments/${this.comment.commentNo}/update`,
            {content: this.editedContent,
              postNo: this.comment.postNo
            },
            {
          headers: {
            Authorization: `Bearer ${getUserInfo().accessToken}`,
            'Content-Type': 'application/json' // JSON 명시
          }
        });

        // updatedAt 값을 화면에 반영
        if (response.data.updatedAt) {
          this.comment.updatedAt = response.data.updatedAt;
        }
        this.editMode = false;
        this.$emit('commentUpdated');
      } catch (error) {
        alert('❌ 댓글 수정 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
      }
    },
    async toggleLike() {
      try {
        const response = await axios.post(`http://localhost:8087/comments/${this.comment.commentNo}/like`, {

        }, {
          headers: {
            Authorization: `Bearer ${getUserInfo().accessToken}`
          }
        });

        alert(response.data);
        this.$emit('commentUpdated');
      } catch (error) {
        alert('❌ 좋아요 처리 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
      }
    },



    formatDate(dateString) {
      return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
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


.edited-content-box{
  border : 1px solid #e5e7eb;
  width: 700px;
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
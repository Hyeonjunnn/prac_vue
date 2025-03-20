<template>
  <li :class="'list-group-item'">
    <!-- 댓글 본문 -->
    <span
        :class="'pointer'"
        @click="toggleEditMode"
    >
            댓글 번호: {{ commentItem.commentNo }},<br>
            내용: {{ commentItem.content }},<br>
            작성자: {{ commentItem.writer }}<br>
        </span>

    <!-- 수정 모드 -->
    <div v-if="isEditing" class="edit-section">
            <textarea
                v-model="editedContent"
                class="form-control"
            ></textarea>
      <div class="edit-actions">
        <button
            class="btn btn-success btn-sm m-1"
            @click="updateComment"
        >
          수정 완료
        </button>
        <button
            class="btn btn-secondary btn-sm m-1"
            @click="cancelEditing"
        >
          취소
        </button>
      </div>
    </div>

    <!-- 편집 / 삭제 버튼 -->
    <span
        v-if="isWriter"
        class="float-end badge bg-secondary pointer m-1"
        @click="toggleEditMode"
    >
            편집
        </span>

    <span
        v-if="isWriter || isAdmin"
        class="float-end badge bg-danger pointer m-1"
        @click="deleteComment(commentItem.commentNo)"
    >
            삭제
        </span>
  </li>
</template>

<script>
import { useRouter } from 'vue-router';
import { inject, ref, computed } from 'vue';
import axios from 'axios';
import { getUserInfo } from '@/utils/AuthUtil.js';

export default {
  name: 'CommentItem',
  props: {
    commentItem: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const commentList = inject('commentList', []);
    const actions = inject('actions', {});
    const { deleteComment } = actions;

    const userInfo = getUserInfo();

    const editedContent = ref(props.commentItem.content);
    const isEditing = ref(false);

    // 권한 설정: 작성자만 수정 가능
    const isWriter = computed(() => props.commentItem.writer === userInfo.username);

    // 권한 설정: 작성자 + 관리자만 삭제 가능
    const isAdmin = computed(() => userInfo.role === 'ADMIN');

    //댓글 수정 기능
    const updateComment = async () => {
      try {
        const url = `http://localhost:8087/comments/${props.commentItem.commentNo}`;
        const data = { content: editedContent.value };
        const token = userInfo.accessToken;

        const response = await axios.put(url, data, {
          headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.data.status === 'success') {
          alert('댓글이 수정되었습니다.');
          props.commentItem.content = editedContent.value;
          isEditing.value = false; // 수정 모드 종료
        } else {
          alert('댓글 수정 실패');
        }
      } catch (error) {
        alert('댓글 수정 실패: ' + error);
      }
    };

    // 댓글 삭제 기능
    // const deleteComment = async (commentNo) => {
    //   if (!confirm('정말로 댓글을 삭제하시겠습니까?')) return;

    //   try {
    //     const response = await axios.delete(`http://localhost:8087/comments/${commentNo}`);
    //     if (response.data.status === 'success') {
    //       const index = commentList.findIndex(comment => comment.commentNo === commentNo);
    //       commentList.splice(index, 1);
    //     } else {
    //       alert('댓글 삭제 실패 : ' + response.data.message);
    //     }
    //   } catch (error) {
    //     alert('에러 발생 : ' + error);
    //   }
    // };

    const toggleEditMode = () => {
      isEditing.value = !isEditing.value;
    };

    const cancelEditing = () => {
      isEditing.value = false;
      editedContent.value = props.commentItem.content; // 원본 복구
    };

    return {
      router,
      commentList,
      deleteComment,
      editedContent,
      isEditing,
      updateComment,
      toggleEditMode,
      cancelEditing,
      isWriter,
      isAdmin
    };
  }
};
</script>

<style scoped>
.comment-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
}

.edit-section {
  margin-top: 10px;
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 5px;
}
</style>

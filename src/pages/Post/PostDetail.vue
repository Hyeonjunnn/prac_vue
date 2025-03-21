<template>
  <div>
    <div class="max-w-7xl w-full mx-auto p-4 bg-white">
      <!-- Author Section -->
      <div class="flex items-center space-x-4 mb-6">
        <img src="https://cdn.startupful.io/img/app_logo/no_img.png" alt="Author Avatar" class="w-12 h-12 rounded-full" />
        <div>
          <h3 class="font-semibold">{{ post.userName }}</h3>
          <p class="text-gray-500 text-sm">
            {{ new Date(post.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="space-y-6">
        <!-- 제목 -->
        <h1 class="text-3xl font-bold text-black">
          {{ post.title }}
        </h1>

        <!-- 내용 -->
        <div class="prose max-w-none text-black">
          <p class="text-gray-500 leading-relaxed">
            {{ post.content }}
          </p>
        </div>
      </div>

      <!-- 수정 삭제 -->
      <div>
        <br />
        <button class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none" @click="goToEditPage">수정</button>
        <button class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none" @click="confirmDelete(post.postNo)">삭제</button>
      </div>
      <!-- 댓글 부분 -->
      <div  v-if="post.boardType === 'FREE'">
        <br />
        <span>댓글 {{ post.commentCount }} 개</span>
        <br />

        <CommentCreate
            v-if="post.postNo"
            :postNo="Number(post.postNo)"
            @commentAdded="handleCommentAdded"
        />

        <CommentList
            v-if="post.postNo"
            ref="commentList"
            :postNo="Number(post.postNo)"
        />

      </div>
    </div>
  </div>
</template>
<script>
import CommentCreate from "@/pages/Post/Comment/CommentCreate.vue";
import CommentList from "@/pages/Post/Comment/CommentList.vue";
import {useRoute, useRouter} from "vue-router";
import {getUserInfo} from "@/utils/AuthUtil.js";
import {onMounted, ref} from "vue";
import axios from "axios";
import commentList from "@/pages/Post/Comment/CommentList.vue";
export default {
  name: "PostDetail",
  components: { CommentCreate, CommentList }, // 컴포넌트 등록
  setup() {
    // 초기 데이터 설정
    const route = useRoute(); // 현재 URL 정보 가져옴
    const router = useRouter(); // 경로 이동 (라우트를 이동하거나 상태 변경할때 사용)
    const postNo = Number(route.params.postNo); // 경로에 포함된 번호를 가져옴
    const post = ref({}); // 반응형 데이터 선언
    const commentList = ref(null);

    const handleCommentAdded = (newComment) => {
      console.log('✅ 새 댓글 추가:', newComment);
      post.value.commentCount += 1;  // 🔥 댓글 수 즉시 증가

      // 🔥 commentList.value가 null인 경우 방어 처리
      if (commentList.value) {
        commentList.value.comments.unshift(newComment);  // 🔥 신규 댓글 즉시 추가
      } else {
        console.warn('❗ commentList가 null입니다.');
      }
    };

    const initParams = {
      page: 1,
      size: 10,
    };

    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8087/posts/${postNo}/with-comments`, initParams);
        post.value = response.data;
      } catch (error) {
        console.error('❌ 게시글 불러오기 실패:', error);
      }
    };

    //상세 정보 가져와서 post에 넣음
    axios.get(`http://localhost:8087/posts/${postNo}/with-comments`, initParams).then((response) => {
      post.value = response.data;
    });

    // 게시글 수정용 데이터
    const goToEditPage = () => {
      router.push({
        name: "PostWrite",
        query: {
          postNo: post.value.postNo,
          title: post.value.title,
          content: post.value.content,
          boardType: post.value.boardType,
        },
      });
    };

    onMounted(() => {
      fetchPostDetail();
      console.log('🔎 commentList 상태 확인:', commentList.value);
    });

    // 메소드 반환
    return {
      post,
      goToEditPage,
      fetchPostDetail,
       commentList,
      handleCommentAdded
    };
  },
  methods: {
    // 삭제 확인 창
    confirmDelete(postNo) {
      if (confirm("정말로 삭제하시겠습니까?")) {
        // 삭제 처리 로직 호출
        this.deletePostData(postNo);
      }
    },
    // 게시글 삭제
    async deletePostData(postNo) {
      const url = `http://localhost:8087/posts/${postNo}`;
      const token = getUserInfo().accessToken;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      try {
        const response = await axios.delete(url, config);
        alert("삭제 됐습니다.");
        // 게시글을 삭제한 후 기존 페이지로 돌려보냄
        this.$router.push("/post");
      } catch (error) {
        alert(error.response.data.message);
      }
    },
  },
};
</script>

<style scoped>
/* Author Section */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.w-12,
.h-12 {
  width: 3rem;
  height: 3rem;
}

.rounded-full {
  border-radius: 9999px;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-500 {
  color: #6b7280;
}

.text-sm {
  font-size: 0.875rem;
}

/* Main Content */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.font-bold {
  font-weight: 700;
}

.text-black {
  color: #000;
}

.prose p {
  color: #6b7280;
  line-height: 1.625;
}

.max-w-none {
  max-width: none;
}

/* 수정 삭제 버튼 */
.mt-4 {
  margin-top: 1rem;
}

.px-3,
.py-1 {
  padding: 0.25rem 0.75rem;
}

.text-white {
  color: #fff;
}

.bg-indigo-600 {
  background-color: #4f46e5;
}

.rounded-md {
  border-radius: 0.375rem;
}

.hover\:bg-indigo-500:hover {
  background-color: #4338ca;
}

.focus\:outline-none:focus {
  outline: none;
}

.text-gray-700 {
  color: #374151;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.hover\:bg-gray-300:hover {
  background-color: #d1d5db;
}

/* 댓글 부분 */
.comment-section {
  margin-top: 1rem;
}

.comment-count {
  font-weight: 600;
}
</style>

<template>
    <li :class="postItem.done ? 'list-group-item list-group-item-success' : 'list-group-item'">
        <span :class="postItem.done ? 'todo-done pointer' : 'pointer'" 
        @click="router.push(`/posts/${postItem.postNo}`, {postNo: postItem.postNo})">
        게시글 번호: {{ postItem.postNo }},<br>
        제목: {{ postItem.title }},<br>
        내용: {{ postItem.content }},<br>
        작성자: {{ postItem.userName }}<br>
        </span>
        <span class="float-end badge bg-secondary pointer m-1" 
        @click="router.push(`/posts/${postItem.postNo}`)">
        편집</span>
        <span class="float-end badge bg-secondary pointer m-1" 
        @click="deletePost(postItem.postNo)">
        삭제</span>
    </li>
</template>

<script>
import { useRouter } from 'vue-router';
import { inject } from 'vue';
import axios from 'axios';

export default {
    name: 'PostItem',
    props: {
        postItem: {
            type: Object,
            required: true
        }
    },
    setup() {
        const router = useRouter();
        const postList = inject('postList', []);
        const actions = inject('actions', {});
        const { deletePost } = actions;
        return { router, postList, deletePost };
    },
    methods: {
        async deletePost(postNo) {
            try {
                const response = await axios.delete(`http://localhost:8087/posts/${postNo}`);
                if (response.data.status === "success") {
                    let index = this.postList.findIndex((post) => post.postNo === postNo);
                    this.postList.splice(index, 1);
                } else {
                    alert('Post 삭제 실패 : ' + response.data.message);
                }
            } catch(error) {
                alert('에러발생 :' + error);
            }
        }
    }
}
</script>

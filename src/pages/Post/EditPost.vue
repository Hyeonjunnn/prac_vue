<template>
    <div class="row">
        <div class="col p-3">
            <h2>게시글 수정</h2>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="form-group">
                <label htmlFor="title">게시글 제목:</label>
                <input type="text" class="form-control" id="title" v-model="postItem.title" />
            </div>
            <div class="form-group">
                <label htmlFor="content">게시글 설명 :</label>
                <textarea class="form-control" rows="3" id="content" v-model="postItem.content"></textarea>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-primary m-1" @click="updatePostHandler">
                수 정
                </button>
                <button type="button" class="btn btn-primary m-1" @click="router.push('/posts')">
                취 소
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, inject, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { getUserInfo, refreshToken } from '@/utils/AuthUtil.js';

export default {
    name: 'EditPost',
    data() {
        return {
            postItem: {
                no: 0,
                title: "",
                content: ""
            }
        }
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    mounted() {
        this.fetchPostOne();
    },
    methods: {
        async fetchPostOne() {
            const route = useRoute();
            const postNo = ref(route.params.postNo).value;
            console.log(postNo);
            const url = `http://localhost:8087/posts/${postNo}/with-comments`;
            const response = await axios.get(url);
            this.postItem = response.data;
        },
        async updatePost() {
            const url = `http://localhost:8087/posts/${postNo}`;
            const data = {
                title: this.postItem.title,
                content: this.postItem.content
            };
            const token = getUserInfo().accessToken;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            };

            const response = await axios.put(url, data, config);

            if (response.status === 200) {
                alert('게시글이 수정되었습니다');
                this.router.push('/posts');
            } else {
                alert('게시글 수정 실패');
            }
        }
    }
}
</script>
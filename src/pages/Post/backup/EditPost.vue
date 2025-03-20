<template>
    <div class="row">
        <div class="col p-3">
            <h2>게시글 수정</h2>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="form-group">
                <label htmlFor="title">게시글 번호:</label>
                <input type="text" class="form-control" id="title" v-model="postItem.postNo" readonly/>
            </div>
            <div class="form-group">
                <label htmlFor="title">게시글 제목:</label>
                <input type="text" class="form-control" id="title" v-model="postItem.title" />
            </div>
            <div class="form-group">
                <label htmlFor="content">게시글 설명 :</label>
                <textarea class="form-control" rows="3" id="content" v-model="postItem.content"></textarea>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-primary m-1" @click="updatePost">
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
import { title } from '@tailus/themer';

export default {
    name: 'EditPost',
    props: {
        postItem: {
            postNo: Number,
            title: String,
            content: String
        }
    },
    data() {
        const route = useRoute();
        const postNo = ref(route.params.postNo).value;

        return {
            postItem: {
                postNo: postNo,
                title: '',
                content:''
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
            const url = `http://localhost:8087/posts/${postNo}/with-comments`;
            const response = await axios.get(url);
            this.postItem = response.data;
        },
        async updatePost() {
            // const route = useRoute();
            const postNo = this.postItem.postNo

            const url = `http://localhost:8087/posts/${postNo}?postStatus=ACTIVE`;
            const data = {
                title: this.postItem.title,
                content: this.postItem.content,
                boardType: 'FREE',
                postStatus: 'ACTIVE'
            };
            const token = getUserInfo().accessToken;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            };

            const response = await axios.post(url, data, config);

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
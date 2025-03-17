<template>
    <div class="row">
        <div class="col p-3">
            <h2>게시글 추가</h2>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="form-group">
                <label htmlFor="title">게시글 제목 :</label>
                <input type="text" class="form-control" id="title" v-model="postItem.title" />
            </div>
            <div class="form-group">
                <label htmlFor="boardType">게시글 타입 :</label>
                <select id="boardType" class="form-control" v-model="postItem.boardType">
                    <option value="FREE">자유게시판</option>
                    <option value="NOTICE">공지사항</option>
                    <option value="PROJECT_RECRUIT">프로젝트 구인</option>
                </select>
            </div>
            <div class="form-group">
                <label htmlFor="postStatus">게시글 상태 :</label>
                <select id="postStatus" class="form-control" v-model="postItem.postStatus">
                    <option value="ACTIVE">활성</option>
                    <option value="INACTIVE">비활성</option>
                </select>
            </div>
            <div class="form-group">
                <label htmlFor="content">게시글 설명 :</label>
                <textarea class="form-control" rows="3" id="content" v-model="postItem.content"></textarea>
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-primary m-1" @click="addPost()">
                추 가
            </button>
                <button type="button" class="btn btn-primary m-1" @click="router.push('/posts')">
                취 소
            </button>
            </div>
        </div>
    </div>
</template>

<script>
import { inject, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getUserInfo } from '@/utils/AuthUtil.js';

export default {
    name: 'addPost',
    data() {
        return {
            postItem: {
                title:"",
                content:"",
                boardType:"FREE",
                postStatus:"ACTIVE"
            }
        }
    },
    setup() {
        const router = useRouter();
        const postItem = inject('postItem', []);
        const actions = inject('actions');
        return { router, postItem };
    },
    mounted() {
    },
    methods: {
        async addPost() {
            try {
                const url = 'http://localhost:8087/posts';
                const data = {
                    title: this.postItem.title,
                    content: this.postItem.content,
                    boardType: this.postItem.boardType,
                    postStatus: this.postItem.postStatus
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
                    alert('게시글이 추가되었습니다');
                } else {
                    alert('게시글 추가 실패');
                }
            } catch(error) {
                alert('추가 에러발생 :' + error);
            }
        }
    }
}
</script>
<template>
    <div class="row">
        <div class="col p-3">
            <router-link class="btn btn-primary" to="/posts/add"> 게시글 추가 </router-link>
            <button class="btn btn-primary ms-1" @click="fetchPostList">새로 고침</button>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <ul class="list-group">
                <PostItem v-for="postItem in postList" :key="postItem.no" v-bind:postItem="postItem" />
            </ul>
        </div>
    </div>
</template>

<script>
import {inject, provide, computed} from "vue";
import axios from "axios";
import PostItem from "@/pages/Post/PostItem.vue";

export default {
    name: "PostList",
    components: {
        PostItem,
    },
    data() {
        return {
            postList: [],
        };
    },
    setup() {
        const postList = inject("postList", []);
        provide(
            "postList",
            computed(() => postList)
        );
    },
    mounted() {
        this.fetchPostList();
    },
    methods: {
        async fetchPostList() {
            try {
                const response = await axios.get("http://localhost:8087/posts?boardType=FREE");
                if (response.status === 200) {
                    this.postList = response.data.content;
                } else {
                    alert("데이터 조회 실패");
                }
            } catch (error) {
                alert("에러발생 :" + error);
            }
        },
    },
};
</script>

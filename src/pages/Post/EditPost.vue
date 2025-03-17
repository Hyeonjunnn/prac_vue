<template>
    <div class="row">
        <div class="col p-3">
            <h2>게시글 수정</h2>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="form-group">
                <label htmlFor="postTitle">제목:</label>
                <input type="text" class="form-control" id="postTitle" v-model="postItem.title" />
            </div>
            <div class="form-group">
                <label htmlFor="postContent">설명:</label>
                <textarea class="form-control" rows="3" id="postContent" v-model="postItem.content"></textarea>
            </div>
            <div class="form-group">
                <label htmlFor="done">완료여부 : </label>&nbsp;
                <input type="checkbox" v-model="postItem.done" />
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

<script setup>
import { inject, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const currentRoute = useRoute();

const postList = inject('postList', []);
const actions = inject('actions', {});
const { updatePost } = actions;

const matchedPostItem = postList.value.find((postItem)=> postItem.postNo === parseInt(currentRoute.params.id))
if (!matchedPostItem)  { 
    router.push('/posts'); 
}
const postItem =  reactive({ ...matchedPostItem })

const updatePostHandler = () => {
    let { postTitle } = postItem;
    if (!postTitle || postTitle.trim()==="") {
        alert('제목은 반드시 입력해야 합니다');
        return;
    }
    updatePost({ ...postItem }, ()=>{
        router.push('/posts');
    });
}
</script>

<style scoped>

</style>
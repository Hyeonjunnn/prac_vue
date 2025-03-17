<template>
    <div class="card card-body">
        <h2>Home</h2>
        <p>인증되지 않아도 접근 가능한 페이지</p>
        <div v-if="data.userInfo.authenticated">
            <p>토큰 : {{ data.userInfo.accessToken }}</p>
            <p>사용자 : {{ data.userInfo.userName }}</p>
            <p>사용자의 역할 : {{ data.userInfo.role }}</p>
            <button @click="logout">로그아웃</button>
        </div>
    </div>
</template>


<script>
import { getUserInfo, logoutProcess } from '@/utils/AuthUtil.js';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

export default {
    name: 'Home',
    setup() {
        const router = useRouter();
        const data = reactive({
            userInfo: getUserInfo()
        });

        const logout = () => {
            logoutProcess(() => {
                data.userInfo = {};
                router.push('/');
            });
        }
        return { data, logout };
    },
    methods: {
    }
}
</script>
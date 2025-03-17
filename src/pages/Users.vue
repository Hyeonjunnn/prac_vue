<template>
    <div>
        <h2>Users</h2>
        <p>users 역할이 있어야만 접근할 수 있는 페이지</p>
        <p>토큰 : {{ userInfo.accessToken }}</p>
        <!-- <p>사용자 : {{ data.userInfo.username }}</p> -->
        <!-- <p>사용자의 역할 : {{ data.userInfo.role }}</p> -->
        <button @click="logout">로그아웃</button>
    </div>
</template>

<script>
import { getUserInfo, logoutProcess } from '@/utils/AuthUtil.js';
import { useRouter } from 'vue-router';

export default {
    name : 'Users',
    setup() {
        const router = useRouter();
        const userInfo = getUserInfo();
        const logout = () => {
            logoutProcess(() => {
                router.push('/');
            });
        }
        return { userInfo, logout };
    }
}
</script>
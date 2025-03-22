<template>
    <div>
        <h2>Admins</h2>
        <p>admins 역할이 있어야만 접근할 수 있는 페이지</p>
        <p>토큰 : {{ userInfo.accessToken }}</p>
         <p>사용자 : {{ userInfo.userName }}</p>
         <p>사용자의 역할 : {{ userInfo.role }}</p>
        <button @click="logout">로그아웃</button>
    </div>

    <RouterLink to="/admin/users">
      <button>유저 목록 보기</button>
    </RouterLink>

</template>

<script>
import { getUserInfo, logoutProcess } from '@/utils/AuthUtil.js';
import { useRouter } from 'vue-router';
import UserList from "@/pages/Admin/UserList.vue";

export default {
    name : 'Admins',
    components: {
      UserList : UserList
    },
    setup() {
        const router = useRouter();
        const userInfo = getUserInfo();
        const logout = () => {
            logoutProcess(() => {
                router.push('/');
            });
        };
        const goToUserList = () => {
          router.push('/admin/users');
        };
        return { userInfo, logout , goToUserList};
    }
}
</script>

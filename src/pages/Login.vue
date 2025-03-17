<template>
    <div>
        <h2>로그인</h2>
        사용자: <input type="text" v-model="info.username" />
        비밀번호: <input type="password" v-model="info.password" />
        <br>
        <button @click="login">로그인</button>
    </div>
</template>

<script>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loginProcess } from '@/utils/AuthUtil.js';

export default {
    name : "Login",
    setup() {
        const router = useRouter();
        const currentRoute = useRoute();
        const fromname = currentRoute.query.fromname;

        const info = reactive({
            username: '',
            password: ''
        });

        const successCallback = () => {
            if (fromname) router.push({ path: fromname });
            else router.push('/');
        }

        const failCallback = () => {
            alert('로그인 실패');
        }

        const login = () => {
            loginProcess(info.username, info.password, successCallback, failCallback);
        }

        return { info, login };
    }
}
</script>
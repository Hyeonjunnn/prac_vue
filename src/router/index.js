import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Users from '@/pages/Users.vue';
import Admins from '@/pages/Admins.vue';
import Login from '@/pages/Login.vue';
import About from '@/pages/About.vue';
import PostList from '@/pages/Post/PostList.vue';
import AddPost from '@/pages/Post/AddPost.vue';
import EditPost from '@/pages/Post/EditPost.vue';
import NotFound from '@/pages/NotFound.vue';
import { isMatchToRole } from '@/utils/AuthUtil.js';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/login', component: Login },
        { path: '/users', component: Users },
        { path: '/admins', component: Admins },
        { path: '/about', component: About },
        { path: '/posts', component: PostList },
        { path: '/posts/add', component: AddPost },
        { path: '/posts/:id', component: EditPost },
        { path: '/:paths(.*)*', component: NotFound },
    ]
})

// router.beforeEach((to) => {
//     if (!isMatchToRole(to.path)) {
//         return { name: 'login', query: { fromname: to.name } };
//     }
// })

export default router;
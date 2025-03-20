<template>
    <div class="message-details">
        <h1>쪽지 내용</h1>
        <div v-if="message" class="message-content">
            <p><strong>보낸 사람:</strong> {{ message.senderId }}</p>
            <p><strong>받는 사람:</strong> {{ message.receiverId }}</p>
            <p><strong>보낸 시간:</strong> {{ message.sendAt }}</p>
            <p><strong>내용:</strong> {{ message.content }}</p>

            <!-- <div>
                <span class="status">{{ message.read ? "읽음" : "읽지 않음" }}</span>
            </div> -->

            <div class="actions">
                <button @click="deleteMessage">삭제</button>
            </div>
        </div>
        <div v-else>
            <p>쪽지를 불러오는 중...</p>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { getUserInfo } from '../../utils/AuthUtil';

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const messageNo = route.params.messageNo; // 라우트에서 messageNo 가져오기
        const message = ref(null); // 반응형 변수 선언

        const fetchMessageDetails = async () => {
            if (!messageNo) {
                console.error("messageNo가 없습니다.");
                return;
            }

            try {
                const token = getUserInfo().accessToken;
                console.log(token);
                const config = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
                const response = await axios.get(`http://localhost:8087/messages/${messageNo}`, config);
                message.value = response.data;

            } catch (error) {
                console.error("쪽지 조회 실패:", error);
            }
        };

        const deleteMessage = async () => {
            try {
                const token = getUserInfo().accessToken;
                const config = {
                    headers: { 'Authorization': 'Bearer ' + token }
                };
                await axios.delete(`http://localhost:8087/messages/${messageNo}`, config);
                router.push('/messages/list');
            } catch (error) {
                console.error("쪽지 삭제 실패:", error);
            }
        };

        onMounted(fetchMessageDetails); // 컴포넌트가 마운트될 때 실행

        return { message, deleteMessage };
    }
};
</script>

<style scoped>
.message-details {
    padding: 20px;
}

.message-content {
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
}

.status {
    font-weight: bold;
    color: green;
}

.actions {
    margin-top: 20px;
}

button {
    background-color: red;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
}

button:hover {
    background-color: darkred;
}
</style>
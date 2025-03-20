<template>
    <div class="message-list">
        <h2>쪽지 목록</h2>
        <div>
            <!-- 쪽지 타입 선택 -->
            <button @click="loadMessages('received')" :class="{ active: currentTab === 'received' }">
                받은 쪽지 <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
            </button>
            <button @click="loadMessages('sent')" :class="{ active: currentTab === 'sent' }">보낸 쪽지</button>
            <router-link to="/messages/write">
                <button>쪽지 보내기</button>
            </router-link>
        </div>

        <div v-if="messages.length === 0">쪽지가 없습니다.</div>
        <div v-else>
            <div v-for="(message, index) in messages" :key="index" class="message-item">
                <div class="message-header">
                    <span class="sender">보낸 사람: {{ message.senderId }}</span>
                    <span class="receiver">받은 사람: {{ message.receiverId }}</span>
                    <span class="date">받은 날짜: {{ formatDate(message.sendAt) }}</span>
                </div>
                <div class="message-content">
                    <!-- 메시지 내용 클릭 시 상세 페이지로 이동 -->
                    <router-link :to="`/messages/${message.no}`">
                        <p :class="currentTab === 'sent' ? 'read' : (message.read ? 'read' : 'unread')">
                            {{ message.content }}
                        </p>
                    </router-link>
                </div>

                <div class="message-actions">
                    <button class="btn btn-danger" @click="deleteMessage(message.no)">삭제</button>
                </div>
            </div>

            <!-- 페이지네이션 -->
            <div class="pagination">
                <button @click="loadMessages(currentTab, currentPage - 1)" :disabled="currentPage === 1">〈</button>
                <button v-for="page in getPageRange()" :key="page" @click="loadMessages(currentTab, page)"
                    :class="{ active: currentPage === page }">
                    {{ page }}
                </button>
                <button @click="loadMessages(currentTab, currentPage + 1)"
                    :disabled="currentPage === totalPages">〉</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { getUserInfo } from '@/utils/AuthUtil.js';

export default {
    name: 'MessageList',
    data() {
        return {
            messages: [],  // 메시지 목록
            currentPage: 1,  // 현재 페이지
            totalPages: 1,  // 전체 페이지 수
            currentTab: 'received',  // 기본적으로 받은 쪽지 목록
            unreadCount: 0,  // 안 읽은 쪽지 개수
            perPage: 10,  // 한 페이지당 표시할 메시지 수
        };
    },
    mounted() {
        // URL에서 쿼리 파라미터로 페이지 번호를 읽어옵니다.
        const page = this.$route.query.page || 1;  // 기본값 1로 설정
        const type = this.$route.query.type || 'received';  // 기본값 'received'로 설정
        this.currentPage = parseInt(page, 10);
        this.currentTab = type;

        // 로드한 페이지 번호에 맞춰 메시지 목록을 불러옵니다.
        this.loadMessages(this.currentTab, this.currentPage);
        this.getUnreadMessages();  // 안 읽은 쪽지 개수 불러오기
    },
    methods: {
        async loadMessages(type, page) {
            try {
                const token = getUserInfo().accessToken;
                const userNo = getUserInfo().userNo;  // 사용자 ID (No)
                // 쿼리 파라미터 순서를 type=received&page=1로 수정
                const url = `http://localhost:8087/messages/list/${type}?type=${type}&page=${page - 1}&size=${this.perPage}&sort=no,desc`;
                const config = {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                };

                const response = await axios.get(url, config);
                if (response.status === 200) {
                    this.messages = response.data.content;  // 메시지 목록
                    this.currentPage = response.data.pageable.pageNumber + 1;  // 현재 페이지 번호
                    this.totalPages = response.data.totalPages;  // 전체 페이지 수
                    this.currentTab = type;  // 탭 상태 업데이트

                    // 페이지 번호와 타입을 쿼리 파라미터에 반영
                    this.$router.push({ query: { type: this.currentTab, page: this.currentPage } });
                }
            } catch (error) {
                console.error('메시지 목록 불러오기 실패:', error);
                alert('메시지 목록을 불러오는 데 실패했습니다.');
            }
        },
        async deleteMessage(messageNo) {
            try {
                const token = getUserInfo().accessToken;
                const url = `http://localhost:8087/messages/${messageNo}`;  // PathVariable로 messageNo 전달
                const config = {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    },
                };

                const response = await axios.delete(url, config);
                if (response.status === 200) {
                    alert('메시지가 삭제되었습니다.');
                    this.loadMessages(this.currentTab, this.currentPage);  // 삭제 후 페이지 새로고침
                }
            } catch (error) {
                console.error('메시지 삭제 실패:', error);
                alert('메시지 삭제 실패');
            }
        },
        async getUnreadMessages() {
            try {
                const token = getUserInfo().accessToken;
                const url = `http://localhost:8087/messages-unread`;
                const config = { headers: { 'Authorization': 'Bearer ' + token } };

                const response = await axios.get(url, config);
                if (response.status === 200) {
                    this.unreadCount = response.data;  // 🔹 안 읽은 쪽지 개수 업데이트
                }
            } catch (error) {
                console.error('안 읽은 쪽지 개수 불러오기 실패:', error);
            }
        },
        getPageRange() {
            const range = [];
            const start = Math.floor((this.currentPage - 1) / 5) * 5 + 1;
            const end = Math.min(start + 4, this.totalPages);

            for (let i = start; i <= end; i++) {
                range.push(i);
            }
            return range;
        },
        formatDate(date) {
            // 날짜 포맷 (예: 2025-03-16 14:30)
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            };
            return new Date(date).toLocaleString('ko-KR', options);
        },
    },
};
</script>

<style scoped>
.message-list {
    padding: 20px;
}

button.active {
    background-color: #007bff;
    color: white;
}

.message-item {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.message-header {
    font-size: 14px;
    margin-bottom: 10px;
}

.sender,
.receiver {
    font-weight: bold;
}

.date {
    font-style: italic;
}

.message-content {
    margin-bottom: 10px;
}

.message-actions button {
    margin-right: 10px;
}

.pagination {
    text-align: center;
    margin-top: 20px;
}

.pagination button {
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
}

.pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.pagination .active {
    font-weight: bold;
    color: white;
    background-color: #007bff;
}

.unread-status {
    margin-top: 10px;
    color: red;
}

.unread {
    color: blue;
}

.read {
    color: #6b6b6b;
    /* grey와 darkgrey 중간 */
}

.unread-badge {
    background-color: red;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 3px 6px;
    border-radius: 50%;
    margin-left: 5px;
}
</style>
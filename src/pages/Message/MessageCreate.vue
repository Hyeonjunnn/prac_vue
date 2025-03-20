<template>
  <div class="row">
    <div class="col p-3">
      <h2>쪽지 전송</h2>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <label for="receiverId">받는 사람 ID :</label>
        <input type="text" class="form-control" id="receiverId" v-model="messageItem.receiverId" />
      </div>
      <div class="form-group">
        <label for="content">메시지 내용 :</label>
        <textarea class="form-control" rows="3" id="content" v-model="messageItem.content"></textarea>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-primary m-1" @click="sendMessage()">
          전송
        </button>
        <button type="button" class="btn btn-secondary m-1" @click="cancelMessage()">
          취소
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
  name: 'MessageCreate',
  data() {
    return {
      messageItem: {
        receiverId: '',
        content: ''
      }
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async sendMessage() {
      try {
        const url = 'http://localhost:8087/messages';
        const data = {
          receiverId: this.messageItem.receiverId,
          content: this.messageItem.content
        };
        const token = getUserInfo().accessToken;
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        };

        const response = await axios.post(url, data, config);

        if (response.status === 200) {
          alert('쪽지가 전송되었습니다. 알림이 발송되었습니다.');
        } else {
          alert('쪽지 전송 실패');
        }
      } catch (error) {
        alert('전송 에러 발생: ' + error);
      }
    },
    cancelMessage() {
      this.router.back(); // 이전 페이지로 이동
    }
  }
};
</script>
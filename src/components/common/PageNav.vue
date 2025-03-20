<template>
  <!-- 페이징 버튼 -->
  <div class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
    <div class="flex mr-4 rounded">
      <a href="#" @click="prevPage()" class="px-3 py-2 ml-0 leading-tight text-indigo-700 bg-white border border-r-0 border-gray-200 rounded-l hover:bg-indigo-500 hover:text-white"
        ><span>Previous</span></a
      >
      <a
        href="#"
        v-for="page in totalPages"
        :key="page"
        :class="page === currentPage ? 'bg-indigo-500 text-white' : 'text-indigo-700'"
        @click="setPage(page)"
        class="px-3 py-2 leading-tight bg-white border border-r-0 border-gray-200 hover:bg-indigo-500 hover:text-white"
        ><span>{{ page }}</span></a
      >
      <a href="#" @click="nextPage" class="px-3 py-2 leading-tight text-indigo-700 bg-white border border-gray-200 rounded-r hover:bg-indigo-500 hover:text-white"><span>Next</span></a>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageNav",
  props: {
    // 현재 페이지 위치 (기본 1)
    currentPage: {
      type: Number,
      default: 1,
    },
    // 한 페이지에 나타낼 항목 수 (기본 10)
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    // 총 페이지 수
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ["set-page"], // 이벤트 정의 (부모에게 값을 전달)
  methods: {
    // 페이징 버튼 메소드
    setPage(page) {
      this.$emit("set-page", page);
    },
    // 페이징 뒤로 버튼
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit("set-page", this.currentPage - 1);
      }
    },
    // 페이징 앞으로 버튼
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("set-page", this.currentPage + 1);
      }
    },
  },
};
</script>

<template>
  <div class="m-input">
    <input
      type="text"
      :style="styleInput"
      :placeholder="placeholder"
      v-model="modelValue"
      @input="onInput"
    />
    <button class="btn-search"></button>
    <div class="search-list" v-if="modelValue">
      <div class="search-list-item" v-for="item in dataSearch" :key="item.book_id">
        <div class="search-list-item-left">
          <img :src="item.cover_image" alt="" />
        </div>
        <div class="search-list-item-right">
          <div class="book-name truncate">{{ item.book_name }}</div>
          <div class="gr-book--large-author truncate">
            by <a href="">{{ item.author_name }}</a>
            <div class="gr-icon--authorBadge"></div>
          </div>
        </div>
      </div>
      <div class="search-full">
        <a :href="`/search?searchType=1&textSearch=${modelValue}`"
          >Xem tất cả kết quả cho "{{ modelValue }}"</a
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MInputSearch',
  emits: ['update:modelValue'],
  props: {
    placeholder: String,
    isSearch: Boolean,
    heightInput: {
      type: Number,
      default: 32
    },
    dataSearch: Array
  },
  computed: {
    styleInput() {
      return {
        height: this.heightInput + 'px'
      }
    }
  },
  methods: {
    onInput(e) {
      this.$emit('onInput', e)
    }
  }
}
</script>

<style scoped>
.m-input {
  width: 100%;
  position: relative;
}
.m-input > input {
  border: #dcd6cc 1px solid;
  outline: none;
  width: 100%;
  border-radius: 3px;
  height: 32px;
  font-size: 12px;
  color: #677279;
  padding: 4px 26px 4px 8px;
}
.btn-search {
  background: url(@/assets/img/search.svg) no-repeat !important;
  display: inline-block;
  height: 19px;
  position: absolute;
  width: 18px;
  right: 4px;
  top: 6.5px;
  color: #767676;
  cursor: pointer;
  appearance: none;
  border: none;
  padding: 0;
}
.search-list {
  position: absolute;
  width: 100%;
  background-color: #fff;
  left: 0;
  top: 32px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  padding: 4px;
}
.search-list-item {
  display: flex;
  height: 50px;
  padding-bottom: 4px;
  border-bottom: 1px solid #7c7878;
}

.search-list-item-left {
  width: 40px;
}
.search-list-item-right {
  padding-left: 12px;
  width: calc(100% - 40px);
}
.search-list-item-right .book-name {
  font-size: 12px;
  font-weight: bold;
}
.gr-icon--authorBadge {
  background: url(/assets/layout/gr_author_badge.svg) 0 center no-repeat;
  width: 14px;
  height: 14px;
  margin-left: 4px;
  vertical-align: middle;
}
.gr-book--large-author {
  color: #333333;
  font-family: 'Merriweather', 'Georgia', serif;
  display: flex;
  align-items: center;
}
.gr-book--large-author a {
  margin-left: 4px;
}
.gr-book--large-author a:hover {
  text-decoration: underline;
}
.gr-icon--authorBadge {
  background: url(@/assets/img/gr_author_badge.svg) 0 center no-repeat;
  width: 14px;
  height: 14px;
  margin-left: 4px;
  vertical-align: middle;
}
.search-full {
  height: 20px;
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #00635d;
  align-items: center;
  cursor: pointer;
}
.search-full:hover {
  text-decoration: underline;
}
</style>

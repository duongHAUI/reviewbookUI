<template>
  <div>
    <div :class="['text-expanded', { expanded: isExpanded }]">
      <p ref="textExpand" v-html="textValue"></p>
    </div>
    <span @click="toggleExpand" v-if="isShowExpand" class="toggle-button-expanded">
      {{ isExpanded ? 'Thu gọn' : 'Mở rộng' }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    textValue: String
  },
  data() {
    return {
      isExpanded: false,
      isShowExpand: true
    }
  },
  mounted() {
    console.log(this.$refs.textExpand.offsetHeight)
    if (this.$refs.textExpand.offsetHeight < 65) {
      this.isShowExpand = false
    } else {
      this.isShowExpand = true
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    }
  }
}
</script>

<style scoped>
.text-expanded {
  position: relative;
  max-height: 60px; /* Chiều cao tối đa khi thu gọn */
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.text-expanded.expanded {
  max-height: none; /* Bỏ giới hạn chiều cao khi mở rộng */
}
.text-expanded p {
  color: #333333;
  font-family: 'Lato', 'Helvetica Neue', 'Helvetica', sans-serif;
}

.toggle-button-expanded {
  display: inline-block;
  cursor: pointer;
  color: blue;
  font-size: 12px;
}
.toggle-button-expanded:hover {
  text-decoration: underline;
}
</style>

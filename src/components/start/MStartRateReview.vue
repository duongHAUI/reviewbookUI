<template>
  <div
    class="star-rating"
    :style="{
      justifyContent: justifyContent
    }"
  >
    <span
      v-for="star in 5"
      :key="star"
      :class="{
        active: star <= fullStars() || star <= startPrevActive,
        half: star === halfStar()
      }"
      @mouseover="onMouseover(star)"
      @mouseleave="onMouseleave()"
      @click="onClick(star)"
      :style="
        star === halfStar()
          ? {
              '--width': halfWidth() + '%',
              fontSize: fontSize ? fontSize + 'px !important' : undefined
            }
          : {
              fontSize: fontSize ? fontSize + 'px !important' : undefined
            }
      "
    >
      &#9733;
    </span>
  </div>
</template>

<script>
export default {
  props: {
    startRate: Number,
    fontSize: {
      type: Number,
      default: 30
    },
    justifyContent: {
      type: String,
      default: 'left'
    },
    isNotReview: Boolean
  },
  data() {
    return {
      startPrevActive: 0
    }
  },
  methods: {
    fullStars() {
      return Math.floor(this.startRate) // Số sao đầy đủ
    },
    halfStar() {
      return this.startRate % 1 !== 0 ? Math.ceil(this.startRate) : 0 // Vị trí nửa sao
    },
    halfWidth() {
      return (this.startRate % 1) * 100 // Tính toán width của nửa sao
    },
    onMouseover(start) {
      this.startPrevActive = start
    },
    onMouseleave() {
      this.startPrevActive = 0
    },
    onClick(start) {
      this.$emit('onReview', start)
    }
  }
}
</script>

<style scoped>
.star-rating {
  display: flex;
  direction: row-reverse;
}

.star-rating span {
  cursor: pointer;
  color: lightgray;
  position: relative;
}

.star-rating span.active {
  color: gold;
}

/* Thêm nửa sao với width động */
.star-rating span.half::before {
  content: '\2605'; /* Ký tự sao đầy đủ */
  position: absolute;
  left: 0;
  top: 0;
  width: var(--width, 50%); /* Giá trị mặc định là 50% */
  overflow: hidden;
  color: gold;
}
</style>

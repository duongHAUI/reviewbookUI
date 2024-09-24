<template>
  <div class="m-button" @click="onClick">
    <button :style="styleCustom" @mouseover="onMouseover" @mouseleave="onMouseleave">
      <i :class="classIcon"></i><slot></slot>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    TextField: String,
    classIcon: String,
    height: {
      type: Number,
      default: 45
    },
    hoverBgrColor: String,
    backgroundColor: String,
    color: String,
    hoverColor: String
  },
  emits: ['click'],
  data() {
    return {
      hoverColorBgrState: this.backgroundColor,
      hoverColorState: this.color
    }
  },
  computed: {
    styleCustom() {
      return {
        height: this.height,
        backgroundColor: this.hoverColorBgrState,
        color: this.hoverColorState
      }
    }
  },
  methods: {
    onMouseover() {
      this.hoverColorBgrState = this.hoverBgrColor
      this.hoverColorState = this.hoverColor
    },
    onMouseleave() {
      this.hoverColorBgrState = this.backgroundColor
      this.hoverColorState = this.color
    },
    onClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style scoped>
.m-button {
  width: 100%;
  display: flex;
  justify-items: center;
  border: none;
  transition: 0.3 linear;
}
.m-button button {
  padding: 8px 12px;
  display: flex;
  justify-items: center;
  justify-content: center;
  border: 1px solid #f3dede;
  outline: none;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
}
.m-button :hover {
  transition: 0.3 linear;
}
.m-button i {
  font-size: 18px;
  margin-right: 12px;
}
</style>

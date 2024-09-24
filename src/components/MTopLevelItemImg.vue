<template>
  <div
    v-click-outside="clickOutsideItem"
    class="MTopLevel_item"
    @click="toggleDown"
    :style="{ backgroundColor: toggle ? 'var(--hover-level-item-bgr)' : '' }"
    ref="topLevelItemImg"
  >
    <li class="topLevelItem">
      <div
        :href="showDownItem ? undefined : link"
        :style="{ color: toggle ? 'var(--hover-level-item-color)' : '' }"
      >
        <img :src="`src/assets/img/${iconItem}`" alt="" />
      </div>
    </li>
    <div class="topLevelItem_down-list" v-if="showDownItem && toggle">
      <ul>
        <li class="topLevelItem_down-item" v-for="(itemDown, index) in downList" :key="index">
          <div class="title-bool" v-if="itemDown.isTitle">{{ itemDown.text }}</div>
          <hr class="hr-item" v-else-if="itemDown.isHr" />
          <a v-else :href="itemDown.href" @click="clickItemDown(itemDown.key)">{{
            itemDown.text
          }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MTopLevelItemImg',
  data() {
    return {
      toggle: false,
      isActiveToggle: false
    }
  },
  props: {
    link: String,
    textTitle: String,
    colorHover: {
      typeof: String,
      default: '#fff'
    },
    showDownItem: Boolean,
    downList: Array,
    iconItem: String
  },
  methods: {
    toggleDown() {
      this.toggle = !this.toggle
    },
    clickOutsideItem(e) {
      if (!this.$refs.topLevelItemImg.contains(e.target)) {
        this.toggle = false
      }
    },
    clickItemDown(key) {
      this.$emit('clickItemDown', key)
    }
  }
}
</script>

<style scoped>
.MTopLevel_item {
  position: relative;
  user-select: none;
  -webkit-user-select: none; /* Cho trình duyệt WebKit (Safari, Chrome) */
  -moz-user-select: none; /* Cho Firefox */
  -ms-user-select: none; /* Cho Internet Explorer/Edge */
}
.topLevelItem {
  line-height: 50px;
  padding: 0 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.topLevelItem ~ .topLevelItem-img {
  padding: 0 8px !important;
}
.topLevelItem:hover {
  background-color: var(--hover-level-item-bgr);
}
.topLevelItem:hover > a {
  color: var(--hover-level-item-color);
}
.down-item {
  font-size: 18px;
  margin-left: 2px;
}
.topLevelItem_down-list {
  position: absolute;
  background-color: #ffff;
  width: 150px;
  display: inline-block;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 8px 0;
  right: 0;
}
.topLevelItem_down-item {
  font-size: 14px;
  padding: 0 16px;
  line-height: 32px;
  color: #333333;
}
.topLevelItem_down-item:hover {
  text-decoration: underline;
}

.topLevelItem-img {
  display: inline-block;
  height: 32px;
  width: 32px;
  color: #767676;
  cursor: pointer;
  appearance: none;
  border: none;
  padding: 0;
  transform: translateY(calc(50% - 4px));
}
.topLevelItem img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transform: translateY(calc(50% - 4px));
}
.title-bool {
  font-weight: bold;
}
.hr-item {
  width: calc(100% + 32px);
  margin-left: -16px;
  background-color: #efefef;
  height: 1px; /* Đặt độ dày cho thẻ hr */
  border: 0; /* Loại bỏ viền mặc định của thẻ hr */
}
</style>

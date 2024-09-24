<template>
  <div
    v-click-outside="clickOutsideItem"
    class="MTopLevel_item"
    @click="toggleDown"
    :style="{ backgroundColor: toggle ? 'var(--hover-level-item-bgr)' : '' }"
  >
    <li class="topLevelItem">
      <a
        :href="showDownItem ? undefined : link"
        :style="{ color: toggle ? 'var(--hover-level-item-color)' : '' }"
      >
        <button
          class="topLevelItem-img"
          v-if="iconItem"
          :style="{
            background: `url(src/assets/img/${iconItem}) no-repeat !important`
          }"
        ></button
      ></a>
    </li>
    <div class="topLevelItem_down-list" v-if="showDownItem && toggle">
      <ul>
        <li
          v-if="!downList || (downList && downList.length == 0)"
          class="topLevelItem_down-item no-data"
        >
          Không có dữ liệu
        </li>
        <li class="topLevelItem_down-item" v-for="(itemDown, index) in downList" :key="index">
          <a :href="itemDown.href">{{ itemDown.text }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MTopLevelItemBgr',
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
    clickOutsideItem() {
      this.toggle = false
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
  width: 200px;
  display: inline-block;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 8px 0;
  right: 0px;
}
.topLevelItem_down-item {
  font-size: 14px;
  padding: 0 16px;
  line-height: 32px;
  color: #333333;
}
.topLevelItem_down-item.no-data {
  padding: 0 8px;
  line-height: 24px;
}
.topLevelItem_down-item.no-data {
  padding: 0 8px;
  line-height: 24px;
  text-align: center;
  font-size: 12px;
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
</style>

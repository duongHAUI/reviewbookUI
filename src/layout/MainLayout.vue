<template>
  <div>
    <the-header v-if="!$route.meta.hideHeaderFooter" />
    <div :class="paddingClass" ref="content">
      <router-view />
    </div>
    <the-footer v-if="!$route.meta.hideHeaderFooter" />
  </div>
  <MLoadding :isLoadding="$state.isLoadding" />
</template>
<script>
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import MLoadding from '@/components/loadding/MLoadding.vue'
export default {
  name: 'MainLayout',
  components: {
    TheHeader,
    TheFooter,
    MLoadding
  },
  data() {
    return {
      styleFooter: {}
    }
  },
  computed: {
    paddingClass() {
      return this.$route?.meta?.removePadding
        ? 'm-main-content-no-padding'
        : 'm-main-content-padding'
    }
  }
}
</script>
<style></style>

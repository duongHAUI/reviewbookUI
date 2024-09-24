<template>
  <header class="header">
    <div class="logo"><img src="@/assets/img/logo.png" alt="" /></div>
    <div class="siteHeader__primaryNavInline">
      <ul class="siteHeader__menuList">
        <m-top-level-item textTitle="Trang chủ" link="/home" />
        <m-top-level-item textTitle="Sách của tôi" link="/mybook" />
        <m-top-level-item
          textTitle="Cộng đồng"
          link="/community"
          showDownItem
          :downList="downListCommunity"
        />
      </ul>
      <div class="searchBox__form">
        <m-input-search
          :dataSearch="dataSearch"
          placeholder="Tìm kiếm sách"
          @onInput="searchData"
        />
      </div>
    </div>

    <div class="siteHeader__personal">
      <ul class="siteHeader__menuList">
        <m-top-level-item-bgr showDownItem iconItem="notification.svg" />
        <m-top-level-item-bgr link="/discussions" iconItem="discussions.svg" />
        <m-top-level-item-bgr link="/message" iconItem="msgs.svg" />
        <m-top-level-item-bgr link="/friend" iconItem="friend.svg" />
        <m-top-level-item-img
          @click="clickItemDown"
          showDownItem
          :downList="downListProfile"
          iconItem="users.png"
        />
      </ul>
    </div>
  </header>
</template>

<script>
import config from '@/config'
import MTopLevelItem from './MTopLevelItem.vue'
import MInputSearch from './MInputSearch.vue'
import MTopLevelItemBgr from './MTopLevelItemBgr.vue'
import MTopLevelItemImg from './MTopLevelItemImg.vue'
import authApi from '@/api/authApi'
import bookApi from '@/api/bookApi'
export default {
  name: 'TheFooter',
  components: { MTopLevelItem, MInputSearch, MTopLevelItemBgr, MTopLevelItemImg },
  data() {
    return {
      downListCommunity: new config().communityDownList,
      downListProfile: new config().profileDownList,
      dataSearch: []
    }
  },
  methods: {
    async logout() {
      try {
        var res = await new authApi().signout(localStorage.getItem('token'))
        if (res) {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          this.isShowSettingUser = false
          window.location.reload()
          window.location.assign('/')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async clickItemDown(key) {
      if (key == 'logout') {
        try {
          var res = await new authApi().signout(localStorage.getItem('token'))
          if (res) {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            window.location.reload()
            window.location.assign('/')
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    async searchData(event) {
      try {
        if (this.timeout) clearTimeout(this.timeout)
        // Xét thời gian tìm kiếm 0,5s
        this.timeout = setTimeout(async () => {
          this.textSearch = event.target.value || ''
          const res = await new bookApi('Book').searchBook({
            pageSize: 5,
            pageNumber: 1,
            listType: -1,
            textSearch: event.target.value || ''
          })
          if (res && res.Data) {
            this.dataSearch = res.Data
          }
        }, 500) // delay
      } catch (error) {
        console.log('Lỗi search data : ', error)
      }
    }
  }
}
</script>

<style scoped>
.header {
  height: var(--height-header);
  padding: 0px var(--padding-beside);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-color-header);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}
.logo {
  font-family: 'Georgia', serif;
  font-size: 18px;
  font-weight: normal;
  color: #4b3832;
  letter-spacing: 0.1em;
}
.logo img {
  height: 32px;
}
.siteHeader__primaryNavInline {
  display: flex;
  align-items: center;
}
.siteHeader__menuList {
  display: flex;
}
.searchBox__form {
  width: 320px;
}
.siteHeader__personal {
  display: flex;
  line-height: 50px;
}
</style>

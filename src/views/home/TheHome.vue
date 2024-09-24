<template>
  <div class="home">
    <div class="home-left">
      <div class="block-box-left">
        <h3 class="title-box-home-left">Đang đọc</h3>
        <div class="empty-book" v-if="countTypeBook.Reading == 0">
          <div class="empty-book-note">
            <img class="readding" src="@/assets/img/readding.svg" alt="" />
            <span>Bạn đang đọc gì thế?</span>
          </div>
          <div class="m-t-16"></div>
          <m-input-search placeholder="Tìm kiếm sách" />
        </div>
        <div class="not-empty-book" v-else>
          <div class="list-want-book">
            <div
              class="list-want-book-item"
              v-for="book in listTypeMyUser.filter((x) => x.list_type == 2).slice(0, 6)"
              :key="book.book_id"
            >
              <img :src="book.cover_image" alt="" />
            </div>
          </div>
          <div class="m-t-8"></div>
          <a class="show-all" href="/mybook?list_type=2">Xem tất cả</a>
        </div>
      </div>
      <div class="block-box-left">
        <h3 class="title-box-home-left">Muốn đọc</h3>
        <div class="empty-book-list" v-if="countTypeBook.WantToRead == 0">
          <div class="empty-book-note">
            <img class="want-book" src="@/assets/img/want-read.svg" alt="" />
            <span>Bạn muốn đọc gì tiếp theo?</span>
          </div>
          <div class="m-t-16"></div>
          <m-input-search placeholder="Tìm kiếm sách" />
        </div>
        <div v-else>
          <div class="list-want-book">
            <div
              class="list-want-book-item"
              v-for="book in listTypeMyUser.filter((x) => x.list_type == 1).slice(0, 5)"
              :key="book.book_id"
            >
              <img :src="book.cover_image" alt="" />
            </div>
          </div>
          <div class="m-t-8"></div>
          <a class="show-all" href="/mybook?list_type=1">Xem tất cả</a>
        </div>
      </div>
      <div class="block-box-left">
        <h3 class="title-box-home-left">Muốn đọc</h3>
        <ul>
          <li class="my-book-statitic-item bold">
            <a href="/mybook">Tất cả ({{ countTypeBook.AllRead ?? 0 }})</a>
          </li>
          <li class="my-book-statitic-item">
            <a href="/mybook?list_type=1">Muốn đọc ({{ countTypeBook.WantToRead ?? 0 }})</a>
          </li>
          <li class="my-book-statitic-item">
            <a href="/mybook?list_type=2">Đang đọc ({{ countTypeBook.Reading ?? 0 }})</a>
          </li>
          <li class="my-book-statitic-item">
            <a href="/mybook?list_type=3">Đã đọc ({{ countTypeBook.Read ?? 0 }})</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="home-content">
      <reivew-post v-model="isShowReviewPost" @addSuccess="() => (isShowReviewPost = false)" />
      <div class="add-review">
        <div>
          <img
            src="https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/393599629_1433351610575770_2611684086342930951_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEStVZ5ZjnY5CLIeimYWbFcTPoj9LNzW_tM-iP0s3Nb-2Agybm7xBDZKr072pzHuS0PrZiqz1mAl7wrP2mf42Fv&_nc_ohc=aW3xnqPHNX0Q7kNvgG7WCgq&_nc_ht=scontent-hkg1-1.xx&_nc_gid=AQxeyg2K0viRWSLAfULKtRh&oh=00_AYCzmqyXvH0lcAcw8bxGRxXkIGvY11P1BWd6DC05DdJ7ag&oe=66EA197D"
            alt=""
          />
        </div>
        <button class="add-review-btn" @click="() => (isShowReviewPost = true)">
          Bạn muốn nhận xét về sách đã đọc?
        </button>
      </div>
      <m-book-review v-for="(item, index) in dataReviewPost" :dataReviewPost="item" :key="index" />
    </div>
    <div class="home-right">
      <div class="right-connect">
        <h4>Kết nối</h4>
        <ul>
          <li><i class="fa-brands fa-facebook-f"></i></li>
          <li><i class="fa-brands fa-twitter"></i></li>
          <li><i class="fa-brands fa-instagram"></i></li>
          <li><i class="fa-brands fa-linkedin-in"></i></li>
        </ul>
      </div>
      <span>© 2024 Goodreads, Inc.</span>
    </div>
  </div>
</template>
<script>
import reviewPostApi from '@/api/reviewPostApi'
import MBookReview from './MBookReview.vue'
import ReivewPost from './ReivewPost.vue'
import baseApi from '@/api/baseApi'
import MInputSearch from '@/components/MInputSearch.vue'
import enumD from '@/common/enum'
export default {
  name: 'TheHome',
  components: { MBookReview, ReivewPost, MInputSearch },
  data() {
    return {
      isShowReviewPost: false,
      dataReviewPost: [],
      pageSize: 20,
      pageNumber: 1,
      listTypeMyUser: [],
      countTypeBook: {},
      enumStatusRead: enumD.StatusRead
    }
  },
  computed: {
    paramFilter() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        listType: -1,
        userId: this.$state.user.user_id
      }
    }
  },
  async created() {
    await this.getReviewPost()
    await this.getMyBookFilter()
  },
  methods: {
    async getReviewPost() {
      try {
        this.$state.isMask()
        const res = await new reviewPostApi('Review').getReviewPost(this.paramFilter)
        this.dataReviewPost = res
      } catch (error) {
        this.$state.unMask()
        console.log(error)
      }
      this.$state.unMask()
    },
    async getMyBookFilter() {
      try {
        this.$state.isMask()
        const res = await new baseApi('Book').getByFilter(this.paramFilter)
        this.listTypeMyUser = res.Data
        this.totalRecord = res.Total
        this.countTypeBook = res.CustomData ? res.CustomData[0] : {}
        this.$state.unMask()
      } catch (error) {
        this.$state.unMask()
        console.log(error)
      }
    }
  }
}
</script>
<style>
@import url(./home.css);
</style>

<template>
  <div class="m-book">
    <div class="m-book-left">
      <div class="m-book-left-img">
        <img :src="book.cover_image" alt="" />
      </div>

      <div class="option-want-book">
        <m-button
          v-if="!book.list_type"
          @click="updateListType(book, enumerate.StatusRead.WantToRead)"
          >Muốn đọc</m-button
        >
        <MCombobox
          v-else
          :data="listTypeBook"
          v-model="book.list_type"
          propName="value"
          propValue="id"
          icon="icon-drop-page-black"
          :locationList="0"
          :isReadonly="true"
          @selected="(list_type) => updateListType(book, list_type)"
        />
      </div>
      <div class="m-rate-book">
        <m-start-rate-review
          :fontSize="48"
          :startRate="book.user_rating"
          @onReview="(start) => onReview(start)"
          :isNotReview="true"
        />
        <span>Đánh giá của bạn</span>
      </div>
    </div>
    <div class="m-book-right m-t-12">
      <div class="book-title-r">{{ book.book_name }}</div>
      <div class="m-t-4"></div>
      <div class="gr-book--large-author">
        by <a href="">{{ book.author_name }}</a>
        <div class="gr-icon--authorBadge"></div>
      </div>
      <div class="m-rate-book-r">
        <m-start-rate :fontSize="32" :startRate="book.avg_rate" />
        <div class="rate-book-r">{{ book.avg_rate }}</div>
        <sup>{{ book.total_rating }} đánh giá</sup>
      </div>
      <div class="m-t-8"></div>
      <m-text-expanded textValue="213213213213123" />
      <div class="book-r-genres m-t-12">Thể loại : {{ book.genre }}</div>
      <div class="book-r-public-date">Ngày xuất bản : {{ formatDate(book.publication_date) }}</div>
      <hr class="m-t-8" />
      <div class="book-user-r">
        <div class="book-user-r-l">
          <div class="book-user-r-l-avt">
            <img :src="book.user_image" alt="" />
          </div>
          <div class="book-user-r-l-info">
            <div class="gr-book--large-author">
              <a href="">{{ book.fullname }}</a>
              <div class="gr-icon--authorBadge"></div>
            </div>
            <div class="info-basic">
              {{ book.total_book }} sách - {{ book.total_follow }} theo dõi
            </div>
          </div>
        </div>
        <div class="my-user-flow" v-if="book.user_id !== $state.user.user_id">
          <button @click="followUnFollow">
            {{ !book.is_follow ? 'Theo dõi' : 'Hủy theo dõi' }}
          </button>
        </div>
      </div>
      <hr class="m-t-8" />
      <div class="start-people">
        <h4>Đánh giá cộng đồng</h4>
        <m-rating-sumary
          :averageRating="book_avg_rate"
          :totalRating1="book.total_rating_1"
          :totalRating2="book.total_rating_2"
          :totalRating3="book.total_rating_3"
          :totalRating4="book.total_rating_4"
          :totalRating5="book.total_rating_5"
          :totalRatings="book.total_rating"
        />
      </div>
    </div>
  </div>
</template>

<script>
import baseApi from '@/api/baseApi'
import bookApi from '@/api/bookApi'
import common from '@/common/common'
import constants from '@/common/constants'
import enumD from '@/common/enum'
import MButton from '@/components/button/MButton.vue'
import MCombobox from '@/components/combobox/MCombobox.vue'
import MRatingSumary from '@/components/MRatingSumary.vue'
import MTextExpanded from '@/components/MTextExpanded.vue'
import MStartRate from '@/components/start/MStartRate.vue'
import MStartRateReview from '@/components/start/MStartRateReview.vue'
export default {
  components: {
    MButton,
    MCombobox,
    MStartRateReview,
    MStartRate,
    MTextExpanded,
    MRatingSumary
  },
  data() {
    return {
      book: {},
      listTypeBook: constants.listTypeBook.filter((x) => x.id != '-1'),
      isFlowUserBook: false,
      enumerate: enumD
    }
  },
  async created() {
    if (this.$route.params) {
      const id = this.$route.params.id
      const guidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (guidPattern.test(id)) {
        await this.getBookDetail(id)
      }
    }
  },
  methods: {
    async updateListType(book, listType) {
      try {
        const res = await new bookApi().UpdateStatusRead({
          user_id: this.$state.user.user_id,
          list_type: listType,
          book_id: book.book_id,
          book_list_item_id: book.book_list_item_id || '00000000-0000-0000-0000-000000000000'
        })
        if (res) {
          book.list_type = listType
          if (res.Data) {
            book.book_list_item_id = res.Data
          } else {
            book.book_list_item_id = res
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getBookDetail(id) {
      try {
        this.$state.isMask()
        const res = await new bookApi('Book').getBookDetail({
          id: id,
          user_id: this.$state.user.user_id
        })
        if (res && res.Data) {
          this.book = {
            ...res.Data,
            ...res.DataUserBookDetail
          }
        }
        this.$state.unMask()
      } catch (error) {
        console.log(error)
      }
    },
    async followUnFollow() {
      try {
        if (!this.book.follow_id) {
          const res = await new baseApi('Follow').create({
            follower_id: this.$state.user.user_id,
            followed_id: this.book.user_id
          })
          if (res && res.Data) {
            this.book.follow_id = res.Data
            this.book.is_follow = true
            this.book.total_follow = this.book.total_follow + 1
          }
        } else {
          const res = await new baseApi('Follow').remove([this.book.follow_id])
          if (res) {
            this.book.follow_id = null
            this.book.is_follow = false
            this.book.total_follow = this.book.total_follow - 1
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    formatDate(date) {
      return common.formatDate(date)
    },
    async onReview(start) {
      try {
        if (this.book.user_rating != start) {
          const res = await new bookApi().UserReviewStartBook({
            book_id: this.book.book_id,
            user_id: this.$state.user.user_id,
            rating: start
          })
          if (res) {
            this.book[`total_rating_${this.book.user_rating}`] =
              this.book[`total_rating_${this.book.user_rating}`] - 1
            this.book[`total_rating_${start}`] = this.book[`total_rating_${start}`] + 1
            this.book.user_rating = start
            // Lấy lại đnáh giá trung bình
            const book = await new baseApi('Book').getById(this.book.book_id)
            if (book) {
              this.book.avg_rate = book.avg_rate
            }
            if (!this.book.list_type) {
              await this.updateListType(this.enumerate.StatusRead.Read)
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
@import url(./m-book.css);
</style>

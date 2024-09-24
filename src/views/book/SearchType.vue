<template>
  <div class="search-type">
    <h4>Tìm kiếm</h4>
    <div class="search-type-header">
      <div class="t-search-input">
        <m-input :placeholder="placeholder" v-model="textSearch" />
      </div>
      <div class="t-search-b">
        <m-button @click="searchData">Tìm kiếm</m-button>
      </div>
    </div>
    <!-- <div class="m-t-16 search-type-rdio">
      <m-radio-button id="1" :checked="true" textField="Sách" nameInput="SearchType" />
      <div class="m-l-12"></div>
      <m-radio-button id="2" margin="0 8px" textField="Bạn bè" nameInput="SearchType" />
    </div> -->
    <ul class="tab-search">
      <li
        class="tab-search-item"
        :class="{ active: tabActive == 'Book' }"
        @click="activeTab('Book')"
      >
        Sách
      </li>
      <li
        class="tab-search-item"
        :class="{ active: tabActive == 'Author' }"
        @click="activeTab('Author')"
      >
        Tác giả
      </li>
      <li
        class="tab-search-item"
        :class="{ active: tabActive == 'Friend' }"
        @click="activeTab('Friend')"
      >
        Bạn bè
      </li>
    </ul>
    <div v-if="tabActive == 'Book'" class="tab-search-book">
      <div class="gr-book--large" v-for="book in listBook" :key="book.book_id">
        <div class="gr-book--large-img">
          <img :src="book.cover_image" alt="" />
        </div>
        <div class="gr-book--large-acction">
          <div class="gr-book--large-title">
            <a href="" class="bold">{{ book.book_name }}</a>
          </div>
          <div class="m-t-4"></div>
          <div class="gr-book--large-author">
            by <a href="">{{ book.author_name }}</a>
            <div class="gr-icon--authorBadge"></div>
          </div>
          <div class="m-t-8"></div>
          <div class="option-book">
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
            <div class="review-rate-book flex">
              <span>Đánh giá của bạn: </span>
              <m-start-rate-review
                :fontSize="16"
                :startRate="book.user_rating"
                @onReview="(start) => onReview(book, start)"
                :isNotReview="true"
              />
            </div>
          </div>
          <div class="m-t-12">
            <span>Tổng đánh giá </span>
            <m-start-rate-review :fontSize="16" :startRate="book.avg_rate" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseApi from '@/api/baseApi'
import bookApi from '@/api/bookApi'
import constants from '@/common/constants'
import enumD from '@/common/enum'
import MButton from '@/components/button/MButton.vue'
import MCombobox from '@/components/combobox/MCombobox.vue'
import MInput from '@/components/input/MInput.vue'
import MTextExpanded from '@/components/MTextExpanded.vue'
import MRadioButton from '@/components/radio-button/MRadioButton.vue'
import MStartRate from '@/components/start/MStartRate.vue'
import MStartRateReview from '@/components/start/MStartRateReview.vue'
export default {
  components: {
    MInput,
    MButton,
    MRadioButton,
    MCombobox,
    MTextExpanded,
    MStartRateReview,
    MStartRate
  },
  data() {
    return {
      placeholder: 'Tìm kiếm sách',
      valueSearch: '',
      typeSearch: enumD.TypeSearch.Book,
      tabActive: 'Book',
      pageSize: 20,
      pageNumber: 1,
      textSearch: '',
      listBook: [],
      listAuthor: [],
      listFriend: [],
      enumerate: enumD,
      listTypeBook: constants.listTypeBook.filter((x) => x.id != '-1')
    }
  },
  computed: {
    paramSearch() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        textSearch: this.textSearch,
        userId: this.$state.user.user_id,
        searchType: enumD.TypeSearch.Book
      }
    }
  },
  async created() {
    if (this.$route.query) {
      this.textSearch = this.$route.query.textSearch || ''
      this.searchType = this.$route.query.searchType || enumD.TypeSearch.Book
      if (this.textSearch) {
        await this.searchData()
      }
    }
  },
  methods: {
    activeTab(tab) {
      this.tabActive = tab
    },
    async searchData() {
      try {
        if (this.timeout) clearTimeout(this.timeout)
        // Xét thời gian tìm kiếm 0,5s
        this.timeout = setTimeout(async () => {
          const res = await new baseApi(this.tabActive).searchData(this.paramSearch)
          if (res && res.Data) {
            this[`list${this.tabActive}`] = res.Data
          }
        }, 500) // delay
      } catch (error) {
        console.log('Lỗi search data : ', error)
      }
    },
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
    async onReview(book, start) {
      try {
        if (book.user_rating != start) {
          const res = await new bookApi().UserReviewStartBook({
            book_id: book.book_id,
            user_id: this.$state.user.user_id,
            rating: start
          })
          if (res) {
            book.user_rating = start
            // Lấy lại đnáh giá trung bình
            const bookAvg = await new baseApi('Book').getById(book.book_id)
            if (bookAvg) {
              book.avg_rate = bookAvg.avg_rate
            }
            if (!book.list_type) {
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
@import url(./search-type.css);
</style>

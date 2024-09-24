<template>
  <div class="my-book">
    <div class="my-book-title">
      <h1>Sách của tôi</h1>
      <div class="mb-action">
        <m-button margin="0 12px 0 0" @click="showAddBook" height="28px">Thêm sách</m-button>
        <div class="mb-search">
          <m-input-search
            :heightInput="28"
            placeholder="Tìm kiếm sách"
            is-search
            @onInput="searchData"
          />
        </div>
        <div
          class="content-table__refesh icon-refesh"
          @click="refresh()"
          data-tip="Lấy lại dữ liệu"
        ></div>
        <ul>
          <li class="mb-acction-item">Chỉnh sửa</li>
          <li class="mb-acction-item mb-acction-item-hr">
            <span class="greyText">&nbsp;|&nbsp;</span>
          </li>
          <li class="mb-acction-item">
            <img src="@/assets/img/view-table.png" class="m-t-8" alt="view-table.png" />
          </li>
          <li class="mb-acction-item">
            <img src="@/assets/img/view-cover.png" class="m-t-8" alt="view-table.png" />
          </li>
        </ul>
      </div>
    </div>
    <div class="my-book-content">
      <div class="my-book-statitic">
        <ul>
          <li class="my-book-statitic-item bold">Tất cả ({{ countTypeBook.AllRead ?? 0 }})</li>
          <li class="my-book-statitic-item">Muốn đọc ({{ countTypeBook.WantToRead ?? 0 }})</li>
          <li class="my-book-statitic-item">Đang đọc ({{ countTypeBook.Reading ?? 0 }})</li>
          <li class="my-book-statitic-item">Đã đọc ({{ countTypeBook.Read ?? 0 }})</li>
        </ul>
        <div class="horizontalGreyDivider"></div>
        <div class="filter-list-type">Lọc theo trạng thái</div>
        <div class="filter-list-type-cbb">
          <MCombobox
            :data="listTypeBook"
            v-model="listType"
            propName="value"
            propValue="id"
            icon="icon-drop-page-black"
            :locationList="0"
            :isReadonly="true"
            @update:modelValue="refresh"
          />
        </div>
        <div class="horizontalGreyDivider"></div>
        <div class="filter-list-type">Sắp xếp</div>
        <div class="filter-list-type-cbb">
          <MCombobox
            :data="listSortBook"
            v-model="sortColumn"
            propName="value"
            propValue="id"
            icon="icon-drop-page-black"
            :locationList="0"
            :isReadonly="true"
            @update:modelValue="refresh"
          />
        </div>
        <div class="m-t-16 sort-direction">
          <m-radio-button id="ASC" :checked="true" textField="Giảm" nameInput="SortDirection" />
          <m-radio-button id="DESC" textField="Tăng" nameInput="SortDirection" />
        </div>
      </div>
      <div class="my-book-info">
        <MTable
          :rows="rows"
          :columns="$state.columnsTableMyBook"
          @delete="deleteRowTable"
          v-model="rowsSelected"
          :isLoadding="$state.isLoadding"
          @refresh="refresh()"
        />
        <div class="content-navigation">
          <div class="content-navigation__total">
            Tổng số: <span>{{ rows.length || 0 }}</span> bản ghi
          </div>
          <div class="content-navigation__page">
            <div>
              <MCombobox
                :data="listPaginate"
                v-model="pageSize"
                propName="value"
                propValue="id"
                icon="icon-drop-page-black"
                :locationList="1"
                :isReadonly="true"
                @update:modelValue="changePageSizePaginate"
              />
            </div>
            <MPaginate :pageCount="totalPageNumber" @change="eventHandlePaginate" />
          </div>
        </div>
      </div>
    </div>
    <m-add-book v-model="isShowAddBook" @addSuccess="getMyBookFilter()" />
  </div>
</template>

<script>
import constants from '@/common/constants'
import MButton from '@/components/button/MButton.vue'
import MCombobox from '@/components/combobox/MCombobox.vue'
import MInputSearch from '@/components/MInputSearch.vue'
import MTable from '@/components/table/MTable.vue'
import MAddBook from './MAddBook.vue'
import baseApi from '@/api/baseApi'
import MRadioButton from '@/components/radio-button/MRadioButton.vue'
export default {
  components: {
    MInputSearch,
    MCombobox,
    MTable,
    MButton,
    MAddBook,
    MRadioButton
  },
  data() {
    return {
      totalRecord: 0,
      rows: [],
      pageSize: 20,
      pageNumber: 1,
      listPaginate: constants.listNavigateNumber,
      listTypeBook: constants.listTypeBook,
      listSortBook: constants.listSortBook,
      textSearch: '',
      rowsSelected: [],
      isShowAddBook: false,
      listType: -1,
      sortColumn: 'none',
      sortDirection: 'ASC',
      countTypeBook: {}
    }
  },
  async created() {
    if (this.$route.query && this.$route.query.list_type) {
      this.listType = this.$route.query.list_type
    }
    await this.getMyBookFilter()
  },
  computed: {
    /**
     * Tính tổng số trang
     */
    totalPageNumber() {
      return Math.ceil(this.totalRecord / this.pageSize)
    },
    paramFilter() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        listType: this.listType,
        sortColumn: this.sortColumn,
        sortDirection: this.sortDirection,
        userId: this.$state.user.user_id,
        textSearch: this.textSearch
      }
    }
  },
  methods: {
    async searchData(event) {
      try {
        if (this.timeout) clearTimeout(this.timeout)
        // Xét thời gian tìm kiếm 0,5s
        this.timeout = setTimeout(async () => {
          this.$state.isMask()
          this.textSearch = event.target.value || ''
          this.pageNumber = 1
          await this.getMyBookFilter()
        }, 500) // delay
      } catch (error) {
        console.log('Lỗi search data : ', error)
      }
    },
    async refresh() {
      this.pageNumber = 1
      await this.getMyBookFilter()
    },
    async getMyBookFilter() {
      try {
        this.$state.isMask()
        const res = await new baseApi('Book').getByFilter(this.paramFilter)
        this.rows = res.Data
        this.totalRecord = res.Total
        this.countTypeBook = res.CustomData ? res.CustomData[0] : {}
        this.$state.unMask()
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * Bắt sự kiện thay đổi trang
     */
    async eventHandlePaginate(pageNumber) {
      this.$state.isMask()
      this.pageNumber = pageNumber
      setTimeout(async () => {
        await this.getData()
      }, 500) // delay
    },
    changePageSizePaginate() {
      this.$state.isMask()
      setTimeout(async () => {
        await this.getData()
      }, 500) // delay
    },
    showAddBook() {
      this.isShowAddBook = true
    }
  }
}
</script>
<style scoped>
@import url(./my-book.css);
</style>

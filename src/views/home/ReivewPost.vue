<template>
  <m-pop-up
    :isShow="modelValue"
    :isIconClose="true"
    dataTipIcon="Đóng (Esc)"
    title="Thêm bài đăng đánh giá sách đã đọc"
    minHeight="max-content"
    iconCloseClass="icon-close-big"
    @close-pop-up="() => this.$emit('update:modelValue', false)"
  >
    <div class="form-submit">
      <div class="m__e-form">
        <div class="form__row" style="width: 100%">
          <MCombobox
            :data="this.listMyBookRead"
            v-model="dataModel.book_id"
            ref="book_id"
            propName="book_name"
            propValue="book_id"
            required
            :rules="[rules.NOT_EMPTY]"
            name="book_id"
            textField="Sách tôi đã đọc"
            :tabIndex="5"
            :errorMsg="errorMsgObjectInput?.book_id"
            @message-error-input="handleBindMessageInput"
          />
        </div>
        <div class="review-book-post bold m-t-16">
          Đánh giá sau khi đọc :
          <span
            ><MStartRateReview :fontSize="18" :startRate="startValue" @onReview="onReview"
          /></span>
        </div>
        <div class="form__col m-t-8" style="width: 100%">
          <div class="m-t-8">
            <MTinyMCE v-model="dataModel.review_text" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="btn-submit-add-book">
        <MButton :tabIndex="19" @click="onSubmitAddBook()" dataTip="Đăng bài">Đăng bài</MButton>
      </div>
    </template>
  </m-pop-up>
</template>

<script>
import resources from '@/common/resource'
import MButton from '@/components/button/MButton.vue'
import MCombobox from '@/components/combobox/MCombobox.vue'
import MPopUp from '@/components/pop-up/MPopUp.vue'
import MTinyMCE from '@/components/TinyMCE/MTinyMCE.vue'
import mixinForm from '@/mixins/mixinForm'
import baseApi from '@/api/baseApi'
import enumD from '@/common/enum'
import MStartRateReview from '@/components/start/MStartRateReview.vue'
export default {
  components: {
    MPopUp,
    MCombobox,
    MTinyMCE,
    MButton,
    MStartRateReview
  },
  props: {
    modelValue: Boolean
  },
  data() {
    return {
      dataModel: { user_id: this.$state.user.user_id },
      rules: resources.FORM_RULES,
      totalRecord: 0,
      pageSize: 20,
      pageNumber: 1,
      listMyBookRead: [],
      startValue: 0
    }
  },
  mixins: [mixinForm],
  computed: {
    paramFilter() {
      return {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        listType: enumD.StatusRead.Read,
        userId: this.$state.user.user_id
      }
    }
  },
  async created() {
    await this.getMyBookRead()
  },
  methods: {
    async getMyBookRead() {
      try {
        this.$state.isMask()
        const res = await new baseApi('Book').getByFilter(this.paramFilter)
        this.listMyBookRead = res.Data
        this.totalRecord = res.Total
      } catch (error) {
        console.log(error)
      }
      this.$state.unMask()
    },
    onReview(start) {
      this.startValue = start
    },
    async onSubmitAddBook() {
      try {
        this.$state.isMask()
        if (!this.checkValidateFormSubmit()) {
          this.$state.unMask()
          return
        }
        this.dataModel.rating = this.startValue
        // kiểm tra là thêm hay sửa
        await new baseApi('Review').create(this.dataModel) // Gọi api Create

        this.dataModel = { user_id: this.$state.user.user_id }
        this.$emit('addSuccess')
      } catch (error) {
        console.log(error)
        var resEror = error?.response?.data
        // Kiểm tra lỗi validate
        if (resEror?.ErrorCode == enumD.ERROR_RESPONSE.BADREQUEST) {
          for (const key in resEror.MoreInfo) {
            this.errorMsgObject[key] = resEror.MoreInfo[key]
            this.errorMessage = resEror.MoreInfo[key]
            this.firstInputNameError = key
            this.errorMsgObjectInput = this.errorMsgObject
          }
        }
      }
      this.$state.unMask()
    }
  }
}
</script>

<style scoped>
.btn-submit-add-book {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #98ac77;
}
.review-book-post {
  display: flex;
  align-items: center;
}
.review-book-post span {
  margin-left: 8px;
}
</style>

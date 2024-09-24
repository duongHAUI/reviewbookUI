<template>
  <m-pop-up
    :isShow="modelValue"
    :isIconClose="true"
    dataTipIcon="Đóng (Esc)"
    title="Thêm sách đã đọc"
    minHeight="max-content"
    iconCloseClass="icon-close-big"
    @close-pop-up="() => this.$emit('update:modelValue', false)"
  >
    <div class="form-submit">
      <div class="m__e-form">
        <div class="form__row" style="width: 100%">
          <div class="form__row f-bw" style="width: 48%">
            <MInput
              textField="Tên sách"
              v-model="dataModel.book_name"
              :required="true"
              ref="book_name"
              name="book_name"
              :tabIndex="1"
              :errorMsg="errorMsgObject?.book_name"
              :rules="[rules.NOT_EMPTY, `${rules.MAX_LENGTH}|255`]"
              @message-error-input="handleBindMessageInput"
            />
          </div>
          <div class="form__col" style="width: 48%">
            <MDatePicker
              textField="Ngày xuất bản"
              name="publication_date"
              ref="publication_date"
              :tabIndex="2"
              :rules="[rules.NOT_EMPTY]"
              v-model="dataModel.publication_date"
              :errorMsg="errorMsgObjectInput?.publication_date"
              @message-error-input="handleBindMessageInput"
            />
          </div>
        </div>
        <MInput
          textField="Mã ISBN sách"
          v-model="dataModel.isbn"
          :required="true"
          name="isbn"
          ref="isbn"
          :tabIndex="3"
          :rules="[rules.NOT_EMPTY, `${rules.MAX_LENGTH}|100`]"
          :errorMsg="errorMsgObject?.isbn"
          @message-error-input="handleBindMessageInput"
        />
        <div class="form__col" style="width: 100%">
          <div class="form__row" style="width: 100%">
            <div class="form__row f-bw" style="width: 48%">
              <MInput
                textField="Thể loại sách"
                v-model="dataModel.genre"
                :required="true"
                name="genre"
                ref="genre"
                :tabIndex="4"
                :errorMsg="errorMsgObject?.genre"
                @message-error-input="handleBindMessageInput"
              />
            </div>
            <div class="form__row f-bw" style="width: 48%">
              <MInput
                textField="Tên tác giả"
                v-model="dataModel.author_name"
                :required="true"
                name="author_name"
                ref="author_name"
                :tabIndex="4"
                :errorMsg="errorMsgObject?.author_name"
                @message-error-input="handleBindMessageInput"
              />
            </div>
          </div>
          <MUpload v-model="fileModel" :dataImages="dataModel.cover_image" />
          <div class="m-t-8">
            <MTinyMCE v-model="dataModel.description" />
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="btn-submit-add-book">
        <MButton :tabIndex="19" @click="onSubmitAddBook()" dataTip="Thêm sách">Thêm sách</MButton>
      </div>
    </template>
  </m-pop-up>
</template>

<script>
import resources from '@/common/resource'
import MButton from '@/components/button/MButton.vue'
import MDatePicker from '@/components/datepicker/MDatePicker.vue'
import MInput from '@/components/input/MInput.vue'
import MPopUp from '@/components/pop-up/MPopUp.vue'
import MTinyMCE from '@/components/TinyMCE/MTinyMCE.vue'
import MUpload from '@/components/upload/MUpload.vue'
import mixinForm from '@/mixins/mixinForm'
import msEnum from '@/common/enum'
import baseApi from '@/api/baseApi'
import fileApi from '@/api/fileApi'
export default {
  components: {
    MPopUp,
    MInput,
    MTinyMCE,
    MUpload,
    MDatePicker,
    MButton
  },
  props: {
    isShowAddBook: Boolean,
    modelValue: Boolean
  },
  data() {
    return {
      dataModel: { user_id: this.$state.user.user_id },
      rules: resources.FORM_RULES,
      listAuthor: [],
      fileModel: undefined
    }
  },
  mixins: [mixinForm],
  methods: {
    async onSubmitAddBook() {
      try {
        this.$state.isMask()
        if (!this.checkValidateFormSubmit()) {
          this.$state.unMask()
          return
        }
        // kiểm tra là thêm hay sửa
        var res = this.$state.idModel
          ? await new baseApi('Book').update(this.$state.idModel, this.dataModel) // Gọi api Update
          : await new baseApi('Book').create(this.dataModel) // Gọi api Create

        if (res && res.Data) {
          this.insertFile(res.Data)
        }

        this.model = {}
        this.$state.idModel = ''
        this.$emit('update:modelValue', false)
        this.$emit('addSuccess')
      } catch (error) {
        console.log(error)
        var resEror = error?.response?.data
        // Kiểm tra lỗi validate
        if (resEror?.ErrorCode == msEnum.ERROR_RESPONSE.BADREQUEST) {
          for (const key in resEror.MoreInfo) {
            this.errorMsgObject[key] = resEror.MoreInfo[key]
            this.errorMessage = resEror.MoreInfo[key]
            this.firstInputNameError = key
            this.errorMsgObjectInput = this.errorMsgObject
          }
        }
      }
      this.$state.unMask()
    },
    async insertFile(id) {
      try {
        let formData = new FormData()
        for (let index = 0; index < this.fileModel.files.length; index++) {
          formData.append('Files', this.fileModel.files[index])
        }
        for (let index = 0; index < this.fileModel.images.length; index++) {
          formData.append('Images[]', this.fileModel.images[index].ImageId)
        }

        formData.append('ObjectId', id)
        const api = new fileApi()
        await api.insertImages(formData)
        this.model.Images = null
      } catch (error) {
        console.log(error)
      }
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
.editor {
  height: 200px !important;
}
</style>

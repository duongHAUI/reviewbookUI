<template>
  <div>
    <div class="book-review-content">
      <div class="book-review-user">
        <img :src="data.image_user_post" alt="" />
      </div>
      <div class="book-review-last-day">{{ convertToTimeAgo(data.created_at) }}</div>
      <div class="book-review-author">
        <span class="bold">{{ data.fullname }}</span> Review
        <span class="bold">{{ data.book_name }}</span>
      </div>
      <div class="book-review-rate m-t-12">
        <span>Đánh giá</span>
        <m-start-rate :startRate="data.avg_rate || 0" :fontSize="14" />
      </div>
      <div class="m-t-4"></div>
      <m-text-expanded :textValue="data.review_text" />
      <div class="m-t-4"></div>
      <div class="gr-book--large">
        <div class="gr-book--large-img">
          <img :src="data.image_book" alt="" />
        </div>
        <div class="gr-book--large-acction">
          <div class="gr-book--large-title">
            <a :href="`/book/${data.book_id}`" class="bold">{{ data.book_name }}</a>
          </div>
          <div class="m-t-4"></div>
          <div class="gr-book--large-author">
            by <a href="">{{ data.author_name }}</a>
            <div class="gr-icon--authorBadge"></div>
          </div>
          <div class="m-t-8"></div>
          <div class="option-book">
            <div class="option-want-book">
              <m-button
                v-if="!data.list_type"
                @click="updateListType(enumerate.StatusRead.WantToRead)"
                >Muốn đọc</m-button
              >
              <MCombobox
                v-else
                :data="listTypeBook"
                v-model="data.list_type"
                propName="value"
                propValue="id"
                icon="icon-drop-page-black"
                :locationList="0"
                :isReadonly="true"
                @selected="updateListType"
              />
            </div>
            <div class="review-rate-book flex">
              <span>Đánh giá sách: </span>
              <m-start-rate-review
                :fontSize="16"
                :startRate="data.user_rating"
                @onReview="onReview"
                :isNotReview="true"
              />
            </div>
          </div>
          <div class="m-t-8"></div>
          <m-text-expanded :textValue="data.description" />
        </div>
      </div>
      <div class="gr-book-footer-acction m-t-8">
        <span @click="likeUnLikeBookReview">{{ myUserLikePostId ? 'Bỏ thích' : 'Thích' }}</span>
        <span> · </span>
        <span>Bình luận</span>
      </div>
    </div>
    <div class="book-review-like-information">
      <span v-if="myUserLikePostId">Bạn</span>
      <span v-if="myUserLikePostId && listFirstLike[0]">,</span>
      <span v-if="listFirstLike && listFirstLike[0]">{{ listFirstLike[0]?.fullname }}</span>
      <span
        v-if="
          (myUserLikePostId && listFirstLike[0] ? data.count_like > 2 : false) ||
          (!myUserLikePostId && listFirstLike[0] ? data.count_like > 1 : false)
        "
      >
        và {{ data.count_like - 1 - (myUserLikePostId ? 1 : 0) }} người khác thích bài viết</span
      >
      <span v-if="this.data.count_like == 1 || (this.data.count_like == 2 && myUserLikePostId)">
        đã thích bài viết</span
      >
    </div>
    <div class="book-review-comments-section">
      <div class="book-review-comment-header" v-if="listCommentReviewPost?.length > 2">
        <span @click="viewAllComment">Xem tất cả {{ data.count_comment - 2 }} bình luận</span>
      </div>
      <div
        v-for="(comment, index) in listCommentReviewPost"
        :key="index"
        class="book-review-comment"
      >
        <div class="comment-timeAgo">{{ convertToTimeAgo(comment.created_at) }}</div>
        <div class="book-review-comment-user">
          <img :src="comment.image_user" class="book-review-user-avatar" alt="" />
          <div class="book-review-user-info">
            <span class="book-review-user-name">{{ comment.fullname }}</span>
          </div>
        </div>
        <div class="book-review-comment-text">
          {{ comment.comment_text }}
        </div>
      </div>
      <div class="book-review-cmt">
        <div class="book-review-comment-user">
          <img class="book-review-user-avatar" :src="$state.user.profile_picture" />
        </div>
        <div class="book-review-comment-input">
          <textarea placeholder="Viết bình luận..." v-model="newComment"></textarea>
          <button
            @click="newCommentReviewPost"
            :disabled="newComment ? false : true"
            class="book-review-comment-btn"
          >
            Bình luận
          </button>
        </div>
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
import MTextExpanded from '@/components/MTextExpanded.vue'
import MStartRate from '@/components/start/MStartRate.vue'
import MStartRateReview from '@/components/start/MStartRateReview.vue'
export default {
  props: {
    dataReviewPost: Object
  },
  components: {
    MStartRateReview,
    MTextExpanded,
    MCombobox,
    MStartRate,
    MButton
  },
  created() {
    if (this.data && this.data.likes) {
      var likes = JSON.parse(this.data.likes)
      if (likes && Array.isArray(likes)) {
        likes.forEach((like) => {
          if (like.user_id == this.$state.user.user_id) {
            this.myUserLikePostId = like.like_id
          } else {
            this.listFirstLike.push(like)
          }
        })
      }
    }
    if (this.data && this.data.comments) {
      var comments = JSON.parse(this.data.comments)
      if (comments && Array.isArray(comments)) {
        comments.forEach((comment) => {
          this.listCommentReviewPost.push(comment)
        })
      }
    }
  },
  data() {
    return {
      listTypeBook: constants.listTypeBook.filter((x) => x.id != '-1'),
      myUserLikePostId: undefined,
      listFirstLike: [],
      listCommentReviewPost: [],
      data: this.dataReviewPost,
      newComment: '',
      enumerate: enumD
    }
  },
  computed: {},
  methods: {
    async onReview(start) {
      try {
        if (this.data.user_rating != start) {
          const res = await new bookApi().UserReviewStartBook({
            book_id: this.data.book_id,
            user_id: this.$state.user.user_id,
            rating: start
          })
          if (res) {
            this.data.user_rating = start
            // Lấy lại đnáh giá trung bình
            const book = await new baseApi('Book').getById(this.data.book_id)
            if (book) {
              this.data.avg_rate = book.avg_rate
            }
            if (!this.data.list_type) {
              await this.updateListType(this.enumerate.StatusRead.Read)
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async likeUnLikeBookReview() {
      try {
        if (this.myUserLikePostId) {
          const res = await new baseApi('Like').remove([this.myUserLikePostId])
          if (res) {
            this.myUserLikePostId = undefined
            this.data.count_like = this.data.count_like - 1
          }
        } else {
          const res = await new baseApi('Like').create({
            review_id: this.data.review_id,
            user_id: this.$state.user.user_id
          })
          this.myUserLikePostId = res.Data
          this.data.count_like = this.data.count_like + 1
        }
      } catch (error) {
        console.log(error)
      }
    },
    async newCommentReviewPost() {
      try {
        let commentModel = {
          review_id: this.data.review_id,
          user_id: this.$state.user.user_id,
          fullname: this.$state.user.fullname,
          image_user: this.$state.user.profile_picture,
          comment_text: this.newComment
        }
        const res = await new baseApi('Comment').create(commentModel)
        if (res) {
          commentModel.comment_id = res.Data
          this.listCommentReviewPost.push(commentModel)
          this.data.count_comment += 1
          this.newComment = ''
        }
      } catch (error) {
        console.log(error)
      }
    },
    async updateListType(listType) {
      try {
        const res = await new bookApi().UpdateStatusRead({
          user_id: this.$state.user.user_id,
          list_type: listType,
          book_id: this.data.book_id,
          book_list_item_id: this.data.book_list_item_id || '00000000-0000-0000-0000-000000000000'
        })
        if (res) {
          this.data.list_type = listType
          if (res.Data) {
            this.data.book_list_item_id = res.Data
          } else {
            this.data.book_list_item_id = res
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    convertToTimeAgo(time) {
      return common.timeAgo(time)
    }
  }
}
</script>

<style scoped>
@import url(./book-review.css);
</style>

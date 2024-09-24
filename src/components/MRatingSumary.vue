<template>
  <div class="ratings-summary">
    <div class="rating-breakdown">
      <div class="rating-row" v-for="(count, index) in ratingCounts" :key="index">
        <span>{{ 5 - index }} Sao</span>
        <div class="rating-bar">
          <div class="fill" :style="{ width: (count / totalRatings) * 100 + '%' }"></div>
        </div>
        <span class="count"
          >{{ count.toLocaleString() }} ({{ ((count / totalRatings) * 100).toFixed(0) }}%)</span
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    averageRating: Number,
    totalRatings: Number,
    totalReviews: Number,
    totalRating1: Number,
    totalRating2: Number,
    totalRating3: Number,
    totalRating4: Number,
    totalRating5: Number
  },
  data() {
    return {
      ratingCounts: [
        this.totalRating5,
        this.totalRating4,
        this.totalRating3,
        this.totalRating2,
        this.totalRating1
      ] // Số lượng đánh giá từ 5 sao đến 1 sao
    }
  }
}
</script>
<style scoped>
.ratings-summary {
  max-width: 500px;
  font-family: Arial, sans-serif;
}

.average-rating {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.stars {
  display: flex;
  margin-right: 10px;
}

.star {
  width: 20px;
  height: 20px;
  background-color: #ffb400;
  margin-right: 5px;
  clip-path: polygon(
    50% 0%,
    61% 38%,
    98% 38%,
    68% 59%,
    79% 100%,
    50% 75%,
    21% 100%,
    32% 59%,
    2% 38%,
    39% 38%
  );
}

.half {
  background: linear-gradient(to right, #ffb400 50%, #ddd 50%);
}

.rating {
  font-size: 24px;
  font-weight: bold;
}

.details {
  margin-left: 10px;
  color: #555;
}

.rating-breakdown {
  margin-top: 20px;
}

.rating-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rating-row span {
  width: 60px;
}

.rating-bar {
  background-color: #ddd;
  width: 300px;
  height: 10px;
  margin: 0 10px;
  border-radius: 5px;
  overflow: hidden;
}

.fill {
  background-color: #ffb400;
  height: 100%;
  border-radius: 5px;
}

.count {
  color: #555;
}
</style>

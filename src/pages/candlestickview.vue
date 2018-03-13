<template>
  <div>
    <div class="top-box">
      <p class="top-label">Candlestick Chart</p>
    </div>
    <div class="main-box">
      <CandleStickChart></CandleStickChart>
    </div>
  </div>
</template>

<script>
import CandleStickChart from '../components/candlestickchart';
export default {
  components: {
    CandleStickChart,
  },
};
</script>

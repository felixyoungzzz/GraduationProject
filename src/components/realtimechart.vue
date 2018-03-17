<template>
  <div>
    <div class="realtime-chart hidden" v-bind:class="symbol">
    </div>
  </div>
</template>

<script>
import d3 from 'd3';
export default {
  props: ['symbol'],
  data() {
    return {
      daystockdata: [],
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.$on(this.symbol, function() {
        let item = document.querySelector('.' + this.symbol);
        if (item.className.includes('hidden')) {
          this.changetoshow();
        } else {
          this.changetohidden();
        }
      });
    });
  },
  methods: {
    changetoshow() {
      let item = document.querySelector('.' + this.symbol);
      setTimeout(() => {
        item.classList.remove('hidden');
      }, 50);
      setTimeout(() => {
        item.classList.add('show');
      }, 50);
    },
    changetohidden() {
      let item = document.querySelector('.' + this.symbol);
      setTimeout(() => {
        item.classList.remove('show');
      }, 50);
      setTimeout(() => {
        item.classList.add('hidden');
      }, 50);
    },
  },
};
</script>

<style>
.realtime-chart {
  transition: height 0.5s ease-in-out;
}

.hidden {
  height: 0px;
  visibility: hidden;
}

.show {
  height: 200px;
}
</style>

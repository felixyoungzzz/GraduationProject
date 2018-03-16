<template>
  <div>
    <div class="show"></div>
  </div>
</template>

<script>
export default {
  props: ['symbol'],
};
</script>

<style>
.hidden {
  height: 0px;
}

.show {
  height: 200px;
}
</style>

<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script> 
import ScreenFull from "screenfull";
export default {
  methods: {
    changeScreen() {
      if (!ScreenFull.isEnabled) {
        // console.log(123);
        return
      }
      ScreenFull.toggle();
    },
  },
};
</script>

<style>
</style>

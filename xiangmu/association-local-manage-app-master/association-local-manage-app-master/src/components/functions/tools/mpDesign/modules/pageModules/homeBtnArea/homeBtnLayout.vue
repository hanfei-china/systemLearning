<template>
  <div>
    <home-area-btn :list="list"></home-area-btn>
  </div>
</template>

<script>
import HomeAreaBtn from "../homeAreaBtn/homeAreaBtn";
export default {
  name: "homeBtnLayout",
  components: {HomeAreaBtn},
  props: {
    list: Array
  }
};
</script>
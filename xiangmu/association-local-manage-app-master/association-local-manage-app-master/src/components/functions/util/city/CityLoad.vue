<template>
  <div
      class="container">
    <div class="main">
      <span class="el-icon-loading"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "cityLoad",
}
</script>

<style scoped lang="less">
.container {
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  background-color: transparent;
  border-radius: 4px;
  overflow: hidden;

  .main {
    position: absolute;
    right: 0;
    top: 0;
    background-color: white;
    height: 100%;
    width: 35px;
    display: flex;
    align-items: center;
    justify-content: center
  }
}
</style>
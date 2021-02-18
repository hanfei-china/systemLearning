<template>
  <functions @privilege-loaded="loaded = true" @privilege-loading="loaded = false">
    <el-container class="absolute-fill-parent">
      <el-aside class="unset-padding position-relative console-menu-container" width="200px">
        <div class="absolute-fill-parent">
          <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
            <menus ref="menus"/>
          </vue-scroll>
        </div>
      </el-aside>
      <el-main class="unset-padding position-relative console-main">
        <div class="absolute-fill-parent ovauto">
          <router-view v-if="loaded"/>
        </div>
      </el-main>
    </el-container>
  </functions>
</template>

<script>
  import Menus from "./util/menu/Menus";
  import Functions from "./Functions";
  export default {
    name: "SideFunctions",
    components: {Functions, Menus},
    data(){
        return {
          loaded: false
        }
    },
  }
</script>

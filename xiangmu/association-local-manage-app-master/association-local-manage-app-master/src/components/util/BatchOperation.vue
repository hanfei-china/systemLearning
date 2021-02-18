<template>
  <div class="batch-operation-container display-flex">
    <div class="select-total" v-show="hasTotal">
      <slot name="selectTotal"></slot>
    </div>
    <div class="operate-tip">
      {{title}}
    </div>
    <ul>
      <slot></slot>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "BatchOperation",
    computed:{
      hasTotal(){
        return this.$slots.selectTotal;
      }
    },
    props:{
      title: {
        type: String,
        default(){
          return '批量操作';
        }
      }
    }
  }
</script>

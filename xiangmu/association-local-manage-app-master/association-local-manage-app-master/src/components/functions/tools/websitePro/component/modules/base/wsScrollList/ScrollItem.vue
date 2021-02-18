<template>
  <div class="ws-scroll-item" :style="itemStyle">
    <div class="scroll-item-left" v-html="leftDom"></div>
    <div class="scroll-item-right" v-html="rightDom"></div>
  </div>
</template>
<script>
import {formatDate} from "@/js/util/utilFunction";
export default {
  props: {
    item: Object,
    leftFormatArray: Array,
    rightFormatArray: Array,
    height: Number,
  },
  computed: {
    itemStyle () {
      return {
        height: (this.height || 24) + 'px',
        lineHeight: (this.height || 24) + 'px',
      }
    },
    leftDom () {
      return this.itemFormatter('left')
    },
    rightDom () {
      return this.itemFormatter('right')
    }
  },
  methods: {
    itemFormatter (type) {
      let item = this.item;
      let str = '';
      let formatArr = type == 'right' ? this.rightFormatArray : this.leftFormatArray;
      formatArr.forEach(propFormat => {
        let prop = '';
        if (/\|/.test(propFormat)) {
          let propArr = propFormat.split('|');
          prop = propArr.find(p => !!item[p])
        } else {
          prop = propFormat;
        }
        let propStr = item[prop] || '';
        if (prop == 'donationTime') {
          let date = new Date(item[prop]);
          propStr = formatDate(date, 'yyyy-MM-dd');
        } else if (prop == 'donationAmount') {
          propStr = (item[prop] || '') + '元';
        } else if (prop == 'title') {
          propStr = item[prop] ? `[${item[prop]}]` : '';
        }
        let propStyle='';
        switch (prop) {
          case 'donationAmount':
            propStyle = 'font-weight: bold;'
        }
        str += ` <span style="${propStyle}">${propStr}</span> `
      })
      return str;
    },
  }
}
</script>
<style scoped>
.ws-scroll-item {
  display: flex;
  justify-content: space-between;
}
.scroll-item-left {
  flex: 1 1 auto;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.scroll-item-right {
  flex: 1 0 auto;
  text-align: right;
}
</style>
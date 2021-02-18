<template>
  <el-cascader placeholder="下拉选择城市" :size="size" clearable v-model="copyValue" :props="lazyAreas" style="width: 100%;"/>
</template>

<script>

export default {
  name: "CityChoose",
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    showCity: {
      type: Boolean,
      default: false
    },
    size: String,
    checkStrictly: {
      type: Boolean,
      default: true
    },
    isToArea: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    lazyAreas() {
      return {
        checkStrictly: this.checkStrictly,
        lazy: true,
        lazyLoad: this.lazyLoad,
      }
    },
  },
  data() {
    return {
      copyValue: '',
      timer:null
    }
  },
  watch: {
    copyValue(val) {
      this.$emit('change', val);
    },
    value(val) {
      if (!this.copyValue || this.copyValue.length < 1) {
        this.copyValue = val;
      }
    },
  },
  methods: {
    lazyLoad(node, resolve) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getArea(node, resolve)
      },500)
    },
    getArea(node, resolve) {
      let params = {};
      if (node.level === 0) {
        params.level = 0
      } else {
        params.parentId = node.data.parentId
      }
      this.$request.get('/api/common/anon/worldArea', {
        params: params
      }).then(res => {
        if (res.success) {
          const nodes = res.data.map(item => ({
            value: item.name,
            label: item.name,
            parentId: item.id,
            leaf: node.level >= 2
          }))
          resolve(nodes)
        }

      })
    }
  }
}
</script>
<style lang="less" >
.el-cascader-node>.el-radio {
  display: none;
}
</style>

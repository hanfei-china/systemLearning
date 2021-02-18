<template>
  <el-cascader :placeholder="placeholder" :size="size" clearable v-model="copyValue" :props="lazyAreas"/>
</template>

<script>
export default {
  name: "CityChoose2",
  props: {
    placeholder: {
      type: String,
      default: '下拉选择城市'
    },
    value: Array | String,
    showCity: {
      type: Boolean,
      default: false,
    },
    size: String,
    checkStrictly: {
      type: Boolean,
      default: true,
    },
  },
  model: {
    prop: "value",
    event: "change",
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
  methods: {
    lazyLoad(node, resolve) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getArea(node, resolve)
      }, 500)
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
    },
    treeData(areaList) {
      for (var i = 0; i < areaList.length; i++) {
        if (areaList[i].children) {
          if (areaList[i].children.length == 0) {
            areaList[i].children = undefined;
          } else {
            for (var j = 0; j < areaList[i].children.length; j++) {
              areaList[i].children[j].children = undefined;
            }
          }
        }
      }
      return areaList;
    },
  },
  data() {
    return {
      copyValue: "",
      timer: null,
    };
  },
  watch: {
    copyValue(val) {
      if (this.showCity) {
        if( val[0]){
          var obj = {country: val[0], province: val[1]?val[1]:'', city: val[2]?val[2]:""};
          this.$emit("change", JSON.stringify(obj));
        }else {
          this.$emit("change", '');
        }

      } else {
        this.$emit("change", val[0]);
      }
    },
    value: {
      immediate: true,
      handler(val) {
        if (this.showCity) {
          if (val) {
            var valueObj = JSON.parse(val);
            if(valueObj.city){
              this.copyValue = [valueObj.country, valueObj.province, valueObj.city];
            }else if(valueObj.province){
              this.copyValue = [valueObj.country, valueObj.province];
            }else if(valueObj.country){
              this.copyValue = [valueObj.country];
            }
          } else {
            this.copyValue = "";
          }
        } else {
          this.copyValue = [val];
        }
      },
    },
  },
  mounted() {
    setInterval(function () {
      document.querySelectorAll('.el-cascader-node__label').forEach(el => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click()
        }
      })
    }, 1000)
  }
};
</script>
<style lang="less" >
.el-cascader-node>.el-radio {
  display: none;
}
</style>
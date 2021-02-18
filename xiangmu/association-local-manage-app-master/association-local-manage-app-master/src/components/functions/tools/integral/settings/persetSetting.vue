<template>
  <!-- <el-input v-model="initValue"
  :maxlength="attribute.maxLength" :placeholder="attribute.placeholder"/>-->
  <div>
    <div
      v-for="(item,index) in attribute.attributes"
      :key="index"
      style="display:flex;alignItems:center;"
    >
      <span style="color:#606266;margin:0 20px;">个人信息完善度达到</span>
      <el-input
        v-model="item.value.persent"
        size="mini"
        :maxlength="item.persent.maxLength"
        :style="{'width':item.persent.titleWidth}"
        :minlength="1"
        @change="persentChange(index)"
      >
        <template slot="append">%</template>
      </el-input>
      <span style="color:#606266;margin:0 20px;">即可获取积分值：</span>
      <el-input-number
        size="mini"
        v-model="item.value.integral"
        :placeholder="item.integral.placeholder"
        :max="item.integral.max?item.integral.max:1000000"
        :min="item.integral.min"
      />
      <i class="el-icon-remove-outline iconDelete" @click="delet(index)"></i>
      <i class="el-icon-circle-plus-outline iconAdd" @click="add(index)"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "persetSetting",
  props: {
    attribute: Object,
    value: Object
  },
  data() {
    return {
      // initValue: this.value
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  watch: {
    //   initValue(val) {
    //     if (val < 1) {
    //       this.initValue = "1";
    //     }
    //     this.$emit("change", val);
    //   }
    // "value.persent"(val) {
    //   if (val < 1) {
    //     this.value.persent = "";
    //   }
    // }
  },
  methods: {
    delet(index) {
      this.$confirm("此操作将删除此条规则, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.attribute.attributes.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    add(index) {
      var obj = {
        persent: {
          maxLength: 3,
          titleWidth: "110px"
        },
        integral: {
          max: Infinity,
          min: 1,
          titleWidth: 130
        },
        value: {
          persent: "90",
          integral: 10
        }
      };
      this.attribute.attributes.splice(index + 1, 0, obj);
    },
    persentChange(index) {
      if (this.attribute.attributes[index].value.persent > 0) {
        if (this.attribute.attributes[index].value.persent > 100) {
          this.attribute.attributes[index].value.persent = 100;
        } else {
          return;
        }
      } else {
        this.attribute.attributes[index].value.persent = 1;
      }
    }
  }
};
</script>

<style>
.iconDelete {
  margin: 10px;
  font-size: 18px;
  color: red;
  cursor: pointer;
}
.iconAdd {
  color: #3fa1b6;
  font-size: 18px;
  cursor: pointer;
}
</style>

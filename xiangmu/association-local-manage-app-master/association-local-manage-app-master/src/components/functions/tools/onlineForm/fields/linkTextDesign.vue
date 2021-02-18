<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-header class="flex flex-column flex-center border-bottom">
      <div class="flex">
        <div
          class="flex-fill-in-the-remaining-space flex flex-column flex-center"
          style="font-size: 16px;color: #333333;"
        >
          <div>
            <i class="el-icon-s-help" style="padding-right: 4px;font-size: 18px;" />关联字段设计
          </div>
        </div>
        <div>
          <el-button type="primary" size="small" @click="submitData">保存</el-button>
          <el-button type="danger" size="small" @click="closeLinkTextDesign">关闭</el-button>
        </div>
      </div>
    </el-header>
    <el-main class="unset-padding position-relative" v-if="formInfo">
      <div class="absolute-fill-parent">
        <vue-scroll>
          <div style="margin: 20px auto;width:85%;" class="box-shadow">
            <div>
              <div
                style="background-color: #F9FAFC;padding: 20px;"
                class="position-relative"
                v-show="adding"
              >
                <div
                  class="position-absolute"
                  style="top:10px;right: 10px;"
                  @click.stop="adding = false"
                >
                  <a style="font-size: 18px;" class="el-icon-close lrd-a hover-scale-bigger" />
                </div>
                <div class="flex" style="margin-top: 20px;">
                  <div
                    class="flex flex-column flex-center text-align-right"
                    style="width: 120px;"
                  >表单已有字段：</div>
                  <div class="flex-fill-in-the-remaining-space">
                    <!-- <template v-for="(item,index) of canBeLink"> -->
                    <el-button
                      v-for="(item,index) of canBeLink"
                      size="mini"
                      @click="addField(item,index)"
                      plain
                      style="margin-bottom:10px;"
                      :key="index"
                      :disabled="(item.belongAttribute&&item.belongAttribute.indexOf(field)>=0)?true:false"
                    >{{item.title}}</el-button>
                    <!-- </template> -->
                    <!-- <el-button size="mini" @click="addField({type:2,moduleName:'formTextarea'})" plain style="margin-bottom:10px;">+多行文本</el-button>
                                        <el-button size="mini" @click="addField({type:3,moduleName:'formDatePicker'})" plain style="margin-bottom:10px;">+日期时间</el-button>
                                        <el-button size="mini" @click="addField({type:4,moduleName:'formRadioGroup'})" plain style="margin-bottom:10px;">+单选</el-button>
                    <el-button size="mini" @click="addField({type:5,moduleName:'formCheckboxGroup'})" plain style="margin-bottom:10px;">+多选</el-button>-->
                  </div>
                </div>
              </div>
              <div class="text-align-center" style="padding: 20px;" v-show="!adding">
                <el-button type="primary" size="small" @click="adding = true" plain>+添加关联字段</el-button>
              </div>
            </div>
            <div ref="sort">
              <!-- <component v-for="(field,index) of formInfo" :ref="field.id"  @delete="deleteField(index)"
              :is="field.moduleName" :key="field.id" :field="field" />-->
              <div :key="index" v-for="(item,index) of linkArr" class="linkItem">
                <span>{{item.title}}</span>
                <i class="el-icon-delete" @click="deleteItem(item,index)"></i>
              </div>
            </div>
          </div>
        </vue-scroll>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import FormField from "./FormField";
import { commonFields } from "../js/fieldType";
import Sortable from "sortablejs";
import FormFileUpload from "../fields/FormFileUpload";
import Field from "../js/field";

export default {
  name: "linkTextDesign",
  components: {
    FormFileUpload
  },
  data() {
    return {
      formInfo: [],
      adding: false,
      commonFields,
      linkArr: [],
      num: 0,
      allfieldsInfo: {}
    };
  },
  created() {
    this.allfieldsInfo = JSON.parse(JSON.stringify(this.allfields));
    // this.ifMove();
    // this.allfieldsInfo.fields.forEach(item => {
    //   if (
    //     item.belongAttribute &&
    //     item.belongAttribute.indexOf(this.field) >= 0
    //   ) {
    //     this.linkArr.push(item);
    //   }
    // });
  },
  props: ["field", "selectIndex", "allfields", "parentID"],
  watch: {
    linkArr() {
      if (this.linkArr.length > 0) {
        this.adding = true;
      }
    },
    num(){
      this.ifMove();
    }
  },
  computed: {
    //可以被进行关联的字段列表
    canBeLink() {
      //   var num = 0;
      this.allfieldsInfo.fields.forEach((item, index) => {
        if (item.id === this.parentID) {
          this.num = index;
        }
      });
      var list = JSON.parse(JSON.stringify(this.allfieldsInfo.fields));
      var arr = list.splice(this.num + 1);
      return arr;
    }
  },
  methods: {
    //每次打开时（此组件新建时），都要判断之前是否移动，如果移动，那么信息就要重新刷新
    ifMove() {
      var flag = false;
      this.allfieldsInfo.fields.forEach((item, index) => {
        if (
          item.belongAttribute &&
          item.belongAttribute.length > 0 &&
          index < this.num
        ) {
          item.belongAttribute = [];
          //此时就需要对外部数据进行更新，为了避免频繁进行数据更新，添加一个开关
          flag = true;
        }
      });
      if (flag) {
        //对外进行数据更新
        this.$emit("updataInfo", this.allfieldsInfo);
      }
      //找到有效的关联的字段
      this.allfieldsInfo.fields.forEach(item => {
        if (
          item.belongAttribute &&
          item.belongAttribute.indexOf(this.field) >= 0
        ) {
          this.linkArr.push(item);
        }
      });
    },
    drag() {
      let el = this.$refs.sort;
      Sortable.create(el, {
        disabled: false,
        handle: ".item-sort",
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          let { oldIndex, newIndex } = evt;
          let copyValue = JSON.parse(JSON.stringify(this.formInfo.fields));

          if (oldIndex < newIndex) {
            let oldItem = copyValue[oldIndex];
            copyValue.splice(newIndex + 1, 0, oldItem);
            copyValue.splice(oldIndex, 1);
            this.sortFields(copyValue);
          }

          if (oldIndex > newIndex) {
            let oldItem = copyValue[oldIndex];
            copyValue.splice(newIndex, 0, oldItem);
            copyValue.splice(oldIndex + 1, 1);
            this.sortFields(copyValue);
          }
        }
      });
    },
    sortFields(fieldList) {
      this.formInfo.fields = fieldList;
    },
    submitData() {
      this.$emit("saveLinkText", this.num, this.canBeLink);
      this.$emit("close");
      //   this.formInfo = [];
      this.linkArr = [];
    },
    //直接关闭
    closeLinkTextDesign() {
      var that = this;
      this.$confirm("此操作将不保存修改, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // that.$emit("saveLinkText", that.num, that.canBeLink);
          that.$emit("close");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addField(fieldItem, index) {
      if (fieldItem.belongAttribute) {
        if (fieldItem.belongAttribute.indexOf(this.field) >= 0) {
          return;
        } else {
          fieldItem.belongAttribute.push(this.field);
          this.linkArr.push(fieldItem);
        }
      } else {
        var arr = [];
        arr.push(this.field);
        //   this.$set(this.canBeLink[index],'belongAttribute',JSON.parse(JSON.stringify(arr)))
        fieldItem.belongAttribute = JSON.parse(JSON.stringify(arr));
        this.linkArr.push(fieldItem);
      }
    },
    deleteField(index) {
      this.formInfo.splice(index, 1);
      if (this.formInfo.length < 1) {
        this.adding = true;
      }
    },
    deleteItem(field, num) {
      this.canBeLink.forEach((item, index) => {
        if (item.id === field.id) {
          this.canBeLink[index].belongAttribute.forEach((str, shu) => {
            if (str === this.field) {
              this.canBeLink[index].belongAttribute.splice(shu, 1);
            }
          });
        }
      });
      this.linkArr.splice(num, 1);
    }
  },
  mounted() {}
};
</script>


<style lang="less" scoped>
.linkItem {
  height: 40px;
  // color: red;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid #ccc;
}
.closeBtn {
  position: absolute;
  left: 35px;
  bottom: 20px;
}
</style>
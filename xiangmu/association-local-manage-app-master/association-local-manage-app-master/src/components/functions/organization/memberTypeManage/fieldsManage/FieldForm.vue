<template>
  <el-container>
    <el-main class="unset-padding" style="overflow: hidden;">
      <el-form size="small" label-width="120px">
        <el-form-item>
          <template v-slot:label>
            <div class="custom-el-form-item-label required">字段名称：</div>
          </template>
          <field-name :memberTypeId="memberTypeId" @change="getList" :list="list"></field-name>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer
      class="flex flex-center flex-column unset-padding"
      height="auto"
      style="padding-top: 16px !important;"
    >
      <div class="flex flex-end">
        <el-button
          icon="el-icon-error"
          type="danger"
          size="small"
          @click="associatedFieldsDialog = false"
        >取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="bindingFields">确定</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import FieldName from "./FieldName";
export default {
  name: "FieldForm",
  components: { FieldName },
  props: ["memberTypeId", "associatedFields", "fieldListLength"],
  data() {
    return {
      list: [], //会员类型的id多选
      associatedFieldsDialog: this.associatedFields //弹窗
    };
  },
  model: {
    prop: "associatedFields",
    event: "change"
  },
  watch: {
    associatedFieldsDialog(val) {
      this.$emit("change", val);
    }
  },
  methods: {
    //绑定的list
    getList(val) {
      this.list = val;
      //   console.log(this.list);
    },

    bindingFields() {
      if (!this.list) {
        this.$message.warning("请选择关联字段");
        return;
      }
      var selectList = JSON.parse(JSON.stringify(this.list));
      var arr = [];
      var num = -1;
      var isGroup = false;
      selectList.forEach((item, index) => {
          if (item.indexOf(",") > 0) {
            arr = item.split(",");
            num = index;
            isGroup=true;
          }
        });
      if (isGroup) {
        // console.log(selectList);
        selectList.splice(num, 1, ...arr);
        // console.log(selectList);
      }
        this.$request
          .post("/api/admin/memberType/bindingFields", {
            fieldIds: selectList,
            memberTypeId: this.memberTypeId,
            seq: this.fieldListLength
          })
          .then(res => {
            if (res.success) {
              this.$message.success("关联成功");
              this.associatedFieldsDialog = false;
              this.$emit("refresh");
            }
          });
    }
  }
};
</script>

<style scoped>
</style>

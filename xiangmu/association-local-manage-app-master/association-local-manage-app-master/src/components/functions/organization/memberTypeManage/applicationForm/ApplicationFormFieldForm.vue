<template>
  <el-container>
    <el-main class="unset-padding" style="overflow: hidden;">
      <el-form size="small" label-width="120px">
        <el-form-item>
          <template v-slot:label>
            <div class="custom-el-form-item-label required">关联字段：</div>
          </template>
          <application-form-field-choose
            style="width: 100%;"
            v-model="memberTypeFieldIds"
            :form-id="formId"
          />
        </el-form-item>
        <!-- <el-form-item>
          <template v-slot:label>
            <div class="custom-el-form-item-label">其他设置：</div>
          </template>
          <el-checkbox v-model="isMatch">作为匹配字段</el-checkbox>
        </el-form-item> -->
      </el-form>
    </el-main>
    <el-footer
      class="flex flex-center flex-column unset-padding"
      height="auto"
      style="padding-top: 16px !important;"
    >
      <div class="flex flex-end">
        <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import ApplicationFormFieldChoose from "./ApplicationFormFieldChoose";
export default {
  name: "ApplicationFormFieldForm",
  components: { ApplicationFormFieldChoose },
  props: {
    formId: String,
    seq: Number
  },
  data() {
    return {
      memberTypeFieldIds: [],
      isMatch: false
    };
  },
  methods: {
    submitData() {
      if (!this.memberTypeFieldIds || this.memberTypeFieldIds.length < 1) {
        this.$message.warning("请关联最少一个字段");
        return;
      }
    //   console.log(this.memberTypeFieldIds);
      var selectList = JSON.parse(JSON.stringify(this.memberTypeFieldIds));
      var arr = [];
      var num = -1;
      var isGroup = false;
      selectList.forEach((item, index) => {
        if (item.indexOf(",") > 0) {
          arr = item.split(",");
          num = index;
          isGroup = true;
        }
      });
      if (isGroup) {
        // console.log(selectList);
        selectList.splice(num, 1, ...arr);
        // console.log(selectList);
      }
      let data = {
          memberTypeFieldIds: selectList,
          isMatch: this.isMatch,
          applicationFormId: this.formId,
          seq: this.seq
      };

      this.$request.post('/api/admin/applicationForm/applicationBindingField',data).then(()=>{
          this.$message.success('字段关联成功');
          this.$emit('refresh');
          this.$emit('close');
      })
    }
  }
};
</script>

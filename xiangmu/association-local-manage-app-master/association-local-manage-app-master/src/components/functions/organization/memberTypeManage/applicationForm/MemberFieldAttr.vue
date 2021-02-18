<template>
  <el-container>
    <el-main class="unset-padding position-relative">
      <div v-if="data">
        <div class="rows" v-if="data.topicType === 9">
          允许增加多条数据： <el-switch v-model="data.isMultiple" @change="editField(data, 'isMultiple')"></el-switch>
        </div>
        <div class="member-field-switches" v-else>
          <div class="rows">字段必填： <el-switch v-model="data.necessary" @change="editField(data, 'necessary')"></el-switch></div>
          <!-- <template v-if="data.topicType !== 14">
            <div class="rows">允许会员自行修改: <el-switch v-model="data.selfModify" @change="editField(data, 'selfModify')"></el-switch></div>
          </template>
          <div class="rows">隐私字段: <el-switch v-model="data.onlyAdmin" @change="editField(data, 'onlyAdmin')"></el-switch></div> -->
        </div>
      </div>
      
      <div class="nofield" v-else>请选择一个字段</div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "MemberFieldForm",
  props: {
    data: Object
  },
  data() {
    return {
    };
  },

  methods: {
    editField(field, propName) {
      var params = {
        formFieldId:field.formFieldId,
        [propName]: field[propName]
      };
      this.$request.put('/api/admin/applicationForm/formField', params).then(res => {
        if (res.success) {
          this.$message.success('修改成功')
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
.nofield{
  color: #999;
  text-align: center;
  margin-top: 30px;
}
.rows{
  margin-top: 10px;
  margin-left: 10px;
}
</style>
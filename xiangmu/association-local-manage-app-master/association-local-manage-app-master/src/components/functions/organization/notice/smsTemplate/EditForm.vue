<template>
  <el-container class="unset-padding">

    <el-main class="unset-padding">
      <div class="flex-fill-in-the-remaining-space">
        <vue-scroll>
          <el-form size="small">
            <div class="flex flex-space-between padding-bottom">
              <div style="width: 80px"><i class="el-icon-warning" style="color: #E6A23C;margin-right: 5px"></i>提示：</div>
              <p class="flex-fill-in-the-remaining-space" style="padding-right: 50px" v-html="tips"></p>
            </div>
            <el-form-item label="模板名称：" required>
              <el-input maxlength="50" show-word-limit v-model="title"/>
            </el-form-item>
            <el-form-item label="模板内容：" required>
              <div>
                <div class="flex flex-end ovhidden" style="margin-bottom: 5px">
                  <span>添加字段：</span>
                  <el-select
                      style="width: 160px"
                      v-model="fieldSelect"
                      @change="selectFields"
                  >
                    <el-option
                        v-for="item in fieldList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                    />
                  </el-select>
                </div>
                <div>
                  <el-input
                      type="textarea"
                      maxlength="500"
                      resize="none"
                      show-word-limit
                      :autosize="{ minRows: 3, maxRows:6 }"
                      v-model="content"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item label="申请说明：" required>
              <el-input
                  type="textarea"
                  maxlength="100"
                  resize="none"
                  show-word-limit
                  :autosize="{ minRows: 3, maxRows:6 }"
                  v-model="description"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
    </el-main>
    <el-footer class="flex flex-center flex-column unset-padding" height="auto" style="padding-top: 16px !important;">
      <div class="flex flex-end">
        <el-button size="small" icon="el-icon-circle-close" type="danger" @click="$emit('close')">取消</el-button>
        <el-button size="small" v-if="editItem.applyStatus===3||Object.keys(editItem).length===0" type="primary" plain @click="templateSubmit('cache')">保存</el-button>
        <el-button size="small" icon="el-icon-circle-check" type="primary" @click="templateSubmit('')">提交</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>

export default {
  name: "editForm",
  props: {
    editItem: {
      type: Object
    }
  },
  data() {
    return {
      tips: "1.短信模版内容中可插入随接收对象而变化的变量字段，显示为 “${姓名}、${手机号}”等。<br>" +
          "2.短信字数含“签名+模版内容+变量内容”，短信70个字数含以内，按1条短信计费；超出70个字为长短信，按照67个字数记为1条短信费用；一条长短信长度最长为500字（分为8条）。",
      fieldList: [],
      fieldSelect: "",
      title: '',
      content: '',
      description: ''
    }
  },
  methods: {
    // 获取活动字段
    getFieldList() {
      let list = [];
      this.$request
          .get("/api/common/associator/getFieldsInfo")
          .then((res) => {
            if (res.success) {
              list = res.data;
              for (let i = 0; i < list.length; i++) {
                if (list[i].topicType === 9) {
                  list.splice(i, 1);
                }
              }
              this.fieldList = list.filter((item) => {
                return [0, 1, 2].includes(item.groupId);
              });
            }
          });
    },
    // 插入活动字段
    selectFields() {
      for (let item of this.fieldList) {
        if (item.id === this.fieldSelect) {
          let temp = ' ${' + item.code + '} ';
          this.content +=temp
        }
      }
    },
    // 保存/提交
    templateSubmit(str) {
      if (!this.title) {
        this.$message.warning("请输入模版名称");
        return;
      }
      if (!this.content) {
        this.$message.warning("请输入模板内容");
        return;
      }
      if (!this.description) {
        this.$message.warning("请输入模板说明");
        return;
      }
      let params = {
        remark: this.description,
        submitType: str === 'cache' ? 1 : 2,
        templateContent: this.content,
        templateName: this.title
      };
      if (Object.keys(this.editItem).length) {
        params.id = this.editItem.id;
        this.$request
            .put("/api/admin/emailTelPhone/updateMessageTemplate", params)
            .then(() => {
              this.$message.success(str === 'cache'?'模版保存成功':"模版提交成功");
              this.$emit("refresh");
              this.$emit("close");
            });
      } else {
        this.$request
            .post("/api/admin/emailTelPhone/addMessageTemplate", params)
            .then(() => {
              this.$message.success(str === 'cache'?'模版保存成功':"模版提交成功");
              this.$emit("refresh");
              this.$emit("close");
            });
      }


    }
  },
  created() {
    this.getFieldList()
  },
  mounted() {
    if (Object.keys(this.editItem).length) {
      this.title = this.editItem.templateName;
      this.content = this.editItem.templateContent;
      this.description = this.editItem.remark;
    }
  }
}
</script>

<style scoped>

</style>
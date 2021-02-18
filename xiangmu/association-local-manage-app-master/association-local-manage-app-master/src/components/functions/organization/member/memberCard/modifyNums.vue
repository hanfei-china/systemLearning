<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="修改项目">
        <el-select @change="changeField" v-model="form.fieldId" placeholder="请选择修改项">
          <el-option v-for="item in selectList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <!-- 单行文本 -->
      <el-form-item label="修改内容" v-if="selectItem.topicType === 0">
        <el-input v-model="form.content"></el-input>
      </el-form-item>
      <!-- 单选值 -->
      <el-form-item label="修改内容" v-if="selectItem.topicType === 2">
        <el-select v-model="form.content" placeholder="请选择修改项">
          <template v-if="selectItem.code=='education'">
            <el-option v-for="item in educationList" :key="item.key" :label="item.title" :value="item.title"></el-option>
          </template>
          <template v-else>
            <el-option v-for="item in selectItem.parameter.options" :key="item.key" :label="item.title" :value="item.title"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <!-- 时间日期 -->
      <el-form-item label="修改内容" v-if="selectItem.topicType === 5">
        <el-date-picker
          v-model="form.content"
          :type="(selectItem.parameter&&selectItem.parameter.dateType)?selectItem.parameter.dateType:'date'"
          placeholder="选择日期"
          :value-format="(selectItem.parameter&&selectItem.parameter.dateType&&selectItem.parameter.dateType=='year')?'yyyy':'yyyy-MM-dd'"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="closeSub">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "modifyNums",
  props: ["selectList","educationList"],
  data() {
    return {
      props: {
        label: "title",
        value: "title",
        children: "subCategoryList"
      },
      form: {
        content: "",
        fieldId: ""
      },
    };
  },
  computed: {
    selectItem() {
      var code = this.form.fieldId;
      var itemVal = {};
      this.selectList.some(item => {
        if (item.code === code) {
          itemVal = item;
          return true;
        }
      });
      return itemVal;
    }
  },
  methods: {
    changeField(){
      this.form.content=""
    },
    onSubmit() {
      if (!this.form.content) {
        this.$message({
          message: "请填写修改内容",
          type: "warning"
        });
        return;
      }
      if (!this.form.fieldId) {
        this.$message({
          message: "请选择修改项",
          type: "warning"
        });
        return;
      }
      this.form.content = String(this.form.content);
      this.$emit("selectItem", this.form);
      this.form = {
        content: "",
        fieldId: ""
      };
    },
    closeSub() {
      this.form = {
        content: "",
        fieldId: ""
      };
      this.$emit("close");
    }
  }
};
</script>

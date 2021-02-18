<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="修改项目">
        <el-select @change="changeField" v-model="form.fieldId" placeholder="请选择修改项">
          <el-option
            v-for="item in formList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 单行文本 -->
      <el-form-item label="修改内容" v-if="selectItem.topicType === 0">
        <el-input v-model="form.content"></el-input>
      </el-form-item>
      <!-- 单选值 -->
      <el-form-item label="修改内容" v-if="selectItem.topicType === 2">
        <el-select v-model="form.content" placeholder="请选择修改项">
          <template>
            <el-option
            v-for="item in selectItem.parameter.options"
            :key="item.key"
            :label="item.title"
            :value="item.title"
          ></el-option>
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
      <!-- 行业 -->
      <el-form-item label="修改内容" v-if="selectItem.topicType === 20">
        <el-cascader
          :show-all-levels="false"
          placeholder="下拉选择行业"
          filterable
          v-model="form.content"
          :options="industryList"
          :props="props"
        />
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
  props: ["selectList"],
  data() {
    return {
      props: {
        label: "title",
        value: "title",
        children: "subCategoryList"
      },
      industryList: [],
      form: {
        content: "",
        fieldId: ""
      },
      textArr: [] //测试用，与业务无关
    };
  },
  watch: {
    //监控用户的选择动作---日期做处理
    // 'form.content'() {
    //   if (this.selectItem.topicType===5) {
    //     console.log(this.form.content)
    //     // console.log(new Date(this.form.content))
    //     // this.form.content=new Date(this.form.content);
    //   }
    // }
  },
  created() {
    this.$request
      .get("/api/admin/organization/category/listOrganizationCategory")
      .then(res => {
        this.industryList = this.treeData(res.data);
      });
  },
  computed: {
    formList() {
      var arr = [];
      this.selectList.forEach(item => {
        if (item.topicType === 5) {
          this.textArr.push(item);
        }
        if (
          (item.topicType === 0 ||
            item.topicType === 2 ||
            item.topicType === 5 ||
            item.topicType === 20) &&
          !item.notEdit
        ) {
          arr.push(item);
        }
      });
      return arr;
    },
    selectItem() {
      var code = this.form.fieldId;
      var itemVal = {};
      this.formList.some(item => {
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
    treeData(areaList) {
      for (var i = 0; i < areaList.length; i++) {
        if (areaList[i].subCategoryList) {
          if (areaList[i].subCategoryList.length == 0) {
            areaList[i].subCategoryList = undefined;
          } else {
            this.treeData(areaList[i].subCategoryList);
          }
        }
      }
      return areaList;
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
      var fieldValues = JSON.parse(JSON.stringify(this.form))

      if(fieldValues.fieldId=="industry"){
        if(fieldValues.content&&fieldValues.content.length&&(typeof fieldValues.content!=="string")){
          fieldValues.content = fieldValues.content[fieldValues.content.length-1]
        }
      }else{
        fieldValues.content = String(fieldValues.content);
      }
      this.$emit("selectItem", fieldValues);
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

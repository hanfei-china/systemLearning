<template>
  <div>
    <template v-if="isComposeField">
      <el-select ref="component" v-if="fieldType === 2" size="small" v-model="copyValue" @visible-change="visibleChange" :disabled="disabled" clearable style="width: 100%;">
        <template v-if="code=='education'">
          <el-option v-for="option of educationOptions" :key="option.key" :value="option.key" :label="option.title" />
        </template>
        <template v-else-if="code=='college'">
          <el-option v-for="option of collegeOptions" :key="option.key" :value="option.key" :label="option.title" />
        </template>
        <template v-else-if="code=='major'">
          <el-option v-for="option of majorOptions" :key="option.key" :value="option.key" :label="option.title" />
        </template>
      </el-select>
      <el-date-picker
        ref="component"
        placeholder="请选择"
        :picker-options="pickerOptions"
        v-else-if="fieldType === 5"
        :disabled="disabled"
        size="small"
        :type="parameter.dateType"
        v-model="copyValue"
        style="width: 100%;"
      ></el-date-picker>
    </template>

    <template v-else>
  <el-input
    v-if="fieldType === 0 || fieldType === 1|| (fieldType === 13&&!config.isGroup)"
    size="small"
    :disabled="disabled"
    v-model="copyValue"
    placeholder="请输入"
    clearable
  />
  <el-select
    ref="component"
    v-else-if="fieldType === 2"
    size="small"
    v-model="copyValue"
    :disabled="disabled"
    clearable
    style="width: 100%;"
  >
    <el-option
      v-for="option of parameter.options"
      :key="option.key"
      :value="option.key"
      :label="option.title"
    />
  </el-select>
  <el-select
    ref="component"
    v-else-if="fieldType === 3"
    :disabled="disabled"
    clearable
    size="small"
    multiple
    v-model="copyValue"
    style="width: 100%;"
  >
    <el-option
      v-for="option of parameter.options"
      :key="option.key"
      :value="option.key"
      :label="option.title"
    />
  </el-select>
  <city-choose
    ref="component"
    v-else-if="fieldType === 6"
    v-model="copyValue"
    :show-city="parameter.cityType === 'city'"
  />
  <el-cascader
    ref="component"
    size="small"
    v-else-if="fieldType === 8"
    :disabled="disabled"
    clearable
    v-model="copyValue"
    :options="options"
    :props="props"
    style="width: 100%;"
  />
  <el-date-picker
    ref="component"
    placeholder="请选择"
    :picker-options="pickerOptions"
    v-else-if="fieldType === 5&&!config.isGroup"
    :disabled="disabled"
    size="small"
    :type="parameter.dateType"
    v-model="copyValue"
    style="width: 100%;"
  ></el-date-picker>
  <el-date-picker
    ref="component"
    placeholder="请选择"
    :picker-options="pickerOptions"
    v-else-if="fieldType === 5&&config.isGroup"
    :disabled="disabled"
    size="small"
    type="year"
    v-model="copyValue"
    style="width: 100%;"
    value-format="timestamp"
    format="yyyy"
  ></el-date-picker>
  <image-upload
    :attributes="{maxSize: 2 * 1024 * 1024}"
    unrestricted
    v-else-if="fieldType === 4"
    v-model="copyValue"
  />
  <member-detail-edit-field
    ref="children"
    v-else-if="fieldType === 9"
    :code="code"
    :config="config"
  />
  <el-rate v-else-if="fieldType === 11" show-text :disabled="disabled" v-model="copyValue"></el-rate>
  <label-choose v-else-if="fieldType === 12" v-model="copyValue" style="width: 100%;"></label-choose>
  <unit-choose style="width: 100%;" v-else-if="fieldType === 10" v-model="copyValue" />
  <el-select
    ref="component"
    v-else-if="fieldType === 13&&config.isGroup"
    :disabled="disabled"
    clearable
    size="small"
    v-model="copyValue"
    style="width: 100%;"
    no-data-text="请先选择入学日期"
  >
    <el-option
      v-for="option of scoolInfo"
      :key="option.id"
      :value="option.id"
      :label="option.college"
    />
  </el-select>

  <el-select
    ref="component"
    v-else-if="fieldType === 15"
    size="small"
    v-model="copyValue"
    :disabled="disabled"
    clearable
    style="width: 100%;"
  >
    <el-option v-for="option of memberTypeList" :key="option.id" :value="option.id" :label="option.typeName"/>
  </el-select>
  </template>
  </div>
</template>

<script>
import ImageUpload from "../../../../../util/ImageUpload";
import CityChoose from "../../../../util/city/CityChoose";
import UnitChoose from "../../../../util//member/UnitChoose";
import LabelChoose from "../../../../util/memberLabel/LabelChoose";
export default {
  name: "MemberEditField",
  components: {
    LabelChoose,
    UnitChoose,
    CityChoose,
    ImageUpload,
    MemberDetailEditField: () => import("./MemberDetailEditField")
  },
  props: ["value", "config", "code", "disabled", "scoolInfo","isComposeField","parentIndex","memberFields","itemindex"],
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      copyValue: null,
      options: [],
      props: {
        label: "enumName",
        value: "enumName",
        children: "subLayer"
      },
      showList: [], //组合字段中就读学院的展示列表
      // schoolList:[]       //通过入学时间获取到的学院列表---要传给父组件，然后由父组件传入到学院组件中（本组件）
      memberTypeList:[],
      educationOptions:[],
      collegeOptions:[],
      majorOptions:[]
    };
  },
  computed: {
    fieldType() {
      return this.config.topicType;
    },
    parameter() {
      return this.config.parameter;
    },
    enumId() {
      return this.config.parameter && this.config.parameter.enumId
        ? this.config.parameter.enumId
        : null;
    },
    maxDate() {
      return this.config.parameter && this.config.parameter.maxDate
        ? this.config.parameter.maxDate
        : null;
    },
    minDate() {
      return this.config.parameter && this.config.parameter.minDate
        ? this.config.parameter.minDate
        : null;
    },
    pickerOptions() {
      let that = this;
      return {
        disabledDate(time) {
          if (that.minDate && that.maxDate) {
            return (
              time.getTime() < that.minDate || time.getTime() > that.maxDate
            );
          } else if (that.minDate && !that.maxDate) {
            return time.getTime() < that.minDate;
          } else if (!that.minDate && that.maxDate) {
            return time.getTime() > that.maxDate;
          } else {
            return time.getTime() > Date.now();
          }
        }
      };
    }
  },
  methods: {
    visibleChange(val){
      if(val){
        if(this.code=="education"){  // 学历
          this.$request.get('/api/common/associator/historyCollege/educations').then(res=>{
            this.educationOptions = res.data;
          })
        }else if(this.code=="graduationDate"){  //毕业年
          // for (var i=0;i<this.memberFields[this.parentIndex].detailList.length;i++) {
          //   if(this.memberFields[this.parentIndex].detailList[i].code=="education"){
          //     var education = this.memberFields[this.parentIndex].detailList[i].value?this.memberFields[this.parentIndex].detailList[i].value:""
          //     break;
          //   }
          // }
          // this.$request.get('/api/common/associator/historyCollege/years',{params:{education}}).then(res => {
          //   this.graduationDateOptions = res.data;
          // })
        }else if(this.code=="college"){  //学院
          for (var i=0;i<this.memberFields[this.parentIndex].detailList.length;i++) {
            if(this.memberFields[this.parentIndex].detailList[i].code=="education"){
              var education = this.memberFields[this.parentIndex].detailList[i].value?this.memberFields[this.parentIndex].detailList[i].value:""
            }
            if(this.memberFields[this.parentIndex].detailList[i].code=="graduationDate"){
              var year = this.memberFields[this.parentIndex].detailList[i].value?this.memberFields[this.parentIndex].detailList[i].value:""
            }
          }
          this.$request.get('/api/common/associator/historyCollege/colleges',{params:{education,year}}).then(res => {
            this.collegeOptions = res.data;
          })
        }else if(this.code=="major"){  //专业
          for (var i=0;i<this.memberFields[this.parentIndex].detailList.length;i++) {
            if(this.memberFields[this.parentIndex].detailList[i].code=="education"){
              var education = this.memberFields[this.parentIndex].detailList[i].value?this.memberFields[this.parentIndex].detailList[i].value:""
            }
            if(this.memberFields[this.parentIndex].detailList[i].code=="graduationDate"){
              var year = this.memberFields[this.parentIndex].detailList[i].value?this.memberFields[this.parentIndex].detailList[i].value:""
            }
            if(this.memberFields[this.parentIndex].detailList[i].code=="college"){
              var college = this.memberFields[this.parentIndex].detailList[i].value?this.memberFields[this.parentIndex].detailList[i].value:""
            }
          }
          this.$request.get('/api/common/associator/historyCollege/majors',{params:{education,year,college}}).then(res => {
            this.majorOptions = res.data;
          })
        }
      }
    },
    deleteSublayer(array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i]["subLayer"].length === 0) {
          delete array[i]["subLayer"];
        } else {
          this.deleteSublayer(array[i]["subLayer"]);
        }
      }
      return array;
    },
    hidden() {
      if (this.$refs.component) {
        if (this.$refs.component.pickerVisible) {
          this.$refs.component.pickerVisible = false;
        }

        if (this.$refs.component.dropDownVisible) {
          this.$refs.component.dropDownVisible = false;
        }

        if (this.$refs.component.visible) {
          this.$refs.component.visible = false;
        }
      }

      if (this.$refs.children) {
        this.$refs.children.hidden();
      }
    }
  },
  created() {
    // if (this.value) {
    //   if (this.config.topicType === 5 && this.config.isGroup) {
    //     this.copyValue = this.value - 0;
    //   } else {
    //     this.copyValue = this.value;
    //   }
    // }
    if(this.config.topicType == 15){
      this.$request.get('/api/admin/memberType/getMemberTypes').then(res=>{
        this.memberTypeList = res.data;
      })
    }
    if (this.enumId) {
      this.$request
        .get("/api/common/associator/getEnumNodes", {
          params: { enumId: this.enumId }
        })
        .then(data => {
          if (data.success) {
            let options = data.data;
            this.options = this.deleteSublayer(options);
          }
        });
    }
    if(this.config.code == "education"&&this.config.parameter.options.length){
      this.educationOptions  = this.config.parameter.options
    }
    if(this.config.code == "college"&&this.config.parameter.options.length){
      this.collegeOptions  = this.config.parameter.options
    }
    if(this.config.code == "major"&&this.config.parameter.options.length){
      this.majorOptions  = this.config.parameter.options
    }
  },
  watch: {
    value:{
      handler(val){
        this.copyValue = val;
      },
      immediate:true
    },
    copyValue(value) {
      this.$emit("change", value);
      if(this.isComposeField){
        for(var i=this.itemindex+1;i<this.memberFields[this.parentIndex].detailList.length;i++){
          if(this.memberFields[this.parentIndex].detailList[i].topicType==2||this.memberFields[this.parentIndex].detailList[i].code=="graduationDate"){
            this.$emit("changeMemberFieldsDetail",this.parentIndex,i,"")
          }
        }
      }
      //当为组合字段且事件发生改变时，去调用接口获取数据
      // if (this.config.topicType === 5 && this.config.isGroup) {
      //   console.log(this.value);
      //   if (!this.value) {
      //     var year = new Date().getFullYear();
      //   } else {
      //     var date = new Date(this.value);
      //     var year = date.getFullYear();
      //   }
      //   console.log(year);

      //   this.$request
      //     .get("/api/common/associator/getCollegeInfoByYear", {
      //       params: { year: year - 0 }
      //     })
      //     .then(res => {
      //       // console.log(res)
      //       if (res.success) {
      //         // this.schoolList = res.data;
      //         this.$emit("getSchool", res.data);
      //       }
      //     });
      // }
    },
  }
};
</script>

<template>
  <div>
    <template v-if="isComposeField">
      <el-select ref="component" v-if="fieldType === 2" size="mini" v-model="copyValue" @change="changeSelect" @visible-change="visibleChange" :disabled="disabled" clearable style="width: 100%;">
        <template v-if="code=='college'">
          <el-option v-for="(option,index) of collegeOptions" :key="index" :value="option.title" :label="option.title" />
        </template>
        <template v-else-if="code=='major'">
          <el-option v-for="(option,index) of majorOptions" :key="index" :value="option.title" :label="option.title" />
        </template>
      </el-select>
      <el-date-picker placeholder="请选择" value-format="yyyy" v-else-if="fieldType === 5" :disabled="disabled"  size="mini" type="year" v-model="copyValue" @change="changeSelect" style="width: 100%;"></el-date-picker>
      <el-input v-else
      size="mini"
      :disabled="disabled"
      v-model="copyValue"
      placeholder="请输入"
      clearable
    />
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
  props: ["value", "config", "code", "disabled","isComposeField","parentIndex","memberFields","itemindex","experienceType","studentExperienceObj"],
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
        if(this.code=="college"){  //学院
          var education=this.experienceType,year=this.studentExperienceObj.graduationDate?this.studentExperienceObj.graduationDate:"";
          this.$request.get('/api/common/associator/historyCollege/colleges',{params:{education,year}}).then(res => {
            this.collegeOptions = res.data;
          })
        }else if(this.code=="major"){  //专业
          var education=this.experienceType,year=this.studentExperienceObj.graduationDate?this.studentExperienceObj.graduationDate:"",college=this.studentExperienceObj.college?this.studentExperienceObj.college:"";
          this.$request.get('/api/common/associator/historyCollege/majors',{params:{education,year,college}}).then(res => {
            this.majorOptions = res.data;
          })
        }
      }
    },
    changeSelect(){
      if(this.isComposeField&&this.memberFields[this.itemindex].needClear){
        for(var i=this.itemindex+1;i<this.memberFields.length;i++){
          if(this.memberFields[i].needClear){
            this.$emit("changeMemberFieldsDetail",this.memberFields[i].code)
          }
        }
      }
    }
  },
  created() {
    if(this.config.topicType == 15){
      this.$request.get('/api/admin/memberType/getMemberTypes').then(res=>{
        this.memberTypeList = res.data;
      })
    }
  },
  watch: {
    value:{
      handler(val){
        this.copyValue = val;
      },
      immediate:true
    },
    parentIndex(val){
      console.log(val)
    },
    copyValue(value) {
      // console.log(value,this.parentIndex)
      this.$emit("change", value);
      // if(this.isComposeField&&this.memberFields[this.itemindex].needClear){
      //   for(var i=this.itemindex+1;i<this.memberFields.length;i++){
      //     if(this.memberFields[i].needClear){
      //       this.$emit("changeMemberFieldsDetail",this.memberFields[i].code)
      //     }
      //   }
      // }
    },
  }
};
</script>

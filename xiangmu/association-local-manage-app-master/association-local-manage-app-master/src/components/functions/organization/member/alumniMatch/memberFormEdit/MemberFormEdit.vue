<template>
  <el-container class="absolute-fill-parent border-top cusdia" v-loading="loading">
    <div class="elheader">
      <div class="headtitle">{{memberId?"编辑校友":"新建校友"}}</div>
      <div>
        <el-button size="small" @click="$emit('close')">关闭</el-button>
        <el-button size="small" @click="saveField">保存</el-button>
      </div>
    </div>
    <el-header height="50px"></el-header>
    <el-main class="unset-padding position-relative">
      <vue-scroll @handle-scroll="click">
        <div style="padding: 20px;">
          <div class="fieldbox">
            <h5>基本信息</h5>
            <div class="rows">
              <div class="rowpart" v-for="(item,index) in basicFieldList" :key="index">
                <span>
                  <i style="color: #f56c6c;margin-right: 4px;" v-if="item.necessary">*</i>
                  {{item.name}}：
                </span>
                <div>
                  <el-date-picker
                    style="width:100%;"
                    size="mini"
                    v-if="item.topicType==5"
                    v-model="model[item.code]"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                  <city-choose
                    size="mini"
                    v-else-if="item.topicType==6"
                    v-model="model[item.code]"
                    :show-city="item.showCity"
                    :cities="cities"
                  />
                  <el-select
                    style="width:100%;"
                    v-else-if="item.topicType==2"
                    size="mini"
                    v-model="model[item.code]"
                  >
                    <el-option
                      v-for="option of item.parameter.options"
                      :key="option.key"
                      :value="option.title"
                      :label="option.title"
                    />
                  </el-select>
                  <el-input
                    v-else
                    size="mini"
                    :placeholder="'请输入'+item.name"
                    v-model="model[item.code]"
                  ></el-input>
                </div>
              </div>
            </div>
          </div>

          <div class="fieldbox">
            <h5>校友照片</h5>
            <div class="alumniPhoto">
              <!-- <div>
                <img v-for="(item,index) in model.images" :key="index" src="item" alt="">
              </div>-->
              <el-upload
                :action="action"
                list-type="picture-card"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :file-list="fileList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>

          <div class="fieldbox">
            <h5>校友通讯网址</h5>
            <div class="alumniUrl">
              <div v-for="(url,index) in urlList.length" :key="index">
              <el-input
                v-if="urlList[index]"
                placeholder="请补全网址（只需输入网址的后半部分）"
                v-model="urlList[index].url"
                @change="changeUrl"
                style="width:500px;marginBottom:15px;"
              >
                <template slot="prepend">
                  <el-select
                    style="width:220px;"
                    size="small"
                    v-model="urlList[index].type"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in urlOptions"
                      :key="item.type"
                      :label="item.url"
                      :value="item.type"
                    ></el-option>
                  </el-select>
                </template>
              </el-input>
              </div>
            </div>
          </div>

          <div class="fieldbox" v-if="!loading">
            <h5>
              在校经历
              <el-tooltip class="item" effect="dark" content="添加在校就读就职经历" placement="top">
                <el-button icon="el-icon-warning" type="text" @click="addExp">增加</el-button>
              </el-tooltip>
            </h5>
            <div
              class="dashbox solidbox"
              v-for="(pitem,pindex) in model.studentExperience"
              :key="pindex"
            >
              <div class="rows">
                <div class="rowpart">
                  <span>在校经历：</span>
                  <el-select
                    @change="changeExp(pindex)"
                    v-model="pitem.education"
                    placeholder="请选择"
                    size="mini"
                  >
                    <el-option
                      v-for="item in newEducationList"
                      :key="item.title"
                      :label="item.title"
                      :value="item.title"
                    ></el-option>
                  </el-select>
                </div>
                <div
                  class="rowpart"
                  v-for="(item,index) in studentExperienceField"
                  :key="index+100"
                >
                  <span>{{item.name}}：</span>
                  <member-edit-field-new
                    :experienceType="pitem.education"
                    :studentExperienceObj="pitem"
                    :memberFields="studentExperienceField"
                    :code="item.code"
                    :config="item"
                    v-model="pitem[item.code]"
                    :isComposeField="true"
                    :itemindex="index"
                    :parentIndex="pindex"
                    @changeMemberFieldsDetail="changeMemberFieldsDetail($event,pitem)"
                  />
                </div>
              </div>
              <div class="btnbox">
                <el-button type="text" @click="deleteStudentExp(pindex)">删除</el-button>
              </div>
            </div>

            <div
              class="dashbox solidbox"
              v-for="(pitem,pindex) in model.teacherExperience"
              :key="pindex+100"
            >
              <div class="rows">
                <div class="rowpart">
                  <span>在校经历：</span>
                  <el-select disabled v-model="jiaozhigong" placeholder="请选择" size="mini">
                    <el-option label="教职工" value="教职工"></el-option>
                  </el-select>
                </div>
                <div class="rowpart" v-for="(item,index) in teacherExperienceField" :key="index">
                  <span>{{item.name}}：</span>
                  <member-edit-field-new
                    :experienceType="jiaozhigong"
                    :studentExperienceObj="studentExperienceObj"
                    :memberFields="teacherExperienceField"
                    :code="item.code"
                    :config="item"
                    v-model="pitem[item.code]"
                    :isComposeField="true"
                    :itemindex="index"
                  />
                </div>
              </div>
              <div class="btnbox">
                <el-button type="text" @click="deleteTeacherExp(pindex)">删除</el-button>
              </div>
            </div>

            <div class="dashbox" v-if="showAddBox">
              <div class="rows">
                <div class="rowpart">
                  <span>在校经历：</span>
                  <el-select clearable v-model="tempExpType" placeholder="请选择" size="mini">
                    <el-option
                      v-for="item in newEducationList"
                      :key="item.title"
                      :label="item.title"
                      :value="item.title"
                    ></el-option>
                  </el-select>
                </div>
                <template v-if="tempExpType&&tempExpType!='教职工'">
                  <div
                    class="rowpart"
                    v-for="(item,index) in studentExperienceField"
                    :key="index+1000"
                  >
                    <span>{{item.name}}：</span>
                    <member-edit-field-new
                      :experienceType="tempExpType"
                      :studentExperienceObj="tempExpObj"
                      :memberFields="studentExperienceField"
                      :code="item.code"
                      :config="item"
                      v-model="tempExpObj[item.code]"
                      :isComposeField="true"
                      :itemindex="index"
                      @changeMemberFieldsDetail="changeMemberFieldsDetail($event,tempExpObj)"
                    />
                  </div>
                </template>
                <template v-if="tempExpType&&tempExpType=='教职工'">
                  <div class="rowpart" v-for="(item,index) in teacherExperienceField" :key="index">
                    <span>{{item.name}}：</span>
                    <member-edit-field-new
                      :experienceType="tempExpType"
                      :studentExperienceObj="tempExpObj"
                      :memberFields="teacherExperienceField"
                      :code="item.code"
                      :config="item"
                      v-model="tempExpObj[item.code]"
                      :isComposeField="true"
                      :itemindex="index"
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="fieldbox">
            <h5>工作单位</h5>
            <div class="rows">
              <div class="rowpart" v-for="(item,index) in workingField" :key="index">
                <span>{{item.name}}：</span>
                <div>
                  <el-cascader
                    :show-all-levels="false"
                    v-if="item.topicType==20"
                    :placeholder="'下拉选择'+item.name"
                    size="mini"
                    filterable
                    clearable
                    v-model="model[item.code]"
                    :options="industryList"
                    :props="props"
                    style="width: 100%;"
                  />
                  <el-select
                    style="width:100%;"
                    v-else-if="item.topicType==2"
                    size="mini"
                    v-model="model[item.code]"
                    clearable
                  >
                    <el-option
                      v-for="option of item.parameter.options"
                      :key="option.key"
                      :value="option.title"
                      :label="option.title"
                    />
                  </el-select>
                  <el-input
                    v-else
                    size="mini"
                    :placeholder="'请输入'+item.name"
                    v-model="model[item.code]"
                  ></el-input>
                </div>
              </div>
            </div>
          </div>
          <div class="fieldbox">
            <h5>联系方式</h5>
            <div class="rows">
              <div class="rowpart" v-for="(item,index) in contactFieldList" :key="index">
                <span>{{item.name}}：</span>
                <div>
                  <el-input size="mini" :placeholder="'请输入'+item.name" v-model="model[item.code]"></el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vue-scroll>
    </el-main>
  </el-container>
</template>

<script>
import MemberEditFieldNew from "./MemberEditFieldNew";
import { formatDate } from "@/js/util/utilFunction";
import CityChoose from "../../../../util/city/CityChoose2";
import { nations, cities } from "./data.js";
import { requestBaseUrl } from "@/js/config/serviceConfig";

export default {
  name: "MemberForm",
  components: { MemberEditFieldNew, CityChoose },
  props: {
    memberId: {
      type: String,
      default: ""
    },
    originalGroups: Array,
    educationList: Array,
    collegeList: Array,
    majorList: Array,
    isBranchMember: Boolean,
    createAlumniInfo: Object
  },
  watch: {
    educationList: {
      immediate: true,
      handler(val) {
        if (val) {
          this.newEducationList = JSON.parse(JSON.stringify(val));
          this.newEducationList.push({ key: "10000", title: "教职工" });
        }
      }
    },
    tempExpType(val, oldval) {
      if (oldval != "教职工" && val == "教职工") {
        this.tempExpObj = {};
      } else if (oldval == "教职工" && val != "教职工") {
        this.tempExpObj = {};
      } else if (oldval != "教职工" && val != "教职工") {
        for (var i = 0; i < this.studentExperienceField.length; i++) {
          if (this.studentExperienceField[i].needClear) {
            this.$set(this.tempExpObj, this.studentExperienceField[i].code, "");
          }
        }
      }
    }
  },
  filters: {
    filterTime(val) {
      return formatDate(new Date(val), "yyyy-MM-dd");
    },
    filterPlace(val) {
      let str = "";
      let valueObj;
      if (typeof val === "string") {
        try {
          valueObj = JSON.parse(val);
        } catch (e) {
          return val;
        }
      } else {
        valueObj = val;
      }
      if (valueObj) {
        if (valueObj.country) {str += valueObj.country + "-"}
        if (valueObj.province) {
          str += valueObj.province + "-";
        }
        if (valueObj.city) {
          str += valueObj.city + "-";
        }
        str = str.slice(0, -1);
      }
      return str;
    }
  },
  data() {
    return {
      action: requestBaseUrl + "/api/common/anon/uploadFile", //图片上传地址
      showAddBox: false,
      jiaozhigong: "教职工",
      loading: false,
      memberInfo: null,
      userInfo: null,
      editField: "",
      cities: cities,
      model: {
        studentExperience: [],
        teacherExperience: []
      },
      basicFieldList: [
        { code: "name", name: "姓名", topicType: 0, required: true },
        {
          code: "sex",
          name: "性别",
          topicType: 2,
          parameter: {
            options: [
              { key: "1", title: "男" },
              { key: "2", title: "女" }
            ]
          }
        },
        { code: "birthday", name: "出生日期", topicType: 5 },
        { code: "idNumber", name: "身份证号", topicType: 0 },
        { code: "currentCity", name: "所在城市", topicType: 6, showCity: true }
      ],
      contactFieldList: [
        { code: "telphone", iconClass: "icon-shouji", name: "手机号" },
        { code: "wechat", iconClass: "icon-tubiaozhizuomoban", name: "微信" },
        { code: "email", iconClass: "icon-youxiang", name: "邮箱" },
        { code: "qq", iconClass: "icon-ziyuan", name: "QQ" }
      ],
      studentExperienceField: [
        { code: "entranceDate", name: "入学年", topicType: 5 },
        {
          code: "graduationDate",
          name: "毕业年",
          topicType: 5,
          needClear: true
        },
        { code: "college", name: "学院", topicType: 2, needClear: true },
        { code: "major", name: "专业", topicType: 2, needClear: true },
        { code: "cless", name: "班级", topicType: 0, value: "" },
        { code: "studentNo", name: "学号", topicType: 0, value: "" }
      ],
      teacherExperienceField: [
        { code: "department", name: "部门", topicType: 0 },
        { code: "job", name: "职务", topicType: 0 },
        { code: "jobNo", name: "工号", topicType: 0 }
      ],
      workingField: [
        { code: "workingCompany", name: "单位", topicType: 0 },
        { code: "industry", name: "行业", topicType: 20 },
        { code: "post", name: "职务", topicType: 0 }
      ],
      addStatus: "",
      studentExperienceObj: {},
      teacherExperienceObj: {},
      workingObj: {},
      newEducationList: [],
      tempExpObj: {},
      tempExpType: "",
      industryList: [],
      props: {
        label: "title",
        value: "title",
        children: "subCategoryList"
      },
      fileList: [],
      urlOptions: [{ url: "https://baike.baidu.com/", type: 1 }],
      urlList: []
    };
  },
  methods: {
    deleteTeacherExp(index) {
      this.model.teacherExperience.splice(index, 1);
    },
    addExp() {
      if (this.showAddBox) {
        if (!this.tempExpType) {
          this.$message.warning("请先选择在校经历");
          return;
        } else {
          if (this.tempExpType == "教职工") {
            this.model.teacherExperience.push(this.tempExpObj);
          } else {
            this.tempExpObj.education = this.tempExpType;
            this.model.studentExperience.push(this.tempExpObj);
          }
          this.tempExpObj = {};
        }
      } else {
        this.showAddBox = true;
      }
    },
    deleteStudentExp(index) {
      this.model.studentExperience.splice(index, 1);
      // this.model.studentExperience.push({
      //   cless:"",college:"",education:"",entranceDate:"",graduationDate:"",major:"",studentNo:""
      // })
    },
    saveField(code) {
      if (!this.model.name) {
        this.$message.warning("请输入姓名");
        return;
      }
      var fieldValues = JSON.parse(JSON.stringify(this.model));
      var allfield = this.basicFieldList
        .concat(this.workingField)
        .concat(this.contactFieldList);
      allfield = allfield.map(item => item.code);
      allfield = allfield.concat([
        "studentExperience",
        "teacherExperience",
        "id"
      ]);
      var obj = {};
      for (var i = 0; i < allfield.length; i++) {
        obj[allfield[i]] = fieldValues[allfield[i]];
      }
      fieldValues = obj;
      // for(var i=fieldValues.teacherExperience.length-1;i>=0;i--){
      //     let valArr = Object.values(fieldValues.teacherExperience[i])
      //     if(valArr.some(item=>!!item)){
      //     }else{
      //         fieldValues.teacherExperience.splice(i,1)
      //     }
      // }
      if (this.tempExpType == "教职工") {
        fieldValues.teacherExperience.push(this.tempExpObj);
      } else if (this.tempExpType) {
        this.tempExpObj.education = this.tempExpType;
        fieldValues.studentExperience.push(this.tempExpObj);
      }

      if (
        fieldValues.industry &&
        fieldValues.industry.length &&
        typeof fieldValues.industry !== "string"
      ) {
        fieldValues.industry =
          fieldValues.industry[fieldValues.industry.length - 1];
      }

      //图片和网址以及知名校友的处理
      var arr = [];
      this.fileList.forEach(item => {
        arr.push(item.url);
      });
      fieldValues.images = JSON.stringify(arr);
      var arr1 = [];
      var newObj = {};
      this.urlOptions.forEach(item => {
        newObj[item.type] = item.url;
      });
      this.urlList.forEach(item => {
        var obj={
          url:newObj[item.type] + item.url,
          type:item.type
        }
        arr1.push(obj);
      });
      fieldValues.urlList = JSON.stringify(arr1);
      // fieldValues.urlList = JSON.stringify(this.urlList);
      fieldValues.isFamous = true;

      var requestData = { fieldValues: fieldValues };
      if (fieldValues.id) {
        this.$request
          .put("/api/admin/member/v2/updateMemberByAdmin", requestData)
          .then(res => {
            this.$emit("refresh-members");
            this.$emit("close");
            this.$message.success("修改成功");
          });
      } else {
        if (this.isBranchMember) {
          this.$request
            .post("/api/admin/branch/addMemberBranch", requestData)
            .then(res => {
              this.$emit("refresh-members");
              this.$emit("close");
              this.$message.success("添加成功");
            });
        } else {
          this.$request
            .post("/api/admin/member/v2/addMemberByAdmin", requestData)
            .then(res => {
              this.$emit("refresh-members");
              this.$emit("close");
              this.$message.success("添加成功");
            });
        }
      }
    },
    changeExp(index) {
      for (var i = 0; i < this.studentExperienceField.length; i++) {
        if (this.studentExperienceField[i].needClear) {
          this.$set(
            this.model.studentExperience[index],
            this.studentExperienceField[i].code,
            ""
          );
        }
      }
    },
    changeMemberFieldsDetail(key, item) {
      this.$set(item, key, "");
    },
    click() {
      for (let ref in this.$refs) {
        let item = this.$refs[ref];
        if (Array.isArray(item)) {
          if (item[0]) {
            item[0].hidden();
          }
        }
      }
    },
    getMemberFields() {
      console.log('修改')
      this.loading = true;
      this.$request
        .get("/api/admin/member/v2/getUserInfoAndMemberInfo", {
          params: { memberId: this.memberId }
        })
        .then(memberInfo => {
          this.memberInfo = memberInfo.data.memberInfo;
          this.userInfo = memberInfo.data.userInfo;
          this.model = JSON.parse(JSON.stringify(memberInfo.data.memberInfo));
          if (
            !(
              isNaN(this.model.birthday) &&
              !isNaN(Date.parse(this.model.birthday))
            )
          ) {
            this.model.birthday = "";
          } else {
            this.model.birthday = formatDate(
              new Date(this.model.birthday),
              "yyyy-MM-dd"
            );
          }
          this.$nextTick(()=>{ this.loading = false; })
          //网址数据处理
          if (this.memberInfo.urlList&&this.memberInfo.urlList.length>0) {
            this.urlList=JSON.parse(JSON.stringify(this.memberInfo.urlList));
          }else{
            this.urlList.push({
              url:'',
              type:1
            })
          }
          // this.urlList=JSON.parse(JSON.stringify(this.memberInfo.urlList));
          //图片数据处理
          if (this.memberInfo&&this.memberInfo.images) {
            var images = JSON.parse(this.memberInfo.images);
          }else{
            var images=[];
          }
          images.forEach(item => {
            var obj = {
              url: item
            };
            this.fileList.push(obj);
          });
        });
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
    handleSuccess(res, file, fileList) {
      // this.fileList.push(file);
      // this.fileList = JSON.parse(JSON.stringify(fileList));
      this.fileList.push({
        url:res.data
      })
    },
    handleRemove(file, fileList) {
      // this.fileList = JSON.parse(JSON.stringify(fileList));
      // console.log(file);
      this.fileList.forEach((item,index)=>{
        if (item.url==file.url) {
          this.fileList.splice(index,1);
        }
      })
    },
    createNewAlumni() {
      if (Object.keys(this.createAlumniInfo).length > 0) {
        console.log("通过信息新建");
        this.model.name = this.createAlumniInfo.alumniName;
        //网址数据处理
        var obj = {
          url: "",
          type: this.createAlumniInfo.urlSource
        };
        this.urlOptions.forEach(item => {
          if (item.type == obj.type) {
            obj.url = this.createAlumniInfo.searchUrl.split(item.url)[1];
          }
        });
        this.urlList.push(obj);
        //图片数据处理
        // var images = JSON.parse(this.createAlumniInfo.image);
        if (this.createAlumniInfo&&this.createAlumniInfo.image) {
            var images = JSON.parse(this.createAlumniInfo.image);
          }else{
            var images=[];
          }
        images.forEach(item => {
          var obj = {
            url: item
          };
          this.fileList.push(obj);
        });
      } else {
        console.log("直接新建");
        this.urlList.push({
          url: "",
          type: 1
        });
      }
    },
    changeUrl(value){
      console.log(value);
    }
  },
  created() {
    this.$request.get("/api/admin/associator/getAllFields").then(res => {
      var fieldList = res.data;
      // 基本信息：0 工作信息：1  联系方式：2  在校就读经历：3 在校就职经历：4
      this.basicFieldList = [];
      this.workingField = [];
      this.studentExperienceField = [];
      this.teacherExperienceField = [];
      this.contactFieldList = [];
      for (var i = 0; i < fieldList.length; i++) {
        if (fieldList[i].topicType == 2) {
          fieldList[i].parameter = fieldList[i].parameter
            ? JSON.parse(fieldList[i].parameter)
            : { options: "" };
        }
        if (fieldList[i].topicType == 6) {
          fieldList[i].showCity = fieldList[i].parameter
            ? JSON.parse(fieldList[i].parameter).showCity
            : false;
        }
        if (fieldList[i].groupId == 0) {
          this.basicFieldList.push(fieldList[i]);
        } else if (fieldList[i].groupId == 1) {
          this.workingField.push(fieldList[i]);
        } else if (
          fieldList[i].groupId == 3 &&
          fieldList[i].code != "education"
        ) {
          if (
            fieldList[i].code == "graduationDate" ||
            fieldList[i].code == "college" ||
            fieldList[i].code == "major"
          ) {
            fieldList[i].needClear = true;
          }
          this.studentExperienceField.push(fieldList[i]);
        } else if (fieldList[i].groupId == 4) {
          this.teacherExperienceField.push(fieldList[i]);
        } else if (fieldList[i].groupId == 2) {
          this.contactFieldList.push(fieldList[i]);
        }
      }
    });
    this.$request
      .get("/api/admin/organization/category/listOrganizationCategory")
      .then(res => {
        this.industryList = this.treeData(res.data);
      });
    if (this.memberId) {
      this.getMemberFields();
    } else {
      this.createNewAlumni();
    }
  }
};
</script>
<style lang="less" scoped>
.cusdia {
  background: white;
  .elheader {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    right: 0;
    height: 50px;
    padding: 0 20px;
    background: white;
    margin-bottom: 10px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e6e6e6;
    align-items: center;
    .headtitle {
      font-size: 16px;
      color: #222222;
      padding-left: 6px;
      border-left: 3px solid #28394b;
      height: 16px;
      line-height: 16px;
    }
    button:first-child {
      border-color: #3fa1b6;
      color: #3fa1b6;
    }
    button:last-child {
      border-color: #3fa1b6;
      background: #3fa1b6;
      color: #fff;
    }
  }
  .fieldbox {
    padding-left: 5px;
    margin-bottom: 20px;
    border-bottom: 1px dashed #e6e6e6;
    font-size: 14px;
    padding-bottom: 20px;
    h5 {
      color: #222222;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
      button {
        color: #3fa1b6;
        padding: 0;
        margin-right: 21px;
      }
    }
    .dashbox {
      border: 1px dashed #4fb6cc;
      margin: 20px 0;
      position: relative;
      .btnbox {
        position: absolute;
        right: 20px;
        top: 20px;
        button {
          color: #3fa1b6;
          padding: 0;
        }
      }
    }
    .rows {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: 900px;
      .rowpart {
        width: 320px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        height: 32px;
        margin-right: 80px;
        span {
          color: #555555;
          width: 120px;
          text-align: right;
          flex-shrink: 0;
          line-height: 32px;
        }
        div {
          color: #000;
          height: 30px;
          display: flex;
          align-items: center;
          flex: 1;
          span {
            color: #000;
          }
        }
      }
    }
    .solidbox {
      border: 1px solid #e6e6e6;
    }
    .newrows {
      margin-top: 20px;
      .flexfield {
        display: flex;
        flex-wrap: wrap;
      }
      .fielditem {
        margin-top: 10px;
        display: flex;
        align-items: center;
        width: 48%;
        margin-right: 3%;
        .custom-el-form-item-label {
          width: 60px;
          flex-shrink: 0;
        }
        div {
          width: 193px;
        }
      }
      .fielditem:nth-of-type(2n) {
        margin-right: 0;
      }
    }
  }

  .flexbox {
    display: flex;
    justify-content: space-between;
    .leftpart {
      width: 52%;
      box-sizing: border-box;
    }
    .rightpart {
      margin-left: 10px;
      flex: 1;
      .rows {
        .rowpart {
          width: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          span {
            color: #999;
          }
          div {
            color: #000;
            height: 30px;
            display: flex;
            align-items: center;
            span {
              color: #000;
            }
          }
        }
      }
    }
    .row1 {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;
      span {
        width: 8px;
        height: 8px;
        background: #06c;
        border-radius: 50%;
        margin-right: 8px;
      }
      p {
        font-size: 14px;
        font-weight: 700;
        color: #333;
        margin-right: 20px;
      }
      .operatebox {
        margin-left: auto;
      }
    }
    .row2 {
      display: flex;
      width: 100%;
      padding-left: 16px;
      margin-top: 10px;
      div {
        padding: 0 10px;
        font-size: 14px;
        background: #f2f2f2;
        margin-right: 10px;
      }
    }
  }
}

.alumniPhoto {
  padding: 25px 40px;
  display: flex;
}
.alumniUrl {
  padding: 25px 40px;
}
</style>

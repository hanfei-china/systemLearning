<template>
  <div style="height:100%;" v-loading="loading">

    <vue-scroll>
      <div style="padding: 0 20px;" v-if="memberInfo">
        <div class="headbox">
          <img v-if="userInfo&&userInfo.headImg" :src="userInfo.headImg" alt="">
          <img v-else src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="">
          <div class="userinfo">
            <div><span v-if="userInfo">{{userInfo.nickName}}</span>({{memberInfo.name}})</div>
            <p>{{age}}岁 {{astro}}座 {{memberInfo.currentCity?JSON.parse(memberInfo.currentCity).city:'--市'}}</p>
          </div>
        </div>
        <div class="fieldbox">
          <h5>基本信息
            <div v-if="OPprivileges.includes('201010003')||branchId">
              <el-button type="text" v-if="addStatus=='basic'" @click="cancelEditBasic">取消</el-button>
              <el-button type="text" v-if="addStatus=='basic'" @click="saveBasic">保存</el-button>
              <el-button type="text" v-else @click="handleEditField('basic')">修改</el-button>
            </div>
          </h5>
          <div class="rows">
            <div class="rowpart" v-for="(item,index) in basicFieldList" :key="index">
              <span>{{item.name}}：</span>
              <div v-if="addStatus=='basic'">
                <el-date-picker size="mini" v-if="item.topicType==5" v-model="model[item.code]" :value-format="(item.parameter&&JSON.parse(item.parameter).dateType=='year')?'yyyy':'yyyy-MM-dd'" :type="item.parameter?JSON.parse(item.parameter).dateType:'date'" placeholder="选择日期"></el-date-picker>
                <city-choose size="mini" v-else-if="item.topicType==6" v-model="model[item.code]" :show-city="item.showCity" :cities="cities"/>
                <el-select v-else-if="item.topicType==2" size="mini" v-model="model[item.code]">
                  <el-option v-for="option of item.parameter.options" :key="option.key" :value="option.title" :label="option.title" />
                </el-select>
                <el-input v-else size="mini" v-model="model[item.code]"></el-input>
              </div>
              <div v-else class="infodiv">
                <span v-if="item.topicType==5">{{model[item.code]|filterTime}}</span>
                <span v-else-if="item.topicType==6">{{model[item.code]|filterPlace}}</span>
                <span v-else>{{model[item.code]}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="fieldbox">
          <h5>在校经历<el-button v-if="OPprivileges.includes('201010003')||branchId" style="float:right;font-style:normal;" type="text" @click="addExp">添加经历</el-button>
          </h5>
          <div class="newrows" v-if="addStatus=='experience'">
            <!-- :disabled="experienceType&&experienceType=='教职工'&&(!!teacherExperienceObj.id)" -->
            <el-select v-if="editExp=='student'" v-model="experienceType" @change="changeExp" placeholder="请选择" size="mini">
              <el-option v-for="item in educationList" :key="item.title" :label="item.title" :value="item.title"></el-option>
            </el-select>
            <el-select v-else-if="editExp=='teacher'" disabled v-model="experienceType" @change="changeExp" placeholder="请选择" size="mini">
              <el-option v-for="item in newEducationList" :key="item.title" :label="item.title" :value="item.title"></el-option>
            </el-select>
            <el-select v-else v-model="experienceType" @change="changeExp" placeholder="请选择" size="mini">
              <el-option v-for="item in newEducationList" :key="item.title" :label="item.title" :value="item.title"></el-option>
            </el-select>
            <el-button type="text" @click="cancelEditExp" style="margin-left:10px;color:#f56c6c;font-size:12px;">取消</el-button>
            <el-button type="text" @click="saveExp" style="margin: 0 10px 0 5px;color:#3FA1B6;font-size:12px;">保存</el-button>
            <div class="flexfield" v-if="experienceType&&experienceType=='教职工'">
              <div class="fielditem" v-for="(itemfield,itemindex) in teacherExperienceField" :key="itemindex">
                <span class="custom-el-form-item-label">{{itemfield.name}}：</span>
                <member-edit-field-new :experienceType="experienceType" :studentExperienceObj="studentExperienceObj" :memberFields="teacherExperienceField" :code="itemfield.code" :config="itemfield"
                  v-model="teacherExperienceObj[itemfield.code]" :isComposeField="true" :itemindex="itemindex" @changeMemberFieldsDetail="changeMemberFieldsDetail" />
              </div>
            </div>
            <div class="flexfield" v-else-if="experienceType&&experienceType!=='教职工'">
              <div class="fielditem" v-for="(itemfield,itemindex) in studentExperienceField" :key="itemindex">
                <span class="custom-el-form-item-label">{{itemfield.name}}：</span>
                <member-edit-field-new :experienceType="experienceType" :studentExperienceObj="studentExperienceObj" :memberFields="studentExperienceField" :code="itemfield.code" :config="itemfield"
                  v-model="studentExperienceObj[itemfield.code]" :isComposeField="true" :itemindex="itemindex" @changeMemberFieldsDetail="changeMemberFieldsDetail" />
              </div>
            </div>
          </div>
          <div class="expbox" v-else>
            <div class="rows" v-for="(item,index) in model.studentExperience" :key="index" v-if="studentExperienceFieldCode.length>0">
              <div class="row1">
                <span><i></i></span>
                <p v-if="studentExperienceFieldCode.includes('college')">{{item.college}}</p><strong><template
                    v-if="studentExperienceFieldCode.includes('entranceDate')">{{item.entranceDate|filterYear}}</template>-<template
                    v-if="studentExperienceFieldCode.includes('graduationDate')">{{item.graduationDate|filterYear}}</template></strong>
                <div class="operatebox" v-if="OPprivileges.includes('201010003')||branchId">
                  <el-button type="text" @click="editStudentExp(item)">修改</el-button>
                  <el-button type="text" style="color:#f56c6c;" @click="deleteStudentExp(item,index)">删除</el-button>
                </div>
              </div>
              <div class="row2">
                <template v-for="(it,idx) in studentExperienceFieldCode" v-if="it!='college'&&it!='entranceDate'&&it!='graduationDate'">
                  <div :key="idx" v-if="item[it]&&studentExperienceFieldCode.includes(it)">{{item[it]}}</div>
                </template>
              </div>
            </div>
            <div class="rows" v-for="(item,index) in model.teacherExperience" :key="item.id" v-if="teacherExperienceFieldCode.length>0">
              <div class="row1">
                <span><i></i></span>
                <p v-if="teacherExperienceFieldCode.includes('department')">{{item.department}}</p><strong>任职</strong>
                <div class="operatebox" v-if="OPprivileges.includes('201010003')||branchId">
                  <el-button type="text" @click="editTeacherExp(item)">修改</el-button>
                  <el-button type="text" style="color:#f56c6c;" @click="deleteTeacherExp(item,index)">删除</el-button>
                </div>
              </div>
              <div class="row2">
                <template v-for="(it,idx) in teacherExperienceFieldCode" v-if="it!='department'">
                  <div :key="idx" v-if="item[it]&&teacherExperienceFieldCode.includes(it)">{{item[it]}}</div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="fieldbox" v-if="workingFieldCode.length>0">
          <h5>工作单位
            <div v-if="OPprivileges.includes('201010003')||branchId">
              <el-button type="text" v-if="addStatus=='working'" @click="cancelWorking">取消</el-button>
              <el-button type="text" v-if="addStatus=='working'" @click="saveWorking">保存</el-button>
              <el-button type="text" v-else @click="handleEditField('working')">修改</el-button>
            </div>
          </h5>
          <div v-if="addStatus=='working'" class="rows">
            <div class="rowpart" v-for="(itemfield,itemindex) in workingField" :key="itemindex">
              <span class="custom-el-form-item-label">{{itemfield.name}}：</span>
              <el-cascader :show-all-levels="false" v-if="itemfield.topicType==20" :placeholder="'下拉选择'+itemfield.name" size="mini" filterable clearable v-model="model[itemfield.code]" :options="industryList"
                :props="props" />
              <el-select v-else-if="itemfield.topicType==2" size="mini" v-model="model[itemfield.code]" clearable>
                <el-option v-for="option of itemfield.parameter.options" :key="option.key" :value="option.title" :label="option.title" />
              </el-select>
              <el-date-picker v-else-if="itemfield.topicType==5" size="mini"  v-model="model[itemfield.code]" :value-format="(itemfield.parameter&&JSON.parse(itemfield.parameter).dateType=='year')?'yyyy':'yyyy-MM-dd'" :type="itemfield.parameter?JSON.parse(itemfield.parameter).dateType:'date'" placeholder="选择日期"></el-date-picker>
              <el-input v-else size="mini" v-model="model[itemfield.code]"></el-input>
            </div>
          </div>
          <div v-else class="rows">
            <div class="row1">
              <span><i></i></span>
              <p v-if="model.workingCompany&&workingFieldCode.includes('workingCompany')">{{model.workingCompany}}</p><strong v-if="model.unitCharacter&&workingFieldCode.includes('unitCharacter')"
                style="font-weight: normal;font-size: 12px;color: #C6C6C6;">{{model.unitCharacter}}</strong>
            </div>
            <div class="row2" :class="model.workingCompany?'':'noCompany'">
              <template v-for="(item,index) in workingFieldCode" v-if="item!='workingCompany'&&item!='unitCharacter'">
                <div :key="index" v-if="model[item]&&workingFieldCode.includes(item)">{{model[item]}}</div>
              </template>
              <!-- <div v-if="model.industry&&workingFieldCode.includes('industry')">{{model.industry}}</div>
              <div v-if="model.post&&workingFieldCode.includes('post')">{{model.post}}</div> -->
            </div>
          </div>
        </div>

        <div class="fieldbox">
          <h5>联系方式
            <div v-if="OPprivileges.includes('201010003')||branchId">
              <el-button type="text" v-if="addStatus=='contact'" @click="cancelEditContact">取消</el-button>
              <el-button type="text" v-if="addStatus=='contact'" @click="saveContact">保存</el-button>
              <el-button type="text" v-else @click="handleEditField('contact')">修改</el-button>
            </div>
          </h5>
          <div class="rows">
            <div class="rowpart" v-for="(item,index) in contactFieldList" :key="index">
              <img :src="item.icon" alt="">
              <div v-if="addStatus=='contact'">
                <el-input size="mini" v-model="model[item.code]" style="margin-right:10px;"></el-input>
              </div>
              <div v-else class="infodiv"><span>{{model[item.code]||"暂无"}}</span></div>
            </div>
          </div>
        </div>

        <div class="fieldbox">
          <h5>账户信息</h5>
          <div class="rows">
            <div class="rowpart"><span>账户状态：</span>
              <div style="color:#3FA1B6;" v-if="model.status=='1'">账户已激活</div>
              <div style="color:#ECA038;" v-else>账户未激活</div>
            </div>
            <div class="rowpart"><span>最近登录时间：</span>
              <div v-if="userInfo&&userInfo.lastLoginTime">{{userInfo.lastLoginTime|filterTime}}</div>
            </div>
            <div class="rowpart"><span>注册方式：</span>
              <div>{{model.source}}</div>
            </div>
            <div class="rowpart"><span>注册时间：</span>
              <div v-if="userInfo&&userInfo.createTime">{{userInfo.createTime|filterTime}}</div>
            </div>
          </div>
        </div>

        <div class="fieldbox">
          <h5>图片</h5>
          <div class="rows">
            <el-image
              v-for="(item,index) in JSON.parse(memberInfo.images)"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="JSON.parse(memberInfo.images)">
            </el-image>
          </div>
        </div>
      </div>
    </vue-scroll>

  </div>
</template>

<script>
import MemberEditFieldNew from "./MemberEditFieldNew";
import { formatDate } from "@/js/util/utilFunction";
import CityChoose from "../../../../util/city/CityChoose2";
import {cities } from "./data.js";

export default {
  name: "MemberForm",
  components: {
    MemberEditFieldNew,
    CityChoose,
  },
  props: {
    memberId: {
      type: String,
      default: "",
    },
    originalGroups: Array,
    educationList: Array,
    branchId:String
  },
  computed: {
    studentExperienceFieldCode() {
      var list = this.studentExperienceField.map((item) => item.code);
      if (this.hasEducation) {
        list.push("education");
        return list;
      } else {
        return list;
      }
    },
    teacherExperienceFieldCode() {
      return this.teacherExperienceField.map((item) => item.code);
    },
    workingFieldCode() {
      return this.workingField.map((item) => item.code);
    },
    OPprivileges() {
      return this.$store.state.OPprivileges.map((item) => item.id);
    },
    age() {
      var aDate = new Date();
      var thisYear = aDate.getFullYear();
      if (this.memberInfo && this.memberInfo.birthday) {
        var bDate = new Date(this.memberInfo.birthday);
        var brith = bDate.getFullYear();
        brith = Number(String(brith).slice(0, 4));
        if (typeof brith == "number") {
          return thisYear - brith;
        } else {
          return "--";
        }
      } else {
        return "--";
      }
    },
    astro() {
      if (this.memberInfo && this.memberInfo.birthday) {
        var bDate = new Date(this.memberInfo.birthday);
        var month = bDate.getMonth() + 1;
        var day = bDate.getDate();
        var s = "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
        var arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
        return s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2);
      } else {
        return "--";
      }
    },
  },
  filters: {
    filterTime(val) {
      if (val) {
        return formatDate(new Date(val), "yyyy-MM-dd");
      } else {
        return "";
      }
    },
    filterYear(val) {
      if (val) {
        return formatDate(new Date(val), "yyyy");
      } else {
        return "";
      }
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
        if (valueObj.country) {
          str += valueObj.country + "-";
        }
        if (valueObj.province) {
          str += valueObj.province + "-";
        }
        if (valueObj.city) {
          str += valueObj.city + "-";
        }
        str = str.slice(0, -1);
      }
      return str;
    },
  },
  data() {
    return {
      editExp:"",
      activeName: "alumnusInfo",
      loading: false,
      memberInfo: null,
      userInfo: null,
      editField: "",
      model: "",
      cities:cities,
      basicFieldList: [
        { code: "name", name: "姓名", topicType: 0 },
        {
          code: "sex",
          name: "性别",
          topicType: 2,
          parameter: {
            options: [
              { key: "1", title: "男" },
              { key: "2", title: "女" },
            ],
          },
        },
        { code: "birthday", name: "出生日期", topicType: 5 },
        // {code:"idNumber",name:"身份证号",topicType:0},
        // {code:"nation",name:"民族",topicType:2,parameter:{options:nations}},
        // {code:"nativePlace",name:"籍贯",topicType:6,showCity:false},
        { code: "currentCity", name: "所在城市", topicType: 6, showCity: true },
        // {code:"maritalStatus",name:"婚姻状态",topicType:2,parameter:{options:[{key:"1",title:"未婚"},{key:"2",title:"已婚"},{key:"3",title:"离异"}]}},
        // {code:"politicalStatus",name:"政治面貌",topicType:2,parameter:{options:[{key:"1",title:"党员"},{key:"2",title:"预备党员"},{key:"3",title:"团员"},{key:"4",title:"群众"}]}},
      ],
      contactFieldList: [
        // {code:"telphone",src:require("./images/shouji.png")},
        // {code:"wechat",src:require("./images/weixin.png")},
        // {code:"email",src:require("./images/youxiang.png")},
        // {code:"qq",src:require("./images/qq.png")},
      ],
      studentExperienceField: [
        { code: "entranceDate", name: "入学年", topicType: 5 },
        {
          code: "graduationDate",
          name: "毕业年",
          topicType: 5,
          needClear: true,
        },
        { code: "college", name: "学院", topicType: 2, needClear: true },
        { code: "major", name: "专业", topicType: 2, needClear: true },
        { code: "cless", name: "班级", topicType: 0, value: "" },
        { code: "studentNo", name: "学号", topicType: 0, value: "" },
      ],
      teacherExperienceField: [
        { code: "department", name: "部门", topicType: 0 },
        { code: "job", name: "职务", topicType: 0 },
        { code: "jobNo", name: "工号", topicType: 0 },
      ],
      workingField: [
        { code: "workingCompany", name: "单位", topicType: 0 },
        { code: "industry", name: "行业", topicType: 20 },
        { code: "post", name: "职务", topicType: 0 },
      ],
      addStatus: "",
      newEducationList: [],
      experienceType: "",
      studentExperienceObj: {},
      teacherExperienceObj: {},
      workingObj: {},
      industryList: [],
      props: {
        label: "title",
        value: "title",
        children: "subCategoryList",
      },
      hasEducation: false,
    };
  },
  methods: {
    goback() {
      this.$emit("refresh-members");
      this.$emit("close");
    },
    changeExp() {
      for (var i = 0; i < this.studentExperienceField.length; i++) {
        if (this.studentExperienceField[i].needClear) {
          this.$set(
            this.studentExperienceObj,
            this.studentExperienceField[i].code,
            ""
          );
        }
      }
    },
    deleteStudentExp(item, index) {
      this.$msgbox
        .confirm("删除操作是不可逆的，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除",
        })
        .then(() => {
          this.$request
            .delete("/api/admin/member/v2/deleteMemberStudentExperience", {
              params: { id: item.id },
            })
            .then(() => {
              this.getMemberFields();
              this.$message.success("删除成功");
            });
        })
        .catch(() => {});
    },
    deleteTeacherExp(item, index) {
      this.$msgbox
        .confirm("删除操作是不可逆的，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除",
        })
        .then(() => {
          this.$request
            .delete("/api/admin/member/v2/deleteMemberTeacherExperience", {
              params: { id: item.id },
            })
            .then(() => {
              this.getMemberFields();
              this.$message.success("删除成功");
            });
        })
        .catch(() => {});
    },
    addExp() {
      this.addStatus = "experience";
      this.editExp = "";
      this.studentExperienceObj = {};
      this.teacherExperienceObj = {};
      this.experienceType = "";
    },
    cancelEditExp() {
      this.addStatus = "";
    },
    saveBasic() {
      var fieldValues = {};
      this.basicFieldList.map((item) => {
        fieldValues[item.code] = this.model[item.code];
      });
      fieldValues.id = this.model.id;
      var requestData = { fieldValues: fieldValues };
      this.$request
        .put("/api/admin/member/v2/updateMemberByAdmin", requestData)
        .then((res) => {
          this.getMemberFields();
          this.$message.success("修改成功");
          this.addStatus = "";
        });
    },
    cancelEditBasic() {
      this.basicFieldList.map((item) => {
        this.model[item.code] = this.memberInfo[item.code];
      });
      this.addStatus = "";
    },
    saveContact() {
      var fieldValues = {};
      this.contactFieldList.map((item) => {
        fieldValues[item.code] = this.model[item.code];
      });
      fieldValues.id = this.model.id;
      var requestData = { fieldValues: fieldValues };
      this.$request
        .put("/api/admin/member/v2/updateMemberByAdmin", requestData)
        .then((res) => {
          this.getMemberFields();
          this.$message.success("修改成功");
          this.addStatus = "";
        });
    },
    cancelEditContact() {
      this.contactFieldList.map((item) => {
        this.model[item.code] = this.memberInfo[item.code];
      });
      this.addStatus = "";
    },
    saveWorking() {
      var fieldValues = {};
      this.workingField.map((item) => {
        fieldValues[item.code] = this.model[item.code];
      });
      fieldValues.id = this.model.id;
      if (
        fieldValues.industry &&
        fieldValues.industry.length &&
        typeof fieldValues.industry !== "string"
      ) {
        fieldValues.industry =
          fieldValues.industry[fieldValues.industry.length - 1];
      }
      var requestData = { fieldValues: fieldValues };
      this.$request
        .put("/api/admin/member/v2/updateMemberByAdmin", requestData)
        .then((res) => {
          this.getMemberFields();
          this.$message.success("修改成功");
          this.addStatus = "";
        });
    },
    cancelWorking() {
      this.workingField.map((item) => {
        this.model[item.code] = this.memberInfo[item.code];
      });
      this.addStatus = "";
    },
    saveExp() {
      if (!this.experienceType) {
        this.$message.warning("请先选择专业或职业");
        return;
      }
      if (this.experienceType == "教职工") {
        if (this.teacherExperienceObj.id) {
          this.$request
            .put("/api/admin/member/v2/updateMemberTeacherExperience", {
              memberId: this.memberId,
              teacherExperience: this.teacherExperienceObj,
            })
            .then((res) => {
              this.getMemberFields();
              this.$message.success("修改就职经历成功");
              this.addStatus = "";
            });
        } else {
          this.$request
            .post("/api/admin/member/v2/addMemberTeacherExperience", {
              memberId: this.memberId,
              teacherExperience: this.teacherExperienceObj,
            })
            .then((res) => {
              this.getMemberFields();
              this.$message.success("添加就职经历成功");
              this.addStatus = "";
            });
        }
      } else {
        var obj = Object.assign(
          { education: this.experienceType },
          this.studentExperienceObj
        );
        if (obj.entranceDate) {
          obj.entranceDate = String(obj.entranceDate);
        }
        if (obj.graduationDate) {
          obj.graduationDate = String(obj.graduationDate);
        }
        if (this.studentExperienceObj.id) {
          this.$request
            .put("/api/admin/member/v2/updateMemberStudentExperience", {
              memberId: this.memberId,
              studentExperience: obj,
            })
            .then((res) => {
              this.getMemberFields();
              this.$message.success("修改就读经历成功");
              this.addStatus = "";
            });
        } else {
          this.$request
            .post("/api/admin/member/v2/addMemberStudentExperience", {
              memberId: this.memberId,
              studentExperience: obj,
            })
            .then((res) => {
              this.getMemberFields();
              this.$message.success("添加就读经历成功");
              this.addStatus = "";
            });
        }
      }
    },
    editStudentExp(item) {
      this.addStatus = "experience";
      this.editExp = "student";
      this.experienceType = item.education;
      this.studentExperienceObj = item;
    },
    editTeacherExp(item) {
      this.addStatus = "experience";
      this.editExp = "teacher";
      this.experienceType = "教职工";
      this.teacherExperienceObj = item;
    },
    handleEditField(type) {
      if (this.addStatus) {
        this.$message.warning("请先保存正在编辑的字段");
        return;
      }
      this.addStatus = type;
    },
    changeMemberFieldsDetail(key) {
      this.$set(this.studentExperienceObj, key, "");
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
      this.loading = true;
      this.$request
        .get("/api/admin/member/v2/getUserInfoAndMemberInfo", {
          params: { memberId: this.memberId },
        })
        .then((memberInfo) => {
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
  },
  created() {
    var url='/api/admin/associator/getFieldsByAuth';
    if (this.branchId) {
      url='/api/admin/associator/getAllFields'
    }
    this.$request.get(url).then((res) => {
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
        } else if (fieldList[i].code == "education") {
          this.hasEducation = true;
        }
      }
    });
    this.$request
      .get("/api/admin/organization/category/listOrganizationCategory")
      .then((res) => {
        this.industryList = this.treeData(res.data);
      });
    this.getMemberFields();
  },
  mounted() {
    var val = this.educationList;
    if (val && val.length) {
      this.newEducationList = JSON.parse(JSON.stringify(val));
      this.newEducationList.push({ key: "10000", title: "教职工" });
    }
  },
};
</script>
<style lang="less" scoped>
.cusdia {
  background: #fff;
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
    button {
      border-color: #3fa1b6;
      color: #3fa1b6;
    }
  }
  .headbox {
    padding: 10px 0 30px 0;
    display: flex;
    align-items: center;
    border-bottom: 1px dashed #e6e6e6;
    img {
      width: 76px;
      height: 76px;
      border-radius: 50%;
    }
    .userinfo {
      margin-left: 20px;
      div {
        font-size: 14px;
        color: #222222;
      }
      p {
        font-size: 14px;
        line-height: 40px;
        color: #888888;
        word-spacing: 10px;
      }
    }
  }

  .fieldbox {
    border-bottom: 1px dashed #e6e6e6;
    font-size: 14px;
    background: white;
    padding: 20px 0;
    h5 {
      font-size: 14px;
      color: #222222;
      display: flex;
      justify-content: space-between;
      align-items: center;
      button {
        color: #3fa1b6;
        font-size: 12px;
        padding: 0;
      }
    }
    .rows {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 25px;
      .rowpart {
        width: 20%;
        margin-bottom: 15px;
        color: #393939;
        display: flex;
        align-items: center;
        height: 30px;
        line-height: 30px;
        padding-right: 20px;
        span {
          flex-shrink: 0;
          white-space: nowrap;
        }
        img {
          margin-right: 5px;
          width: 25px;
          height: 25px;
        }
        div {
          flex: 1;
          height: 30px;
          display: flex;
          align-items: center;
          /deep/.el-date-editor.el-input {
            width: initial;
          }
        }
      }
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
        width: 20%;
        padding-right: 20px;
        .custom-el-form-item-label {
          width: 60px;
          flex-shrink: 0;
          text-align: right;
        }
        div {
          width: 193px;
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
      width: 16px;
      height: 16px;
      background: #fcf4ed;
      border-radius: 4px;
      margin-right: 9px;
      position: relative;
      i {
        width: 5px;
        height: 5px;
        background: #eca038;
        border-radius: 50%;
        position: absolute;
        left: 5px;
        top: 5px;
      }
    }
    p {
      font-size: 14px;
      color: #393939;
      margin-right: 20px;
    }
    .operatebox {
      margin-left: auto;
      button {
        color: #3fa1b6;
        padding: 0;
        font-size: 12px;
      }
    }
  }
  .row2 {
    display: flex;
    width: 100%;
    padding-left: 25px;
    margin-top: 10px;
    div {
      padding: 0 8px;
      font-size: 14px;
      background: #f9f9f9;
      margin-right: 10px;
      line-height: 20px;
      color: #88989e;
      white-space: nowrap;
    }
  }
  .noCompany {
    margin-top: -10px;
    padding-left: 0;
  }
  .expbox {
    display: flex;
    flex-wrap: wrap;
    padding-left: 14px;
    .rows {
      background: rgba(249, 249, 249, 0.42);
      padding: 11px;
      margin-right: 20px;
      width: 430px;
      .row1 {
        height: 18px;
        span {
          background: #edfbfc;
          i {
            background: #63bcc0;
          }
        }
        strong {
          font-weight: normal;
          font-size: 12px;
          color: #c6c6c6;
        }
      }
    }
  }
}
</style>

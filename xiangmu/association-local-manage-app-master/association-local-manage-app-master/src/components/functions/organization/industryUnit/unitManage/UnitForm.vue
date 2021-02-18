<template>
  <el-container>
    <el-main class="unset-padding" style="overflow: hidden;height: 500px;">
      <vue-scroll>
        <el-form size="small" label-width="160px">
          <el-form-item>
            <template v-slot:label>
              <div class="custom-el-form-item-label required">
                企业全称：
              </div>
            </template>
            <el-input :maxlength="100" placeholder="单位名称，100字以内"
                      v-model="unitInfo.organizationName"></el-input>
          </el-form-item>
          <el-form-item>
            <template v-slot:label>
              <div>企业logo：</div>
            </template>
            <div class="flex">
              <div style="width: 80px;height: 80px;background-color: rgb(136, 136, 136);">
                <el-image v-if="unitInfo.logoUrl" :src="unitInfo.logoUrl"
                          style="width: 100%;height: 100%;" fit="cover"></el-image>
              </div>
              <div class="flex flex-column flex-end" style="padding-left: 10px;">
                <div style="color: red;font-size: 12px;">请上传1:1比例的图片，单张图片质量应小于1M</div>
                <div>
                  <el-upload
                      :action="action" :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :on-success="handleAvatarSuccess"
                      accept="image/png,image/jpeg,image/gif,image/jpg"
                  >
                    <el-button size="small" type="primary">上传logo</el-button>
                  </el-upload>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <template v-slot:label>
              <div>企业执照：</div>
            </template>
            <div class="flex">
              <div style="width: 80px;height: 80px;background-color: rgb(136, 136, 136);">
                <el-image v-if="unitInfo.businessUrl" :src="unitInfo.businessUrl"
                          style="width: 100%;height: 100%;" fit="cover"></el-image>
              </div>
              <div class="flex flex-column flex-end" style="padding-left: 10px;">
                <div style="color: red;font-size: 12px;">请上传1:1比例的图片，单张图片质量应小于1M</div>
                <div>
                  <el-upload
                      :action="action" :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :on-success="handlebusinessUrl"
                      accept="image/png,image/jpeg,image/gif,image/jpg"
                  >
                    <el-button size="small" type="primary">上传logo</el-button>
                  </el-upload>
                </div>
              </div>
            </div>
          </el-form-item>
          <!-- <el-form-item>
              <template v-slot:label>
                  <div class="custom-el-form-item-label">
                      所属行业：
                  </div>
              </template>
              <industry-choose style="width: 100%;" v-model="unitInfo.organizationClasses"/>
          </el-form-item> -->
          <el-form-item>
            <template v-slot:label>
              <div class="custom-el-form-item-label">
                企业位置：
              </div>
            </template>
            <city-choose :isToArea="true" show-city v-model="unitInfo.organizationAddress"/>
          </el-form-item>
          <el-form-item>
            <template v-slot:label>
              <div class="custom-el-form-item-label">
                企业详细地址：
              </div>
            </template>
            <el-input placeholder="请输入单位联系地址，100字以内" :maxlength="100" v-model="unitInfo.contactAddress"/>
          </el-form-item>
          <el-form-item>
            <template v-slot:label>
              <div class="custom-el-form-item-label">
                联系人姓名：
              </div>
            </template>
            <el-input placeholder="请输入单位联系人姓名，10字以内" :maxlength="10" v-model="unitInfo.contactPerson"/>
          </el-form-item>
          <el-form-item>
            <template v-slot:label>
              <div class="custom-el-form-item-label">
                联系方式：
              </div>
            </template>
            <el-input placeholder="请输入单位联系人联系方式，固话或手机号，20字以内" :maxlength="20"
                      v-model="unitInfo.contactPhone"/>
          </el-form-item>
          <el-form-item>
            <template v-slot:label>
              <div>
                单位描述：
              </div>
            </template>
            <editor v-model="unitInfo.descriptions"></editor>
          </el-form-item>
          <el-form-item v-for="(item,index) in keyWords" :key="index">
            <template v-slot:label>
              <div :class="{'custom-el-form-item-label':true, 'required':item.required}">
                {{ item.title }}：
              </div>
            </template>
            <el-input v-if="item.type==0" :placeholder="'请输入单位联系地址'+item.title" v-model="unitInfo[item.key]"/>
            <el-select v-else-if="item.type==1" filterable v-model="unitInfo[item.key]" placeholder="请选择" size="mini">
              <el-option v-for="(selectItem,selectIndex) in typeList[item.key]" :key="selectIndex" :label="selectItem"
                         :value="selectItem"></el-option>
            </el-select>
            <el-date-picker v-else-if="item.type==2" v-model="unitInfo[item.key]" type="year"
                            placeholder="选择年"></el-date-picker>
          </el-form-item>
        </el-form>
      </vue-scroll>
    </el-main>
    <el-footer style="padding: 16px 0 0;" height="auto">
      <div class="text-align-right">
        <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import IndustryChoose from "../industryManage/IndustryChoose";
import CityChoose from "../../../util/city/CityChoose";
import {requestBaseUrl} from '../../../../../js/config/serviceConfig';
import Editor from "../../../../util/editor/Editor";
import {majorList, collegeList, natureList} from './majorList'

export default {
  name: "UnitForm",
  components: {Editor, CityChoose, IndustryChoose},
  props: ["id"],
  data() {
    return {
      action: requestBaseUrl + '/api/common/anon/uploadFile',//图片上传地址
      unitInfo: {
        contactAddress: '',
        contactPerson: '',
        contactPhone: '',
        // isSchoolFellow: false,
        organizationClasses: [],
        organizationName: '',
        organizationAddress: [],
        descriptions: '',
        schoolFellowName: '',
        schoolFellowPhone: '',
        logoUrl: '',
        businessUrl: '',
        shortName: '',
        creditCode: '',
        organizationNature: '',
        organizationScale: '',
        contactPhone: '',
        organizationEmail: '',
        organizationWebsite: '',
        schoolFellowName: '',
        sex: '',
        schoolFellowPhone: '',
        job: '',
        education: '',
        entranceDate: '',
        college: '',
        major: '',
        cless: '',
        studentNo: ''
      },
      keyWords: [
        {key: "shortName", title: "企业简称", type: 0, required: false},
        {key: "creditCode", title: "统一社会信用代码", type: 0, required: false},
        {key: "organizationNature", title: "企业性质", type: 1, required: false},
        {key: "industry", title: "所属行业", type: 1, required: false},
        {key: "organizationScale", title: "企业规模", type: 1, required: false},
        {key: "organizationEmail", title: "企业邮箱", type: 0, required: false},
        {key: "organizationWebsite", title: "企业官网", type: 0, required: false},
        {key: "schoolFellowName", title: "校友姓名", type: 0, required: false},
        {key: "sex", title: "校友性别", type: 1, required: false},
        {key: "schoolFellowPhone", title: "校友手机号", type: 0, required: false},
        {key: "job", title: "校友本单位职务", type: 0, required: false},
        {key: "education", title: "校友本校经历", type: 1, required: false},
        {key: "entranceDate", title: "校友就读年份", type: 2, required: false},
        {key: "college", title: "校友所在学院", type: 1, required: false},
        {key: "major", title: "校友专业", type: 1, required: false},
        {key: "cless", title: "校友班级", type: 0, required: false},
        {key: "studentNo", title: "校友学号", type: 0, required: false}
      ],
      typeList: {
        organizationNature: natureList,
        organizationScale: ['0~20人', '20~99人', '100~499人', '500~999人', '1000~9999人', '10000人以上'],
        sex: ['男', '女'],
        education: ['专科', '本科', '硕士', '博士', '教职工'],
        college: collegeList,
        major: majorList,
        industry: []
      },
    }
  },
  methods: {
    getIndustry() {
      this.$request.get('/api/admin/organization/category/listOrganizationCategory').then(res => {
        if (res.success) {
          this.typeList.industry = res.data.map(item => item.title);
        }
      })
    },
    // 上传本地图片   限制图片大小
    beforeAvatarUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!');
        return false
      }
    },
    handleAvatarSuccess(res, file) {
      this.unitInfo.logoUrl = file.response.data;
    },
    handlebusinessUrl(res, file) {
      this.unitInfo.businessUrl = file.response.data;
    },
    submitData() {
      var that = this;
      if (!this.unitInfo.organizationName) {
        this.$message.warning('请输入单位名称');
        return;
      }

      var flag = false;
      this.keyWords.some(item => {
        if (item.required && !that.unitInfo[item.key]) {
          if (item.type == 0) {
            this.$message.warning('请输入' + item.title);
          } else {
            this.$message.warning('请选择' + item.title);
          }
          flag = true;
          return true;
        }
      })
      if (flag) {
        return false;
      }
      let data = {...this.unitInfo};
      if (this.unitInfo.organizationAddress.length > 0) {
        data.organizationAddress = JSON.stringify({
          country: data.organizationAddress[0],
          province: data.organizationAddress[1],
          city: data.organizationAddress[2],
        });
      } else {
        data.organizationAddress = JSON.stringify({});
      }

      if (this.id) {
        data.id = this.id;
        this.$request.put('/api/admin/organization/updateOrganization', data).then(() => {
          this.$emit('refresh-list');
          this.$emit('close');
          this.$message.success('单位信息修改成功');
        })
      } else {

        this.$request.post('/api/admin/organization/addOrganization', data).then(() => {
          this.$emit('refresh-list');
          this.$emit('close');
          this.$message.success('单位新增成功');
        })
      }
    },
    getData() {
      if (this.id) {
        this.$request.get('/api/admin/organization/getOrganizationDetailsById', {
          params: {
            id: this.id
          }
        }).then(res => {
          let data = res.data;

          this.unitInfo.contactAddress = data.contactAddress;
          this.unitInfo.contactPerson = data.contactPerson;
          this.unitInfo.contactPhone = data.contactPhone;
          // this.unitInfo.isSchoolFellow = data.isSchoolFellow;
          this.unitInfo.descriptions = data.descriptions;
          this.unitInfo.logoUrl = data.logoUrl;
          this.unitInfo.businessUrl = data.businessUrl
          this.unitInfo.organizationName = data.organizationName;
          var arr = [
            JSON.parse(data.organizationAddress).country,
            JSON.parse(data.organizationAddress).province,
            JSON.parse(data.organizationAddress).city,
          ]
          this.unitInfo.organizationAddress = arr;
          this.unitInfo.schoolFellowName = data.schoolFellowName;
          this.unitInfo.schoolFellowPhone = data.schoolFellowPhone;
          let organizationClasses = [];

          data.categories.forEach(industry => {
            organizationClasses.push(industry.id);
          });


          this.unitInfo.organizationClasses = organizationClasses;
          this.keyWords.forEach(item => {
            this.unitInfo[item.key] = data[item.key];
          })
        })
      }
    }
  },
  created() {
    this.getData();
    this.getIndustry();
  }
}
</script>


<template>
  <el-container class="cusdia">
    <div class="elheader">
      <div class="headtitle">修改校友卡信息</div>
      <div>
        <el-button size="small" @click="$emit('close')">返回</el-button>
        <el-button class="primaryBtnClass" size="small" @click="save()">保存</el-button>
      </div>
    </div>
    <el-header height="60px"></el-header>
    <el-main class="unset-padding position-relative flex">
      <div class="card-fields-container">
        <el-form ref="form" :model="model" :rules="rules" label-width="110px" size="small">
          <el-row class="form-box-0">
            <h3 class="card-fields-title">基本信息</h3>
            <div class="fields-and-photo flex flex-wrap">
              <div class="card-fields flex flex-wrap">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="model.name"></el-input>
                </el-form-item>
                <el-form-item label="英文名" prop="englishName">
                  <el-input v-model="model.englishName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-select v-model="model.sex" placeholder="请选择性别">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="卡号" prop="cardNo">
                  <el-input v-model="model.cardNo"></el-input>
                </el-form-item>
              </div>
              <div class="card-photo">
                <img :src="model.photo"/>
                <el-upload :action="action" :on-success="uploadSuccess" :before-upload="beforeUpload"
                           :show-file-list="false" accept="image/png,image/jpeg,image/gif,image/jpg">
                  <el-button size="small" type="text">重新上传</el-button>
                </el-upload>
              </div>
            </div>
          </el-row>
          <el-row class="form-box-1">
            <h3 class="card-fields-title">在校经历</h3>
            <div class="flex flex-wrap" style="justify-content: space-between">
              <div v-for="(item, index) in fieldsInfo[model.type]" :key="index">
                <el-form-item v-if="item.topicType === 0" :label="item.label" :prop="item.code" :rules="item.rules">
                  <el-input v-model="model[item.code]"></el-input>
                </el-form-item>
                <el-form-item v-if="item.topicType === 5" :label="item.label" :prop="item.code" :rules="item.rules">
                  <el-date-picker v-model="model[item.code]" type="year" value-format="yyyy" size="small" :clearable="false"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="item.code === 'identity'" :label="item.label" :prop="item.code">
                  <el-select v-model="model[item.code]">
                    <el-option v-for="option of identityOptions" :key="option.title" :value="option.title"
                               :label="option.title"/>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-row>

          <el-row class="form-box-1" v-if="cardSettings.enablePhysicsCard">
            <div class="flexbox">
              <h3 class="card-fields-title">实体卡申领信息</h3>
              <div class="swithbox">
                <el-switch v-model="model.needPhysicalCard" active-text="已申领" inactive-text="未申领"></el-switch>
              </div>
            </div>
            <el-form-item label="申领状态" prop="cardStatus" class="cardStatus" v-if="model.needPhysicalCard">
              <div class="stepbox">
                <div @click="toStep('1')"><img :src="stepImg(1)" alt="">待制卡</div><span></span>
                <div @click="toStep('2')"><img :src="stepImg(2)" alt="">已制卡</div><span></span>
                <div @click="toStep('3')"><img :src="stepImg(3)" alt="">已送出</div>
              </div>
            </el-form-item>
            <div class="flex flex-wrap" style="justify-content: space-between" v-if="model.needPhysicalCard">
              <template v-for="(item, index) in physicalCardFields">
                <el-form-item :key="index" v-if="item.topicType === 0&&showField(item)&&(item.code!='deliveryCode'||(model.cardStatus=='3'))" :label="item.label" :prop="item.code" :rules="item.rules">
                  <el-input v-model="model[item.code]"></el-input>
                </el-form-item>
                <el-form-item :key="index" v-else-if="item.topicType === 5&&showField(item)" :label="item.label" :prop="item.code" :rules="item.rules">
                  <el-date-picker v-model="model[item.code]" type="year" value-format="yyyy" size="small" :clearable="false"></el-date-picker>
                </el-form-item>
                <el-form-item :key="index" v-else-if="item.topicType === 6&&showField(item)" :label="item.label" :prop="item.code" :rules="item.rules">
                  <city-choose :key="index" size="small" v-model="model[item.code]" :show-city="true" :show-area="true"/>
                </el-form-item>
                <el-form-item :key="index" v-else-if="item.topicType === 2&&showField(item)&&(item.code!='deliveryType'||(model.cardStatus=='3'))" :label="item.label" :prop="item.code" :rules="item.rules">
                  <el-select v-model="model[item.code]">
                    <el-option v-for="option of item.parameter.options" :key="option.key" :value="option.key" :label="option.title"/>
                  </el-select>
                </el-form-item>
              </template>
            </div>
          </el-row>
        </el-form>
      </div>
      <div class="card-review">
        <h3>校友卡预览</h3>
        <div class="card-view">
          <el-row>
            <div class="card-logo block">
              <el-image :src="cardSettings.logo">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="card-tab">
              校友卡
            </div>
          </el-row>
          <el-row>
            <div class="card-view-fields" style="max-width: 200px">
              <el-row class="card-name">
                <span  style="white-space: nowrap">{{ model.name }}</span>
                <p>{{ model.type == '0' ? "学生" : "教职工" }}</p>
              </el-row>
              <el-row class="card-info" style="align-items: flex-start">
                <span  style="white-space: nowrap">{{ model.type == '0' ? "专业" : "职务" }}</span>
                <p>{{ model.type == '0' ? model.major : model.job }}</p>
              </el-row>
              <el-row class="card-info" style="align-items: flex-start">
                <span  style="white-space: nowrap">{{ model.type == '0' ? "学院" : "单位" }}</span>
                <p>{{ model.type == '0' ? model.college : model.department }}</p>
              </el-row>
              <el-row class="card-no">
                <span  style="white-space: nowrap">No.{{ model.cardNo }}</span>
              </el-row>
            </div>
            <img :src="model.photo" class="card-img"/>
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import {requestBaseUrl} from "@/js/config/serviceConfig";
import CityChoose from "@/components/functions/organization/member/allMember/memberForm/CityChoose";
export default {
  name: "CardDetail",
  props: {
    cardId: {
      type: String,
      default: ''
    },
  },
  components:{CityChoose},
  data() {
    return {
      rules: {
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '性别不能为空', trigger: 'blur'}
        ],
        cardNo: [
          {required: true, message: '卡号不能为空', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              this.$request.get('/api/admin/member/card/memberCardIdByCardNo', {params: {cardNo: value}}).then((result) => {
                let id = result.data;
                if (id && this.model.id !== id) {
                  callback(new Error("当前卡号已存在"));
                  return ;
                }
                callback();
              });
            }, trigger: 'blur'
          },
        ],
      },
      action: requestBaseUrl + '/api/common/anon/uploadFile',
      model: {},
      cardSettings: {logo: ''},
      deliveryTypes:[],
      identityOptions: [],
      fieldsInfo: {
        0: [
          {
            code: "identity",
            label: "学历",
            topicType: 2,
            rules: {}
          },
          {
            code: "entranceDate",
            label: "入学年",
            topicType: 5,
            rules: {}
          },
          {
            code: "graduationDate",
            label: "毕业年",
            topicType: 5,
            rules: {}
          },
          {
            code: "college",
            label: "学院",
            topicType: 0,
            rules: {required: true, message: '学院不能为空', trigger: 'blur'}
          },
          {
            code: "major",
            label: "专业",
            topicType: 0,
            rules: {required: true, message: '专业不能为空', trigger: 'blur'}
          },
          // {
          //   code: "cless",
          //   label: "班级",
          //   topicType: 0,
          //   rules: {}
          // },
          // {
          //   code: "studentNo",
          //   label: "学号",
          //   topicType: 0,
          //   rules: {}
          // }
        ],
        1: [
          {
            code: "department",
            label: "就职部门",
            topicType: 0,
            rules: {required: true, message: '就职部门不能为空', trigger: 'blur'}
          },
          {
            code: "job",
            label: "职务",
            topicType: 0,
            rules: {required: true, message: '职务不能为空', trigger: 'blur'}
          },
          {
            code: "jobNo",
            label: "工号",
            topicType: 0,
            rules: {}
          }
        ]
      },
      physicalCardFields:[
        {
          code: "receiveWay",
          label: "领取方式",
          topicType: 2,
          rules: {required: true, message: '领取方式不能为空', trigger: 'blur'},
          parameter: {
            options: [{key:"0",title:"自取"},{key:"1",title:"邮寄"},{key:"2",title:"他人代领"}],
          },
        },
        {
          code: "pickupAddress",
          label: "领取地址",
          topicType: 0,
          rules: {required: true, message: '请输入领取地址', trigger: ["blur", "change"]},
          show:[{key:"receiveWay",value:"0"},{key:"receiveWay",value:"2"}]
        },
        {
          code: "receiverName",
          label: "收件人姓名",
          topicType: 0,
          rules: {required: true, message: '请输入收件人姓名', trigger: ["blur", "change"]},
          show:[{key:"receiveWay",value:"1"}]
        },
        {
          code: "receiverPhone",
          label: "收件人手机号",
          topicType: 0,
          rules: {required: true, message: '请输入收件人手机号', trigger: ["blur", "change"]},
          show:[{key:"receiveWay",value:"1"}]
        },
        {
          code: "areaAddress",
          label: "所在地区",
          topicType: 6,
          show:[{key:"receiveWay",value:"1"}]
        },
        {
          code: "detail",
          label: "详细地址",
          topicType: 0,
          rules: {required: true, message: '请输入详细地址', trigger: ["blur", "change"]},
          show:[{key:"receiveWay",value:"1"}]
        },
        {
          code: "deliveryType",
          label: "邮寄快递",
          topicType: 2,
          parameter: {
            options: this.deliveryTypes,
          },
          show:[{key:"receiveWay",value:"1"}]
        },
        {
          code: "deliveryCode",
          label: "快递单号",
          topicType: 0,
          show:[{key:"receiveWay",value:"1"}]
        },
        {
          code: "substituteName",
          label: "代领人",
          topicType: 0,
          rules: {required: true, message: '请输入代领人姓名', trigger: ["blur", "change"]},
          show:[{key:"receiveWay",value:"2"}]
        },
      ],
      inactiveImg:require("./img/inactive.png"),
      activeImg:require("./img/active.png"),
    }
  },
  methods: {
    showField(item){
      if(item.show){
        for(var i=0;i<item.show.length;i++){
          if(this.model[item.show[i].key] == item.show[i].value ){
            return true
          }
        }
        return false
      }else{
        return true
      }
    },
    toStep(index){
      this.model.cardStatus = index
    },
    stepImg(index){
      if(Number(this.model.cardStatus)>=index){
        return this.activeImg
      }else{
        return this.inactiveImg
      }
    },
    detail() {
      this.$request.get('/api/admin/member/card/detail', {params: {id: this.cardId}}).then((cardInfo) => {
        this.model = JSON.parse(JSON.stringify(cardInfo.data));
        try {
          var address = JSON.parse(this.model.receiverAddress)
          this.$set(this.model,"detail",address.detail)
          // this.model.detail = address.detail
          delete address.detail
          this.model.areaAddress = JSON.stringify(address)
        } catch (error) {

        }
      });
      this.$request.get('api/admin/settings/manage/getCommonSetting?type=20').then((cardSettings) => {
        this.cardSettings = JSON.parse(JSON.stringify(cardSettings.data));
        this.deliveryTypes = this.cardSettings.deliveryTypes.map((item)=>{
          return {key:item,title:item}
        })
        this.physicalCardFields.map(item=>{
          if(item.code=="deliveryType"){
            item.parameter.options = this.deliveryTypes
          }
        })
      });
      this.$request.get('/api/common/associator/historyCollege/educations').then(res => {
        this.identityOptions = res.data;
      });
    },
    beforeUpload(file) {
      if (file.size > 100 * 1024 * 1024) {
        this.$message.warning(`【${file.name}】上传失败，图片大小应不大于100M`);
        return false;
      }
      return true;
    },
    uploadSuccess(response) {
      this.model.photo = response.data;
    },
    save() {
      this.$refs.form.validate((valid)=>{
        if(valid){
          var newmodel = JSON.parse(JSON.stringify(this.model))
          if(!newmodel.needPhysicalCard){
            this.physicalCardFields.map(item=>{
              newmodel[item.code] = ""
            })
            newmodel.cardStatus = "0"
            newmodel.receiverAddress = ""
          }
          if(newmodel.receiveWay=="0"){
            newmodel.receiverName = ""
            newmodel.receiverPhone = ""
            newmodel.receiverAddress = ""
            newmodel.deliveryType = ""
            newmodel.deliveryCode = ""
            newmodel.substituteName = ""
          }else if(newmodel.receiveWay=="1"){
            if(newmodel.cardStatus!='3'){
              newmodel.deliveryType = ""
              newmodel.deliveryCode = ""
            }
            newmodel.pickupAddress = ""
            newmodel.substituteName = ""
            var areaAddress = newmodel.areaAddress?JSON.parse(newmodel.areaAddress):{}
            areaAddress.detail = newmodel.detail
            newmodel.receiverAddress = JSON.stringify(areaAddress)
          }else if(newmodel.receiveWay=="2"){
            newmodel.receiverName = ""
            newmodel.receiverPhone = ""
            newmodel.receiverAddress = ""
            newmodel.deliveryType = ""
            newmodel.deliveryCode = ""
          }
          this.$request.put('/api/admin/member/card/modify', newmodel).then(res => {
            if (res.success) {
              this.$message.success('校友卡信息已更新');
              this.$emit("refresh");
              this.$emit("close");
            }
          })
        }
      })
    }
  },
  created() {
    this.detail();
  }
}
</script>

<style lang="less" scoped>
.card-view {
  background-image: url('./img/card-bg.png');
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
  width: 410px;
  padding-bottom: 23px;
}
.card-logo {
  float: left;
  margin-left: 25px;
  margin-top: 28px;
}
.card-tab {
  background-image: url('./img/card-tab.png');
  width: 90px;
  height: 36px;
  color: #fff;
  right: 0;
  float: right;
  text-align: center;
  line-height: 40px;
  margin-top: 23px;
}
.card-view-fields {
  float: left;
  margin-left: 35px;
  font-size: 14px;
  .el-row {
    display: flex;
    align-items: center;
  }
  .card-name {
    margin-top: 20px;
    span {
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
    p {
      margin-left: 10px;
      font-size: 14px;
      color: #5B5B5B;
      line-height: 20px;
    }
  }
  .card-info {
    margin-top: 10px;
    span {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 20px;
    }
    p {
      margin-left: 10px;
      font-size: 14px;
      color: #5B5B5B;
      line-height: 20px;
    }
  }
  .card-no {
    margin-top: 19px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }
}

.card-img {
  width: 104px;
  height: 140px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
  border: 3px solid #FFFFFF;
  float: right;
  margin-top: 20px;
  margin-right: 30px;
  object-fit: cover;
}

.cusdia {
  background: white;
  height: 100%;
  .card-fields-container {
    height: 100%;
    flex: 1;
    border-right: 2px dotted rgb(239 239 239);
    /deep/ .el-form-item__content {
      width: 180px;
      .el-date-editor {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
    .card-fields-title {
      margin-top: 10px;
      font-size: 16px;
      font-weight: 500;
      color: #222222;
      line-height: 50px;
    }
    .card-fields {
      width: 500px;
    }
    .card-photo {
      width: 104px;
      height: 140px;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
      border: 3px solid #FFFFFF;
      text-align: center;
      img {
        width: 104px;
        height: 140px;
        object-fit: cover;
      }
      div {
        line-height: 50px;
      }
    }
  }
  .card-review {
    width: 40%;
    height: 100%;
    background-size: cover;
    h3 {
      margin-top: 20px;
      margin-left: 18px;
      font-size: 16px;
      font-weight: 500;
      color: #222222;
      line-height: 22px;
    }
  }
  .elheader {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    right: 0;
    line-height: 60px;
    padding: 0 20px;
    background: white;
    margin-bottom: 10px;
    font-size: 16px;
    box-shadow: 0 2px 4px 0 hsla(0, 0%, 68%, .27);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .headtitle {
      border-left: 3px solid black;
      height: 24px;
      line-height: 24px;
      padding-left: 9px;
      font-size: 20px;
      color: #465361;
      font-weight: 600;
    }
  }
}

.form-box-0 {
  width: 610px;
  margin-left: 18px;
}

.form-box-1 {
  width: 610px;
  border-top: 2px dotted rgb(239 239 239);
  margin-left: 18px;
  margin-top: 10px;
  .flexbox{
    display: flex;
    justify-content: space-between;
    .swithbox{
      margin-top: 10px;
      line-height: 50px;
    }
  }
  .cardStatus /deep/ .el-form-item__content{
    width: initial;
  }
  .stepbox{
    display: flex;
    align-items: center;
    div{
      white-space: nowrap;
      cursor: pointer;
      img{
        width: 26px;
        margin-right: 7px;
      }
    }
    span{
      height: 1px;
      width: 18px;
      background: #E8E8E8;
      margin: 0 8px;
    }
  }
}


</style>

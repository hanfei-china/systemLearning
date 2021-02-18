<template>
  <el-container class="cusdia">
    <div class="elheader">
      <div class="headtitle">校友卡信息</div>
      <div>
        <el-button size="small" @click="$emit('close')">返回</el-button>
        <el-button class="primaryBtnClass" size="small" @click="$emit('edit', cardId)">修改</el-button>
      </div>
    </div>
    <el-header height="60px"></el-header>
    <el-main class="unset-padding position-relative flex">
      <div class="card-fields-container">
        <h3 class="card-fields-title">校友卡信息</h3>
        <div class="fields-and-photo flex">
          <div class="card-fields flex flex-wrap">
            <div class="card-field flex" v-for="(item, index) in fieldsInfo[model.type]" :key="index">
              <span>{{ item.label }}：</span>
              <p v-if="item.code === 'type' && model.type === '0'">学生卡</p>
              <p v-else-if="item.code === 'type' && model.type === '1'">教职工卡</p>
              <p v-else>{{ model[item.code] }}</p>
            </div>
          </div>
          <div class="card-photo">
            <img :src="model.photo"/>
          </div>
        </div>


        <el-row class="form-box-1" v-if="cardSettings.enablePhysicsCard&&model.needPhysicalCard">
            <h3 class="card-fields-title">实体卡申领信息</h3>
            <div class="cardStatus">
              <div class="label">申领状态：</div>
              <div class="stepbox">
                <div><img :src="stepImg(1)" alt="">待制卡</div><span></span>
                <div><img :src="stepImg(2)" alt="">已制卡</div><span></span>
                <div><img :src="stepImg(3)" alt="">已送出</div>
              </div>
            </div>

            <div class="card-fields flex flex-wrap">
              <template v-for="(item, index) in physicalCardFields">
                <div class="card-field flex" :key="index" v-if="item.topicType === 0&&showField(item)&&(item.code!='deliveryCode'||(model.cardStatus=='3'))">
                  <span>{{ item.label }}：</span>
                  <p v-if="item.code=='receiverAddress'">{{model[item.code]|addressFilter}}</p>
                  <p v-else>{{ model[item.code] }}</p>
                </div>
                <div class="card-field flex" :key="index" v-else-if="item.topicType === 2&&showField(item)&&(item.code!='deliveryType'||(model.cardStatus=='3'))">
                  <span>{{ item.label }}：</span>
                  <p>{{ getOptonName(item.parameter.options,model[item.code]) }}</p>
                </div>
              </template>
            </div>
          </el-row>


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
                <span style="white-space: nowrap">{{ model.name }}</span>
                <p>{{ model.type == '0' ? model.identity : "教职工" }}</p>
              </el-row>
              <el-row class="card-info" style="align-items: flex-start">
                <span style="white-space: nowrap">{{ model.type == '0' ? "学院" : "单位" }}</span>
                <p>{{ model.type == '0' ? model.college : model.department }}</p>
              </el-row>
              <el-row class="card-info" style="align-items: flex-start">
                <span style="white-space: nowrap">{{ model.type == '0' ? "专业" : "职务" }}</span>
                <p>{{ model.type == '0' ? model.major : model.job }}</p>
              </el-row>
              <el-row class="card-no">
                <span style="white-space: nowrap">No.{{ model.cardNo }}</span>
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
export default {
  name: "CardDetail",
  props: {
    cardId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      fieldsInfo: {
        0: [
          {
            code: "name",
            label: "姓名",
          },
          {
            code: "sex",
            label: "性别",
          },
          {
            code: "type",
            label: "类型",
          },
          {
            code: "identity",
            label: "学历",
          },
          {
            code: "entranceDate",
            label: "入学年",
          },
          {
            code: "graduationDate",
            label: "毕业年",
          },
          {
            code: "college",
            label: "学院",
          },
          {
            code: "major",
            label: "专业",
          },
          // {
          //   code: "cless",
          //   label: "班级",
          // },
          // {
          //   code: "studentNo",
          //   label: "学号",
          // }
        ],
        1: [
          {
            code: "name",
            label: "姓名",
          },
          {
            code: "sex",
            label: "性别",
          },
          {
            code: "type",
            label: "类型",
          },
          {
            code: "department",
            label: "就职部门",
          },
          {
            code: "job",
            label: "职务",
          },
          {
            code: "jobNo",
            label: "工号",
          }
        ]
      },
      model: {},
      cardSettings: {logo: ''},
      inactiveImg:require("./img/inactive.png"),
      activeImg:require("./img/active.png"),
      deliveryTypes:[],
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
          code: "receiverAddress",
          label: "收件地址",
          topicType: 0,
          rules: {required: true, message: '请输入收件地址', trigger: ["blur", "change"]},
          show:[{key:"receiveWay",value:"1"}]
        },
        {
          code: "deliveryType",
          label: "邮寄快递",
          topicType: 2,
          rules: {required: true, message: '请选择邮寄快递', trigger: ["blur", "change"]},
          parameter: {
            options: this.deliveryTypes,
          },
          show:[{key:"receiveWay",value:"1"}]
        },
        {
          code: "deliveryCode",
          label: "快递单号",
          topicType: 0,
          rules: {required: true, message: '请输入快递单号', trigger: ["blur", "change"]},
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
    }
  },
  methods: {
    getOptonName(options,value){
      var str = ""
      if(options&&options.length){
        options.map(item=>{
          if(item.key==value){
            str = item.title
          }
        })
      }
      return str
    },
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

    .card-fields-title {
      margin-top: 10px;
      margin-left: 18px;
      font-size: 16px;
      font-weight: 500;
      color: #222222;
      line-height: 50px;
    }

    .card-fields {
      width: 500px;
    }

    .card-field {
      width: 50%;
      line-height: 20px;
      margin: 10px 0;
      span {
        width: 110px;
        text-align: right;
        color: #393939;
        flex-shrink: 0;
      }

      p {
        color: rgba(124, 124, 124, 0.85);
      }
    }

    .card-photo {
      width: 104px;
      height: 140px;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.07);
      border: 3px solid #FFFFFF;
      img {
        width: 104px;
        height: 140px;
        object-fit: cover;
      }
    }
  }

  .card-review {
    width: 40%;
    height: 100%;

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



.form-box-1 {
  border-top: 2px dotted rgb(239 239 239);
  margin-top: 30px;
  .cardStatus{
    display: flex;
    align-items: center;
    height: 40px;
    .label{
      width: 110px;
      text-align: right;
    }
    .stepbox{
      display: flex;
      align-items: center;
      div{
        white-space: nowrap;
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

}
</style>

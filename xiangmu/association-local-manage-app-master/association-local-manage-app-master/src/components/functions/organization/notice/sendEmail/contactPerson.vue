<template>
  <div class="contactPerson">
    <div class="contactPerson-left">
      <div class="contactPerson-left__top">
        <div class="contactPerson-left__topLeft">
          <img src="./image/iconPre.png" alt/>
          <span>选择联系人</span>
        </div>
        <div v-if="contactPerson.length>0" class="contactPerson-left__topRight">
          <img v-if="!selectAllPersonIf" src="./image/ifSelectAll.png" @click="selectAllPerson"/>
          <img v-else src="./image/selectAll.png" alt @click="cancelSelectAll"/>
          <span>所有联系人 共{{ contactPerson.length }}人</span>
        </div>
      </div>
      <div class="contactPerson-left__mid">
        <el-input :disabled="copyIsAllMember" placeholder="姓名、手机、邮箱" prefix-icon="el-icon-search" v-model="searchInfo"></el-input>
      </div>
      <div class="contactPerson-left__bot">
        <div v-if="selectShowList.length>0">联系人</div>
        <ul>
          <li v-for="(item,index) in selectShowList" :key="item.objectId">
            <div v-if="haveSelectList.indexOf(index)===-1" @click="selectOnePerson(item,index)">
              <img src="./image/ifSelectAll.png"/>
              <!-- <img v-else src="./image/selectAll.png" @click="cancelSelectOne(item,index)" /> -->
              <span>{{ item.objectName }}({{ item.device }})</span>
            </div>
            <div v-else @click="cancelSelectOne(item,index)">
              <!-- <img v-if="haveSelectList.indexOf(index)===-1" src="./image/ifSelectAll.png" /> -->
              <img src="./image/selectAll.png"/>
              <span>{{ item.objectName }}({{ item.device }})</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- 标签展示模块 -->
      <div v-if="checkAllShow" class="contactPerson-left_tag">
        <div>标签</div>
        <ul>
          <li @click="copyIsAllMember=!copyIsAllMember"
              :style="{'background-color': copyIsAllMember?'#fff':'#409EFF','color':copyIsAllMember?'#409EFF':'#fff','border-color':copyIsAllMember?'#409EFF':'#fff'}">
            全部（{{ checkAllData.effectiveNum + checkAllData.invalidNum }}）
          </li>
        </ul>
      </div>
    </div>
    <div class="contactPerson-mid"></div>
    <div class="contactPerson-right">
      <template>
        <div class="contactPerson-right__top" v-if="copyIsAllMember">
          <div class="contactPerson-right__topLeft">
            <div>
              <img src="./image/iconPre.png" alt/>
              <span>有效邮箱({{ checkAllData.effectiveNum }})</span>
            </div>
            <div>
              <img src="./image/iconPreError.png" alt/>
              <span>无效邮箱({{ checkAllData.invalidNum }})</span>
            </div>
          </div>
          <div class="contactPerson-right__topRight">
            <span @click="clearCheckAll" v-if="checkAllData.effectiveNum>0||checkAllData.invalidNum>0">全部清空</span>
          </div>
        </div>
        <div v-else class="contactPerson-right__top">
          <div class="contactPerson-right__topLeft">
            <div @click="selectShowListFlag=1">
              <img v-if="selectShowListFlag===1" src="./image/iconPre.png" alt/>
              <img v-else src="./image/iconPreValid.png" alt/>
              <span>有效邮箱({{ showContactPerson.length }})</span>
            </div>
            <div @click="selectShowListFlag=0" v-if="validEmail.length>0">
              <img v-if="selectShowListFlag===0" src="./image/iconPreError.png" alt/>
              <img v-else src="./image/iconPreValid.png" alt/>
              <span>无效邮箱({{ validEmail.length }})</span>
            </div>
          </div>
          <div class="contactPerson-right__topRight">
            <span @click="clearAllPerson  ">全部清空</span>
          </div>
        </div>
      </template>
      <div class="contactPerson-right__bot" v-if="!copyIsAllMember">
        <!-- 展示有效列表 -->
        <ul v-if="selectShowListFlag">
          <li v-for="item in showContactPerson" :key="item.objectId">
            <div>{{ item.objectName }}({{ item.device }})</div>
            <div>
              <img src="./image/cancelSelect.png" @click="deleteOnePerson(item.objectId)"/>
            </div>
          </li>
        </ul>
        <!-- 展示无效列表 -->
        <ul v-if="!selectShowListFlag">
          <li v-for="item in validEmail" :key="item.objectId">
            <div>{{ item.objectName }}({{ item.device }})</div>
            <div>
              <img src="./image/cancelSelect.png" @click="deleteOneValid(item.objectId)"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "contactPerson",
  props: ["contactPerson", 'isAllMember'],
  data() {
    return {
      searchInfo: "",
      contactPersonList: [], //点击全选后勾选的联系人列表
      selectAllPersonIf: false,
      selectPersonList: [], //勾选的联系人列表
      selectShowList: [], //待勾选的联系人列表
      haveSelectList: [], //已勾选的联系人对应的下标列表
      showContactPerson: [], //真正的联系人列表
      validEmail: [], //无效邮箱列表
      selectShowListFlag: 1, //展示有效列表或是无效列表   无效：0   有效：1
      copyIsAllMember: false,
      checkAllShow: true,
      checkAllData: {
        effectiveNum: 0,
        invalidNum: 0
      }
    };
  },
  model: {
    prop: 'isAllMember',
    event: 'change'
  },
  watch: {
    copyIsAllMember(value) {
      if (value) {
        this.deleteAllPerson()
      }
      this.$emit('change', value);
    },
    contactPersonList(val) {
      //去重
      var obj = {};
      var arr = [];
      this.selectPersonList.forEach((item, index) => {
        obj[item.objectId] = index;
      });
      this.contactPersonList.forEach((item, index) => {
        if (obj[item.objectId] !== null && obj[item.objectId] !== undefined) {
          this.contactPersonList.splice(index, 1);
        }
      });
      arr = this.contactPersonList.concat(
        this.selectPersonList
      );
      //有效邮箱筛选
      this.validEmail = [];
      this.showContactPerson = [];
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})(\.([a-zA-z]{2}))?$/;
      arr.forEach((item, index) => {
        if (!reg.test(item.device)) {
          this.validEmail.push(item);
          // this.showContactPerson.splice(index, 1);
        } else {
          this.showContactPerson.push(item);
        }
      });
    },
    selectPersonList(val) {
      //去重
      var obj = {};
      var arr = [];
      this.selectPersonList.forEach((item, index) => {
        obj[item.objectId] = index;
      });
      this.contactPersonList.forEach((item, index) => {
        if (obj[item.objectId] !== null && obj[item.objectId] !== undefined) {
          this.contactPersonList.splice(index, 1);
        }
      });
      arr = this.contactPersonList.concat(
        this.selectPersonList
      );
      //有效邮箱筛选
      this.validEmail = [];
      this.showContactPerson = [];
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})(\.([a-zA-z]{2}))?$/;
      arr.forEach((item, index) => {
        if (!reg.test(item.device)) {
          this.validEmail.push(item);
          // this.showContactPerson.splice(index, 1);
        } else {
          this.showContactPerson.push(item);
        }
      });
    },
    searchInfo(val) {

      this.haveSelectList = [];
      if (val) {
        this.checkAllShow = false
        this.selectShowList = [];
        this.$request
          .get("/api/admin/emailTelPhone/list?emailSearchContent=" + val)
          .then(res => {
            if (res.data.length > 0) {
              res.data.forEach(item => {
                var obj = {
                  objectId: item.id,
                  device: item.email,
                  objectName: item.name,
                  objectType: 1
                };
                this.selectShowList.push(obj);
              });
              // this.selectShowList = JSON.parse(JSON.stringify(res.data));
            } else {
              //成为添加邮箱的方式
              var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})(\.([a-zA-z]{2}))?$/;
              if (reg.test(val)) {
                var obj = {
                  device: val,
                  objectType: 0
                };
                this.selectShowList.push(obj);
              }
            }
          });
      } else {
        this.checkAllShow = true
        this.selectShowList = [];
      }
    },
    showContactPerson(val) {
      this.$emit("getContactPerson", val);
    },
    // contactPerson(val){
    //   this.selectAllPerson();
    //   console.log('执行')
    // }
  },
  created() {
    this.selectAllPerson();
    this.getMemberInfoTelPhone();
  },
  methods: {
    clearCheckAll() {
      this.$confirm("确认取消选择所有联系人?", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.copyIsAllMember = false
          this.$message({
            type: "success",
            message: "清除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消清空"
          });
        });
    },
    getMemberInfoTelPhone() {
      this.$request.get('api/admin/emailTelPhone/getSendEmailAllMemberNum').then(res => {
        this.checkAllData.effectiveNum = res.data.effectiveNum || 0;
        this.checkAllData.invalidNum = res.data.invalidNum || 0;
      })
    },
    //选择所有的联系人
    selectAllPerson() {
      this.selectAllPersonIf = true;
      this.contactPersonList = JSON.parse(JSON.stringify(this.contactPerson));
    },
    //取消选择所有联系人
    cancelSelectAll() {
      this.selectAllPersonIf = false;
      this.contactPersonList = [];
    },
    //勾选一个联系人
    selectOnePerson(info, index) {
      this.selectPersonList.push(info);
      this.haveSelectList.push(index);
    },
    //取消勾选某个联系人
    cancelSelectOne(info, num) {
      this.selectPersonList.forEach((item, index) => {
        if (item.objectId === info.objectId) {
          this.selectPersonList.splice(index, 1);
        }
      });
      var index = this.haveSelectList.indexOf(num);
      this.haveSelectList.splice(index);
    },
    clearAllPerson() {
      this.$confirm("确认清空已选所有联系人?", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteAllPerson()
          this.$message({
            type: "success",
            message: "清除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消清空"
          });
        });
    },
    //清空全部联系人
    deleteAllPerson() {
      this.contactPersonList = [];
      this.selectPersonList = [];
      this.haveSelectList = [];
      this.showContactPerson = [];
      this.selectAllPersonIf = false;
      this.validEmail = [];
      this.selectShowListFlag = 1;
    },
    //清空某个联系人
    deleteOnePerson(id) {
      this.selectPersonList.forEach((item, index) => {
        if (item.objectId === id) {
          this.selectPersonList.splice(index, 1);
        }
      });
      this.contactPersonList.forEach((item, index) => {
        if (item.objectId === id) {
          this.contactPersonList.splice(index, 1);
        }
      });
    },
    //清除某个无效的邮箱
    deleteOneValid(id) {
      this.validEmail.forEach((item, index) => {
        if (item.objectId === id) {
          this.validEmail.splice(index, 1);
        }
      })
    }
  }
};
</script>

<style scoped lang="less">
.contactPerson {
  padding: 20px;
  border-bottom: 1px solid #dfdfdf;
  display: flex;

  .contactPerson-left {
    flex: 1;
    padding-right: 20px;

    .contactPerson-left__top {
      display: flex;
      justify-content: space-between;
      //   margin-bottom: 15px;
      .contactPerson-left__topLeft {
        display: flex;
        display: flex;
        align-items: center;

        img {
          width: 14px;
          height: 18px;
          margin-right: 4px;
        }

        span {
          font-size: 16px;
          color: #323232;
          line-height: 18px;
          height: 18px;
        }
      }

      .contactPerson-left__topRight {
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
          width: 12px;
          height: 12px;
          margin-right: 10px;
        }

        span {
          color: #4f86c5;
          font-size: 14px;
          line-height: 1;
        }
      }
    }

    .contactPerson-left__mid {
      margin: 20px 0 10px 0;
      padding-left: 20px;
    }

    .contactPerson-left__bot {
      padding-left: 20px;

      & > div {
        font-size: 14px;
        color: #dfdfdf;
        padding-top: 10px;
        padding-bottom: 10px;
      }

      ul {
        max-height: 270px;
        // border: 1px solid orange;
        overflow-y: auto;

        li {
          padding: 7px 0;
          margin-bottom: 5px;
          width: 50%;
          cursor: pointer;

          &:hover {
            background-color: #ece6e6;
          }

          img {
            width: 12px;
            height: 12px;
            margin-right: 10px;
          }

          span {
            font-size: 14px;
            line-height: 1;
            color: #323232;
          }
        }
      }
    }
  }

  .contactPerson-mid {
    height: 320px;
    margin: 0 20px;
    border-right: 1px dashed #dfdfdf;
  }

  .contactPerson-left_tag {
    padding-left: 20px;

    & > div {
      font-size: 14px;
      color: #dfdfdf;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    ul {
      max-height: 150px;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;

      li {
        padding: 10px 25px;
        border-radius: 6px;
        margin-right: 15px;
        margin-bottom: 10px;
        cursor: pointer;
        color: #fff;
        border: 1px solid #fff;
        box-sizing: border-box;
      }
    }
  }

  .contactPerson-right {
    flex: 1;

    .contactPerson-right__top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      .contactPerson-right__topLeft {
        display: flex;
        align-items: center;

        div {
          &:nth-child(2n) {
            border-left: 2px solid #e8e8e8;
            margin-left: 20px;
            padding-left: 20px;
          }

          cursor: pointer;

          img {
            width: 14px;
            height: 18px;
            margin-right: 4px;
          }

          span {
            font-size: 16px;
            color: #323232;
            line-height: 18px;
            height: 18px;
          }
        }
      }

      .contactPerson-right__topRight {
        display: flex;
        align-items: center;
        cursor: pointer;

        span {
          font-size: 14px;
          line-height: 1;
          color: #e84731;
          cursor: pointer;
        }
      }
    }

    .contactPerson-right__bot {
      ul {
        max-height: 360px;
        overflow-y: auto;
        padding-left: 20px;
        //   border: 1px solid red;
        li {
          height: 30px;
          float: left;
          display: flex;
          margin-bottom: 15px;
          margin-right: 60px;

          &:nth-child(2n) {
            margin-right: 0;
          }

          //   height: 30px;
          div {
            &:first-child {
              width: 270px;
              font-size: 14px;
              text-align: center;
              padding: 5px 10px;
              border: 1px solid #e8e8e8;
              border-top-left-radius: 3px;
              border-bottom-left-radius: 3px;
            }

            &:last-child {
              width: 15px;
              background-color: #e8e8e8;
              display: flex;
              justify-content: center;
              align-items: center;
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
              cursor: pointer;

              img {
                width: 11px;
                height: 13px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
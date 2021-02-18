<template>
  <div class="contactPerson">
    <!-- 左边 -->
    <div class="contactPerson-left">
      <!-- 头部 -->
      <div class="contactPerson-left__top">
        <div class="contactPerson-left__top__left">
          <img src="../sendEmail/image/iconPre.png" alt/>
          <span>选择联系人</span>
        </div>
        <div v-if="allMemberList.length>0" @click="ifSelectAll=!ifSelectAll" class="contactPerson-left__top__right">
          <img src="../sendEmail/image/ifSelectAll.png" v-if="!ifSelectAll"/>
          <img src="../sendEmail/image/selectAll.png" v-else>
          <span>选择所有联系人 共{{ allMemberList.length }}人</span>
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="contactPerson-left__search">
        <el-input :disabled="copyIsAllMember" placeholder="姓名、手机" prefix-icon="el-icon-search" v-model="searchInfo" clearable></el-input>
      </div>
      <!-- 联系人展示模块 -->
      <div class="contactPerson-left_result">
        <div v-if="personList.length>0">联系人</div>
        <ul>
          <li v-for="item in personList" :key="item.id">
            <div v-if="haveSelectList.indexOf(item.id)===-1" @click="selectOnePerson(item)">
              <img src="../sendEmail/image/ifSelectAll.png"/>
              <span>{{ item.name }}({{ item.telphone }})</span>
            </div>
            <div v-else @click="cancelSelectOne(item)">
              <img src="../sendEmail/image/selectAll.png"/>
              <span>{{ item.name }}({{ item.telphone }})</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- 标签展示模块 -->
      <div class="contactPerson-left_tag">
        <div>标签</div>
        <ul>
          <li v-if="checkAllShow" @click="copyIsAllMember=!copyIsAllMember"
              :style="{'background-color': copyIsAllMember?'#fff':'#409EFF','color':copyIsAllMember?'#409EFF':'#fff','border-color':copyIsAllMember?'#409EFF':'#fff'}">
            全部(&nbsp;{{ checkAllData.errorSum + checkAllData.reasonableSum }}&nbsp;)
          </li>
          <li
            v-for="item in tagsList"
            :key="item.id"
            :style="{'background-color': selectTagsList.indexOf(item.id)>=0?'#fff':item.color,'color':selectTagsList.indexOf(item.id)>=0?item.color:'#fff','border-color':selectTagsList.indexOf(item.id)>=0?item.color:'#fff'}"
            :class="{'selectTag':selectTagsList.indexOf(item.id)>=0,'cannotCheck':copyIsAllMember}"
            @click="!copyIsAllMember&&clickTag(item.id)"
          >{{ item.title }}&nbsp;(&nbsp;{{ item.memberNum }}&nbsp;)
          </li>
        </ul>
      </div>
    </div>
    <!-- 中间的边界 -->
    <div class="contactPerson-border"></div>
    <!-- 右边部分 -->
    <div class="contactPerson-right">
      <!-- 头部 -->
      <template>
        <div class="contactPerson-right__top" v-if="!copyIsAllMember">
          <div class="contactPerson-right__topLeft">
            <div @click="selectShowListFlag=1">
              <img v-if="selectShowListFlag===1" src="../sendEmail/image/iconPre.png" alt/>
              <img v-else src="../sendEmail/image/iconPreValid.png" alt/>
              <span>有效手机号({{ validPerson.length }})</span>
            </div>
            <div @click="selectShowListFlag=0" v-if="invalidPerson.length>0">
              <img v-if="selectShowListFlag===0" src="../sendEmail/image/iconPreError.png" alt/>
              <img v-else src="../sendEmail/image/iconPreValid.png" alt/>
              <span>无效手机号({{ invalidPerson.length }})</span>
            </div>
          </div>
          <div class="contactPerson-right__topRight">
            <span @click="deleteAllPerson" v-if="allPersonList.length>0">全部清空</span>
          </div>
        </div>
        <div class="contactPerson-right__top" v-if="copyIsAllMember">
          <div class="contactPerson-right__topLeft">
            <div v-if="checkAllData.reasonableSum>0">
              <img src="../sendEmail/image/iconPre.png" alt/>
              <span>有效手机号({{ checkAllData.reasonableSum }})</span>
            </div>
            <div v-if="checkAllData.errorSum>0">
              <img src="../sendEmail/image/iconPreError.png" alt/>
              <span>无效手机号({{ checkAllData.errorSum }})</span>
            </div>
          </div>
          <div class="contactPerson-right__topRight">
            <span @click="clearCheckAll"
                  v-if="checkAllData.errorSum>0||checkAllData.reasonableSum>0">全部清空</span>
          </div>
        </div>
      </template>
      <!-- 联系人展示 -->
      <div class="contactPerson-right__bot" v-if="!copyIsAllMember">
        <!-- 展示有效列表 -->
        <ul v-if="selectShowListFlag">
          <li v-for="item in validPerson" :key="item.objectId">
            <div>{{ item.name }}({{ item.telphone }})</div>
            <div>
              <img src="../sendEmail/image/cancelSelect.png" @click="delectOnePerson(item.id)"/>
            </div>
          </li>
        </ul>
        <!-- 展示无效列表 -->
        <ul v-if="!selectShowListFlag">
          <li v-for="item in invalidPerson" :key="item.objectId">
            <div>{{ item.name }}({{ item.telphone }})</div>
            <div>
              <img src="../sendEmail/image/cancelSelect.png" @click="delectOnePerson(item.id)"/>
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
  props: ['isAllMember'],
  model: {
    prop: 'isAllMember',
    event: 'change'
  },
  data() {
    return {
      searchInfo: "",
      personList: [],
      haveSelectList: [],
      selectPersonList: [], //储存选择的联系人列表
      tagsList: [],
      selectTagsList: [], //储存选择的标签的id
      tagsPersonList: [], //储存被选择的标签标签对应的联系人
      allPersonList: [], //所有联系人
      validPerson: [], //有效的联系人
      invalidPerson: [], //无效的联系人
      selectShowListFlag: 1, //1--展示的为有效邮箱；0--展示的为无效邮箱
      ifSelectAll: false,
      allMemberList: [],
      // 全选相关字段
      copyIsAllMember: false,
      checkAllShow: true,
      checkAllData: {
        errorSum: 0,
        reasonableSum: 0
      }
    };
  },
  watch: {
    copyIsAllMember(value) {
      if (value) {
        this.haveSelectList = [];
        this.selectPersonList = [];
        this.selectTagsList = []
      }
      this.$emit('change', value);
    },
    searchInfo(val) {
      if (val) {
        this.checkAllShow = false
      } else {
        this.checkAllShow = true
      }
      this.getTagsList(val);
      this.getPersonList(val);
    },
    selectPersonList() {
      this.allPersonList = this.deduplication(
        this.selectPersonList,
        this.tagsPersonList
      );
    },
    selectTagsList(val) {
      if (!val.length) {
        this.tagsPersonList = [];
        this.allPersonList = this.deduplication(
          this.selectPersonList,
          this.tagsPersonList
        );
        return;
      }
      this.getTagsPerson();
    },
    allPersonList(val) {
      let result = this.ifValid(val);
      this.validPerson = result.valid;
      this.$emit('getValidList', this.validPerson);
      this.invalidPerson = result.invalid;
      if (this.invalidPerson.length === 0) {
        this.selectShowListFlag = 1;
      }
    },
    ifSelectAll(val) {
      if (val) {
        this.allMemberList.forEach(item => {
          this.haveSelectList.push(item.id);
        })
        this.selectPersonList = this.deduplication(this.allMemberList, this.selectPersonList);
      } else {
        var obj = {};
        this.allMemberList.forEach(item => {
          obj[item.id] = true;
        });
        var arr = [];
        this.selectPersonList.forEach(item => {
          if (!obj[item.id]) {
            arr.push(item);
          }
        })
        this.selectPersonList = JSON.parse(JSON.stringify(arr));
        for (const key in obj) {
          var num = this.haveSelectList.indexOf(key);
          this.haveSelectList.splice(num, 1);
        }
      }
    },
  },
  created() {
    this.getTagsList();
    this.getMemberInfoTelPhone();
    if (this.$route.params.memberList) {
      this.allMemberList = JSON.parse(JSON.stringify(this.$route.params.memberList));
      this.ifSelectAll = true;
    }
    // console.log(this.$route.params.memberList)
  },
  methods: {
    getMemberInfoTelPhone() {
      this.$request.get('api/admin/emailTelPhone/getMemberInfoTelPhone ').then(res => {
        this.checkAllData.errorSum = res.data.errorSum || 0;
        this.checkAllData.reasonableSum = res.data.reasonableSum || 0;
      })
    },
    //勾选所有联系人
    selectAllMember() {
      this.ifSelectAll = true;
    },
    //勾选一个联系人
    selectOnePerson(info) {
      this.selectPersonList.push(info);
      this.haveSelectList.push(info.id);
    },
    //取消勾选某个联系人
    cancelSelectOne(info) {
      this.selectPersonList.forEach((item, index) => {
        if (item.id === info.id) {
          this.selectPersonList.splice(index, 1);
        }
      });
      var index = this.haveSelectList.indexOf(info.id);
      this.haveSelectList.splice(index, 1);
    },
    //获取标签列表
    getTagsList() {
      this.$request
        .get(
          "/api/admin/memberLabel/getMemberLabelList?content=" +
          this.searchInfo +
          "&orderSort=0"
        )
        .then(res => {
          this.tagsList = JSON.parse(JSON.stringify(res.data));
        });
    },
    //获取联系人列表
    getPersonList(val) {
      if (val) {
        this.personList = [];
        this.$request
          .get("/api/admin/emailTelPhone/list?emailSearchContent=" + val)
          .then(res => {
            this.personList = JSON.parse(JSON.stringify(res.data));
          });
      } else {
        this.personList = [];
      }
    },
    //点击标签
    clickTag(id) {
      var index = this.selectTagsList.indexOf(id);
      if (index >= 0) {
        this.selectTagsList.splice(index, 1);
      } else {
        this.selectTagsList.push(id);
      }
    },
    //获取标签的联系人
    getTagsPerson() {
      var condition = {
        labelIds: this.selectTagsList
      };
      this.$request
        .get("/api/admin/emailTelPhone/list", {params: condition})
        .then(res => {
          this.tagsPersonList = JSON.parse(JSON.stringify(res.data));
          this.allPersonList = this.deduplication(
            this.selectPersonList,
            this.tagsPersonList
          );
        });
    },
    //去重
    deduplication(arr1, arr2) {
      var obj = {};
      for (let i = 0; i < arr1.length; i++) {
        obj[arr1[i].id] = arr1[i];
      }
      for (let j = 0; j < arr2.length; j++) {
        if (!obj[arr2[j].id]) {
          obj[arr2[j].id] = arr2[j];
        }
      }
      var arr = [];
      for (const key in obj) {
        arr.push(obj[key]);
      }
      return arr;
    },
    //验证联系方式是否有效
    ifValid(arr) {
      var arr1 = [];
      var arr2 = [];
      var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
      for (let i = 0; i < arr.length; i++) {
        if (reg.test(arr[i].telphone)) {
          arr1.push(arr[i]);
        } else {
          arr2.push(arr[i]);
        }
      }
      return {valid: arr1, invalid: arr2};
    },
    //清空所有联系人
    deleteAllPerson() {
      this.$confirm("确认清空所有已选联系人?", "确认操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.haveSelectList = [];
          this.selectPersonList = [];
          this.selectTagsList = [];
          this.$message({
            type: "success",
            message: "清除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
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
    //清除一个有效或者无效联系人
    delectOnePerson(id) {
      for (var i = 0; i < this.allPersonList.length; i++) {
        if (this.allPersonList[i].id === id) {
          this.allPersonList.splice(i, 1);
          break;
        }
      }
      for (var i = 0; i < this.selectPersonList.length; i++) {
        if (this.selectPersonList[i].id === id) {
          this.selectPersonList.splice(i, 1);
          break;
        }
      }
      for (var i = 0; i < this.tagsPersonList.length; i++) {
        if (this.tagsPersonList[i].id === id) {
          this.tagsPersonList.splice(i, 1);
          break;
        }
      }
      var num = this.haveSelectList.indexOf(id);
      if (num >= 0) ;
      {
        this.haveSelectList.splice(num, 1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.contactPerson {
  display: flex;
  height: 640px;
  border-bottom: 1px solid #f0f0f0;
}

// 左边
.contactPerson-left {
  flex: 1;
  padding: 20px;
}

.contactPerson-left__top {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.contactPerson-left__top__left {
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

.contactPerson-left__top__right {
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

.contactPerson-left__search {
  margin: 20px 0 10px 0;
}

.contactPerson-left_result {
  padding-left: 20px;
  margin-bottom: 20px;

  & > div {
    font-size: 14px;
    color: #dfdfdf;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  ul {
    max-height: 200px;
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

.cannotCheck {
  background-color: #909399 !important;
  color: #fff !important;
  border-color: #fff !important;

  &:hover {
    cursor: not-allowed;
  }
}

//中间的线
.contactPerson-border {
  border-left: 1px dashed #dfdfdf;
  width: 0;
  height: 90%;
  margin: auto 0;
}

//右边
.contactPerson-right {
  flex: 1;
  padding: 20px;
}

.contactPerson-right__top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 10px;

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
    height: 360px;
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
</style>
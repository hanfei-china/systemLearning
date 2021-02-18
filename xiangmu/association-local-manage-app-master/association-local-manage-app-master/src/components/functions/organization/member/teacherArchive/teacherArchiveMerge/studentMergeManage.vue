<template>
  <div class="memberMergeManage">
    <div class="memberMergeManage-header">
      <div class="memberMergeManage-header__left">
        <div class="memberMergeManage-header__leftBox">手动合并</div>
        <div style="color:rgb(102, 102, 102);">检测到{{mergeInfo.listData?mergeInfo.listData.length:0}}条重复数据</div>
      </div>
      <div>
        <el-button :style="{'color':ifAllActivate?'black':'#fff','background-color':ifAllActivate?'#ccc':'#3fa1b6',}" v-if="mergeInfo.listData&&mergeInfo.listData.length>0" @click="mergeTo" :disabled="ifAllActivate">合并本组
        </el-button>
      </div>
    </div>
    <div class="memberMergeManage-select">
      <div style="padding:25px 0;color:rgb(102, 102, 102);">已默认勾选所有教职工数据，可手动进行勾选或取消</div>
      <div class="memberMergeManage-select__item">
        <ul>
          <li v-for="(item,index) in mergeInfo.listData" :key="index">
            <div v-if="selectList.indexOf(index)<0" class="selectBox" @click="select(index)"></div>
            <div v-else class="noSelectBox el-icon-circle-check" @click="cancelSelect(index)"></div>
            <!-- <div class="imgAndState">
              <img v-if="item.userInfo" :src="item.userInfo.headImg" alt />
              <img
                v-else
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                alt
              />
              <div style="color:green;fontSize:12px;">已激活</div>
            </div> -->
            <ul class="info">
              <li>
                <div>
                  <span style="marginRight:15px;">{{item.name}}</span>
                  <span v-if="item.sex==='男'" class="el-icon-male" style="fontSize:16px;color:#3fa1b6;"></span>
                  <span v-else class="el-icon-female" style="fontSize:16px;color:#3fa1b6;"></span>
                </div>
              </li>
              <li>
                <div style="fontWeight:700;">身份证号</div>
                <div>{{item.idNumber}}</div>
              </li>
              <li>
                <div style="fontWeight:700;">出生日期</div>
                <div>{{item.birthday}}</div>
              </li>
              <!-- <li>
                <div style="fontWeight:700;">手机号</div>
                <div>{{item.telphone}}</div>
              </li> -->
            </ul>
            <div class="showIndex">{{index+1}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="memberMergeManage-header">
      <div class="memberMergeManage-header__left">
        <div class="memberMergeManage-header__leftBox">预览合并结果</div>
        <div>（请手动选择要保留的信息，未选择项会保存在历史记录中）</div>
      </div>
    </div>
    <div class="selectInfo" v-if="showMergeInfo.length>0">
      <div class="selectInfo-header"></div>
      <div class="selectInfo-tabel">
        <div class="selectInfo-tabel__list">
          <ul class="selectInfo-tabel__name">
            <li>
              合并后的信息以
              <span class="selectIndex">{{mainSelectIndex}}</span>为主
            </li>
            <li class="titleBox">基本信息</li>
            <li v-for="item in showFieldListNew1">{{item.name}}</li>
            <li class="titleBox">教职工信息</li>
            <li v-for="item in showFieldListNew2">{{item.name}}</li>
          </ul>
          <ul class="selectInfo-tabel__item">
            <li class="itemNums" v-for="(item,index) in showMergeInfo" :key="index">
              <ul>
                <li @click="selecMainInfo(item.index+1,index+1)">
                  <div :class="{'ifSelected':mainSelectIndex===item.index+1}">教职工{{item.index+1}}</div>
                </li>
                <div style="height:50px;backgroundColor: #f2f2f2;borderTop:1px solid #e4e4e4;borderBottom: 1px solid #e4e4e4;margin:15px 0;"></div>
                <li v-for="fields in showFieldListNew1"
                    @click="fieldValues[fields.code]=index"
                    :class="{'selectLi':index===fieldValues[fields.code]}"
                >{{fields.code==='currentCity'?(item.currentCity?(JSON.parse(item.currentCity).country+" "+JSON.parse(item.currentCity).province +" "+(JSON.parse(item.currentCity).city||"")):""):item[fields.code]}}
                </li>
                <div style="height:50px;backgroundColor: #f2f2f2;borderTop:1px solid #e4e4e4;borderBottom: 1px solid #e4e4e4;margin:15px 0;"></div>
                <li
                  v-for="fields in showFieldListNew2"
                  @click="fieldValues[fields.code]=index"
                  :class="{'selectLi':index===fieldValues[fields.code]}"
                >{{item[fields.code]}}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "studentMergeManage",
  props: ["mergeInfo"],
  data() {
    return {
      selectList: [],
      mainSelectIndex: 1,
      fieldValues: {}, //合并的信息
      showMergeInfo: [],
      ifAllActivate: false,
      showFieldListNew1: [],
      showFieldListNew2: []
    };
  },
  watch: {
    mergeInfo(val) {
      this.mergeInfoSelect();
      this.mainSelectIndex = 1;
      this.selecMainInfo(this.selectList[0] + 1, 1);
    },
    selectList(val) {
      this.showMergeInfo = [];
      this.selectList.forEach((item) => {
        var obj = this.mergeInfo.listData[item];
        obj.index = item;
        this.showMergeInfo.push(obj);
      });
      this.selecMainInfo(this.selectList[0] + 1, 1);
      if (val.length <= 1) {
        this.ifAllActivate = true;
      } else {
        this.ifAllActivate = false;
      }
    },
  },
  created() {
    let me = this;
    me.$request.get("/api/admin/member/archive/getAllFields?type=1").then(r => {
      let showFieldListNew1 = [];
      let showFieldListNew2 = [];
      r.data.sort((a, b) => a.seq > b.seq).forEach(item => {
        if (null == item.parameter) {
          item.parameter = {};
        }
        if (item.groupId == 1) {
          showFieldListNew1.push(item);
        } else {
          showFieldListNew2.push(item);
        }
      })
      me.showFieldListNew1 = showFieldListNew1;
      me.showFieldListNew2 = showFieldListNew2;
    });
  },
  methods: {
    //数据处理---默认勾选要进行合并的信息
    mergeInfoSelect() {
      this.selectList = [];
      //   console.log(this.mergeInfo.listData)
      this.mergeInfo.listData.forEach((item, index) => {
        this.selectList.push(index);
      });
    },
    cancelSelect(num) {
      this.selectList.forEach((item, index) => {
        if (item === num) {
          this.selectList.splice(index, 1);
          this.mainSelectIndex = 1;
          return;
        }
      });
    },
    select(index) {
      this.selectList.push(index);
      //加入一个冒泡排序---保证下边呈现的校友排序是按照顺序的
      for (let i = 0; i < this.selectList.length; i++) {
        for (let j = i + 1; j < this.selectList.length; j++) {
          if (this.selectList[i] > this.selectList[j]) {
            var num = this.selectList[i];
            this.selectList[i] = this.selectList[j];
            this.selectList[j] = num;
          }
        }
      }
    },
    //选择为主的信息
    selecMainInfo(selectIndex, index) {
      this.mainSelectIndex = selectIndex;
      this.fieldValues = this.copyObj(this.showMergeInfo[index - 1], index);
      if (!this.showMergeInfo[index - 1]) {
        return;
      }
    },
    //对象的复制---内部一些属性要剔除
    copyObj(obj, index) {
      var newObj = {};
      for (const key in obj) {
        if (key !== "studentExperience" && key !== "teacherExperience") {
          newObj[key] = index - 1;
        }
      }
      return newObj;
    },
    //合并
    mergeTo() {
      //基本信息
      var obj = {};
      for (const key in this.fieldValues) {
        if (key !== "index" && key !== "userInfo") {
          var num = this.fieldValues[key];
          obj[key] = this.showMergeInfo[num][key];
        }
      }
      obj.createTime = null;

      //合并的成员id
      var mergeIds = [];
      this.showMergeInfo.forEach((item) => {
        mergeIds.push(item.id);
      });

      var params = {
        associationMemberArchiveTeacher: obj,
        mergeIds,
      };
      this.$request
        .post("/api/admin/member/teacher/archive/mergeMemberArchiveInfo", params)
        .then((res) => {
          if (res.success) {
            this.$message({
              message: "合并成功",
              type: "success",
            });
            this.$emit("updata");
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.memberMergeManage {
  padding: 15px;
  overflow-y: auto;
  font-size: 14px;
  height: 865px;
  overflow-y: auto;
  .memberMergeManage-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e4e4;
    .memberMergeManage-header__left {
      display: flex;
      .memberMergeManage-header__leftBox {
        color: rgb(12, 25, 44);
        font-weight: 700;
        font-size: 16px;
        padding: 0 7px;
        border-left: 3px solid #3fa1b6;
        margin-right: 25px;
      }
    }
  }
  .memberMergeManage-select {
    padding: 0 20px;
    .memberMergeManage-select__item {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          position: relative;
          width: 333px;
          height: 120px;
          box-sizing: border-box;
          border: 1px solid #e4e4e4;
          margin-right: 20px;
          margin-bottom: 20px;
          display: flex;
          padding-right: 10px;
          .selectBox {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid #e4e4e4;
            box-sizing: border-box;
            cursor: pointer;
            margin: 5px 15px 0 5px;
          }
          .noSelectBox {
            font-size: 16px;
            color: #3fa1b6;
            cursor: pointer;
            margin: 5px 15px 0 5px;
          }
          .imgAndState {
            padding-top: 15px;
            img {
              width: 36px;
              height: 36px;
              //   border: 1px solid red;
              border-radius: 50%;
              margin-bottom: 15px;
              margin-right: 10px;
            }
          }
          .info {
            flex: 1;
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            li {
              display: flex;
              justify-content: space-between;
              width: 100%;
              height: 14px;
              line-height: 14px;
              border: 0;
              margin-bottom: 15px;
            }
          }
          .showIndex {
            position: absolute;
            top: 0;
            right: 15px;
            width: 24px;
            height: 20px;
            background-color: #ccc;
            color: red;
            text-align: center;
          }
        }
      }
    }
  }
}

.selectInfo {
  overflow-x: auto;
  width: 100%;
  .selectInfo-header {
    padding: 15px 0;
    display: flex;
    .selectInfo-name {
      width: 200px;
    }
    ul {
      flex: 1;
      overflow-x: auto;
      display: flex;
      li {
        flex: 1;
        min-width: 210px;
        height: 75px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .selectInfo-tabel {
    border: 1px solid rgb(228, 228, 228);
    box-sizing: border-box;
    .selectInfo-tabel__header {
      background-color: rgb(242, 242, 242);
      border-bottom: 1px solid rgb(228, 228, 228);
      padding: 15px 25px;
    }
    .selectInfo-tabel__list {
      display: flex;
      padding: 15px 0;
      .selectInfo-tabel__name {
        width: 200px;
        text-align: center;
        line-height: 45px;
        li {
          margin-bottom: 2px;
        }
      }
      .selectInfo-tabel__item {
        flex: 1;
        overflow-x: auto;
        display: flex;
        .itemNums {
          flex: 1;
          min-width: 210px;
          ul {
            li {
              text-align: center;
              line-height: 45px;
              height: 45px;
              margin-bottom: 2px;
              cursor: pointer;
              border-radius: 4px;
              &:hover {
                background-color: #3fa1b6;
                color: #fff;
              }
            }
            .selectLi {
              background-color: #3fa1b6;
              color: #fff;
            }
          }
        }
      }
    }
    .selectInfo-tabel__school {
      padding: 25px;
      padding-bottom: 0;
      overflow: hidden;
      ul {
        display: flex;
        flex-wrap: wrap;
        ul {
          float: left;
        }
      }
      .selectInfo-tabel__schoolInfo {
        width: 450px;
        height: 90px;
        border: 1px solid #3fa1b6;
        border-radius: 6px;
        margin-right: 25px;
        margin-bottom: 25px;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        &:hover {
          background-color: #3fa1b6;
          color: #fff;
        }
        .selectInfo-tabel__schoolInfo__top {
          display: flex;
          align-items: center;
          padding: 15px 0 0 10px;
          margin-bottom: 15px;
        }
        .selectInfo-tabel__schoolInfo__bot {
          display: flex;
          align-items: center;
          padding-left: 40px;
        }
      }
    }
  }
}
.selectInfo-name {
  width: 200px;
  text-align: center;
  line-height: 75px;
}
.titleBox {
  text-align: left;
  font-weight: 700;
  line-height: 50px;
  background-color: #f2f2f2;
  height: 50px;
  padding-left: 25px;
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  margin: 15px 0 !important;
}
.selectIndex {
  background-color: #3fa1b6;
  padding: 5px 9px;
  color: #fff;
  margin: 5px;
  border-radius: 50%;
}

.selectSudents {
  background-color: #3fa1b6;
  color: #fff;
}
.selectTeacher {
  background-color: #3fa1b6;
  color: #fff;
}

.selectItem {
  padding: 10px 30px;
  border: 1px dashed rgb(204, 204, 204);
  width: 120px;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #3fa1b6;
    color: #fff;
    border: 0;
  }
}
.ifSelected {
  background-color: #3fa1b6;
  color: #fff;
  border: 0;
}
.canSubmit {
  color: #fff;
  background-color: #3fa1b6;
}
</style>

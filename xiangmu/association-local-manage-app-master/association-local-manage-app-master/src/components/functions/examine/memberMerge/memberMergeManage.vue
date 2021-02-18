<template>
  <div class="memberMergeManage">
    <div class="memberMergeManage-header">
      <div class="memberMergeManage-header__left">
        <div class="memberMergeManage-header__leftBox">手动合并</div>
        <div style="color:rgb(102, 102, 102);">检测到{{mergeInfo.detail?mergeInfo.detail.length:0}}条重复数据</div>
      </div>
      <div>
        <el-button :style="{'color':ifAllActivate?'black':'#fff','background-color':ifAllActivate?'#ccc':'#3fa1b6',}" v-if="mergeInfo.detail&&mergeInfo.detail.length>0" @click="mergeTo" :disabled="ifAllActivate">合并本组
        </el-button>
      </div>
    </div>
    <div class="memberMergeManage-select">
      <div style="padding:25px 0;color:rgb(102, 102, 102);">已默认勾选所有未激活校友数据，已激活的校友仅可选择其中一位，对本组中不希望合并的校友可取消勾选</div>
      <div class="memberMergeManage-select__item">
        <ul>
          <li v-for="(item,index) in mergeInfo.detail" :key="index">
            <div v-if="selectList.indexOf(index)<0" class="selectBox" @click="select(index)"></div>
            <div v-else class="noSelectBox el-icon-circle-check" @click="cancelSelect(index)"></div>
            <div class="imgAndState">
              <img v-if="item.userInfo" :src="item.userInfo.headImg" alt />
              <img v-else src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt />
              <div v-if="item.status==='1'" style="color:green;fontSize:12px;">已激活</div>
              <div v-else style="color:red;fontSize:12px;">未激活</div>
            </div>
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
              <li>
                <div style="fontWeight:700;">手机号</div>
                <div>{{item.telphone}}</div>
              </li>
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
      <div class="selectInfo-header">
        <!-- <div class="selectInfo-name">
          合并后的信息以
          <span class="selectIndex">{{mainSelectIndex}}</span>为主
        </div>-->
        <!-- <ul>
          <li v-for="item in selectList.length" :key="item" @click="selecMainInfo(item)">
            <div :class="{'selectItem':true,'ifSelected':mainSelectIndex===item}">校友{{item}}</div>
          </li>
        </ul>-->
      </div>
      <div class="selectInfo-tabel">
        <!-- <div class="selectInfo-tabel__header">
          <div style="fontWeight:700;">基本信息</div>
        </div>-->
        <div class="selectInfo-tabel__list">
          <ul class="selectInfo-tabel__name">
            <li>合并后的信息以<span class="selectIndex">{{mainSelectIndex}}</span>为主</li>
            <li class="titleBox">基本信息</li>
            <li v-for="item in basicFieldList" :key="item.code">{{item.name}}</li>
            <li class="titleBox">工作单位</li>
            <li v-for="item in workingField" :key="item.code">{{item.name}}</li>
            <li class="titleBox">联系方式</li>
            <li v-for="item in contactFieldList" :key="item.code">{{item.name}}</li>
          </ul>
          <ul class="selectInfo-tabel__item">
            <li class="itemNums" v-for="(item,index) in showMergeInfo" :key="index">
              <ul>
                <li @click="selecMainInfo(item.index+1,index+1)">
                  <div :class="{'ifSelected':mainSelectIndex===item.index+1}">校友{{item.index+1}}</div>
                </li>
                <div style="height:50px;backgroundColor: #f2f2f2;borderTop:1px solid #e4e4e4;borderBottom: 1px solid #e4e4e4;margin:15px 0;"></div>
                <template v-for="it in basicFieldList">
                  <li :key="it.code" @click="fieldValues[it.code]=index" :class="{'selectLi':index===fieldValues[it.code]}">
                    {{it.code=="currentCity"?(item.currentCity?(JSON.parse(item.currentCity).country+" "+JSON.parse(item.currentCity).province +" "+(JSON.parse(item.currentCity).city||"")):""):item[it.code]}}
                  </li>
                </template>
                <div style="height:50px;backgroundColor: #f2f2f2;borderTop:1px solid #e4e4e4;borderBottom: 1px solid #e4e4e4;margin:15px 0;"></div>
                <template v-for="it in workingField">
                  <li :key="it.code" @click="fieldValues[it.code]=index" :class="{'selectLi':index===fieldValues[it.code]}">{{item[it.code]}}</li>
                </template>
                <div style="height:50px;backgroundColor: #f2f2f2;borderTop:1px solid #e4e4e4;borderBottom: 1px solid #e4e4e4;margin:15px 0;"></div>
                <template v-for="it in contactFieldList">
                  <li :key="it.code" @click="fieldValues[it.code]=index" :class="{'selectLi':index===fieldValues[it.code]}">{{item[it.code]}}</li>
                </template>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <!-- <div class="selectInfo-tabel">
        <div class="selectInfo-tabel__header">
          <div style="fontWeight:700;">当前工作</div>
        </div>
        <div class="selectInfo-tabel__list">
          <ul class="selectInfo-tabel__name">
            <li>所在行业</li>
            <li>所在单位</li>
            <li>职务</li>
          </ul>
          <ul class="selectInfo-tabel__item">
            <li class="itemNums" v-for="(item,index) in [1,2,3,4]" :key="index">
              <ul>
                <li v-for="(item,index) in [1,2,3]" :key="index">122</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="selectInfo-tabel">
        <div class="selectInfo-tabel__header">
          <div style="fontWeight:700;">联系方式</div>
        </div>
        <div class="selectInfo-tabel__list">
          <ul class="selectInfo-tabel__name">
            <li>手机号</li>
            <li>邮箱</li>
            <li>微信</li>
            <li>QQ</li>
          </ul>
          <ul class="selectInfo-tabel__item">
            <li class="itemNums" v-for="(item,index) in [1,2,3,4]" :key="index">
              <ul>
                <li v-for="(item,index) in [1,2,3,4]" :key="index">122</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>-->
      <div class="selectInfo-tabel">
        <div class="selectInfo-tabel__header">
          <div style="fontWeight:700;">在校经历</div>
        </div>
        <div class="selectInfo-tabel__school">
          <ul>
            <li v-for="(memberItem,memberIndex) in showMergeInfo" :key="memberIndex">
              <ul>
                <li @click="selectStudents(memberIndex,index)" v-for="(item,index) in memberItem.studentExperience" :key="index"
                  :class="{'selectInfo-tabel__schoolInfo':true,'selectSudents':studentExperience[memberIndex]&&studentExperience[memberIndex].indexOf(index)>=0}">
                  <div class="selectInfo-tabel__schoolInfo__top">
                    <div style="width:10px;height:10px;backgroundColor: #3fa1b6;borderRadius:50%;"></div>
                    <div style="fontWeight:700;margin:0 35px 0 10px;">{{item.college}}</div>
                    <div>{{item.entranceDate}}-{{item.graduationDate}}</div>
                  </div>
                  <div class="selectInfo-tabel__schoolInfo__bot">
                    <template v-for="it in studentExperienceField" v-if="it.code!='college'&&it.code!='entranceDate'&&it.code!='graduationDate'">
                      <div :key="it.code">{{item[it.code]}}</div>
                    </template>
                  </div>
                </li>
              </ul>
              <ul>
                <li @click="selectTeacher(memberIndex,index)" v-for="(item,index) in memberItem.teacherExperience" :key="index"
                  :class="{'selectInfo-tabel__schoolInfo':true,'selectTeacher':teacherExperience[memberIndex]&&teacherExperience[memberIndex].indexOf(index)>=0}">
                  <div class="selectInfo-tabel__schoolInfo__top">
                    <div style="width:10px;height:10px;backgroundColor: #3fa1b6;borderRadius:50%;"></div>
                    <div style="fontWeight:700;margin:0 15px 0 10px;">{{item.department}}</div>
                    <div>任职</div>
                  </div>
                  <div class="selectInfo-tabel__schoolInfo__bot">
                    <template v-for="it in teacherExperienceField" v-if="it.code!='department'">
                      <div :key="it.code">{{item[it.code]}}</div>
                    </template>
                  </div>
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
  name: "memberMergeManage",
  props: ["mergeInfo"],
  data() {
    return {
      selectList: [],
      mainSelectIndex: 1,
      fieldValues: {}, //合并的信息
      showMergeInfo: [],
      studentExperience: {},
      teacherExperience: {},
      ifAllActivate: false,
      basicFieldList:[],
      workingField:[],
      studentExperienceField:[],
      teacherExperienceField:[],
      contactFieldList:[],
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
        var obj = this.mergeInfo.detail[item];
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
    var url='/api/admin/associator/getFieldsByAuth';
    this.$request.get(url).then((res) => {
      var fieldList = res.data;
      // 基本信息：0 工作信息：1  联系方式：2  在校就读经历：3 在校就职经历：4
      this.basicFieldList = [];
      this.workingField = [];
      this.studentExperienceField = [];
      this.teacherExperienceField = [];
      this.contactFieldList = [];
      for (var i = 0; i < fieldList.length; i++) {
        if (fieldList[i].groupId == 0) {
          this.basicFieldList.push(fieldList[i]);
        } else if (fieldList[i].groupId == 1) {
          this.workingField.push(fieldList[i]);
        } else if (fieldList[i].groupId == 3) {
          this.studentExperienceField.push(fieldList[i]);
        } else if (fieldList[i].groupId == 4) {
          this.teacherExperienceField.push(fieldList[i]);
        } else if (fieldList[i].groupId == 2) {
          this.contactFieldList.push(fieldList[i]);
        }
      }
    });
  },
  methods: {
    //数据处理---默认勾选要进行合并的信息
    mergeInfoSelect() {
      var num = 0;
      this.selectList = [];
      //   console.log(this.mergeInfo.detail)
      this.mergeInfo.detail.forEach((item, index) => {
        if (item.status === "0") {
          this.selectList.push(index);
        } else {
          if (!num) {
            this.selectList.push(index);
          }
          num++;
        }
      });
      if (num === this.mergeInfo.detail.length) {
        this.ifAllActivate = true;
      }
    },
    cancelSelect(num) {
      // if (this.selectList.length <= 2) {
      //   this.$message({
      //     message: "至少要选择两个信息来合并~",
      //     type: "warning"
      //   });
      //   return;
      // }
      this.selectList.forEach((item, index) => {
        if (item === num) {
          this.selectList.splice(index, 1);
          this.mainSelectIndex = 1;
          return;
        }
      });
    },
    select(index) {
      var flag = true;
      this.selectList.forEach((item) => {
        if (
          this.mergeInfo.detail[item].status === "1" &&
          this.mergeInfo.detail[index].status === "1"
        ) {
          this.$message({
            message: "已激活信息只能勾选其中一个~",
            type: "warning",
          });
          flag = false;
          return;
        }
      });
      if (!flag) {
        return;
      }
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
      this.studentAndTeach(index);
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
    //学习经历和工作经历数据处理
    studentAndTeach(index) {
      this.studentExperience = {};
      var arr1 = [];
      this.showMergeInfo[index - 1].studentExperience.forEach((item, index) => {
        arr1.push(index);
      });
      this.$set(this.studentExperience, index - 1, arr1);
      this.teacherExperience = {};
      var arr2 = [];
      this.showMergeInfo[index - 1].teacherExperience.forEach((item, index) => {
        arr2.push(index);
      });
      this.$set(this.teacherExperience, index - 1, arr2);
    },
    //选择教育经历
    selectStudents(memberIndex, index) {
      if (!this.studentExperience[memberIndex]) {
        var arr1 = [index];
        this.$set(this.studentExperience, memberIndex, arr1);
      } else {
        if (this.studentExperience[memberIndex].indexOf(index) < 0) {
          var arr2 = this.studentExperience[memberIndex];
          arr2.push(index);
          this.$set(this.studentExperience, memberIndex, arr2);
        } else {
          var arr3 = this.studentExperience[memberIndex];
          var num = arr3.indexOf(index);
          arr3.splice(num, 1);
          this.$set(this.studentExperience, memberIndex, arr3);
        }
      }
    },
    //选择就职经历
    selectTeacher(memberIndex, index) {
      if (!this.teacherExperience[memberIndex]) {
        var arr1 = [index];
        this.$set(this.teacherExperience, memberIndex, arr1);
      } else {
        if (this.teacherExperience[memberIndex].indexOf(index) < 0) {
          var arr2 = this.teacherExperience[memberIndex];
          arr2.push(index);
          this.$set(this.teacherExperience, memberIndex, arr2);
        } else {
          var arr3 = this.teacherExperience[memberIndex];
          var num = arr3.indexOf(index);
          arr3.splice(num, 1);
          this.$set(this.teacherExperience, memberIndex, arr3);
        }
      }
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
      //就读经历数据
      var studentExperience = [];
      for (const key in this.studentExperience) {
        var arr = this.showMergeInfo[key].studentExperience;
        this.studentExperience[key].forEach((item) => {
          studentExperience.push(arr[item]);
        });
      }
      //就职经历
      var teacherExperience = [];
      for (const key in this.teacherExperience) {
        var arr = this.showMergeInfo[key].teacherExperience;
        this.teacherExperience[key].forEach((item) => {
          teacherExperience.push(arr[item]);
        });
      }
      //合并的id处理---要是有已激活的必须要采用已激活的
      this.selectList.forEach((item) => {
        if (this.mergeInfo.detail[item].status === "1") {
          obj.id = this.mergeInfo.detail[item].id;
        }
      });
      obj.studentExperience = studentExperience;
      obj.teacherExperience = teacherExperience;
      obj.createTime = null;
      obj.status = "1";

      //合并的成员id
      var memberIds = [];
      this.showMergeInfo.forEach((item) => {
        memberIds.push(item.id);
      });

      var params = {
        fieldValues: obj,
        memberIds,
      };
      this.$request
        .put("/api/admin/member/v2/mergeMemberInfo", params)
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
          height: 146px;
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
          div{
            margin-left: 35px;
          }
          div:first-child{
            margin-left: 0;
          }
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

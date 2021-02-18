<template>
  <div class="alumniInfo" v-if="selectOneAlumni&&selectOneAlumni.reptileMemberContent">
    <div class="alumniInfo-header">
      <div class="alumniInfo-header__left">校友资讯信息</div>
    </div>
    <div class="alumniInfo-simpleInfo">
      <img
        v-if="selectOneAlumni.reptileNewContent[0].image"
        :src="JSON.parse(selectOneAlumni.reptileNewContent[0].image)[0]"
        class="alumniItem-middle__img"
      />
      <img v-else src="../alumniMatch/image/header.png" class="alumniItem-middle__img" />
      <div class="alumniInfo-simpleInfo__right">
        <div style="display:flex;justifyContent:space-between;">
          <div style="fontSize:16px;fontWeight:700;">
            姓名：&nbsp;
            <span>{{selectOneAlumni.reptileNewContent[0].alumniName}}</span>
          </div>
          <div style="color:#FF9D00;">
            来源：&nbsp;
            <span>{{selectOneAlumni.title?selectOneAlumni.title.split('-')[1]:''}}</span>
          </div>
        </div>
        <div style="fontSize:16px;display:flex;alignItems:center;fontWeight:700;">
          网页标题：&nbsp;
          <a target="_blank" :href="selectOneAlumni.searchUrl">{{selectOneAlumni.title}}</a>
        </div>
        <div style="fontSize:16px;fontWeight:700;display:flex;alignItems:center;">
          网页链接：&nbsp;
          <span class="copyURL">{{selectOneAlumni.searchUrl}}</span>&nbsp;&nbsp;
          <span
            @click="copyUrl(selectOneAlumni.searchUrl)"
            class="el-icon-copy-document"
            style="color:#3fa1b6;fontSize:14px;marginLeft:15px;cursor:pointer;"
          >复制链接</span>
        </div>
        <div style="fontSize:12px;color:#C6C6C6;">
          网页最近一次更新时间：&nbsp;
          <span>{{selectOneAlumni.reptileNewContent[0].baiduUpdateTime}}</span>
        </div>
      </div>
    </div>
    <div class="alumniInfo-news">
      <div class="alumniInfo-news__header">
        <div style="fontWeight:700;fontSize:16px;">网页最新发布消息</div>
        <div style="color:#C6C6C6;">
          发布时间：&nbsp;
          <span
            v-if="selectOneAlumni&&selectOneAlumni.reptileNewContent&&selectOneAlumni.reptileNewContent[0]"
          >{{selectOneAlumni.reptileNewContent[0].updateTime | yyyyMMddHHmmss}}</span>
        </div>
      </div>
      <div style="margin:15px 0;color:#FF9D00;">资讯更新后，下方选中内容也会同时更新到校友信息库（不准备更新的内容可取消选中）</div>
      <div class="table">
        <div class="table-head">基本信息</div>
        <ul class="table-items">
          <template v-for="(item,index) in newList">
            <li
              v-if="canSelectList.indexOf(item.field)>=0"
              :key="index"
              @click="selectOneInfo(index)"
              :class="{'active':selectInfo.indexOf(index)>=0,'canSelect':true,'canSave':true}"
            >
              <span style="width:120px;textAlign:right;">{{item.field}}：</span>
              <span style="flex:1;textAlign:left;paddingLeft:20px;">{{item.value}}</span>
              <img
                v-if="selectInfo.indexOf(index)>=0"
                src="./image/updata.png"
                class="selectInfoItem"
              />
            </li>
            <li v-else :key="index" class="noSave">
              <span style="width:120px;textAlign:right;">{{item.field}}：</span>
              <span style="flex:1;textAlign:left;paddingLeft:20px;">{{item.value}}</span>
            </li>
          </template>
        </ul>
        <!-- <div
          class="table-introdution"
          @click="selectOneInfo(newList.length)"
          :class="{'active':selectInfo.indexOf(newList.length)>=0}"
        >-->
        <div class="table-introdution">
          <span style="width:120px;textAlign:right;">简介：</span>
          <span
            style="flex:1;textAlign:left;paddingLeft:20px;"
          >{{selectOneAlumni.reptileNewContent[0].introduce}}</span>
          <!-- <img
            v-if="selectInfo.indexOf(newList.length)>=0"
            src="./image/updata.png"
            class="selectInfoItem"
          />-->
        </div>
      </div>
    </div>
    <div class="alumniInfo-news">
      <div class="alumniInfo-news__header">
        <div style="fontWeight:700;fontSize:16px;marginBottom:20px;">系统内存录信息</div>
        <div style="color:#C6C6C6;">
          发布时间：&nbsp;
          <span
            v-if="selectOneAlumni.reptileMemberContent[0]&&selectOneAlumni.reptileMemberContent[0].updateTime"
          >{{selectOneAlumni.reptileMemberContent[0].updateTime | yyyyMMddHHmmss}}</span>
        </div>
      </div>
      <div class="table">
        <div class="table-head">基本信息</div>
        <ul class="table-items">
          <li v-for="(item,index) in oldList" :key="index" class="noSave">
            <span style="width:120px;textAlign:right;">{{item.field}}：</span>
            <span style="flex:1;textAlign:left;paddingLeft:20px;">{{item.value}}</span>
          </li>
        </ul>
        <div
          class="table-introdution"
          v-if="selectOneAlumni.reptileMemberContent[0]&&selectOneAlumni.reptileMemberContent[0].introduce"
        >
          <span style="width:120px;textAlign:right;">简介：</span>
          <span
            style="flex:1;textAlign:left;paddingLeft:20px;"
          >{{selectOneAlumni.reptileMemberContent[0].introduce}}</span>
        </div>
        <div v-else class="table-introdution" style="justifyContent:center;">暂无内容</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "updataInfo",
  props: ["selectOneAlumni"],
  data() {
    return {
      selectInfo: [],
      newList: [],
      oldList: [],
      canSelectList: ["职务", "职位", "职称", "职业", "单位", "企业"]
    };
  },
  watch: {
    selectOneAlumni(val) {
      if (!val) {
        return;
      }
      if (val.reptileNewContent[0] && val.reptileNewContent[0].content) {
        this.newList = JSON.parse(val.reptileNewContent[0].content);
      } else {
        this.newList = [];
      }
      if (val.reptileMemberContent[0] && val.reptileMemberContent[0].content) {
        this.oldList = JSON.parse(val.reptileMemberContent[0].content);
      } else {
        this.oldList = [];
      }
    }
  },
  methods: {
    selectOneInfo(index) {
      var num = this.selectInfo.indexOf(index);
      if (num >= 0) {
        this.selectInfo.splice(num, 1);
      } else {
        this.selectInfo.push(index);
      }
      this.selectInfoList();
    },
    selectInfoList() {
      var arr = [];
      for (let i = 0; i < this.selectInfo.length; i++) {
        if (this.selectInfo[i] == this.newList.length) {
          arr.push({
            field: "introduce",
            value: this.selectOneAlumni.reptileNewContent[0].introduce
          });
        } else {
          var obj = JSON.parse(
            JSON.stringify(this.newList[this.selectInfo[i]])
          );
          arr.push(obj);
        }
      }
      this.$emit("selectInfo", arr);
    },
    copyUrl(url) {
      var input = document.createElement("input");
      document.body.appendChild(input);
      input.setAttribute("value", url);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
      }
      document.body.removeChild(input);
      this.$message({
        message: "复制成功",
        type: "success"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.alumniInfo {
  padding: 15px;
  box-sizing: border-box;
}
.alumniInfo-header {
  box-sizing: border-box;
  padding: 10px 0;
  border-bottom: 1px solid rgb(228, 228, 228);
}
.alumniInfo-header__left {
  padding-left: 10px;
  border-left: 3px solid #28394b;
  font-size: 16px;
  font-weight: 700;
}

.alumniInfo-simpleInfo {
  padding: 35px 0;
  //   margin: 0 30px;
  border-bottom: 1px dashed rgb(228, 228, 228);
  display: flex;
  img {
    width: 110px;
    height: 140px;
    margin-right: 35px;
    // border: 1px solid red;
  }
}
.alumniInfo-simpleInfo__right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  .copyURL {
    display: inline-block;
    max-width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #555555;
    font-weight: 400;
  }
  a {
    text-decoration: underline;
    color: #3fa1b6;
    display: inline-block;
    max-width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 400;
  }
}

.alumniInfo-basicInfo {
  margin: 30px;
}
.alumniInfo-basicInfo__header {
  padding-left: 15px;
  font-size: 16px;
  font-weight: 700;
  // width: 60%;
}

.alumniInfo-news {
  margin-top: 20px;
}
.alumniInfo-news__header {
  display: flex;
  justify-content: space-between;
}

.table-head {
  border: 1px solid #e8e8e8;
  background-color: #f8f8f8;
  padding: 10px;
}
.table-items {
  display: flex;
  flex-wrap: wrap;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  .canSave {
    width: 50%;
    box-sizing: border-box;
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #e8e8e8;
    position: relative;
    background-color: #f7f9fa;
    cursor: pointer;
    &:nth-child(2n-1) {
      border-right: 1px solid #e8e8e8;
    }
    &:last-child {
      border-bottom: none;
    }
    // &:hover {
    //   background-color: rgb(195, 234, 239);
    // }
  }
  .noSave {
    width: 50%;
    box-sizing: border-box;
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #e8e8e8;
    position: relative;
    &:nth-child(2n-1) {
      border-right: 1px solid #e8e8e8;
    }
    &:last-child {
      border-bottom: none;
    }
    // &:hover {
    //   background-color: rgb(195, 234, 239);
    // }
  }
}
.active {
  // background-color: #f7f9fa;
  background-color: rgb(195, 234, 239) !important;
}
.canSelect {
  background-color: #f7f9fa;
}
.selectInfoItem {
  position: absolute;
  width: 14px;
  height: 14px;
  top: 50%;
  transform: translateY(-50%);
  right: 15px;
}
.table-introdution {
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 10px 0;
  position: relative;
  // cursor: pointer;
  // &:hover {
  //   background-color: #f7f9fa;
  // }
}
</style>
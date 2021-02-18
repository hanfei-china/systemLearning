<template>
  <div>
    <div style="maxWidth:1000px;minWidth:500px;">
      <div v-for="item in linkAlumnisList" :key="item.id" class="linkAlumnItem">
        <div class="alumniInfo-simpleInfo">
          <img v-if="item.image" :src="JSON.parse(item.image)[0]" class="alumniItem-middle__img" />
          <img v-else src="../../alumniMatch/image/header.png" class="alumniItem-middle__img" />
          <div class="alumniInfo-simpleInfo__right">
            <div style="display:flex;justifyContent:space-between;">
              <div style="fontSize:16px;fontWeight:700;">
                姓名：&nbsp;
                <span>{{item.alumniName}}</span>
              </div>
              <div style="color:#FF9D00;">
                来源：&nbsp;
                <span>{{item.title?item.title.split('-')[1]:''}}</span>
              </div>
            </div>
            <div style="fontSize:16px;display:flex;alignItems:center;fontWeight:700;">
              网页标题：&nbsp;
              <a target="_blank" :href="item.searchUrl">{{item.title}}</a>
            </div>
            <div style="fontSize:16px;fontWeight:700;display:flex;alignItems:center;">
              网页链接：&nbsp;
              <span class="copyURL">{{item.searchUrl}}</span>&nbsp;&nbsp;
              <span
                @click="copyUrl(item.searchUrl)"
                class="el-icon-copy-document"
                style="color:#3fa1b6;fontSize:14px;marginLeft:15px;cursor:pointer;"
              >复制链接</span>
            </div>
            <div style="fontSize:12px;color:#C6C6C6;">
              网页最近一次更新时间：&nbsp;
              <span>{{item.baiduUpdateTime}}</span>
            </div>
          </div>
        </div>
        <!-- <div class="alumniInfo-news">
        <div class="alumniInfo-news__header">
          <div style="fontWeight:700;fontSize:16px;">网页最新发布消息</div>
          <div style="color:#C6C6C6;">
            发布时间：&nbsp;
            <span
              v-if="selectOneAlumni&&selectOneAlumni.reptileNewContent&&selectOneAlumni.reptileNewContent[0]"
            >{{selectOneAlumni.reptileNewContent[0].updateTime | yyyyMMddHHmmss}}</span>
          </div>
        </div>-->
        <!-- <div style="margin:15px 0;color:#FF9D00;">资讯更新后，下方选中内容也会同时更新到校友信息库（不准备更新的内容可取消选中）</div> -->
        <div class="table">
          <div class="table-head">基本信息</div>
          <ul class="table-items" v-if="item.content">
            <template v-for="(info,index) in JSON.parse(item.content)">
              <li :key="index" class="noSave">
                <span style="width:120px;textAlign:right;">{{info.field}}：</span>
                <span style="flex:1;textAlign:left;paddingLeft:20px;">{{info.value}}</span>
              </li>
            </template>
          </ul>
          <div v-else class="table-introdution">暂无基本信息</div>
          <div class="table-introdution">
            <span style="width:120px;textAlign:right;">简介：</span>
            <span style="flex:1;textAlign:left;paddingLeft:20px;">{{item.introduce}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "linkMemberInfo",
  props: ["memberId"],
  data() {
    return {
      linkAlumnisList: []
    };
  },
  created() {
    this.getLinkAlumnisList();
  },
  methods: {
    getLinkAlumnisList() {
      this.$request
        .get(
          "/api/admin/reptile/getSuspectedAlumniByMemberId?id=" + this.memberId
        )
        .then(res => {
          this.linkAlumnisList = JSON.parse(JSON.stringify(res.data));
        });
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
        message: "网址复制成功",
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
  //   border-bottom: 1px dashed rgb(228, 228, 228);
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
.linkAlumnItem {
  margin-bottom: 20px;
  border-bottom: 1px dashed rgb(228, 228, 228);
  padding-bottom: 15px;
}
</style>
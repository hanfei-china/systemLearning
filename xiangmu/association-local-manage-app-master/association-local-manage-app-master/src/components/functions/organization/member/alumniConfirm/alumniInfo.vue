<template>
  <div class="alumniInfo">
    <div class="alumniInfo-header">
      <div class="alumniInfo-header__left">校友咨询信息</div>
    </div>
    <div class="alumniInfo-simpleInfo">
      <img
        v-if="clickAlumni.image&&JSON.parse(clickAlumni.image).length>0"
        :src="JSON.parse(clickAlumni.image)[0]"
        alt
      />
      <img v-else src="../alumniMatch/image/header.png" alt />
      <div class="alumniInfo-simpleInfo__right">
        <div style="display:flex;justifyContent:space-between;">
          <div style="fontSize:16px;fontWeight:700;">
            姓名：&nbsp;
            <span>{{clickAlumni.alumniName}}</span>
          </div>
          <div style="color:#FF9D00;">
            来源：&nbsp;
            <span>{{clickAlumni.title?clickAlumni.title.split('-')[1]:''}}</span>
          </div>
        </div>
        <div style="fontSize:16px;display:flex;alignItems:center;fontWeight:700;">
          网页标题：&nbsp;
          <a :href="clickAlumni.searchUrl" target="_blank">{{clickAlumni.title}}</a>
        </div>
        <div style="fontSize:16px;fontWeight:700;display:flex;alignItems:center;">
          网页链接：&nbsp;
          <span class="copyURL">{{clickAlumni.searchUrl}}</span>&nbsp;&nbsp;
          <span
            @click="copyUrl"
            class="el-icon-copy-document"
            style="color:#3fa1b6;fontSize:14px;marginLeft:15px;cursor:pointer;"
          >复制链接</span>
        </div>
        <div style="fontSize:12px;color:#C6C6C6;">
          网页最近一次更新时间：&nbsp;
          <span>{{clickAlumni.baiduUpdateTime}}</span>
        </div>
      </div>
    </div>
    <div class="alumniInfo-basicInfo">
      <div class="alumniInfo-basicInfo__header">基本信息</div>
      <ul
        v-if="clickAlumni.content&&JSON.parse(clickAlumni.content).length>0"
        class="alumniInfo-basicInfo__list"
      >
        <li v-for="(item,index) in JSON.parse(clickAlumni.content)" :key="index">
          <div class="listItem">{{item.field}}：</div>
          <div class="listItem-info">{{item.value}}</div>
        </li>
      </ul>
      <div v-else class="alumniInfo-basicInfo__list">
        <div>暂无信息</div>
      </div>
    </div>
    <div class="alumniInfo-Introduction">
      <div class="alumniInfo-basicInfo__header">简介</div>
      <div
        class="alumniInfo-Introduction__person"
      >{{clickAlumni.introduce?clickAlumni.introduce:'暂无内容'}}</div>
    </div>
    <div class="alumniInfo-photos">
      <div class="alumniInfo-basicInfo__header">图册</div>
      <ul
        v-if="clickAlumni.image&&JSON.parse(clickAlumni.image).length>0"
        class="alumniInfo-photos__list"
      >
        <li v-for="(item,index) in JSON.parse(clickAlumni.image)" :key="index">
          <!-- <img :src="item" alt /> -->
          <el-image style="width: 146px; height: 184px" :src="item" :preview-src-list="[item]"></el-image>
        </li>
      </ul>
      <div v-else class="alumniInfo-photos__list">
        <div>暂无图片</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "alumniInfo",
  props: ["clickAlumni"],
  data() {
    return {};
  },
  methods: {
    copyUrl() {
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.setAttribute("value", this.clickAlumni.searchUrl);
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
  padding: 10px 15px;
  border-bottom: 1px solid rgb(228, 228, 228);
}
.alumniInfo-header__left {
  padding-left: 10px;
  border-left: 3px solid #3fa1b6;
  font-size: 16px;
  font-weight: 700;
}

.alumniInfo-simpleInfo {
  padding: 35px 0;
  margin: 0 30px;
  border-bottom: 1px dashed rgb(228, 228, 228);
  display: flex;
  img {
    width: 110px;
    height: 140px;
    margin-right: 35px;
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
.alumniInfo-basicInfo__list {
  margin-top: 25px;
  padding-left: 35px;
  overflow: hidden;
  li {
    float: left;
    width: calc(100% / 2 - 50px);
    display: flex;
    margin-bottom: 30px;
    &:nth-child(2n) {
      margin-left: 100px;
    }
    .listItem {
      width: 120px;
      text-align: left;
    }
    .listItem-info {
      flex: 1;
      text-align: left;
    }
  }
}

.alumniInfo-Introduction {
  margin: 0 30px;
  padding: 30px 0;
  border-top: 1px dashed rgb(228, 228, 228);
  border-bottom: 1px dashed rgb(228, 228, 228);
}
.alumniInfo-Introduction__person {
  padding: 0 35px;
  margin: 25px 0;
}

.alumniInfo-photos {
  margin: 30px;
}
.alumniInfo-photos__list {
  overflow: hidden;
  padding: 0 35px;
  margin-top: 25px;
  li {
    float: left;
    margin: 0 20px 20px 0;
    img {
      width: 146px;
      height: 184px;
    }
  }
}
@media screen and (max-width: 1400px) {
  .alumniInfo-basicInfo__list li {
    width: calc(100%) !important;
    margin-left: 0 !important;
  }
}
</style>
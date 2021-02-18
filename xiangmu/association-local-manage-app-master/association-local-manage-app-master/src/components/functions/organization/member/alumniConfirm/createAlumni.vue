<template>
  <el-dialog
    title="新建知名校友"
    :visible.sync="createNewVisible"
    :close-on-click-modal="false"
    append-to-body
    width="760px"
    :show-close="false"
  >
    <div>
      检索到&nbsp;
      <span style="color:#FF9D00;">{{createAlumniListTotal}}</span>&nbsp;位同名校友，请确认是否为同一人。若是，请选中并关联该校友；若不是，请继续新建
    </div>
    <div v-if="createAlumniListTotal>0" class="sameAlumni">
      <!-- 左箭头 -->
      <span
        class="sameAlumni-pageLeft"
        @click="lastPage"
        v-if="createAlumniForm.offset>=createAlumniForm.limit"
      >
        <span class="el-icon-arrow-left"></span>
      </span>
      <!-- 右箭头 -->
      <span
        class="sameAlumni-pageRight"
        @click="nextPage"
        v-if="createAlumniListTotal-createAlumniForm.offset>createAlumniForm.limit"
      >
        <span class="el-icon-arrow-right"></span>
      </span>
      <div
        :class="{'sameAlumniItem':true,'boundary':(index+1)%4===0}"
        v-for="(item,index) in createAlumniList"
        :key="item.id"
        @click="clickLinkAlumni(item.id)"
      >
        <img v-if="item.headImg" :src="item.headImg" alt />
        <img v-else src="../alumniMatch/image/header.png" alt />
        <div style="fontWeight:700;margin:7px 0;">{{item.name}}</div>
        <div v-if="item.birthday" style="marginBottom:7px;">{{item.birthday | age}}岁</div>
        <div v-else style="marginBottom:7px;">-- 岁</div>
        <div @click="seeMember(item)" style="border:1px solid #E8E8E8;padding:5px 8px;borderRadius:4px;">查看详情</div>
        <div class="linkCheckIf">
          <div v-if="selectLinkAlumni==item.id" class="itemCancleSelect">
            <img src="./image/select.png" alt />
          </div>
          <div class="itemSelect" v-else></div>
        </div>
      </div>
    </div>
    <div v-else class="sameAlumni">
      <div>暂无同名校友</div>
    </div>
    <div slot="footer" class="dialog-footer">
      <div @click="$emit('close')">取消</div>
      <div @click="linkToAlumni">关联选中校友</div>
      <div @click="$emit('toCreateNew',createAlumniInfo)">继续新建</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "createAlumni",
  props: ["createAlumniInfo", "createNewVisible"],
  data() {
    return {
      createAlumniForm: {
        limit: 4,
        offset: 0,
        searchContent: "",
        name: ""
      },
      createAlumniList: [],
      createAlumniListTotal: 0,
      selectLinkAlumni: ""
    };
  },
  filters:{
    age(birthday){
      var num=birthday.split('-')[0]-0;
      var year=(new Date()).getFullYear();
      return year-num;
    }
  },
  created() {
    this.createAlumniForm.name = this.createAlumniInfo.alumniName;
    this.getAlumniByName();
  },
  //   watch:{
  //       createAlumniInfo(val){
  //           console.log(111);
  //           this.createAlumniForm=val.alumniName;
  //           this.getAlumniByName();
  //       }
  //   },
  methods: {
    getAlumniByName() {
      this.$request
        .get("/api/admin/reptile/getSameMemberByName", {
          params: this.createAlumniForm
        })
        .then(res => {
          // console.log(res);
          this.createAlumniList = res.data.list;
          this.createAlumniListTotal = res.data.total;
        });
    },
    clickLinkAlumni(id) {
      if (this.selectLinkAlumni == id) {
        this.selectLinkAlumni = "";
      } else {
        this.selectLinkAlumni = id;
      }
    },
    linkToAlumni() {
      if (!this.selectLinkAlumni) {
        this.$message({
          message: '请先选中要关联的对象',
          type: 'warning'
        });
        return 
      }
      var params = {
        type: 1,
        id: this.createAlumniInfo.id,
        contentId: this.createAlumniInfo.cId,
        memberId: this.selectLinkAlumni
      };
      this.$request
        .post("/api/admin/reptile/relationAssociateAlumni", params)
        .then(res => {
          // console.log(res);
          if (res.success) {
            this.$emit("close");
            this.$emit("fresh-member");
          }
        });
    },
    lastPage() {
      this.createAlumniForm.offset =
        this.createAlumniForm.offset - this.createAlumniForm.limit;
      this.getAlumniByName();
    },
    nextPage() {
      this.createAlumniForm.offset =
        this.createAlumniForm.offset + this.createAlumniForm.limit;
      this.getAlumniByName();
    },
    seeMember(info){
      this.$emit('seeMember',info);
    }
  }
};
</script>

<style lang="less" scoped>
.sameAlumni {
  background-color: #f9f9f9;
  padding: 15px 40px;
  margin-top: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
}
.sameAlumni-pageLeft {
  position: absolute;
  top: 50%;
  transform: translate(-50%);
  left: 15px;
  cursor: pointer;
  z-index: 10;
  span {
    font-size: 26px;
  }
}
.sameAlumni-pageRight {
  position: absolute;
  top: 50%;
  transform: translate(-50%);
  right: -10px;
  cursor: pointer;
  z-index: 10;
  span {
    font-size: 26px;
  }
}
.sameAlumniItem {
  // float: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  margin-right: 75px;
  margin-top: 20px;
  position: relative;
  cursor: pointer;
  // &:nth-child(6n) {
  //   margin-right: 0;
  // }
  // &:hover {
  //   color: #ff9d00;
  // }
  img {
    width: 100px;
    height: 100px;
  }
}
.boundary{
  margin-right: 0;
}
// .linkAlumni {
//   color: #ff9d00;
// }
/deep/ .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  font-weight: 700;
}
/deep/ .el-dialog__footer {
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: flex-end;
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    div {
      color: #3fa1b6;
      border: 1px solid #3fa1b6;
      border-radius: 4px;
      padding: 7px 20px;
      margin-left: 15px;
      cursor: pointer;
      &:last-child {
        color: #fff;
        background-color: #3fa1b6;
      }
      &:hover {
        transform: scale(1.02);
      }
    }
  }
}
.linkCheckIf {
  position: absolute;
  top: -20px;
  right: -30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .itemSelect {
    margin-right: 7px;
    width: 16px;
    height: 16px;
    border: 1px solid #dddddd;
    border-radius: 2px;
    cursor: pointer;
    box-sizing: border-box;
  }
  .itemCancleSelect {
    box-sizing: border-box;
    margin-right: 7px;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    cursor: pointer;
    background-color: #63bcc0;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 9px;
      height: 9px;
    }
  }
}
</style>
<template>
  <div class="addTags">
    <div class="addTagsList">
      <div class="addTagsList-title">已有标签</div>
      <el-checkbox-group v-model="addTagForm.labelIds">
        <el-checkbox
          v-for="item in tagsList"
          :key="item.id"
          :label="item.id"
          :disabled="ifDelete?true:false"
          style="width:30%;"
        >
          <div class="addTagsList-tagsItem">
            <div class="addTagsList-tagsItem__color" :style="{'background-color':item.color}"></div>
            <div>{{item.title}}</div>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="addTagsShow">
      <div class="addTagsShow-item" v-for="item in showTagsList" :key="item.id">
        <span class="el-icon-close addTagsShow-item__icon" @click="selectOneTag(item.id)"></span>
        <span>{{item.title}}</span>
      </div>
    </div>
    <div class="addTagsFooter">
      <el-button
        size="mini"
        @click="sureAddTags"
        style="backgroundColor: #428bca;borderColor: #357EBD;color:#fff;"
      >保存</el-button>
      <el-button size="mini" @click="cancelSubmit">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "addTags",
  props: ["memberSelection", "editMemberInfo", "ifDelete"],
  data() {
    return {
      addTagForm: {
        labelIds: [],
        memberIds: null
      },
      tagsList: [],
      showTagsList: [],
      selectTagsList: []
    };
  },
  watch: {
    "addTagForm.labelIds"(val) {
      this.showTagsList = [];
      var obj = {};
      this.tagsList.forEach(item => {
        obj[item.id] = item;
      });
      val.forEach(item => {
        this.showTagsList.push(obj[item]);
      });
    },
    editMemberInfo(val) {
      this.getTagsList();
      // if (Object.keys(val).length > 0) {
      //   this.addTagForm.labelIds = [];
      //   val.labels.forEach(item => {
      //     this.addTagForm.labelIds.push(item.id);
      //   });
      // }
    },
    memberSelection(val) {
      this.getTagsList();
      // if (this.ifDelete && val.length > 0) {
      //   this.mergeTags();
      // }
    }
  },
  created() {
    this.getTagsList();
  },
  methods: {
    getTagsList() {
      this.$request
        .get("/api/admin/memberLabel/getLabelToMemberList")
        .then(res => {
          this.tagsList = JSON.parse(JSON.stringify(res.data));
          //当第一次通过点击会员的标签设置来打开这个组件时，watch监听器不会执行editMemberInfo的监听，因为此时也是组件初创。为了解决这个问题，在这里执行editMemberInfo的监听器内容
          if (!this.ifDelete && Object.keys(this.editMemberInfo).length > 0) {
            this.addTagForm.labelIds = [];
            this.editMemberInfo.labels.forEach(item => {
              this.addTagForm.labelIds.push(item.id);
            });
          }
          //同上---为了处理删除操作的
          if (this.ifDelete) {
            this.mergeTags();
          }
        });
    },
    selectOneTag(id) {
      var num = this.addTagForm.labelIds.indexOf(id);
      this.addTagForm.labelIds.splice(num, 1);
      if (this.ifDelete) {
        this.selectTagsList.push(id);
      }
    },
    //合并共有标签
    mergeTags() {
      this.addTagForm.labelIds = [];
      var obj = {};
      var num = this.memberSelection.length;
      this.memberSelection[0].label.forEach(item => {
        obj[item.id] = 1;
      });
      for (let i = 1; i < num; i++) {
        this.memberSelection[i].label.forEach(item => {
          if (obj[item.id]) {
            obj[item.id]++;
          }
        });
      }
      for (const key in obj) {
        if (obj[key] === num) {
          this.addTagForm.labelIds.push(key);
        }
      }
    },
    sureAddTags() {
      if (this.memberSelection.length > 0) {
        this.addTagForm.memberIds = [];
        this.memberSelection.forEach(item => {
          this.addTagForm.memberIds.push(item.id);
        });
        //批量删除请求
        if (this.ifDelete) {
          this.$request
            .delete("/api/admin/memberLabel/batchRemoveLabelToMember", {
              data: {
                memberIds: this.addTagForm.memberIds,
                labelIds: this.selectTagsList
              }
            })
            .then(res => {
              this.addTagForm.memberIds = null;
              this.addTagForm.labelIds = [];
              this.showTagsList = [];
              this.selectTagsList = [];
              this.$emit("updataList");
              this.$emit("close");
            });
        } else {
          //批量添加请求
          if (this.addTagForm.labelIds.length === 0) {
            this.$message({
              message: "请选择要添加的标签",
              type: "warning"
            });
            return;
          }
          this.$request
            .post(
              "/api/admin/memberLabel/batchInsertLabelToMember",
              this.addTagForm
            )
            .then(res => {
              // console.log(res);
              if (res.success) {
                this.addTagForm.memberIds = null;
                this.addTagForm.labelIds = [];
                this.showTagsList = [];
                this.$emit("updataList");
                this.$emit("close");
              }
            });
        }
      } else {
        //单独编辑请求
        var obj = {
          memberId: this.editMemberInfo.id,
          labelIds: this.addTagForm.labelIds
        };
        this.$request
          .put("/api/admin/memberLabel/updateLabelToMember", obj)
          .then(res => {
            if (res.success) {
              this.addTagForm.memberIds = null;
              this.addTagForm.labelIds = [];
              this.showTagsList = [];
              this.$emit("updataList");
              this.$emit("close");
            }
          });
      }
    },
    cancelSubmit() {
      this.addTagForm.memberIds = null;
      this.addTagForm.labelIds = [];
      this.showTagsList = [];
      this.selectTagsList = [];
      this.$emit("close");
    }
  }
};
</script>

<style lang="less" scoped>
.addTags {
  padding-left: 30px;
  .addTagsList {
    display: flex;
    .addTagsList-title {
      width: 150px;
      font-weight: 600;
      color: #394263;
    }
    .addTagsList-tagsItem {
      display: flex;
      align-items: center;
      .addTagsList-tagsItem__color {
        width: 15px;
        height: 15px;
        border-radius: 3px;
        margin-right: 5px;
      }
    }
  }
  .addTagsShow {
    box-sizing: border-box;
    margin-left: 70px;
    margin-top: 15px;
    border: 1px solid #dbe1e8;
    min-height: 25px;
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    padding: 5px 7px;
    padding-right: 0;
    .addTagsShow-item {
      background-color: #eff2f7;
      border: 1px solid #ddd;
      padding: 3px 5px;
      font-size: 12px;
      color: #333;
      margin: 3px 5px 3px 0;
      display: flex;
      align-items: center;
      .addTagsShow-item__icon {
        font-weight: 600;
        width: 16px;
        color: #959596;
        cursor: pointer;
        &:hover {
          color: #464646;
        }
      }
    }
  }
  .addTagsFooter {
    margin-top: 15px;
    text-align: right;
  }
}
</style>
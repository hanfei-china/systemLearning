<template>
  <div class="tagsManage">
    <div class="tagsManageTop">
      <div class="tagsManageTop-left">标签管理</div>
      <div>
        <el-button type="danger" size="small" icon="el-icon-circle-close" @click="$emit('close')">关闭</el-button>
        <!-- <el-button type="success" size="small" icon="el-icon-circle-check">保存</el-button> -->
      </div>
    </div>
    <div class="tagsManageMiddle">
      <div class="tagsManageMiddle-top">
        <div>
          <el-button size="small" icon="el-icon-plus" @click="addEditVisible=true">添加标签</el-button>
          <el-button
            size="small"
            style="background-color: #428bca;color:#fff;border-color: #357EBD;"
            @click="mergeClick"
          >合并标签</el-button>
          <el-button size="small" type="danger" @click="deleteTag(selectList)">批量删除</el-button>
        </div>
        <div>
          <el-input
            v-model="searchTags"
            size="mini"
            style="width:250px;"
            placeholder="搜索标签名称"
            prefix-icon="el-icon-search"
          ></el-input>
        </div>
      </div>
      <div class="tagsManageMiddle-table">
        <el-table
          @selection-change="handleSelectionChange"
          :data="tagsList"
          style="width: 100%"
          :header-cell-style="{'background':'#f9f9f9','color':'#394263'}"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="title">
            <template slot="header">
              <div class="upOrDown" @click="peopleUpOrDown">
                <span>名称</span>
                <span v-if="peopleOrder===1" class="el-icon-arrow-down"></span>
                <span v-if="peopleOrder===2" class="el-icon-arrow-up"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="titleDescribe" label="标签描述"></el-table-column>
          <el-table-column prop="memberNum">
            <template slot="header">
              <div class="upOrDown" @click="orderUpOrDown">
                <span>联系人数</span>
                <span v-if="tagsNumOrder===3" class="el-icon-arrow-down"></span>
                <span v-if="tagsNumOrder===4" class="el-icon-arrow-up"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="颜色（点击修改）">
            <template slot-scope="scope">
              <el-popover placement="bottom" width="150" trigger="click" :ref="scope.row.id">
                <ul>
                  <li
                    class="selectColorList"
                    v-for="(item,index) in tagsSelectColor"
                    :key="index"
                    :style="{'background-color':item}"
                    @click="selectColor(scope.row,item)"
                  ></li>
                </ul>
                <div
                  slot="reference"
                  :style="{'background-color':scope.row.color}"
                  class="colorDiv"
                ></div>
              </el-popover>
              <!-- <div :style="{'background-color':scope.row.color}" class="colorDiv"></div> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="editTagClick(scope.row)">
                <span class="el-icon-edit" style="color:#394263;fontWeight:700;fontSize:14px;"></span>
              </el-button>
              <el-button size="mini" @click="deleteTag([scope.row.id])">
                <span class="el-icon-close" style="color:#394263;fontWeight:700;fontSize:14px;"></span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 标签添加和编辑 -->
    <el-dialog
      append-to-body
      :visible.sync="addEditVisible"
      width="500px"
      :title="editTagIf?'编辑标签':'添加标签'"
    >
      <!-- <div slot="title">
        <span>{{Object.keys(editTagInfo).length>0?'编辑标签':'添加标签'}}</span>
      </div>-->
      <div slot="footer" class="addEditTags-footer">
        <el-button
          @click="submitTabInfo"
          size="mini"
          style="backgroundColor: #428bca;borderColor: #357EBD;color:#fff;"
        >保存</el-button>
        <el-button size="mini" style="color:#394263;" @click="cancleSubmit">取消</el-button>
      </div>
      <div class="addEditTags-container">
        <div class="addEditTags-container__item">
          <span>标签名：</span>
          <el-input
            placeholder="请输入标签名"
            v-model="tagsInfoForm.labelTitle"
            size="mini"
            class="dialogInput"
          ></el-input>
        </div>
        <div class="addEditTags-container__item">
          <span>标签描述：</span>
          <el-input
            placeholder="请输入标签描述"
            v-model="tagsInfoForm.labelDescribe"
            size="mini"
            class="dialogInput"
          ></el-input>
        </div>
      </div>
    </el-dialog>
    <!-- 合并标签 -->
    <el-dialog append-to-body :visible.sync="mergeTagsVisible" width="500px" title="合并标签">
      <div class="mergeTags-container">
        <div class="mergeTags-container__header">将标签合并到</div>
        <div class="mergeTags-container__radio">
          <el-radio-group v-model="toMergeLabelId">
            <el-radio v-for="item in selectionList" :key="item.id" :label="item.id">{{item.title}}</el-radio>
          </el-radio-group>
        </div>
        <div class="mergeTags-container__checkbox">
          <el-checkbox v-model="ifDeleteOther">同时删除其他标签</el-checkbox>
        </div>
      </div>
      <div slot="footer" class="addEditTags-footer">
        <el-button
          @click="mergeSure"
          size="mini"
          style="backgroundColor: #428bca;borderColor: #357EBD;color:#fff;"
        >保存</el-button>
        <el-button size="mini" style="color:#394263;" @click="cancelMerge">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tagsManage",
  data() {
    return {
      activeName: "first",
      searchTags: "", //搜索标签标题
      orderSort: 0, //搜索顺序
      selectList: [],
      tagsList: [],
      peopleOrder: 0,
      tagsNumOrder: 0,
      tagsSelectColor: [
        "#2A6496",
        "#FFB983",
        "#F38E72",
        "#EB7371",
        "#C5A3A1",
        "#A6887D",
        "#F7CF66",
        "#C1CF6E",
        "#DDD67E",
        "#71A574",
        "#A7C9A6",
        "#66BED1",
        "#61CAF1",
        "#94B6C2",
        "#97B1D2",
        "#BFBADB",
        "#C392CA",
        "#D2CFEC",
        "#F0AEC9",
        "#A8B6B8",
        "#8B9E8C"
      ],
      addEditVisible: false,
      editTagIf: false,
      tagsInfoForm: {
        labelTitle: "",
        labelDescribe: "",
        labelColor: ""
      },
      mergeTagsVisible: false,
      selectionList: [],
      toMergeLabelId: "",
      ifDeleteOther: false
    };
  },
  created() {
    this.getTagsList();
  },
  watch: {
    searchTags(val) {
      this.getTagsList();
    }
  },
  methods: {
    //获取标签列表
    getTagsList() {
      this.$request
        .get(
          "/api/admin/memberLabel/getMemberLabelList?content=" +
            this.searchTags +
            "&orderSort=" +
            this.orderSort
        )
        .then(res => {
          //   console.log(res);
          this.tagsList = JSON.parse(JSON.stringify(res.data));
        });
    },
    //联系人排序
    orderUpOrDown() {
      if (this.tagsNumOrder === 3) {
        this.tagsNumOrder = 4;
      } else {
        this.tagsNumOrder = 3;
      }
      this.peopleOrder = 0;
      this.orderSort = this.tagsNumOrder;
      this.getTagsList();
    },
    //名称排序
    peopleUpOrDown() {
      if (this.peopleOrder === 1) {
        this.peopleOrder = 2;
      } else {
        this.peopleOrder = 1;
      }
      this.tagsNumOrder = 0;
      this.orderSort = this.peopleOrder;
      this.getTagsList();
    },
    //编辑标签
    editTag(status, id) {
      this.$request
        .put("/api/admin/memberLabel/updateMemberLabel", this.tagsInfoForm)
        .then(res => {
          if (res.success) {
            if (status) {
              this.$refs[id].doClose();
            } else {
              this.addEditVisible = false;
            }
            this.getTagsList();
            this.tagsInfoForm = {
              labelTitle: "",
              labelDescribe: "",
              labelColor: ""
            };
          }
        });
    },
    //标签更换颜色
    selectColor(info, color) {
      this.tagsInfoForm.labelColor = color;
      this.tagsInfoForm.labelTitle = info.title;
      this.tagsInfoForm.labelDescribe = info.titleDescribe;
      this.tagsInfoForm.id = info.id;
      this.editTag(true, info.id);
    },
    //点击编辑标签按钮
    editTagClick(item) {
      this.tagsInfoForm.labelColor = item.color;
      this.tagsInfoForm.labelTitle = item.title;
      this.tagsInfoForm.labelDescribe = item.titleDescribe;
      this.tagsInfoForm.id = item.id;
      this.addEditVisible = true;
      this.editTagIf = true;
    },
    submitTabInfo() {
      if (this.editTagIf) {
        this.editTag(false);
      } else {
        this.tagsInfoForm.labelColor = "#2A6496";
        this.$request
          .post("/api/admin/memberLabel/insertMemberLabel", this.tagsInfoForm)
          .then(res => {
            //   console.log(res);
            if (res.success) {
              this.getTagsList();
              this.addEditVisible = false;
              this.tagsInfoForm = {
                labelTitle: "",
                labelDescribe: "",
                labelColor: ""
              };
            }
          });
      }
    },
    cancleSubmit() {
      this.addEditVisible = false;
      this.tagsInfoForm = {
        labelTitle: "",
        labelDescribe: "",
        labelColor: ""
      };
    },
    //删除标签
    deleteTag(ids) {
      //   console.log({ ids });
      //   var arr=JSON.stringify(ids);
      if (ids.length === 0) {
        this.$message({
          message: "请先选择要删除的标签",
          type: "warning"
        });
        return;
      }
      this.$confirm("此操作将删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request
            .delete("/api/admin/memberLabel/deleteMemberLabel", {
              data: { ids }
            })
            .then(res => {
              if (res.success) {
                this.getTagsList();
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //多选标签
    handleSelectionChange(selection) {
      //   console.log(selection);
      this.selectList = [];
      this.selectionList = selection;
      selection.forEach(item => {
        this.selectList.push(item.id);
      });
    },
    //点击合并标签按钮
    mergeClick() {
      if (this.selectList.length === 0) {
        this.$message({
          message: "请选择要合并的标签",
          type: "warning"
        });
        return;
      }
      this.mergeTagsVisible = true;
    },
    //合并标签
    mergeSure() {
      this.$request
        .put("/api/admin/memberLabel/mergeMemberLabel", {
          formLabelIds: this.selectList,
          isDelete: this.ifDeleteOther ? 1 : 0,
          toMergeLabelId: this.toMergeLabelId
        })
        .then(res => {
          // console.log(res);
          if (res.success) {
            this.mergeTagsVisible = false;
            this.toMergeLabelId = "";
            this.ifDeleteOther = false;
            this.getTagsList();
          }
        });
    },
    //取消合并标签
    cancelMerge() {
      this.mergeTagsVisible = false;
      this.toMergeLabelId = "";
      this.ifDeleteOther = false;
    }
  }
};
</script>

<style lang="less" scoped>
.tagsManage {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
}
.tagsManageTop {
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
  //   box-shadow: 0 2px 4px 0 hsla(0, 0%, 68%, 0.27);
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  .tagsManageTop-left {
    font-size: 20px;
    color: #465361;
    font-weight: 600;
  }
}
.tagsManageMiddle {
  padding: 20px;
  padding-top: 70px;
  .tagsManageMiddle-top {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.upOrDown {
  color: #428bca;
  cursor: pointer;
  span {
    margin-right: 5px;
    font-weight: 700;
  }
}
.colorDiv {
  width: 17px;
  height: 17px;
  border-radius: 3px;
  cursor: pointer;
}
.selectColorList {
  float: left;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 3px;
  &:nth-child(7n) {
    margin-right: 0;
  }
}

.addEditTags-title {
  border-bottom: 1px solid #eaedf1;
  font-size: 20px;
}
.addEditTags-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .addEditTags-container__item {
    display: flex;
    align-items: center;
    span {
      width: 80px;
      color: #394263;
      text-align: right;
      margin-right: 20px;
    }
    .dialogInput {
      width: 240px;
    }
    &:first-child {
      margin-bottom: 20px;
    }
  }
}

.tagsManageMiddle-table {
  height: 700px;
  overflow-y: auto;
}
.mergeTags-container {
  color: #394263;
  .mergeTags-container__radio {
    margin: 15px 0;
    padding-left: 30px;
  }
  .mergeTags-container__checkbox {
    padding-left: 30px;
  }
}
</style>
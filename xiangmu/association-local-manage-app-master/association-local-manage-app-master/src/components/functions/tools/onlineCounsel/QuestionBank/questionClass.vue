<template>
  <div class="container">
    <div class="containerTop" style="cursor:pointer;" @click="ifAddClass=true">
      <i class="el-icon-circle-plus" style="marginRight:10px;"></i>
      <span>添加分类</span>
    </div>
    <div class="containerList">
      <!-- 全部问题模板 -->
      <div
        :class="{'clickClass':clickClassItem==='all'}"
        @click="selectClassItem('all')"
      >全部分类（{{allClassNum}}）</div>
      <!-- 添加分类模板 -->
      <div class="addClassBox" v-if="ifAddClass">
        <el-input v-model="addClassInfo" size="mini" style="width:50%"></el-input>
        <span style="borderRight: 1px solid #DCDFE6;" @click="addClassClick(false)">取消</span>
        <span @click="addClassClick(true)">确定</span>
      </div>
      <!-- 各个分类模板 -->
      <ul>
        <!-- 单独一条分类的模板 -->
        <template v-for="(item) in allClassList">
          <li
            :key="item.id"
            v-if="editClassNameInfo!==item.id"
            :class="{'clickClass':clickClassItem===item.id}"
            @click="selectClassItem(item.id)"
            @mouseover="mouseoverItem(item.id)"
            @mouseleave="mouseleaverItem(item.id)"
          >
            <div>{{item.className}}（{{item.questionNum}}）</div>
            <div v-show="mouseoverItemInfo===item.id" style="transition:all 0.3s;">
              <span class="el-icon-edit" style="padding:0 5px;" @click="editClassName(item)"></span>
              <span
                class="el-icon-delete"
                style="padding:0 5px;marginRight:5px;"
                @click="deleteClassName(item.id)"
              ></span>
            </div>
          </li>
          <li class="addClassBox" :key="item.id" v-if="editClassNameInfo===item.id">
            <el-input size="mini" style="width:50%" v-model="editClassItemName"></el-input>
            <span style="borderRight: 1px solid #DCDFE6;" @click="editClassNameInfo=''">取消</span>
            <span @click="sureEditClassName(item.id)">确定</span>
          </li>
        </template>
        <!-- ---------------------------------------- -->

        <!-- 未分类模板 -->
        <li :class="{'clickClass':clickClassItem==='no'}" @click="selectClassItem('no')">
          <div>未分类（{{noClassNum}}）</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "questionClass",
  data() {
    return {
      allClassList: [],
      addClassInfo: "",
      ifAddClass: false,
      clickClassItem: 0,
      mouseoverItemInfo: Number,
      editClassNameInfo: "",
      allClassNum: Number,
      noClassNum: Number,
      editClassItemName: "" //编辑框的类型绑定值
    };
  },
  created() {
    this.getAllClass();
    this.selectClassItem("all");
  },
  methods: {
    getAllClass() {
      this.$request
        .get("/api/admin/message/searchCustomerSubjectClassList")
        .then(res => {
          console.log(res);
          res.data.forEach(item => {
            if (item.id === "all") {
              this.allClassNum = item.questionNum;
            } else if (item.id === "no") {
              this.noClassNum = item.questionNum;
            } else {
              this.allClassList.push(item);
            }
          });
        });
    },
    addClassClick(data) {
      if (data) {
        if (!this.addClassInfo) {
          this.$message.error("类名不得为空");
          return false;
        }
        this.$request
          .post("/api/admin/message/insertCustomerSubjectClass", {
            className: this.addClassInfo
          })
          .then(res => {
            // console.log(res);
            if (res.data === "havaOne") {
              this.$message.error("此分类已有，请重新编辑类名提交");
            } else {
              this.addClassInfo = "";
              this.ifAddClass = false;
              this.allClassList = [];
              this.getAllClass();
            }
          });
      } else {
        this.addClassInfo = "";
        this.ifAddClass = false;
      }
    },
    selectClassItem(id) {
      this.clickClassItem = id;
      this.$emit("selectClass", id);
    },
    mouseoverItem(data) {
      // console.log(data);
      this.mouseoverItemInfo = data;
    },
    mouseleaverItem(data) {
      if (data === this.mouseoverItemInfo) {
        this.mouseoverItemInfo = Number;
      }
    },
    //点击编辑类名的按钮
    editClassName(item) {
      this.editClassNameInfo = item.id;
      this.editClassItemName = item.className;
    },
    //删除类名
    deleteClassName(id) {
      this.$request
        .delete("/api/admin/message/deleteCustomerSubjectClass", {
          params: { id: id }
        })
        .then(res => {
          // console.log(res);
          this.allClassList = [];
          this.getAllClass();
        });
    },
    //确定修改类名
    sureEditClassName(id) {
      this.$request
        .put("/api/admin/message/updateCustomerSubjectClass", {
          id: id,
          className: this.editClassItemName
        })
        .then(res => {
          // console.log(res);
          this.allClassList = [];
          this.getAllClass();
          this.editClassNameInfo = "";
        });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  font-size: 14px;
  .containerTop {
    height: 29px;
    padding-top: 12px;
    color: #1880ff;
    font-weight: 700;
  }
  .containerList {
    div {
      margin: 0;
      padding: 4px 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:hover {
        background-color: #e6f5ff;
        cursor: pointer;
      }
    }
    ul {
      box-sizing: border-box;
      color: rgba(4, 15, 66, 0.9);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5;
      list-style: none;
      font-feature-settings: "tnum";
      margin: 0;
      padding: 0;
      li {
        &:first-child {
          margin-top: 7px;
        }
        &:hover {
          background-color: #e6f5ff;
          cursor: pointer;
        }
        &:last-child {
          margin-bottom: 7px;
        }
        font-size: 15px;
        margin: 5px 0;
        padding: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        list-style: none;
        outline: 0;
        transition: all 0.3s;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.addClassBox {
  display: flex;
  align-items: center;
  span {
    padding: 0 10px;
    color: #1880ff;
    cursor: pointer;
  }
}
.clickClass {
  background-color: #e6f5ff;
}
</style>
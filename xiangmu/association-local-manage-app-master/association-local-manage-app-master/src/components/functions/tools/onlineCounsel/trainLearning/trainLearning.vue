<template>
  <div style="height:100%;">
    <add-question
      v-if="aditQuestion"
      :addQuestionContent="addQuestionContent"
      @addQuestion="addQuestionIf"
      style="height:100%;"
    ></add-question>
    <el-container
      v-else
      style="padding: 0 16px 16px;"
      class="absolute-fill-parent background-color-white"
    >
      <el-header class="unset-padding flex flex-column flex-center">
        <div class="flex">
          <div
            class="flex-fill-in-the-remaining-space flex"
            style="justifyContent: space-between;alignItems:center;"
          >
            <el-button
              type="primary"
              @click="ignoreQuestion"
              :disabled="ignoreSections.length===0"
            >忽略</el-button>
            <el-date-picker
              v-model="searchTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              @change="selectSearchTime"
            ></el-date-picker>
          </div>
          <!-- <div >
                    <el-button size="small" type="primary" @click="newClass">新增分类</el-button>
          </div>-->
        </div>
      </el-header>
      <el-main class="unset-padding position-relative">
        <el-draggable-table
          :list="list"
          :el-table-props="elTableProps"
          class="custom-el-table header-gray"
          :options="dragOptions"
          dragSelector="tbody"
          @selection-change="selectItems"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column class-name="item-un-sort" label="未识别问题" show-overflow-tooltip>
            <template slot-scope="{row}">{{row.content}}</template>
          </el-table-column>
          <el-table-column class-name="item-un-sort" width="200px">
            <!-- 自定义表头 -->
            <template slot="header" slot-scope="{scope}">
              <el-popover placement="bottom" width="120" trigger="hover" ref="popoverItem">
                <div style="display:flex;flexDirection:column;alignItems:center;">
                  <p
                    @click="changeSortStyle(1)"
                    :class="{'normalSortStyle':true,'selectSortStyle':formInfo.sort===1}"
                  >按提问次数升序</p>
                  <p
                    @click="changeSortStyle(2)"
                    :class="{'normalSortStyle':true,'selectSortStyle':formInfo.sort===2}"
                  >按提问次数降序</p>
                </div>
                <!-- <el-button slot="reference">click 激活</el-button> -->
                <div slot="reference">
                  <span>按提问次数</span>
                  <span style="marginRight:5px;">{{formInfo.sort===1?'升序':'降序'}}</span>
                  <span
                    style="color:#409eff;fontSize:14px;"
                    :class="{'el-icon-caret-bottom':formInfo.sort===2,'el-icon-caret-top':formInfo.sort===1}"
                  ></span>
                </div>
              </el-popover>
            </template>
            <!-- 自定义表格内容 -->
            <template slot-scope="{row}">{{row.num}}</template>
          </el-table-column>
          <!-- <el-table-column class-name="item-un-sort" label="知识库相似问题" width="200px">
            <template slot-scope="{row}">
              <span style="marginRight:5px;">0</span>
              <el-popover
                style="fontSize:14px;"
                placement="bottom"
                width="200"
                trigger="hover"
                content="未找到任何可匹配的标准问题。"
              >
                <span slot="reference" class="el-icon-question"></span>
              </el-popover>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="180px">
            <template slot-scope="{row}">
              <el-popover placement="bottom" trigger="click" :ref="row.content">
                <div class="operateSection" @click="addNewQuestion(row.content)">添加到新问题</div>
                <div class="operateSection" @click="addToOld(row.content)">学习到已有问题</div>
                <div style="borderBottom: none;" class="operateSection" @click="ignoreOneSection(row.content)">忽略</div>
                <el-button slot="reference" size="small" icon="el-icon-caret-bottom">操作</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-draggable-table>
      </el-main>
      <div style="display:flex;justifyContent:center;padding-top:16px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 50]"
          :page-size="formInfo.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-container>
    <el-dialog :visible.sync="dialogTableVisible" append-to-body>
      <to-old-question :toOldQuestionInfo="toOldQuestionInfo" @close="closeDialog"></to-old-question>
    </el-dialog>
  </div>
</template>

<script>
import toOldQuestion from "./toOldQuestion";
import addQuestion from "../QuestionBank/addQuestion";
import ElDraggableTable from "../../../../util/elTableDraggable/ElDraggableTable";
import Vue from "vue";
export default {
  name: "trainLearning",
  components: { ElDraggableTable, addQuestion, toOldQuestion },
  data() {
    return {
      list: [],
      dragOptions: {
        filter: ".item-un-sort",
        draggable: ".el-table__row",
        animation: 150
      },
      elTableProps: {
        height: "100%",
        size: "small",
        border: false,
        stripe: true
      },
      searchTime: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      formInfo: {
        endTime: "",
        startTime: "",
        sort: 2,
        limit: 20,
        offset: 0
      },
      total: 0,
      ignoreSections: [],
      aditQuestion: false,
      addQuestionContent: "",
      dialogTableVisible: false,
      toOldQuestionInfo: ""
    };
  },
  methods: {
    getList() {
      this.$request
        .post("/api/admin/message/getUnrecognizedQuestion", {
          startTime: this.formInfo.startTime,
          endTime: this.formInfo.endTime,
          sort: this.formInfo.sort,
          limit: this.formInfo.limit,
          offset: this.formInfo.offset
        })
        .then(res => {
          //   console.log(res);
          this.list = res.data.list;
          this.total = res.data.total;
        });
    },
    //切换升降排列顺序
    changeSortStyle(data) {
      this.$set(this.formInfo, "sort", data);
      this.$refs.popoverItem.doClose();
      this.getList();
    },
    handleSizeChange(e) {
      // console.log(e)
      this.formInfo.limit = e;
      this.formInfo.offset = 0;
      this.getList();
    },
    handleCurrentChange(e) {
      // console.log(e);
      this.formInfo.offset = (e - 1) * this.formInfo.limit;
      this.getList();
    },
    //选定筛选时间
    selectSearchTime(date) {
      if (!date) {
        this.formInfo.startTime = "";
        this.formInfo.endTime = "";
      } else {
        this.formInfo.startTime = date[0];
        this.formInfo.endTime = date[1];
      }

      this.getList();
    },
    //勾选表单中的选项
    selectItems(section) {
      this.ignoreSections = [];
      section.forEach(item => {
        this.ignoreSections.push(item.content);
      });
    },
    //点击单个问题忽略
    ignoreOneSection(data) {
      this.ignoreSections.push(data);
      this.$refs[data].doClose();
      this.ignoreQuestion();
    },
    //忽略未识别问题
    ignoreQuestion() {
      this.$request
        .put("/api/admin/message/updateUnrecognizedQuestion", {
          contents: this.ignoreSections
        })
        .then(res => {
          //   console.log(res);
          if (res.success) {
            this.getList();
          }
        });
    },
    //添加到新问题
    addNewQuestion(data) {
      this.aditQuestion = true;
      this.addQuestionContent = data;
    },
    //关闭添加问题组件
    addQuestionIf(data) {
      this.aditQuestion = false;
      this.getList();
    },
    //添加到已有问题
    addToOld(content) {
      this.dialogTableVisible = true;
      this.toOldQuestionInfo = content;
    },
    //关闭dialog
    closeDialog(data) {
      if (data) {
        this.getList();
      }
      this.dialogTableVisible = false;
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
.selectSortStyle {
  color: #409eff;
}
.normalSortStyle {
  padding: 10px 0;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
  }
}
.operateSection {
  padding: 7px 0;
//   padding-left: 25px;
  margin: 0 25px;
  border-bottom: 1px solid #EBEEF5;
  cursor: pointer;
  &:hover {
    background-color: #fafafa;
    color: #409eff;
  }
}
</style>

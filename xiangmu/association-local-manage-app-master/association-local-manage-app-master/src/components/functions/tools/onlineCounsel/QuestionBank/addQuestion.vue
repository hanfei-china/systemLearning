<template>
  <div class="addQuestion" style="fontSize:14px;">
    <div class="addQuestionTop">添加问题</div>
    <div class="addQuestionForm">
      <el-form ref="formQuestion" :model="addQuestionForm" label-width="100px" :rules="rules">
        <el-form-item label="标准问题：" prop="standardQuestion">
          <el-input v-model="addQuestionForm.standardQuestion" size="small"></el-input>
        </el-form-item>
        <el-form-item label="相似问法：">
          <el-input
            @keydown.native.enter="addSameQuestion"
            v-model="sameQustion"
            size="small"
            placeholder="请输入问法，回车添加"
          ></el-input>
          <div v-if="addQuestionForm.similarityQuestions.length>0">
            <ul
              v-if="!IFcloseSameQuestion"
              style="border:1px solid rgba(4, 15, 66, 0.2);marginTop:8px;padding:11px 16px;borderRadius:6px;"
            >
              <li
                v-for="(item,index) in addQuestionForm.similarityQuestions"
                :key="index"
                style="padding:0;margin:10px 0;lineHeight:18px;display:flex;justifyContent: space-between;"
              >
                <span>{{item}}</span>
                <span style="color:#1880ff;cursor: pointer;" @click="deleteSameQuestion(index)">删除</span>
              </li>
            </ul>
            <div style="display:flex;justifyContent: space-between;">
              <span
                style="color:rgba(4, 15, 66, 0.6);"
              >已有{{addQuestionForm.similarityQuestions.length}}个问法</span>
              <div
                v-if="IFcloseSameQuestion"
                style="color:#1880ff;cursor: pointer;"
                @click="sameQuestionShowIF"
              >
                <span>展开</span>
                <span class="el-icon-caret-bottom"></span>
              </div>
              <div v-else style="color:#1880ff;cursor: pointer;" @click="sameQuestionShowIF">
                <span>收起</span>
                <span class="el-icon-caret-top"></span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="默认回答：" prop="answer">
          <el-input
            v-model="addQuestionForm.answer"
            placeholder="请输入答案"
            type="textarea"
            rows="8"
            resize="none"
            style="fontSize:16px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="答案有效期">
          <el-radio-group v-model="addQuestionForm.timeStatus">
            <el-radio :label="1">永久有效</el-radio>
            <el-radio :label="2">自定义有效期</el-radio>
          </el-radio-group>
          <el-date-picker
            value-format="timestamp"
            v-if="validTimeShow"
            v-model="validTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="分类名称" prop="questionClassId">
          <el-select v-model="addQuestionForm.questionClassId" placeholder="请选择分类">
            <el-option
              :label="item.className"
              :value="item.id"
              v-for="item in selectClassList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联问题" style="color:#1880ff;">
          <div @click="clickAddQuestion" style="cursor:pointer;">
            <span class="el-icon-circle-plus" style="marginRight:8px;"></span>
            <span>添加问题</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="isAdding" type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="$emit('addQuestion',false)">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" append-to-body>
      <div slot="title">
        <div style="fontSize:16px;textAlign: center;">添加关联问题</div>
      </div>
      <div class="dialogContainer">
        <div class="dialogLeft">
          <div class="classification">分类</div>
          <div class="classificationList">
            <ul>
              <li
                style="marginBottom:5px;"
                @click="clickAllClassItem(item.id)"
                v-for="item in allClassList"
                :key="item.id"
                :class="{'clickClass':clickClassItem===item.id}"
              >{{item.className}}</li>
            </ul>
          </div>
        </div>
        <div class="dialogRight">
          <div class="normalQuestion">常见问题</div>
          <div class="serachQuestion">
            <el-input
              v-model="searchQuestion"
              suffix-icon="el-icon-search"
              size="small"
              placeholder="搜索问题"
            ></el-input>
          </div>
          <div class="allQustion">
            <el-checkbox-group v-model="addQuestionForm.relationQuestionIds">
              <el-checkbox
                :label="item.id"
                class="checkQuestion"
                v-for="item in questionList"
                :key="item.id"
              >
                <span class="questionInfo">{{item.standardQuestion}}</span>
              </el-checkbox>
              <!-- <el-checkbox label="1" style="display:block;marginBottom:14px;">
                <span style="display:inline-block;width:500px;">复选框 A</span>
              </el-checkbox>-->
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "addQuestion",
  props: ["editQuestion", "addQuestionContent"],
  data() {
    return {
      addQuestionForm: {
        standardQuestion: "",
        id: "",
        answer: "",
        timeStatus: 1,
        questionClassId: "",
        relationQuestionIds: [],
        similarityQuestions: [],
        startTime: "",
        endTime: ""
      },
      rules: {
        standardQuestion: [
          { required: true, message: "请输入标准问题", trigger: "blur" }
        ],
        answer: [
          { required: true, message: "请输入默认回答", trigger: "blur" }
        ],
        questionClassId: [
          { required: true, message: "请选择问题分类", trigger: "change" }
        ]
      },
      sameQustion: "", //相似问法表单域绑定元素
      IFcloseSameQuestion: false, //是否收起相似问题列表
      validTimeShow: false, //是否展示时间日期选择器
      validTime: [],
      dialogTableVisible: false,
      searchQuestion: "",
      allClassList: [], //所有分类列表
      selectClassList: [], //可供选择的分类列表
      clickClassItem: "", //选中的关联问题的分类项
      total: Number, //问题总数
      questionList: [], //问题列表
      isAdding:false
    };
  },
  watch: {
    validTime(val) {
      this.addQuestionForm.startTime = val[0];
      this.addQuestionForm.endTime = val[1];
    },
    "addQuestionForm.timeStatus"(val) {
      if (val === 2) {
        this.validTimeShow = true;
      } else {
        this.validTimeShow = false;
        this.validTime = [];
      }
    },
    clickClassItem(val) {
      this.getQuestionList();
    },
    searchQuestion(val) {
      this.getQuestionList();
    }
  },
  created() {
    if (this.editQuestion) {
      this.getQuestionInfo();
    } else if (this.addQuestionContent) {
      this.addQuestionForm.standardQuestion = this.addQuestionContent;
    }
    this.getAllClass();
  },
  methods: {
    //提交问题
    onSubmit() {
      //如果是将未识别问题添加到题库中，需要添加一个参数
      if (this.addQuestionContent) {
        this.addQuestionForm.dataSource = 1;
      }
      var a = true;
      this.$refs["formQuestion"].validate(state => {
        if (!state) {
          a = false;
          return false;
        }
      });
      if (!a) {
        return false;
      }
      if (
        this.addQuestionForm.timeStatus === 2 &&
        (!this.addQuestionForm.startTime || !this.addQuestionForm.endTime)
      ) {
        this.$message({
          message: "请选择有效期限",
          type: "warning"
        });
        return false;
      }
      this.isAdding=true;
      if (!this.editQuestion) {
        this.$request
          .post(
            "/api/admin/message/insertCustomerSubject",
            this.addQuestionForm
          )
          .then(res => {
            //   console.log(res);
            if (res.success) {
              this.isAdding=false;
              if (res.data === "havaOne") {
                this.$message.error("题库中已经包含此问题，请重新编辑提交");
              } else {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$emit("addQuestion", false);
              }
            }
          });
      } else {
        this.$request
          .put("/api/admin/message/updateCustomerSubject", this.addQuestionForm)
          .then(res => {
            //   console.log(res);
            if (res.success) {
              this.isAdding=false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$emit("addQuestion", false);
            }
          });
      }
    },
    //获取问题详细信息
    getQuestionInfo() {
      this.$request
        .get(
          "/api/admin/message/searchCustomerSubjectDetail?id=" +
            this.editQuestion
        )
        .then(res => {
          //   console.log(res);
          var arr = [];
          var arr_1 = [];
          res.data.relationQuestions.forEach(item => {
            arr.push(item.id);
          });
          res.data.similarQuestions.forEach(item => {
            arr_1.push(item.similarityQuestionContent);
          });
          this.addQuestionForm = {
            standardQuestion: res.data.customerSubject.standardQuestion,
            id: res.data.customerSubject.id,
            answer: res.data.customerSubject.insideAnswers,
            timeStatus: res.data.customerSubject.timeState,
            questionClassId: res.data.customerSubject.questionClassId,
            relationQuestionIds: arr,
            similarityQuestions: arr_1,
            startTime: res.data.customerSubject.startTime,
            endTime: res.data.customerSubject.endTime
          };
        });
    },
    //添加相似问题
    addSameQuestion() {
      this.addQuestionForm.similarityQuestions.push(this.sameQustion);
      this.sameQustion = "";
    },
    //相似问题是否展示
    sameQuestionShowIF() {
      this.IFcloseSameQuestion = !this.IFcloseSameQuestion;
    },
    //删除相似问题
    deleteSameQuestion(index) {
      this.addQuestionForm.similarityQuestions.splice(index, 1);
    },
    //点击添加关联问题按钮
    clickAddQuestion() {
      this.dialogTableVisible = true;
    },
    //获取分类
    getAllClass() {
      this.$request
        .get("/api/admin/message/searchCustomerSubjectClassList")
        .then(res => {
          //   console.log(res);
          this.allClassList = JSON.parse(JSON.stringify(res.data));
          res.data.forEach(item => {
            if (item.id === "all") {
              this.total = item.questionNum;
              this.clickClassItem =
                this.addQuestionForm.questionClassId || "all";
            }
            if (item.id !== "all" && item.id !== "no") {
              this.selectClassList.push(item);
            }
          });
        });
    },
    //点击分类
    clickAllClassItem(id) {
      this.clickClassItem = id;
    },
    //获取所有问题
    getQuestionList() {
      var limit=this.total===0?1:this.total
      this.$request
        .get(
          "/api/admin/message/searchCustomerSubjectPage?classId=" +
            this.clickClassItem +
            "&limit=" +
             limit+
            "&offset=0&searchContent=" +
            this.searchQuestion
        )
        .then(res => {
          //   console.log(res);
          this.questionList = JSON.parse(JSON.stringify(res.data.list));
        });
    }
  }
};
</script>

<style lang="less" scoped>
.addQuestion {
  flex: 1;
  background-color: #fff;
  padding: 0 16px;
  overflow-y: auto;
  .addQuestionTop {
    padding: 16px 0;
    line-height: 24px;
    font-size: 16px;
    color: rgba(4, 15, 66, 0.6);
    border-bottom: 1px solid #eef0f6;
  }
  .addQuestionForm {
    padding-top: 36px;
    width: 500px;
    box-sizing: border-box;
    margin: 0;
    color: rgba(4, 15, 66, 0.9);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
  }
}
.dialogContainer {
  border: 1px solid #eef0f6;
  border-radius: 4px;
  display: flex;
  height: 300px;
  .dialogLeft {
    width: 236px;
    padding: 0 16px;
    border-right: 1px solid #eef0f6;
    display: flex;
    flex-direction: column;
    .classification {
      padding: 16px 0;
      font-weight: 500;
      color: rgba(4, 15, 66, 0.9);
    }
    .classificationList {
      flex: 1;
      overflow: auto;
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
          margin: 0;
          padding: 4px 0;
          padding-left: 4px;
          white-space: nowrap;
          list-style: none;
          outline: 0;
          transition: all 0.3s;
          &:hover {
            background-color: #e6f5ff;
            cursor: pointer;
          }
          &:first-child {
            padding-top: 0;
          }
          &:last-child {
            padding-bottom: 8px;
          }
        }
      }
    }
  }
  .dialogRight {
    flex: 1;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    .normalQuestion {
      width: 100%;
      padding: 16px 0;
      font-weight: 500;
      color: rgba(4, 15, 66, 0.9);
    }
    .serachQuestion {
      width: 100%;
      margin-bottom: 16px;
    }
    .allQustion {
      width: 100%;
      flex: 1;
      overflow: auto;
      .checkQuestion {
        display: block;
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        .questionInfo {
          display: inline-block;
          width: 500px;
          text-overflow: ellipsis;
          white-space: normal;
        }
      }
    }
  }
}
.clickClass {
  background-color: #e6f5ff;
}
</style>
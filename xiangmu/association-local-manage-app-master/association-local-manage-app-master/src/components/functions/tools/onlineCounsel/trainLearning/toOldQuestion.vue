<template>
  <div>
    <div>
      <div style="fontSize:16px;textAlign: center;marginBottom:15px;">添加关联问题</div>
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
          <el-radio-group v-model="selectQuestion">
            <el-radio
              v-for="item in questionList"
              :key="item.id"
              :label="item.id"
              class="checkQuestion"
            >
              <span class="questionInfo">{{item.standardQuestion}}</span>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "toOldQuestion",
  props: ["toOldQuestionInfo"],
  data() {
    return {
      allClassList: [],
      selectClassList: [], //可供选择的分类列表
      clickClassItem: "", //选中的关联问题的分类项
      searchQuestion: "",
      total: Number,
      questionList: [],
      selectQuestion: ""
    };
  },
  watch: {
    clickClassItem(val) {
      this.getQuestionList();
    },
    searchQuestion(val) {
      this.getQuestionList();
    }
  },
  created() {
    this.getAllClass();
  },
  methods: {
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
              this.clickClassItem = "all";
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
      this.$request
        .get(
          "/api/admin/message/searchCustomerSubjectPage?classId=" +
            this.clickClassItem +
            "&limit=" +
            this.total +
            "&offset=0&searchContent=" +
            this.searchQuestion
        )
        .then(res => {
          //   console.log(res);
          this.questionList = JSON.parse(JSON.stringify(res.data.list));
        });
    },
    //学习到已有问题
    confirm(){
        this.$request.put('/api/admin/message/addUnrecognizedToSimilarityQuestion',{
            content:this.toOldQuestionInfo,
            standardQuestionId:this.selectQuestion
        }).then(res=>{
            if (res.success) {
                this.$emit('close',true);
            }
        })
    }
  }
};
</script>

<style lang="less" scoped>
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
.dialog-footer {
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
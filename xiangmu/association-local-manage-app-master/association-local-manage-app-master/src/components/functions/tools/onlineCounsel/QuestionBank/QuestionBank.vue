<template>
  <div class="questionBank">
    <question-class v-if="!ifAddQuestion" class="questionClass" @selectClass="selectClassId"></question-class>
    <question-list
      v-if="!ifAddQuestion"
      class="questionList"
      :showClassInfo="selectClassIdInfo"
      @addQuestion="addQuestion"
    ></question-list>
    <add-question
      v-if="ifAddQuestion"
      class="addQuestion"
      @addQuestion="addQuestion"
      :editQuestion="editQuestioninfo"
    ></add-question>
    <!-- <edit-question
      v-if="!ifAddQuestion&&ifEditQuestion"
      class="addQuestion"
      :editQuestion="editQuestioninfo"
    ></edit-question> -->
  </div>
</template>

<script>
import questionClass from "./questionClass";
import questionList from "./questionList";
import addQuestion from "./addQuestion";
// import editQuestion from "./editQuestion";
export default {
  name: "QuestionBank",
  components: { questionList, questionClass, addQuestion},
  data() {
    return {
      ifAddQuestion: false,
      selectClassIdInfo: "",
      editQuestioninfo: ''
    };
  },
  methods: {
    addQuestion(data, id) {
      this.ifAddQuestion = data;
      this.editQuestioninfo = id;
    },
    selectClassId(id) {
      this.selectClassIdInfo = id;
    },
  }
};
</script>

<style lang="less" scoped>
.questionBank {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 16px;
  box-sizing: border-box;
  .questionClass {
    width: 240px;
    align-items: stretch;
    box-sizing: border-box;
    background-color: #fff;
    padding: 16px 24px;
    margin-right: 16px;
  }
  .questionList {
    flex: 1;
    align-items: stretch;
    box-sizing: border-box;
    background-color: #fff;
    padding: 16px 24px;
  }
}
</style>
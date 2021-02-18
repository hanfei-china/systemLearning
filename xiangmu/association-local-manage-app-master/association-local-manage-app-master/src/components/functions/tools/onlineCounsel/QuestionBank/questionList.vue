<template>
  <div class="containerQuestion">
    <!-- 头部 -->
    <div class="containerTop">
      <div style="color:#1880ff;font-weight: 700;cursor:pointer;">
        <i class="el-icon-circle-plus" style="marginRight:10px;"></i>
        <span @click="addQuestion('')">添加问题</span>
      </div>
      <div class="containerTopRight">
        <el-input
          placeholder="请输入搜索内容"
          suffix-icon="el-icon-search"
          class="topRight-input"
          size="small"
          style="width:320px;height:32px;marginRight:8px;"
          v-model="searchInfo"
        ></el-input>
        <el-button
          style="height:32px;fontSize:14px;"
          size="small"
          @click="dialogTableVisible=true"
        >批量导入</el-button>
        <el-button style="height:32px;fontSize:14px;" size="small" @click="downloadQustion(1)">批量导出</el-button>
      </div>
    </div>
    <!-- 表格部分 -->
    <div class="containerMiddle">
      <el-table
        :data="questionList"
        height="700"
        style="width: 100%"
        :header-cell-style="{'backgroundColor': '#fafafa'}"
      >
        <el-table-column prop="standardQuestion" label="标准问题"></el-table-column>
        <el-table-column label="有效期">
          <template slot-scope="scope">
            <span
              v-if="scope.row.timeState===2"
            >{{scope.row.startTime | yyyyMMddHHmmss}}---{{scope.row.endTime | yyyyMMddHHmmss}}</span>
            <span v-else>永久有效</span>
          </template>
        </el-table-column>
        <el-table-column prop="timeState" label="当前状态" width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.currentState===1" style="display:flex;alignItems:center;">
              <span
                style="width:8px;height:8px;borderRadius:50%;backgroundColor: #15c292;marginRight:10px;"
              ></span>
              <span>正常</span>
            </div>
            <div v-else style="display:flex;alignItems:center;">
              <span
                style="width:8px;height:8px;borderRadius:50%;backgroundColor: red;marginRight:10px;"
              ></span>
              <span>停用</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="250">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | yyyyMMddHHmmss}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addQuestion(scope.row.id)">编辑</el-button>
            <el-button
              type="text"
              v-if="scope.row.currentState===1"
              size="small"
              @click="stopQuestion(false,scope.row.id)"
            >停用</el-button>
            <el-button
              type="text"
              v-if="scope.row.currentState===2"
              size="small"
              @click="stopQuestion(true,scope.row.id)"
              style="color:red;"
            >启用</el-button>
            <el-button type="text" size="small" @click="deleteQuestion(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="containerBottom">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" append-to-body width="25%">
      <div slot="title">
        <div style="fontSize:16px;textAlign: center;">批量导入</div>
      </div>
      <div class="dialog-middle">
        <div class="uploadFile">
          <div style="marginRight:15px;fontSize:14px;lineHeight:32px;">上传文件：</div>
          <div>
            <el-upload
              class="upload-demo"
              :action="action"
              :on-success="uploadFiles"
              :on-remove="deleteFile"
              :before-upload="beforeUpload"
              :file-list="fileList"
              :limit="1"
              accept=".xls,.xlsx"
            >
              <el-button size="small" icon="el-icon-document-add">点击上传</el-button>
            </el-upload>
            <div style="fontSize:14px;marginTop:15px;">
              <span>*下载</span>
              <span style="color:#1880ff;cursor:pointer;" @click="downloadQustion(2)">《题库数据模板》</span>
            </div>
          </div>
        </div>
        <div style="color:rgba(4, 15, 66, 0.6);fontSize:14px;marginTop:30px;">
          <p>数据导入说明：</p>
          <p>1.数据导入需按模板填写具体内容，标准问题，默认回答不可为空，默认答案只可填写文字内容</p>
          <p>2.单次导入文件大小不超过2MB</p>
          <p>3.目前仅支持.xlsx格式文件导入</p>
          <p>4.每次只能导入1个文件</p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(false)">取 消</el-button>
        <el-button type="primary" @click="closeDialog(true)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestBaseUrl } from "../../../../../js/config/serviceConfig";
export default {
  name: "questionList",
  props: ["showClassInfo"],
  data() {
    return {
      searchInfo: "", //搜索框内容
      questionList: [], //问题的列表数据
      limit: 20,
      offset: 0,
      currentPage: 1,
      total: 0,
      dialogTableVisible: false,
      action: requestBaseUrl + "/api/common/anon/uploadFile", //上传图片及文件的地址
      uploadFilesList: "", //上传的文件的列表
      fileList: [], //初始状态时的文件上传列表
    };
  },
  watch: {
    showClassInfo(val) {
      this.limit = 20;
      this.offset = 0;
      this.currentPage = 1;
      this.getQuestionList();
    },
    searchInfo(val) {
      this.offset = 0;
      this.getQuestionList();
    }
  },
  //这里的作用：从添加问题返回时，且返回前后分类列表选中的都是“全部分类”--此时不会触发watch
  created() {
    this.limit = 20;
    this.offset = 0;
    this.currentPage = 1;
    this.getQuestionList();
  },
  methods: {
    getQuestionList() {
      this.$request
        .get(
          "/api/admin/message/searchCustomerSubjectPage?classId=" +
            this.showClassInfo +
            "&limit=" +
            this.limit +
            "&offset=" +
            this.offset +
            "&searchContent=" +
            this.searchInfo
        )
        .then(res => {
          // console.log(res);
          this.questionList = JSON.parse(JSON.stringify(res.data.list));
          this.total = res.data.total;
        });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getQuestionList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (this.currentPage - 1) * this.limit;
      this.getQuestionList();
    },
    downloadQustion(data) {
      if (data===1) {
        var url=`${requestBaseUrl}/api/admin/message/exportExcel?classId=${this.showClassInfo}&searchContent=${this.searchInfo}`
      }else if (data===2) {
        var url=`${requestBaseUrl}/api/admin/message/exportTemplate`
      }
      console.log(url);
      window.open(url);
    },
    addQuestion(id) {
      this.$emit("addQuestion", true, id);
    },
    stopQuestion(state, id) {
      var currentState = 2;
      if (state) {
        currentState = 1;
      }
      this.$request
        .put("/api/admin/message/updateCurrentState", {
          id,
          currentState
        })
        .then(res => {
          // console.log(res);
          this.getQuestionList();
        });
    },
    deleteQuestion(id) {
      this.$request
        .delete("/api/admin/message/deleteCustomerSubject?id=" + id)
        .then(res => {
          this.getQuestionList();
        });
    },
    beforeUpload(file){
      //超出文件大小要求的处理
      // console.log(file);
      if (file.size>2*1024*1024) {
        this.fileList=[];
        this.uploadFilesList='';
        this.$message({
          message: '文件超出2M，请重新上传文件',
          type: 'warning'
        });
      }
    },
    uploadFiles(response, file, fileList) {
      this.uploadFilesList = response.data;
    },
    deleteFile(file, fileList) {
      this.uploadFilesList = "";
    },
    closeDialog(state) {
      if (state) {
        this.$request.post('/api/admin/message/importCustomerSubjectByExcel',{url:this.uploadFilesList}).then(res=>{
          console.log(res);
        })
      }
      this.fileList = [];
      this.uploadFilesList = '';
      this.dialogTableVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.containerQuestion {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  .containerTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    .containerTopRight {
      display: flex;
      height: 33.5px;
      align-items: center;
    }
  }
  .containerMiddle {
    flex: 1;
  }
  .containerBottom {
    height: 53.5px;
    padding: 10px 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-end;
  }
}
.dialog-middle {
  .uploadFile {
    display: flex;
  }
}
</style>
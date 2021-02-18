<template>
  <el-container
    class="absolute-fill-parent background-color-white"
    style="padding: 16px 16px 0 16px;"
  >
    <el-header class="unset-padding" height="auto">
      <div class="flex" style="padding-bottom: 16px;">
        <div class="flex-fill-in-the-remaining-space"></div>
        <div class="flex">
          <el-button size="small" type="primary" @click="newSubmit" v-if="!isDonation">新增</el-button>
          <el-button size="small" @click="batchImportVisible = true" v-if="!isDonation">批量导入</el-button>
          <el-dropdown style="margin-left: 10px;" @command="manageDropdown">
            <el-button type="primary">
              导出
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="dataDropdown">数据导出</el-dropdown-item>
              <el-dropdown-item command="manageDropdown">附件导出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button style="position: relative;" type="primary" icon="el-icon-download" size="small">
                        <span style="opacity: 0;">数据导出</span>
                        <a style="color: inherit;padding-left: 29px;text-align: left;" class="absolute-fill-parent flex flex-column flex-center" :href="downloadUrl">数据导出</a>
          </el-button>-->
        </div>
      </div>
    </el-header>
    <el-main class="position-relative unset-padding">
      <el-table
        size="small"
        :data="list"
        v-show="list.length>0 || loaded"
        height="100%"
        class="custom-el-table header-gray"
        border
        stripe
      >
        <el-table-column type="index" align="center" label="序号" fixed />
        <el-table-column
          v-for="field of fields"
          :key="field.code"
          :label="field.title"
          show-tooltip-when-overflow
          :min-width="field.width"
        >
          <template v-slot="{row}">
            <online-form-preview-field
              :row="row"
              :field="field"
              :form-info="formInfo"
              :value="row[field.code]"
            />
          </template>
        </el-table-column>
        <el-table-column label="处理状态" v-if="formInfo.isNeedHandle" width="100px">
          <template v-slot="{row}">{{handleStatus(row.handleStatus)}}</template>
        </el-table-column>
        <el-table-column label="处理时间" v-if="formInfo.isNeedHandle" width="150px">
          <template v-slot="{row}">{{row.handleTime | yyyyMMddHHmm}}</template>
        </el-table-column>
        <el-table-column
          label="处理意见"
          v-if="formInfo.isNeedHandle"
          width="100px"
          show-tooltip-when-overflow
          prop="rejectReason"
        />
        <el-table-column
          label="操作"
          fixed="right"
          :width="formInfo.isNeedHandle ? '205px' : '100px'"
          v-if="!isDonation"
        >
          <template v-slot="{row}">
            <template v-if="row.handleStatus === 0 && formInfo.isNeedHandle">
              <el-button
                type="text"
                size="small"
                class="unset-padding custom-el-button"
                @click="resolve(row.submitId)"
              >{{formInfo.resolveText}}</el-button>
              <el-button
                type="text"
                size="small"
                class="unset-padding custom-el-button danger"
                @click="reject(row.submitId)"
              >{{formInfo.rejectText}}</el-button>
              <el-button
                type="text"
                size="small"
                class="unset-padding custom-el-button warning"
                @click="reply(row.submitId)"
              >回复</el-button>
            </template>
            <el-button
              type="text"
              size="small"
              class="unset-padding custom-el-button"
              @click="editSubmit(row.submitId)"
              v-if="!isDonation"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              class="unset-padding custom-el-button danger"
              @click="deleteSubmit(row.submitId)"
              v-if="!isDonation"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="auto" class="unset-padding">
      <div style="padding-bottom: 16px;padding-top: 16px;" class="flex">
        <div class="flex-fill-in-the-remaining-space"></div>
        <div>
          <el-pagination
            background
            :total="total"
            :page-size="page.pageSize"
            :current-page="page.pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10,20,50]"
            @size-change="sizeChange"
            @current-change="currentChange"
          />
        </div>
      </div>
    </el-footer>
    <el-dialog
      :visible.sync="submitHandleVisible"
      :title="submitHandleTitle"
      width="650px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form size="small" style="max-width: 750px;" v-if="submitHandleVisible">
        <el-form-item>
          <el-input
            v-model="submitReason"
            placeholder="请输入备注信息，200字以内"
            type="textarea"
            :rows="6"
            resize="none"
            :maxlength="200"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button
          icon="el-icon-error"
          type="danger"
          size="small"
          @click="submitHandleVisible=false"
        >取消</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
    <batch-import :visible.sync="batchImportVisible" @refresh="refreshList" />
    <el-dialog
      :title="submitFormTitle"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="submitFormVisible"
      width="800px"
    >
      <online-submit-form
        :submit-id="submitFormId"
        v-if="submitFormVisible"
        @close="submitFormVisible = false"
        @refresh="getSubmitList"
      />
    </el-dialog>
  </el-container>
</template>

<script>
import FormBuilder from "../js/formBuilder";
import OnlineFormPreviewField from "./fields/OnlineFormPreviewField";
import BatchImport from "./poi/import/BatchImport";
import OnlineSubmitForm from "./form/OnlineSubmitForm";
import { requestBaseUrl } from "../../../../../js/config/serviceConfig";

export default {
  name: "OnlineFormDataManage",
  components: { OnlineSubmitForm, BatchImport, OnlineFormPreviewField },
  data() {
    return {
      formInfo: {},
      loading: true,
      adding: false,
      fields: [],
      page: {
        pageSize: 20,
        pageNum: 1
      },
      total: 0,
      list: [],
      loaded: false,
      batchImportVisible: false,

      submitId: "",
      submitReason: "",
      submitHandleStatus: null,
      submitHandleVisible: false,
      submitHandleTitle: "",

      submitFormTitle: "",
      submitFormId: null,
      submitFormVisible: false,
      isDonation:false     //判断是否为捐赠表单，默认为否
    };
  },
  computed: {
    formId() {
      return this.$route.params.formId;
    },
    downloadUrl() {
      return `${requestBaseUrl}/api/admin/onlineForm/downloadSubmitList/${this.formId}`;
    }
  },
  methods: {
    //文件导出
    manageDropdown(command) {
      if (command==='dataDropdown') {
        // console.log(11111);
      // this.$request.get(`${requestBaseUrl}/api/admin/onlineForm/downloadSubmitList/${this.formId}`)
      window.open(`${requestBaseUrl}/api/admin/onlineForm/downloadSubmitList/${this.formId}`)
      }else if(command==='manageDropdown'){
        // console.log(22222);
        window.open(`${requestBaseUrl}/api/admin/onlineForm/downloadFileZip/${this.formId}`)
      }
      

    },
    handleStatus(value) {
      switch (value) {
        case 0:
          return "待处理";
        case 1:
          return this.formInfo.resolveText;
        case 2:
          return this.formInfo.rejectText;
        case 3:
          return "已回复";
      }
    },
    refreshList() {
      this.page.pageNum = 1;
      this.getSubmitList();
    },
    sizeChange(size) {
      this.page.pageSize = size;
      this.refreshList();
    },
    currentChange(current) {
      this.page.pageNum = current;
      this.getSubmitList();
    },
    getSubmitList() {
      let params = {
        id: this.formId,
        limit: this.page.pageSize,
        offset: (this.page.pageNum - 1) * this.page.pageSize
      };

      this.loading = true;
      Promise.all([
        this.$request.get("/api/admin/onlineForm", {
          params: { id: this.formId }
        }),
        this.$request.get("/api/admin/onlineForm/submit/list", { params })
      ]).then(([formInfo, submitList]) => {
        if (formInfo.data.formCode==='DONATIONRECORD') {
          this.isDonation=true;
        }
        this.formInfo = new FormBuilder(formInfo.data);

        let fields = formInfo.data.fields.filter(item => {
          let width = item.title.length * 18;
          if (width < 100) {
            width = 100;
          }

          if (item.type === 2) {
            width = 200;
          }

          item.width = width + "px";
          return item.type !== 8;
        });

        this.fields = [
          // {
          //     code:'memberName',
          //     title: '会员姓名',
          //     type: 1
          // }
        ].concat(fields);

        if (this.formInfo.isNeedHandle) {
          this.fields = this.fields.concat([
            {
              code: "createTime",
              title: "提交时间",
              width: "150px"
            }
          ]);
        }

        this.list = submitList.data.list;
        this.total = submitList.data.total;
        this.loaded = true;
      });
    },
    resolve(id) {
      this.$request
        .put("/api/admin/onlineForm/submit/handle", {
          handleStatus: 1,
          id
        })
        .then(() => {
          this.refreshList();
          this.$message.success({ message: "处理成功", duration: 1500 });
        });
    },
    reject(id) {
      this.submitId = id;
      this.submitReason = "";
      this.submitHandleStatus = 2;
      this.submitHandleTitle = this.formInfo.rejectText;
      this.submitHandleVisible = true;
    },
    reply(id) {
      this.submitId = id;
      this.submitReason = "";
      this.submitHandleStatus = 3;
      this.submitHandleTitle = "回复";
      this.submitHandleVisible = true;
    },
    handleSubmit() {
      this.$request
        .put("/api/admin/onlineForm/submit/handle", {
          handleStatus: this.submitHandleStatus,
          id: this.submitId,
          rejectReason: this.submitReason
        })
        .then(() => {
          this.refreshList();
          this.submitHandleVisible = false;
          this.$message.success({ message: "处理成功", duration: 1500 });
        });
    },
    newSubmit() {
      this.submitFormTitle = "新增记录";
      this.submitFormId = null;
      this.submitFormVisible = true;
    },
    editSubmit(submitId) {
      this.submitFormTitle = "编辑记录";
      this.submitFormId = submitId;
      this.submitFormVisible = true;
    },
    deleteSubmit(submitId) {
      this.$msgbox
        .confirm("删除不可恢复，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除"
        })
        .then(() => {
          this.$request
            .delete(`/api/admin/onlineForm/poi/submit/${submitId}`)
            .then(data => {
              if (data.success) {
                this.refreshList();
                this.$message.success(`记录已成功删除`);
              }
            });
        })
        .catch(() => {});
    }
  },
  created() {
    this.getSubmitList();
  }
};
</script>

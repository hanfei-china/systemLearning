<template>
  <el-container class="background-color-white absolute-fill-parent">
    <!--    table-->
    <el-main class="position-relative unset-padding">
      <div style="padding: 20px;">
        <!--    短信供应商信息配置-->
        <template>
          <!--    title-->
          <div style="padding: 0 0 20px;">
            <div class="flex-fill-in-the-remaining-space smsTemplate-header">短信供应商信息配置</div>
          </div>
          <!--    content-->
          <div class="unset-padding" style="margin:10px 0 15px 0">
            <el-form label-position="left" label-width="auto" :model="smsConfigure" size="small">
              <div class="flex flex-space-between">
                <el-col :span="7">
                  <el-form-item
                      label="ACCESSID："
                      prop="accessId"
                      required
                      class="flex-fill-in-the-remaining-space"
                  >
                    <el-input type="accessId" v-model="smsConfigure.accessId" :readonly="smsConfigure.accessIdReadonly">
                      <i slot="suffix" v-if="smsConfigure.accessIdReadonly" @click="smsConfigure.accessIdReadonly=false"
                         class="edit-icon el-input__icon el-icon-edit-outline"></i>
                      <i slot="suffix" v-else @click="smsConfigure.accessIdReadonly=true"
                         class="el-input__icon el-icon-check edit-icon"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item
                      label="SECERT："
                      prop="secert"
                      required
                      class="flex-fill-in-the-remaining-space"
                  >
                    <el-input type="secert" v-model="smsConfigure.secert" :readonly="smsConfigure.secertReadOnly">
                      <i slot="suffix" v-if="smsConfigure.secertReadOnly" @click="smsConfigure.secertReadOnly=false"
                         style="color: #409EFF" class="edit-icon el-input__icon el-icon-edit-outline "></i>
                      <i slot="suffix" v-else @click="smsConfigure.secertReadOnly=true" style="color: #409EFF"
                         class="edit-icon el-input__icon el-icon-check"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                      label="签名："
                      prop="signature"
                      required
                      class="flex-fill-in-the-remaining-space"
                  >
                    <el-input type="accessId" v-model.number="smsConfigure.signature"
                              :readonly="smsConfigure.signatureReadOnly">
                      <i slot="suffix" v-if="smsConfigure.signatureReadOnly"
                         @click="smsConfigure.signatureReadOnly=false" style="color: #409EFF"
                         class="edit-icon el-input__icon el-icon-edit-outline "></i>
                      <i slot="suffix" v-else @click="smsConfigure.signatureReadOnly=true" style="color: #409EFF"
                         class="edit-icon el-input__icon el-icon-check"></i>
                    </el-input>
                  </el-form-item>
                </el-col>
              </div>
            </el-form>
          </div>
        </template>
        <!--    各类型消息-推送规则配置-->
        <template>
          <!--    title-->
          <div class="flex" style="padding: 0 0 20px;">
            <div class="flex-fill-in-the-remaining-space smsTemplate-header">各类型消息-推送规则配置</div>
          </div>
          <!--    content-->
          <div class="unset-padding">
            <div>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="editTemplate({})">添加模板
              </el-button>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteTemplate('')">删除</el-button>
            </div>
            <el-table
                class="custom-el-table header-gray lrd-el-table"
                ref="multipleTable"
                tooltip-effect="dark"
                style="width: 100%;margin-top: 10px"
                :data="tableList"
                border
                @selection-change="handleSelectionChange"
            >
              <el-table-column
                  type="selection"
                  width="55">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="templateName"
                  label="模板名称"
                  show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="templateContent"
                  label="模板内容"
                  show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="remark"
                  label="申请说明"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="templateCode"
                  label="模板CODE"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="applyStatus"
                  label="审核状态"
                  width="120"
                  show-overflow-tooltip>
                <span slot-scope="{row}" v-html="getTempStatus(row.applyStatus)"/>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="reason"
                  label="审核信息"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="adminName"
                  label="创建人"
                  width="120"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="createTime"
                  label="创建时间"
                  width="120"
                  show-overflow-tooltip>
                <template slot-scope="{row}">
                  <span>{{ row.createTime | yyyyMMdd }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="140">
                <template v-slot="{row}">
                  <el-button size="small" v-if="row.applyStatus!==0" type="text" class="unset-padding custom-el-button"
                             @click="editTemplate(row)">编辑
                  </el-button>
                  <el-button  size="small" v-if="row.applyStatus!==0&&markList.indexOf(row.id)<0" type="text" class="unset-padding custom-el-button danger"
                             @click="deleteTemplate(row.id)">删除
                  </el-button>
                  <el-switch
                    @change="changeSwitch(row.id)"
                    v-if="markList.indexOf(row.id)>=0"
                    style="marginLeft:10px;"
                    v-model="markObj[row.id]"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </div>
    </el-main>
    <el-dialog v-if="editFormFlag" :title="editTitle" :visible.sync="editFormFlag" append-to-body
               :close-on-click-modal="false"
               width="800px">
      <!--edit模板-->
      <edit-form :editItem="editItem" @close="editFormFlag = false" @refresh="refresh"/>
    </el-dialog>
  </el-container>
</template>

<script>
import EditForm from "./EditForm";

export default {
  name: "smsTemplate",
  components: {EditForm},
  data() {
    return {
      editFormFlag: false,
      smsConfigure: {
        accessId: '',
        accessIdReadonly: true,
        secert: '',
        secertReadOnly: true,
        signature: '',
        signatureReadOnly: true
      },
      editItem: null,
      editTitle: '',
      tableList: [],
      // table选中项
      multipleSelection: [],
      markList:['1'],
      markObj:{}
    }
  },
  watch: {
    "smsConfigure.accessIdReadonly"(val) {
      if (val) {
        this.$request
            .post("/api/admin/settings/manage/updateShortMessageSettings", {accessId: this.smsConfigure.accessId})
            .then(() => {
              this.$message.success("短信供应商信息配置ACCESSID修改成功");
            });
      }
    },
    "smsConfigure.secertReadOnly"(val) {
      if (val) {
        this.$request
            .post("/api/admin/settings/manage/updateShortMessageSettings", {accessSecret: this.smsConfigure.secert})
            .then(() => {
              this.$message.success("短信供应商信息配置SECERT修改成功");
            });
      }
    },
    "smsConfigure.signatureReadOnly"(val) {
      if (val) {
        this.$request
            .post("/api/admin/settings/manage/updateShortMessageSettings", {signName: this.smsConfigure.signature})
            .then(() => {
              this.$message.success("短信供应商信息配置签名修改成功");
            });
      }
    }
  },
  methods: {
    // table选中的row
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 审核状态
    getTempStatus(status) {
      switch (status) {
        case 0:
          return `<span style="color:#E6A23C">审核中<span>`
        case 1:
          return `<span style="color:#67C23A">已通过<span>`
        case 2:
          return `<span style="color:#F56C6C">未通过<span>`
        case 3:
          return `<span style="color:#909399">未提交<span>`
      }
    },
    // 删除row
    deleteTemplate(rowId) {
      let ids = []
      if (rowId !== '') {
        ids.push(rowId)
      } else {
        this.multipleSelection.map(item => {
          ids.push(item.id)
        })
      }
      this.$msgbox.confirm('删除操作不可恢复，是否继续删除？', '提示', {type: 'warning', confirmButtonText: '确认删除'}).then(() => {
        this.$request.delete('/api/admin/emailTelPhone/deleteMessageTemplate', {
          params: {ids: ids}
        }).then((data) => {
          if (data.success) {
            this.getTableList();
            this.$message.success(`删除成功`);
          }
        })
      }).catch(() => {
      });
    },
    // edit模板
    editTemplate(row) {
      if (Object.keys(row).length) {
        this.editTitle = '编辑模板'
        this.editItem = row
      } else {
        this.editItem = {}
        this.editTitle = '创建模板'
      }
      this.editFormFlag = true
    },
    // 获取List
    getTableList() {
      this.$request.get('/api/admin/emailTelPhone/getMessageTemplatePage',).then(res => {
        if (res.success) {
          this.tableList = res.data;
          var list=this.markList;
          var obj={};
          res.data.forEach(item=>{
            if (list.indexOf(item.id)>=0) {
              obj[item.id]=item.isOpenBirthday||false;
            }
          })
          this.markObj=obj;
        }
      })
    },
    changeSwitch(id){
      var data={
        id,
        isOpenBirthday:this.markObj[id]
      };
      this.$request.put('/api/admin/emailTelPhone/updateTemplateIsOpen',data).then(res=>{
        if (res.success) {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        }else{
          this.$message.error('修改失败');
        }
      })
    },
    // 获取短信服务配置
    getSmsSetting() {
      this.$request.get('/api/admin/emailTelPhone/getMessageSetting',).then(res => {
        this.smsConfigure.accessId = res.data.accessId;
        this.smsConfigure.secert = res.data.accessSecret;
        this.smsConfigure.signature = res.data.signName;
      })
    },
    // 刷新
    refresh() {
      this.getTableList();
    }
  },
  created() {
    this.getTableList();
    this.getSmsSetting()
  }
}
</script>

<style scoped lang="less">
.smsTemplate-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  line-height: 16px;
  font-weight: 500;
  border-bottom: 1px solid lightgrey;
  height: 40px;

  &:before {
    display: block;
    clear: both;
    content: '';
    width: 4px;
    height: 14px;
    background-color: #3FA1B6;
    margin-right: 10px;

  }
}

.edit-icon {
  color: #409EFF;
  font-size: 20px
}
</style>
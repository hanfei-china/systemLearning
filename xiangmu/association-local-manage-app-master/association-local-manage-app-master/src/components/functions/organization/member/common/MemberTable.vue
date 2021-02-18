<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="unset-padding position-relative">
      <el-container class="absolute-fill-parent background-color-white minwh980" style="padding: 0 16px;"
                    v-loading="loading">
        <el-header class="unset-padding flex" height="auto">
          <div class="flex-fill-in-the-remaining-space flex" style="padding: 16px 0;width: 194px;">
            <div class="flex flexwrap">
              <high-search v-model="birthTypeChoose" :searchList="searchList" :collegeList="collegeList">
                <el-select class="w160" v-model="filterObj.status" size="small" placeholder="请选择账户状态" clearable>
                  <el-option label="已激活" :value="1"></el-option>
                  <el-option label="未激活" :value="0"></el-option>
                </el-select>
                <el-date-picker v-model="filterObj.dateRange" size="small" type="daterange" range-separator="至" start-placeholder="注册开始日期" end-placeholder="注册结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </high-search>
              <div class="text-align-right" style="padding: 10px 0 10px 0">
                <el-button class="primaryBtnClass" v-if="OPprivileges.includes('201010001')" size="small" @click="addMember">新增</el-button>
                <el-button size="small" class="plainBtnClass" v-if="OPprivileges.includes('201010004')" @click="batchImportVisible=true">导入</el-button>
                <el-button size="small" class="plainBtnClass" v-if="OPprivileges.includes('201010005')" @click="exportFormVisible=true">导出</el-button>
                <el-button size="small" class="plainBtnClass" v-if="OPprivileges.includes('201010031')" @click="$router.push('/console/examine/memberMerge')">合并重复</el-button>
                <el-button size="small" class="plainBtnClass" v-if="OPprivileges.includes('201010006')" @click="tagsManageVisible=true">标签</el-button>
              </div>
            </div>
          </div>

        </el-header>
        <el-main class="unset-padding position-relative">
          <el-table ref="addTagsTable" class="custom-el-table header-gray lrd-el-table" style="min-width: 400px;"
                    highlight-current-row :data="memberList" size="small" border
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" fixed/>
            <template v-for="field in showFieldListNew">
              <!-- 多级表头 -->
              <template v-if="field.detailList.length">
                <el-table-column align="center" :key="field.code" show-overflow-tooltip :label="field.name">
                  <el-table-column v-for="item in field.detailList" :key="item.code" show-overflow-tooltip
                                   :label="item.name" :prop="item.code" min-width="150">
                    <template slot-scope="{ row }">
                      <div class="zuhe" @mouseenter="overFunc(item)" @mouseleave="hoverItem=null">
                        {{ transData(row[item.code], item) }}
                        <el-popover v-if="hoverItem&&hoverItem.code==item.code" class="popbox" placement="bottom"
                                    :width="field.code == 'jiudu' ? 900 : 300" trigger="click">
                          <el-table size="mini" :data="fieldInfoList" style="width: 100%">
                            <el-table-column v-for="item in field.detailList" :key="item.code" show-overflow-tooltip
                                             :label="item.name" :prop="item.code">
                              <template slot-scope="{ row }">{{ transData(row[item.code], item) }}</template>
                            </el-table-column>
                          </el-table>
                          <el-button size="mini" slot="reference" @click="seeInfoList(field, row)" type="text">点击查看
                          </el-button>
                        </el-popover>
                      </div>
                    </template>
                  </el-table-column>
                </el-table-column>
              </template>
              <!-- 标签 -->
              <template v-else-if="field.code==='label'">
                <el-table-column :key="field.code" show-overflow-tooltip :prop="field.code" min-width="300"
                                 align="center">
                  <template slot="header">
                    <el-tooltip class="item" effect="dark" content="批量为会员添加标签" placement="top">
                      <div style="cursor:pointer;align:center;" @click="modifyAddTags">
                        <span>标签</span>
                        <span class="el-icon-edit" style="color:#428bca;marginLeft:5px;"></span>
                      </div>
                    </el-tooltip>
                  </template>
                  <template slot-scope="{ row }">
                    <div class="tagsListEdit">
                      <div class="tagsShow" v-for="item in row.label" :key="item.id"
                           :style="{'background-color':item.color}" @click="searchByTag(item.id)">{{ item.title }}
                      </div>
                      <!-- <span v-if="row.label.length>0" class="el-icon-edit-outline tagsItemEdit" @click="editMemeberTags({labels:row.label,id:row.id})"></span> -->
                      <div class="el-icon-edit-outline tagsItemEdit"
                           @click="editMemeberTags({labels:row.label,id:row.id})"></div>
                    </div>
                  </template>
                </el-table-column>
              </template>
              <!-- 普通表格 -->
              <template v-else>
                <el-table-column :fixed="field.code=='name'" :key="field.code" show-overflow-tooltip :label="field.name"
                                 :prop="field.code" min-width="150" align="center">
                  <template slot="header" slot-scope="{row}">
                    <el-tooltip class="item" effect="dark" content="点击进行排序" placement="top">
                      <div style="cursor:pointer;align:center;" @click="sort(field.code)">
                        <span style="color:#3FA1B6;">{{ field.name }}</span>
                        <span v-if="sortItem===field.code&&orderStatus===2" class="el-icon-caret-bottom"
                              style="color:#428bca;marginLeft:5px;"></span>
                        <span v-if="sortItem===field.code&&orderStatus===1" class="el-icon-caret-top"
                              style="color:#428bca;marginLeft:5px;"></span>
                      </div>
                    </el-tooltip>
                  </template>
                  <template slot-scope="{ row }">
                    <span v-if="field.code=='name'" class="canClick"
                          @click="seeMember(row)">{{ transData(row[field.code], field) }}
                      <img v-if="row.isFamous==true" src="./image/famous.png" class="famousIcon"/>
                    </span>
                    <span v-else>{{ transData(row[field.code], field) }}</span>
                  </template>
                </el-table-column>
              </template>
            </template>
            <el-table-column label="操作" min-width="120px" fixed="right">
              <template slot-scope="{ $index, row }">
                <el-button type="text" class="custom-el-button" size="small" v-if="OPprivileges.includes('201010003')"
                           @click="editMember(row)">修改
                </el-button>
                <el-button type="text" class="custom-el-button danger" size="small"
                           v-if="OPprivileges.includes('201010002')" @click="deleteMember(row)">删除
                </el-button>
                <el-button type="text" class="custom-el-button" size="small" @click="seeMember(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer class="unset-padding" height="auto">
          <div class="flex" style="padding: 16px 0;">
            <div>
              <batch-operation title="批量操作">
                <li @click="deleteChosenData" v-if="OPprivileges.includes('201010002')">删除</li>
                <li @click="exportChosenData" v-if="OPprivileges.includes('201010005')">导出</li>
                <li @click="modifyEdit" v-if="OPprivileges.includes('201010003')">批量修改</li>
                <li @click="emailSendCommand('notTemplateSendVisible')" v-if="OPprivileges.includes('201010030')">发送邮件
                </li>
                <li @click="smsSendCommand('notTemplateSendVisible')" v-if="OPprivileges.includes('201010030')">发送短信
                </li>
                <li v-if="OPprivileges.includes('201010006')">
                  <el-dropdown @command="labelSettingCommand">
                    <span class="el-dropdown-link">
                      标签设置<i class="el-icon-arrow-up el-icon--right"/>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="labelSetVisible">添加标签</el-dropdown-item>
                      <el-dropdown-item command="labelMoveVisible">移出标签
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </li>
              </batch-operation>
            </div>
            <div class="flex-fill-in-the-remaining-space text-align-right">
              <el-pagination
                :current-page="page.currentPage"
                background
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.pageSize"
                :total="memberTotal"
                :pager-count="5"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="pageChange"
                @size-change="sizeChange"
              >
              </el-pagination>
            </div>
          </div>
        </el-footer>

        <!-- 查看弹框 -->
        <div class="dialogbox" v-show="memberFormVisible">
          <member-form-new :isFamous="isFamous" :memberId="memberFormId" v-if="memberFormVisible"
                           @close="memberFormVisible = false" :educationList="educationList"
                           @refresh-members="refreshMembers"/>
        </div>
        <!-- 新增修改弹框 -->
        <div class="dialogbox" v-show="memberFormEditVisible">
          <member-form-edit :memberId="memberFormId" v-if="memberFormEditVisible" @close="memberFormEditVisible = false"
                            :educationList="educationList" @refresh-members="refreshMembers"/>
        </div>
        <!-- 标签管理 -->
        <div class="dialogbox" v-show="tagsManageVisible">
          <tags-manage @close="closeTagsManage"></tags-manage>
        </div>
        <!-- 批量添加标签 -->
        <el-dialog :visible.sync="addTagsVisible" title="批量添加标签" append-to-body :close-on-click-modal="false"
                   width="500px">
          <add-tags :memberSelection="memberSelection" :editMemberInfo="editMemberInfo" @close="closeAddTagDialog"
                    @updataList="refreshMembers"></add-tags>
        </el-dialog>
        <!-- 批量移除标签 -->
        <el-dialog :visible.sync="deleteTagsVisible" append-to-body :close-on-click-modal="false" width="500px">
          <add-tags :memberSelection="memberSelection" :ifDelete="true" @close="closeDeleteTags"
                    @updataList="refreshMembers"></add-tags>
        </el-dialog>
        <!-- 批量修改 -->
        <el-dialog :visible.sync="modifyNumsVisible" title="批量修改" append-to-body :close-on-click-modal="false"
                   width="800px">
          <modify-nums @selectItem="modifyItemSelect" :selectList="showFieldListNew" @close="modifyNumsVisible=false"
                       :educationList="educationList"></modify-nums>
        </el-dialog>
        <!-- 标签弹框 -->
        <el-dialog :visible.sync="labelOperateVisible" :title="labelOperateTitle" append-to-body
                   :close-on-click-modal="false" width="800px">
          <label-set v-if="labelOperateVisible" :memberIds="receiverList" :operate="labelOperateType"
                     @close="labelOperateVisible = false" @refresh="refreshMembers"/>
        </el-dialog>

        <member-batch-import @queryTable="refreshMembers" @refresh-members="refreshMembers"
                             :visible.sync="batchImportVisible" title="校友导入"></member-batch-import>
        <!-- <member-batch-import-from-activity :visible.sync="batchImportFormActVisible" @refresh-members="refreshMembers"/> -->
        <el-dialog title="导出会员信息" append-to-body :close-on-click-modal="false" :visible.sync="exportFormVisible"
                   width="650px">
          <export-form v-if="exportFormVisible" @close="exportFormVisible = false" :conditionall="condition"
                       :memberTotal="memberTotal"/>
        </el-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import highSearch from '../../../../util/highSearch/highSearch'
import addTags from '../addTags/addTags'
import tagsManage from '../tagsManage/tagsManage'
import modifyNums from "./modifyNums";
import MemberBatchImport from "../allMember/import/excel/MemberBatchImport";
import MemberFormNew from "../allMember/memberForm/MemberFormNew";
import MemberFormEdit from "../allMember/memberForm/MemberFormEdit";
import BatchOperation from "../../../../util/BatchOperation";
import {formatDate} from "@/js/util/utilFunction";
import ExportForm from "../allMember/export/ExportForm";
import {exportExcel} from "../../../../../js/util/exportFile";
import LabelSet from "../allMember/label/LabelSet";
import {birthOptions} from "../allMember/memberForm/data"

export default {
  name: "MemberTable",
  components: {
    LabelSet,
    ExportForm,
    BatchOperation,
    MemberFormNew,
    MemberFormEdit,
    MemberBatchImport,
    modifyNums,
    tagsManage,
    addTags,
    highSearch
  },
  props: ["memberDelete"],
  data() {
    return {
      timer: null,
      showFieldListNew: [],
      fieldInfoList: [],
      collegeList: [],
      loading: false,
      memberSelection: [],
      memberList: [],
      memberFieldList: [],

      //查询会员列表相关参数
      page: {
        currentPage: 1,
        pageSize: 10
      },
      memberTotal: 0,

      //会员表单
      memberFormId: "",
      memberFormVisible: false,
      memberFormEditVisible: false,

      //导出表单
      memberTypes: [],
      educationList: [],
      filterObj: {dateRange: []},
      //从Excel导入
      batchImportVisible: false,
      //从活动导入
      batchImportFormActVisible: false,
      exportFormVisible: false,
      modifyNumsVisible: false,        //批量修改的弹窗
      modifySelectInfo: {},         //批量修改时的选中项
      //批量设置标签
      labelOperateType: null,
      labelOperateVisible: false,
      labelOperateTitle: '批量添加标签',
      hoverItem: null,
      //标签管理
      tagsManageVisible: false,
      addTagsVisible: false,
      deleteTagsVisible: false,
      editMemberInfo: {},
      clickTag: '',
      sortItem: 'createTime',
      orderStatus: 2,
      birthOptions: birthOptions,
      addFamousVisible: false,
      addFamousInfo: {},
      isFamous: false,
      searchList: [    //这是筛选列表
        {type: 1, key: 'name', condition: 5, title: '姓名', width: 'w160', value: ''},
        {type: 1, key: 'telphone', condition: 5, title: '手机号', width: 'w160', value: ''},
        {type: 1, key: 'email', condition: 5, title: '邮箱', width: 'w160', value: ''},
        {type: 1, key: 'major', condition: 5, title: '专业', width: 'w160', value: ''},
        {type: 1, key: 'college', condition: 5, title: '学院', width: 'w160', value: ''},
        {type: 1, key: 'cless', condition: 5, title: '班级', width: 'w160', value: ''},
        {type: 1, key: 'department', condition: 5, title: '部门', width: 'w160', value: ''},
        {type: 1, key: 'job', condition: 5, title: '职位', width: 'w160', value: ''},
        {type: 1, key: 'jobNo', condition: 5, title: '工号', width: 'w160', value: ''},
        {type: 1, key: 'workingCompany', condition: 5, title: '单位名称', width: 'w160', value: ''},
        {type: 1, key: 'post', condition: 5, title: '职务', width: 'w160', value: ''},
        {type:2,key:'entranceDate',condition:1,title:'入学年',width:'w160',value:'',time:'year',timeType:'yyyy'},
        {type:2,key:'graduationDate',condition:1,title:'毕业年',width:'w160',value:'',time:'year',timeType:'yyyy'},
        {type:3,key:'birthday',condition:1,title:'生日',width:'w160',value:''},
        {type:3,key:'currentCity',condition:1,title:'所在城市',value:'',width:'w160'},
        {type:3,key:'currentCollegeId',condition:1,title:'现属学院',value:'',width:'w160'},
      ],
      birthTypeChoose: null
    };
  },
  computed: {
    OPprivileges() {
      return this.$store.state.OPprivileges.map(item => item.id)
    },
    receiverList() {
      let receiverList = [];
      for (let item of this.memberSelection) {
        receiverList.push(item.id)
      }
      return receiverList;
    },
    // currentCollegeId() {
    //   if (this.currentCollege.id != '') {
    //     return this.currentCollege.id;
    //   }
    //   return this.$store.state.currentCollege ? this.$store.state.currentCollege.id : null;
    // },
    condition() {
      let condition = {};
      condition.searchList = [];
      this.searchList.forEach(item => {
        // 有值searchList加项
        if (item.value && item.value.length || item.value == '0') {
          condition.searchList.push({
            type: item.condition,
            value: Array.isArray(item.value) ? item.value.join("-") : item.value,
            field: item.key
          });
        } else {
          // 没有值&&筛选条件为空不为空searchList加项
          if (item.condition == 3 || item.condition == 4) {
            condition.searchList.push({
              type: item.condition,
              value: Array.isArray(item.value) ? item.value.join("-") : item.value,
              field: item.key
            });
          }
        }
      })

      condition.birthdayType = this.birthTypeChoose

      for (const key in this.filterObj) {
        if (this.filterObj[key] || this.filterObj[key] == '0') {
          condition[key] = this.filterObj[key]
        }
      }
      if (condition.dateRange && condition.dateRange.length > 1) {
        condition.dateRange[0] = condition.dateRange[0] + " 00:00:00"
        condition.dateRange[1] = condition.dateRange[1] + " 23:59:59"
      }
      condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
      condition.limit = this.page.pageSize;
      condition.labelIds = [this.clickTag]
      if (!condition.labelIds[0]) {
        condition.labelIds = [];
      }
      condition.orderField = this.sortItem;
      condition.orderStatus = this.orderStatus;
      return condition;
    }
  },
  methods: {
    modifyAddTags() {
      if (!this.memberSelection.length) {
        this.$message({
          message: '请先选择要添加标签的会员',
          type: 'warning'
        });
        return
      }
      this.addTagsVisible = true;
    },
    editMemeberTags(memberInfo) {
      this.editMemberInfo = JSON.parse(JSON.stringify(memberInfo));
      this.addTagsVisible = true;
    },
    closeAddTagDialog() {
      this.addTagsVisible = false;
      this.memberSelection = [];
      this.editMemberInfo = {};
      this.$refs.addTagsTable.clearSelection();
    },
    closeTagsManage() {
      this.tagsManageVisible = false;
      this.refreshMembers();
    },
    modifyDeleteTags() {
      if (!this.memberSelection.length) {
        this.$message({
          message: '请先选择要添加标签的会员',
          type: 'warning'
        });
        return
      }
      this.deleteTagsVisible = true;
    },
    closeDeleteTags() {
      this.deleteTagsVisible = false;
      this.memberSelection = [];
      this.$refs.addTagsTable.clearSelection();
    },
    overFunc(item) {
      this.hoverItem = item
    },
    modifyEdit() {
      if (this.memberSelection.length <= 0) {
        this.$message.warning('请选择要修改的校友');
        return;
      }
      this.modifyNumsVisible = true
    },
    //批量修改传值
    modifyItemSelect(data) {
      this.modifySelectInfo = JSON.parse(JSON.stringify(data));
      let memberIds = [];
      this.memberSelection.forEach(item => {
        memberIds.push(item.id);
      });
      var obj = {
        code: this.modifySelectInfo.fieldId,
        value: this.modifySelectInfo.content,
        memberIds: memberIds
      }
      this.$request.put('/api/admin/member/v2/batchModifyMemberInfo', obj).then(res => {
        this.modifyNumsVisible = false
        if (res.success) {
          this.refreshMembers();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    emailSendCommand(val) {
      if (val === 'notTemplateSendVisible') {
        if (this.memberSelection.length === 0) {
          this.$message({
            message: '请勾选要发送邮件通知的申请信息',
            type: 'warning'
          });
          return
        }
        this.templateSendVisible = true;
        var memberList = [];
        this.memberSelection.forEach(item => {
          var obj = {
            objectId: item.id,
            device: item.email,
            objectName: item.name,
            objectType: 1
          };
          memberList.push(obj);
        })
        this.$router.push({
          name: 'sendEmail',
          params: {
            memberList
          }
        });
      } else if (val === 'templateSendVisible') {
        this.notTemplateSendVisible = true;
      }
    },
    smsSendCommand(val) {
      if (val === 'notTemplateSendVisible') {
        if (this.memberSelection.length === 0) {
          this.$message({
            message: '请勾选要发送短信的申请信息',
            type: 'warning'
          });
          return
        }
        this.templateSendVisible = true;
        this.$router.push({
          name: 'sendSms',
          params: {
            memberList: this.memberSelection
          }
        });
      } else if (val === 'templateSendVisible') {
        this.notTemplateSendVisible = true;
      }
    },
    labelSettingCommand(val) {
      if (val === 'labelSetVisible') {
        this.modifyAddTags();
      } else if (val === 'labelMoveVisible') {
        this.modifyDeleteTags();
      }
    },
    exportChosenData() {
      if (this.memberSelection.length <= 0) {
        this.$message.warning('请选择要导出的会员');
        return;
      }
      let memberIds = [];
      this.memberSelection.forEach(item => {
        memberIds.push(item.id);
      });
      var condition = Object.assign(this.condition, {exportQueryLimit: [1, this.memberSelection.length], memberIds})
      this.$request.post('/api/admin/member/poi/export', condition, {
        responseType: 'blob',
      }).then(resp => {
        exportExcel(resp);
      });
    },
    deleteChosenData() {
      if (this.memberSelection.length <= 0) {
        this.$message.warning('请选择要删除的校友');
        return;
      }
      let memberIds = [];
      this.memberSelection.forEach(item => {
        memberIds.push(item.id);
      });
      this.$confirm("此操作将删除用户的所有信息且不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$request.delete("/api/admin/member/v2/batch", {params: {memberIds}}).then(res => {
          if (res.success) {
            this.$message.success("删除成功");
            this.refreshMembers()
          }
        });
      });
    },
    seeInfoList(item, row) {
      if (item.code == "jiuzhi") {
        this.$request.get("/api/admin/member/v2/getMemberTeacherExperience", {
          params: {memberId: row.id},
          noLoading: true
        }).then(res => {
          this.fieldInfoList = res.data;
        });
      } else if (item.code == "jiudu") {
        this.$request.get("/api/admin/member/v2/getMemberStudentExperience", {
          params: {memberId: row.id},
          noLoading: true
        }).then(res => {
          this.fieldInfoList = res.data;
        });
      }
    },
    transData(val, field) {
      if (field.topicType == 2) {
        let {options} = field.parameter;
        if (options) {
          if (options.length != 0) {
            for (let option of options) {
              if (option.key === val) {
                return option.title;
              }
            }
          } else {
            return "";
          }
        } else {
          return val
        }
      }
      if (field.topicType === 5) {
        if (val && field.notEdit) {
          return formatDate(new Date(val), "yyyy-MM-dd");
        } else {
          return val
        }
      }
      if (field.topicType === 6) {
        let str = "";
        let valueObj;
        if (typeof val === "string") {
          try {
            valueObj = JSON.parse(val);
          } catch (e) {
            return val;
          }
        } else {
          valueObj = val;
        }
        if (valueObj) {
          if (valueObj.country) {
            str += valueObj.country + "-";
          }
          if (valueObj.province) {
            str += valueObj.province + "-";
          }
          if (valueObj.city) {
            str += valueObj.city + "-";
          }
          str = str.slice(0, -1)
        }
        return str;
      }
      return val;
    },
    handleSelectionChange(selection) {
      let copySelection = JSON.parse(JSON.stringify(selection));
      if (copySelection.length <= 0) {
        this.memberSelection = copySelection;
        return;
      }
      this.memberSelection = copySelection;
    },
    addMember() {
      this.memberFormId = "";
      this.memberFormEditVisible = true;
    },
    editMember(row) {
      this.memberFormId = row.id;
      this.memberFormEditVisible = true;
    },
    seeMember(row) {
      this.memberFormId = row.id;
      this.memberFormVisible = true;
      this.isFamous = row.isFamous;
    },
    deleteMember(row) {
      this.$confirm("此操作将删除用户的所有信息且不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$request.delete("/api/admin/member/v2", {params: {memberId: row.id}}).then(res => {
          if (res.success) {
            this.$message.success("会员已删除");
            this.refreshMembers()
          }
        });
      });
    },
    pageChange(pageIndex) {
      this.page.currentPage = pageIndex;
      this.loadMembers();
    },
    sizeChange(pageSize) {
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.loadMembers();
    },
    refreshMembers(callback) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.page.currentPage = 1;
        this.loadMembers(callback);
      }, 500)
    },
    getMemberFields(callback) {
      Promise.all([
        this.$request.get("/api/common/associator/historyCollege/educations"),
      ]).then(([educationList]) => {
        this.educationList = educationList.data;
        callback && callback();
      });
    },
    searchByTag(id) {
      this.page.currentPage = 1;
      this.clickTag = id;
      this.loadMembers();
    },
    loadMembers(callback) {
      this.memberSelection = [];
      // this.loading = true;
      if (!(!!window.MSInputMethodContext && !!document.documentMode)) {
        this.loading = true;
      }
      // this.$request.get("/api/admin/member/v2/list", { params: this.condition }).then(members => {
      this.$request.post("/api/admin/member/v2/list", this.condition).then(members => {
        this.memberList = members.data.list;
        this.memberTotal = members.data.total;
        this.$nextTick(() => {
          this.loading = false;
        })
        callback && callback();
      });
    },
    //排序
    sort(item) {
      if (item === this.sortItem) {
        if (this.orderStatus == 0) {
          this.orderStatus = 1
        } else if (this.orderStatus == 1) {
          this.orderStatus = 2
        } else {
          this.orderStatus = 0
          return
        }
      } else {
        this.orderStatus = 1;
      }
      this.sortItem = item;
      this.refreshMembers();
    },
  },
  created() {
    this.$request.get("/api/admin/college/getCollegeList").then(res => {
      this.collegeList = res.data;
    })
    this.$request.get("/api/common/associator/anon/identityTypeList").then(res => {
      this.authWayGroupList = res.data;
    })
    this.$request.get("/api/admin/associator/getFieldsByAuth").then(res => {
      var fieldList = res.data
      // 基本信息：0 工作信息：1  联系方式：2  在校就读经历：3 在校就职经历：4
      var index = fieldList.findIndex(item => item.groupId == 1 || item.groupId == 2)
      if (index > -1) {
        fieldList.splice(index, 0, {code: "label", name: "标签", parameter: {}, detailList: []})
      } else {
        fieldList.push({code: "label", name: "标签", parameter: {}, detailList: []})
      }

      var newList = [];
      for (var i = 0; i < fieldList.length; i++) {
        fieldList[i].detailList = []
        if (fieldList[i].topicType == 2) {
          fieldList[i].parameter = fieldList[i].parameter ? JSON.parse(fieldList[i].parameter) : {options: ""}
        }
        if (fieldList[i].groupId == 3) {
          var index = newList.findIndex(item => item.code == 'jiudu')
          if (index > -1) {
            newList[index].detailList.push(fieldList[i])
          } else {
            newList.push({code: "jiudu", name: "就读经历", topicType: 13, parameter: {}, detailList: [fieldList[i]]})
          }
        } else if (fieldList[i].groupId == 4) {
          var index = newList.findIndex(item => item.code == 'jiuzhi')
          if (index > -1) {
            newList[index].detailList.push(fieldList[i])
          } else {
            newList.push({code: "jiuzhi", name: "就职经历", topicType: 13, parameter: {}, detailList: [fieldList[i]]})
          }
        } else {
          newList.push(fieldList[i])
        }
      }
      var jiuduindex = newList.findIndex(item => item.code == 'jiudu')
      if (jiuduindex > -1) {
        var majorindex = newList[jiuduindex].detailList.findIndex(item => item.code == 'major')
        if (majorindex > -1) {
          newList[jiuduindex].detailList.splice(majorindex + 1, 0, {
            code: "currentCollege",
            name: "现属学院",
            parameter: {},
            detailList: []
          })
        }
      }

      newList = newList.concat([
        {code: "source", name: "注册方式", topicType: 0, parameter: {}, detailList: [], notEdit: true},
        {code: "authWayGroup", name: "认证身份", topicType: 0, parameter: {}, detailList: [], notEdit: true},
        {code: "createTime", name: "创建时间", topicType: 5, parameter: {}, detailList: [], notEdit: true},
        {
          code: "status",
          name: "账户状态",
          topicType: 2,
          parameter: {options: [{key: "1", title: "已激活"}, {key: "0", title: "未激活"}]},
          detailList: [],
          notEdit: true
        }
      ])
      this.showFieldListNew = newList

      this.refreshMembers();
      this.getMemberFields(() => {});

    });

},
  watch: {
    filterObj: {
      deep: true,
      handler() {
        this.refreshMembers();
      }
    },
    searchList: {
      deep: true,
      handler() {
        this.refreshMembers();
      }
    },
    // currentCollegeId(){
    //   this.refreshMembers();
    // }
  }
};
</script>

<style lang="less" scoped>
.flexwrap {
  flex-wrap: wrap;

  .w120 {
    width: 120px;
  }

  .w160 {
    width: 160px !important;
  }

  .el-input {
    margin-right: 15px;
    margin-bottom: 10px;
  }

  .el-select {
    margin-right: 15px;
    width: 200px;
  }

  .el-cascader {
    margin-right: 15px;
  }

  .el-range-editor {
    width: 250px;
    margin-right: 20px;
  }
}

.canClick {
  cursor: pointer;
  color: #3FA1B6;
  position: relative;
}


.dialogbox {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000000;
}

.zuhe {
  display: flex;
  height: 28px;
  align-items: center;

  .popbox {
    margin-left: auto;
    display: none;
  }
}

.zuhe:hover {
  .popbox {
    display: block;
  }
}

.tagsListEdit {
  min-height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    .tagsItemEdit {
      display: inline-block;
    }
  }
}

.tagsShow {
  color: #fff;
  padding: 2px 5px;
  margin-right: 5px;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
}

.notags {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.tagsItemEdit {
  display: none;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.custom-el-button {
  color: #3FA1B6;
}

.famousIcon {
  width: 18px;
  height: 18px;
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
}

.serachInput {
  line-height: 30px;
  cursor: pointer;

  &:hover {
    color: rgb(63, 161, 182);
    transform: scale(1.05);
  }
}
</style>

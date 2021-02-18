<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="unset-padding position-relative">
      <el-container class="absolute-fill-parent background-color-white minwh980" style="padding: 0 16px;"
                    v-loading="loading">
        <div class="toAlumni">
          <div class="toSameAlumni" @click="sameAlumniVisible=true" v-if="sameAlumniList.length>0">
            <div class="toSameAlumni-left">
              <img src="../alumniUpdata/image/toAlumni.png" alt/>
              <div>
                发现疑似校友&nbsp;&nbsp;
                <span v-for="(item,index) in sameAlumniList" :key="index">
                  <span v-if="index<=15">{{ item.alumniName }}、&nbsp;</span>
                  <span v-if="index==sameAlumniList.length-1&&index>15">......</span>
                </span>
              </div>
            </div>
            <div href style="color:#3FA1B6;cursor:pointer">立即确认前往</div>
          </div>
          <div class="toSameAlumni" v-else>
            <div class="toSameAlumni-left">
              <img src="../alumniUpdata/image/toAlumni.png" alt/>
              <div>
                系统检测未发现疑似校友&nbsp;&nbsp;&nbsp;
                <span>
                  <span>检测时间：</span>
                  <span>{{ sameUpdataTime | yyyyMMddHHmmss }}</span>
                </span>
              </div>
            </div>
          </div>
          <div
              class="toSameAlumni"
              @click="alumniUpdataVisible=true"
              v-if="updataAlumniList.length>0"
          >
            <div class="toSameAlumni-left">
              <img src="../alumniUpdata/image/toAlumni.png" alt/>
              <div>
                校友资讯有更新&nbsp;&nbsp;
                <span v-for="(item,index) in updataAlumniList" :key="index">
                  <span v-if="index<=15">{{ item.reptileNewContent[0].alumniName }}、&nbsp;</span>
                  <span v-if="index==updataAlumniList.length-1&&index>15">......</span>
                </span>
              </div>
            </div>
            <div href style="color:#3FA1B6;cursor:pointer;">立即确认前往</div>
          </div>
          <div class="toSameAlumni" v-else>
            <div class="toSameAlumni-left">
              <img src="../alumniUpdata/image/toAlumni.png" alt/>
              <div>
                系统监测未发现知名校友的网页资讯有更新&nbsp;&nbsp;&nbsp;
                <span>
                  <span>检测时间：&nbsp;&nbsp;</span>
                  <span>{{ alumniUpdataTime | yyyyMMddHHmmss }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <el-header class="unset-padding flex" height="auto">
          <div class="flex-fill-in-the-remaining-space flex" style="padding: 16px 0;width: 194px;">
            <div class="flex flexwrap">
              <high-search v-model="birthTypeChoose" :searchList="searchList">
                <el-select style="width: 160px" v-model="filterObj.status" size="small" placeholder="请选择账户状态" clearable>
                  <el-option label="已激活" :value="1"></el-option>
                  <el-option label="未激活" :value="0"></el-option>
                </el-select>
                <el-select v-model="filterObj.urlType" size="small" style="width:160px;" placeholder="请选择资讯来源"
                           clearable>
                  <el-option label="无来源" :value="0"></el-option>
                  <el-option label="百度百科" :value="1"></el-option>
                </el-select>
                <el-date-picker v-model="filterObj.dateRange" size="small" type="daterange" range-separator="至"
                                start-placeholder="注册开始日期" end-placeholder="注册结束日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </high-search>
              <div class="text-align-right" style="padding: 10px 0 10px 0;">
                <el-button
                    class="primaryBtnClass"
                    v-if="OPprivileges.includes('201010001')"
                    size="small"
                    @click="addMember"
                >新增
                </el-button>
                <el-button
                    size="small"
                    class="plainBtnClass"
                    v-if="OPprivileges.includes('201010004')"
                    @click="batchImportVisible=true"
                >导入
                </el-button>
                <el-button
                    size="small"
                    class="plainBtnClass"
                    v-if="OPprivileges.includes('201010005')"
                    @click="exportFormVisible=true"
                >导出
                </el-button>
                <el-button
                    size="small"
                    class="plainBtnClass"
                    v-if="OPprivileges.includes('201010006')"
                    @click="tagsManageVisible=true"
                >标签
                </el-button>
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
                      <span class="tagsShow" v-for="item in row.label" :key="item.id"
                            :style="{'background-color':item.color}"
                            @click="searchByTag(item.id)">{{ item.title }}</span>
                      <span v-if="row.label.length>0" class="el-icon-edit-outline tagsItemEdit"
                            @click="editMemeberTags({labels:row.label,id:row.id})"></span>
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
                          @click="seeMember(row)">{{ transData(row[field.code], field) }}</span>
                    <span v-else>{{ transData(row[field.code], field) }}</span>
                  </template>
                </el-table-column>
              </template>
            </template>
            <el-table-column label="操作" min-width="160px" fixed="right">
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
                      标签设置
                      <i class="el-icon-arrow-up el-icon--right"/>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="labelSetVisible">添加标签</el-dropdown-item>
                      <el-dropdown-item command="labelMoveVisible">移出标签</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </li>
              </batch-operation>
            </div>
            <div class="flex-fill-in-the-remaining-space text-align-right">
              <el-pagination :current-page="page.currentPage" background :page-sizes="[10, 20, 50, 100]"
                             :page-size="page.pageSize" :total="memberTotal" :pager-count="5"
                             layout="total, sizes, prev, pager, next, jumper"
                             @current-change="pageChange" @size-change="sizeChange"></el-pagination>
            </div>
          </div>
        </el-footer>

        <!-- 查看弹框 -->
        <div class="dialogbox" v-show="memberFormVisible">
          <member-form-new :isFamous="isFamous" :member-id="memberFormId" v-if="memberFormVisible"
                           @close="memberFormVisible = false" :educationList="educationList" :collegeList="collegeList"
                           :majorList="majorList"
                           @refresh-members="refreshMembers"/>
        </div>
        <!-- 新增修改弹框 -->
        <div class="dialogbox" v-show="memberFormEditVisible">
          <member-form-edit :createAlumniInfo="createAlumniInfo" :memberId="memberFormId" v-if="memberFormEditVisible"
                            @close="closeCreateAlumni" :educationList="educationList" :collegeList="collegeList"
                            :majorList="majorList" @refresh-members="refreshMembers"/>
        </div>
        <!-- 标签管理 -->
        <div class="dialogbox" v-show="tagsManageVisible">
          <tags-manage @close="closeTagsManage" v-if="tagsManageVisible"></tags-manage>
        </div>
        <!-- 疑似校友 -->
        <div class="dialogbox" v-show="sameAlumniVisible">
          <alumni-confirm @refresh-members="refreshMembers" @toCreateNew="toCreateNew" @close="sameAlumniVisible=false"
                          v-if="sameAlumniVisible"></alumni-confirm>
        </div>
        <!-- 校友资讯更新 -->
        <div class="dialogbox" v-show="alumniUpdataVisible">
          <alumni-updata @refresh-members="refreshMembers" @close="alumniUpdataVisible=false"
                         v-if="alumniUpdataVisible"></alumni-updata>
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
                       :educationList="educationList" :collegeList="collegeList" :majorList="majorList"></modify-nums>
        </el-dialog>
        <!-- 标签弹框 -->
        <el-dialog :visible.sync="labelOperateVisible" :title="labelOperateTitle" append-to-body
                   :close-on-click-modal="false" width="800px">
          <label-set v-if="labelOperateVisible" :memberIds="receiverList" :operate="labelOperateType"
                     @close="labelOperateVisible = false" @refresh="refreshMembers"/>
        </el-dialog>

        <member-batch-import @queryTable="refreshMembers" @refresh-members="refreshMembers"
                             :visible.sync="batchImportVisible" title="知名校友导入"></member-batch-import>
        <!-- <member-batch-import-from-activity :visible.sync="batchImportFormActVisible" @refresh-members="refreshMembers"/> -->
        <el-dialog title="导出会员信息" append-to-body :close-on-click-modal="false" :visible.sync="exportFormVisible"
                   width="650px">
          <export-form :isFamouseMember="true" v-if="exportFormVisible" @close="exportFormVisible = false"
                       :conditionall="condition" :memberTotal="memberTotal"/>
        </el-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import highSearch from '../../../../util/highSearch/highSearch'
import addTags from "../addTags/addTags";
import tagsManage from "../tagsManage/tagsManage";
import modifyNums from "./modifyNums";
import MemberBatchImport from "../allMember/import/excel/MemberBatchImport";
import MemberFormNew from "../allMember/memberForm/MemberFormNew";
import MemberFormEdit from "./memberFormEdit/MemberFormEdit";

import BatchOperation from "../../../../util/BatchOperation";
import {formatDate} from "@/js/util/utilFunction";
import ExportForm from "../allMember/export/ExportForm";
import {exportExcel} from "../../../../../js/util/exportFile";
import LabelSet from "../allMember/label/LabelSet";
import {birthOptions} from "../allMember/memberForm/data";
import alumniConfirm from "../alumniConfirm/alumniConfirm";
import alumniUpdata from "../alumniUpdata/alumniUpdata";

export default {
  name: "alumniMatch",
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
    alumniConfirm,
    alumniUpdata,
    highSearch
  },
  props: ["memberDelete"],
  data() {
    return {
      timer:null,
      showFieldListNew: [],
      fieldInfoList: [],

      loading: false,
      memberSelection: [],
      memberList: [],
      memberFieldList: [],

      //查询会员列表相关参数
      page: {
        currentPage: 1,
        pageSize: 10,
      },
      memberTotal: 0,

      //会员表单
      memberFormId: "",
      memberFormVisible: false,
      memberFormEditVisible: false,

      //导出表单
      memberTypes: [],
      educationList: [],
      collegeList: [],
      majorList: [],
      filterObj: {
        dateRange: [],
      },
      //从Excel导入
      batchImportVisible: false,
      //从活动导入
      batchImportFormActVisible: false,
      exportFormVisible: false,
      modifyNumsVisible: false, //批量修改的弹窗
      modifySelectInfo: {}, //批量修改时的选中项
      //批量设置标签
      labelOperateType: null,
      labelOperateVisible: false,
      labelOperateTitle: "批量添加标签",
      hoverItem: null,
      //标签管理
      tagsManageVisible: false,
      addTagsVisible: false,
      deleteTagsVisible: false,
      editMemberInfo: {},
      clickTag: "",
      sortItem: "createTime",
      orderStatus: 2,
      birthOptions: birthOptions,
      sameAlumniVisible: false,
      alumniUpdataVisible: false,
      createAlumniInfo: {},
      sameAlumniList: [],
      updataAlumniList: [],
      isFamous: false,
      alumniUpdataTime: '',
      sameUpdataTime: '',
      searchList: [    //这是筛选列表
        {type:1,key:'name',condition:5,title:'姓名',width:'w160',value:''},
        {type: 1, key: 'telphone', condition: 5, title: '手机号', width: 'w160', value: ''},
        {type:1,key:'email',condition:5,title:'邮箱',width:'w160',value:''},
        {type: 1, key: 'college', condition: 5, title: '学院', width: 'w160', value: ''},
        {type: 1, key: 'major', condition: 5, title: '专业', width: 'w160', value: ''},
        {type: 1, key: 'cless', condition: 5, title: '班级', width: 'w160', value: ''},
        {type: 1, key: 'department', condition: 5, title: '部门', width: 'w160', value: ''},
        {type: 1, key: 'job', condition: 5, title: '职位', width: 'w160', value: ''},
        {type: 1, key: 'jobNo', condition: 5, title: '工号', width: 'w160', value: ''},
        {type: 1, key: 'workingCompany', condition: 5, title: '单位名称', width: 'w160', value: ''},
        {type: 1, key: 'post', condition: 5, title: '职务', width: 'w160', value: ''},
        {
          type: 2,
          key: 'entranceDate',
          condition: 1,
          title: '入学年',
          width: 'w160',
          value: '',
          time: 'year',
          timeType: 'yyyy'
        },
        {
          type: 2,
          key: 'graduationDate',
          condition: 1,
          title: '毕业年',
          width: 'w160',
          value: '',
          time: 'year',
          timeType: 'yyyy'
        },
        {type: 3, key: 'birthday', condition: 1, title: '生日', width: 'w160', value: ''},
        {type: 3, key: 'currentCity', condition: 1, title: '所在城市', value: '', width: 'w160'},
      ],
      birthTypeChoose:null
    };
  },
  computed: {
    OPprivileges() {
      return this.$store.state.OPprivileges.map((item) => item.id);
    },
    receiverList() {
      let receiverList = [];
      for (let item of this.memberSelection) {
        receiverList.push(item.id);
      }
      return receiverList;
    },
    condition() {
      let condition = {};
      condition.searchList = [];
      this.searchList.forEach(item => {
        if (item.value&&item.value.length||item.value=='0') {
          condition.searchList.push({
            type: item.condition,
            value:Array.isArray(item.value)?item.value.join("-"):item.value,
            field: item.key
          });
        }else {
          if (item.condition==3||item.condition==4) {
            condition.searchList.push({
              type:item.condition,
              value:Array.isArray(item.value)?item.value.join("-"):item.value,
              field:item.key
            });
          }
        }
      })
      condition.birthdayType = this.birthTypeChoose
      for (const key in this.filterObj) {
        if (this.filterObj[key] || this.filterObj[key] == "0") {
          condition[key] = this.filterObj[key];
        }
      }
      if (condition.dateRange && condition.dateRange.length > 1) {
        condition.dateRange[0] = condition.dateRange[0] + " 00:00:00";
        condition.dateRange[1] = condition.dateRange[1] + " 23:59:59";
      }
      condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
      condition.limit = this.page.pageSize;
      condition.labelIds = [this.clickTag];
      if (!condition.labelIds[0]) {
        condition.labelIds = [];
      }
      condition.orderField = this.sortItem;
      condition.orderStatus = this.orderStatus;
      condition.isFamous = true;
      return condition;
    },
  },
  methods: {
    modifyAddTags() {
      if (!this.memberSelection.length) {
        this.$message({
          message: "请先选择要添加标签的会员",
          type: "warning",
        });
        return;
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
          message: "请先选择要添加标签的会员",
          type: "warning",
        });
        return;
      }
      this.deleteTagsVisible = true;
    },
    closeDeleteTags() {
      this.deleteTagsVisible = false;
      this.memberSelection = [];
      this.$refs.addTagsTable.clearSelection();
    },
    overFunc(item) {
      this.hoverItem = item;
    },
    modifyEdit() {
      if (this.memberSelection.length <= 0) {
        this.$message.warning("请选择要修改的校友");
        return;
      }
      this.modifyNumsVisible = true;
    },
    //批量修改传值
    modifyItemSelect(data) {
      this.modifySelectInfo = JSON.parse(JSON.stringify(data));
      let memberIds = [];
      this.memberSelection.forEach((item) => {
        memberIds.push(item.id);
      });
      var obj = {
        code: this.modifySelectInfo.fieldId,
        value: this.modifySelectInfo.content,
        memberIds: memberIds,
      };
      this.$request
          .put("/api/admin/member/v2/batchModifyMemberInfo", obj)
          .then((res) => {
            this.modifyNumsVisible = false;
            if (res.success) {
              this.refreshMembers();
            } else {
              this.$message.error(res.msg);
            }
          });
    },
    emailSendCommand(val) {
      if (val === "notTemplateSendVisible") {
        if (this.memberSelection.length === 0) {
          this.$message({
            message: "请勾选要发送邮件通知的申请信息",
            type: "warning",
          });
          return;
        }
        this.templateSendVisible = true;
        var memberList = [];
        var flag = true;
        this.memberSelection.forEach((item) => {
          var obj = {
            objectId: item.id,
            device: item.email,
            objectName: item.name,
            objectType: 1,
          };
          memberList.push(obj);
        });
        // if (!flag) {
        //   this.$message({
        //       message: '部分成员缺少邮箱信息,请切换一种通知方式或补充邮箱信息',
        //       type: 'warning'
        //     });
        //   return
        // }
        this.$router.push({
          name: "sendEmail",
          params: {
            memberList,
          },
        });
      } else if (val === "templateSendVisible") {
        this.notTemplateSendVisible = true;
      }
    },
    smsSendCommand(val) {
      if (val === "notTemplateSendVisible") {
        if (this.memberSelection.length === 0) {
          this.$message({
            message: "请勾选要发送短信的申请信息",
            type: "warning",
          });
          return;
        }
        this.templateSendVisible = true;
        this.$router.push({
          name: "sendSms",
          params: {
            memberList: this.memberSelection,
          },
        });
      } else if (val === "templateSendVisible") {
        this.notTemplateSendVisible = true;
      }
    },
    labelSettingCommand(val) {
      if (val === "labelSetVisible") {
        this.modifyAddTags();
      } else if (val === "labelMoveVisible") {
        this.modifyDeleteTags();
      }
    },
    exportChosenData() {
      if (this.memberSelection.length <= 0) {
        this.$message.warning("请选择要导出的会员");
        return;
      }
      let memberIds = [];
      this.memberSelection.forEach((item) => {
        memberIds.push(item.id);
      });
      var condition = Object.assign(this.condition, {exportQueryLimit: [1, this.memberSelection.length], memberIds})
      // let condition = {
      //   exportQueryLimit: [1, this.memberSelection.length],
      //   memberIds,
      // };
      // var condition=JSON.parse(JSON.stringify(this.condition));
      // if (condition.birthday.length==0) {
      //   condition.birthday='';
      // }
      this.$request
          .post("/api/admin/member/poi/export", condition, {
            responseType: "blob",
          })
          .then((resp) => {
            exportExcel(resp);
          });
    },
    deleteChosenData() {
      if (this.memberSelection.length <= 0) {
        this.$message.warning("请选择要删除的校友");
        return;
      }
      let memberIds = [];
      this.memberSelection.forEach((item) => {
        memberIds.push(item.id);
      });
      this.$confirm(
          "请问是只从知名校友列表清除,还是同时从校友列表清除?",
          "提示",
          {
            confirmButtonText: "只从知名校友列表清除",
            cancelButtonText: "同时从校友列表清除",
            type: "warning",
            distinguishCancelAndClose: true
          }
      )
          .then(() => {
            this.$request
                .delete("/api/admin/member/v2/batchDeleteFamousMember", {params: {memberIds}})
                .then(res => {
                  if (res.success) {
                    this.$message.success("此校友已从知名校友列表删除");
                    this.refreshMembers();
                  }
                });
          })
          .catch((action) => {
            if (action == 'cancel') {
              this.$request
                  .delete("/api/admin/member/v2/batch", {
                    params: {memberIds}
                  })
                  .then(res => {
                    if (res.success) {
                      this.$message.success(
                          "此校友已移除知名校友,同时已从校友列表删除"
                      );
                      this.refreshMembers();
                    }
                  });
            }
          });
    },
    seeInfoList(item, row) {
      if (item.code == "jiuzhi") {
        this.$request
            .get("/api/admin/member/v2/getMemberTeacherExperience", {
              params: {memberId: row.id},
            })
            .then((res) => {
              this.fieldInfoList = res.data;
            });
      } else if (item.code == "jiudu") {
        this.$request
            .get("/api/admin/member/v2/getMemberStudentExperience", {
              params: {memberId: row.id},
            })
            .then((res) => {
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
          return val;
        }
      }
      if (field.topicType === 5) {
        if (val && field.notEdit) {
          return formatDate(new Date(val), "yyyy-MM-dd");
        } else {
          return val;
        }
        // if (val) {
        //   if(field.parameter&&field.parameter.dateType=="year"){
        //     return formatDate(new Date(val), "yyyy");
        //   }else{
        //     return formatDate(new Date(val), "yyyy-MM-dd");
        //   }
        // } else {
        //   return "";
        // }
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
            str += valueObj.country + "-"
          }
          if (valueObj.province) {
            str += valueObj.province + "-";
          }
          if (valueObj.city) {
            str += valueObj.city + "-";
          }
          str = str.slice(0, -1);
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
      this.$confirm(
          "请问是只从知名校友列表清除,还是同时从校友列表清除?",
          "提示",
          {
            confirmButtonText: "只从知名校友列表清除",
            cancelButtonText: "同时从校友列表清除",
            type: "warning",
            distinguishCancelAndClose: true
          }
      )
          .then(() => {
            this.$request
                .delete("/api/admin/member/v2/deleteFamousMemberInfo", {
                  params: {memberId: row.id}
                })
                .then(res => {
                  if (res.success) {
                    this.$message.success("此校友已从知名校友列表删除");
                    this.refreshMembers();
                  }
                });
          })
          .catch((action) => {
            if (action == 'cancel') {
              this.$request
                  .delete("/api/admin/member/v2", {params: {memberId: row.id}})
                  .then(res => {
                    if (res.success) {
                      this.$message.success(
                          "此校友已移除知名校友,同时已从校友列表删除"
                      );
                      this.refreshMembers();
                    }
                  });
            }
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
      if(this.timer){
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer=setTimeout(()=>{
        this.page.currentPage = 1;
        this.loadMembers(callback);
        this.getSameUpdataAlumni();
      },500)
    },
    getMemberFields(callback) {
      Promise.all([
        this.$request.get("/api/common/associator/historyCollege/educations"),
        this.$request.get("/api/common/associator/historyCollege/colleges"),
        this.$request.get("/api/common/associator/historyCollege/majors"),
      ]).then(([educationList, collegeList, majorList]) => {
        this.educationList = educationList.data;
        this.collegeList = collegeList.data;
        this.majorList = majorList.data;
        callback && callback();
      });
    },
    searchByTag(id) {
      this.clickTag = id;
      this.loadMembers();
    },
    loadMembers(callback) {
      this.memberSelection = [];
      // this.loading = true;
      if (!(!!window.MSInputMethodContext && !!document.documentMode)) {
        this.loading = true;
      }
      this.$request
      // .get("/api/admin/member/v2/list", { params: this.condition })
      this.$request.post("/api/admin/member/v2/list", this.condition)
          .then((members) => {
            this.memberList = members.data.list;
            this.memberTotal = members.data.total;
            this.$nextTick(() => {
              this.loading = false;
            })
            callback && callback();
          });
    },
    sort(item) {
      if (item === this.sortItem) {
        if (this.orderStatus == 0) {
          this.orderStatus = 1;
        } else if (this.orderStatus == 1) {
          this.orderStatus = 2;
        } else {
          this.orderStatus = 0;
          return;
        }
      } else {
        this.orderStatus = 1;
      }
      this.sortItem = item;
      this.refreshMembers();
    },
    toCreateNew(info) {
      this.sameAlumniVisible = false;
      this.memberFormEditVisible = true;
      this.memberFormId = "";
      this.createAlumniInfo = JSON.parse(JSON.stringify(info));
    },
    closeCreateAlumni() {
      this.memberFormEditVisible = false;
      this.createAlumniInfo = {};
    },
    getSameUpdataAlumni() {
      var confirmForm = {
        limit: 20,
        offset: 0,
        searchContent: "",
      };
      var updataForm = {
        limit: 20,
        offset: 0,
        searchContent: "",
      };
      Promise.all([
        this.$request.get("/api/admin/reptile/getSuspectedAlumni", {
          params: confirmForm,
        }),
        this.$request.get("/api/admin/reptile/getUpdateAlumni", {
          params: updataForm,
        }),
      ]).then((res) => {
        // console.log(res);
        this.sameAlumniList = res[0].data.result.list;
        this.sameUpdataTime = res[0].data.updateTime;
        this.updataAlumniList = res[1].data.result.list;
        this.alumniUpdataTime = res[0].data.updateTime;
      });
    },
  },
  created() {
    this.getSameUpdataAlumni();
    this.$request.get("/api/admin/associator/getFieldsByAuth").then((res) => {
      var fieldList = res.data;
      // 基本信息：0 工作信息：1  联系方式：2  在校就读经历：3 在校就职经历：4
      var index = fieldList.findIndex(
          (item) => item.groupId == 1 || item.groupId == 2
      );
      if (index > -1) {
        fieldList.splice(index, 0, {
          code: "label",
          name: "标签",
          parameter: {},
          detailList: [],
        });
      } else {
        fieldList.push({
          code: "label",
          name: "标签",
          parameter: {},
          detailList: [],
        });
      }
      var newList = [];
      for (var i = 0; i < fieldList.length; i++) {
        fieldList[i].detailList = [];
        if (fieldList[i].topicType == 2) {
          fieldList[i].parameter = fieldList[i].parameter
              ? JSON.parse(fieldList[i].parameter)
              : {options: ""};
        }
        if (fieldList[i].groupId == 3) {
          var index = newList.findIndex((item) => item.code == "jiudu");
          if (index > -1) {
            newList[index].detailList.push(fieldList[i]);
          } else {
            newList.push({
              code: "jiudu",
              name: "就读经历",
              topicType: 13,
              parameter: {},
              detailList: [fieldList[i]],
            });
          }
        } else if (fieldList[i].groupId == 4) {
          var index = newList.findIndex((item) => item.code == "jiuzhi");
          if (index > -1) {
            newList[index].detailList.push(fieldList[i]);
          } else {
            newList.push({
              code: "jiuzhi",
              name: "就职经历",
              topicType: 13,
              parameter: {},
              detailList: [fieldList[i]],
            });
          }
        } else {
          newList.push(fieldList[i]);
        }
      }
      newList = newList.concat([
        {
          code: "source",
          name: "注册方式",
          topicType: 0,
          parameter: {},
          detailList: [],
          notEdit: true,
        },
        {
          code: "createTime",
          name: "创建时间",
          topicType: 5,
          parameter: {},
          detailList: [],
          notEdit: true,
        },
        {
          code: "status",
          name: "账户状态",
          topicType: 2,
          parameter: {
            options: [
              {key: "1", title: "已激活"},
              {key: "0", title: "未激活"},
            ],
          },
          detailList: [],
          notEdit: true,
        },
      ]);
      this.showFieldListNew = newList;

      this.refreshMembers();
      this.getMemberFields(() => {
      });
      // this.$request.get("/api/common/anon/area").then(res => {
      //   this.$store.commit(SET_AREALIST, res.data);
      // });
    });
    // this.refreshMembers();
    // this.getMemberFields(() => {});
  },
  watch: {
    filterObj: {
      deep: true,
      handler() {
        this.refreshMembers();
      },
    },
    searchList: {
      deep: true,
      handler() {
        this.refreshMembers();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.flexwrap {
  flex-wrap: wrap;

  .w120 {
    width: 120px;
  }

  .w160 {
    width: 160px;
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
  color: #3fa1b6;
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

.tagsItemEdit {
  display: none;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.custom-el-button {
  color: #3fa1b6;
}

.toAlumni {
  padding-top: 15px;
}

.toSameAlumni {
  display: flex;
  justify-content: space-between;
  height: 34px;
  align-items: center;
  background-color: rgba(255, 157, 0, 0.08);
  border: 1px solid rgba(255, 157, 0, 0.4);
  padding: 0 15px;
  border-radius: 6px;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
    margin-right: 15px;
  }

  &:first-child {
    margin-bottom: 15px;
  }
}

.toSameAlumni-left {
  display: flex;
  align-items: center;
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

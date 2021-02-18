<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="unset-padding position-relative">
      <el-container class="absolute-fill-parent background-color-white minwh980" style="padding: 0 16px;">
        <!-- 头部 -->
        <el-header class="unset-padding flex" height="auto">
          <div class="flex-fill-in-the-remaining-space flex" style="padding: 16px 0;width: 194px;">
            <div class="flex flexwrap" style="flexWrap:wrap;">
              <el-input class="w120" v-model="filterObj.name" size="small" placeholder="搜索姓名"  clearable/>
              <el-input class="w120" v-model="filterObj.telphone" size="small" placeholder="搜索手机号" clearable/>
              <el-input class="w160" v-model="filterObj.email" size="small" placeholder="搜索邮箱" clearable/>
              <el-date-picker class="w120" v-model="filterObj.entranceDate" placeholder="入学年" value-format="yyyy" size="small" type="year"></el-date-picker>
              <el-date-picker class="w120" v-model="filterObj.graduationDate" placeholder="毕业年" value-format="yyyy" size="small" type="year"></el-date-picker>
              <el-input class="w160" v-model="filterObj.college" size="small" placeholder="搜索学院" clearable/>
              <el-input class="w160" v-model="filterObj.major" size="small" placeholder="搜索专业" clearable/>
              <el-input class="w160" v-model="filterObj.cless" size="small" placeholder="搜索班级" clearable/>
              <el-input class="w160" v-model="filterObj.department" size="small" placeholder="搜索部门" clearable/>
              <el-input class="w160" v-model="filterObj.job" size="small" placeholder="搜索职位" clearable/>
              <el-input class="w160" v-model="filterObj.jobNo" size="small" placeholder="搜索工号" clearable/>
              <el-input class="w160" v-model="filterObj.workingCompany" size="small" placeholder="搜索单位名称" clearable/>
              <el-input class="w160" v-model="filterObj.post" size="small" placeholder="搜索职务" clearable/>
              <el-select class="w160" v-model="filterObj.status" size="small" placeholder="请选择账户状态" clearable>
                <el-option label="已激活" :value="1"></el-option>
                <el-option label="未激活" :value="0"></el-option>
              </el-select>
              <el-cascader class="w160" size="small" :options="birthOptions" v-model="filterObj.birthday" clearable placeholder="请选择生日"></el-cascader>
              <el-date-picker style="margin-right:20px;" v-model="filterObj.dateRange" size="small" type="daterange" range-separator="至" start-placeholder="注册开始日期" end-placeholder="注册结束日期" value-format="yyyy-MM-dd"></el-date-picker>

              <el-button class="primaryBtnClass" type="primary" size="small" @click="addMember">新增</el-button>
              <el-button class="plainBtnClass" size="small" @click="batchImportVisible=true">导入</el-button>
              <el-button class="plainBtnClass" size="small" @click="exportFormVisible=true">导出</el-button>
            </div>
          </div>
        </el-header>
        <!-- 表格部分 -->
        <el-main class="unset-padding position-relative">
          <el-table ref="addTagsTable" class="custom-el-table header-gray lrd-el-table" style="min-width: 400px;" highlight-current-row :data="memberList" size="small" border
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" fixed />
            <template v-for="field in showFieldListNew">
              <!-- 多级表头 -->
              <template v-if="field.detailList.length">
                <el-table-column align="center" :key="field.code" show-overflow-tooltip :label="field.name">
                  <el-table-column v-for="item in field.detailList" :key="item.code" show-overflow-tooltip :label="item.name" :prop="item.code" min-width="150">
                    <template slot-scope="{ row }">
                      <div class="zuhe">{{ transData(row[item.code], item) }}</div>
                    </template>
                  </el-table-column>
                </el-table-column>
              </template>
              <!-- 标签 -->
              <template v-else-if="field.code==='label'">
                <el-table-column :key="field.code" show-overflow-tooltip :prop="field.code" :label="field.name" min-width="300" align="center">
                  <template slot-scope="{ row }">
                    <div class="tagsListEdit">
                      <span class="tagsShow" v-for="item in row.label" :key="item.id" :style="{'background-color':item.color}">{{item.title}}</span>
                    </div>
                  </template>
                </el-table-column>
              </template>
              <!-- 一般表头 -->
              <template v-else>
                <el-table-column :fixed="field.code=='name'" :key="field.code" show-overflow-tooltip :label="field.name" :prop="field.code" min-width="150" align="center">
                  <template slot="header" slot-scope="{row}">
                    <el-tooltip class="item" effect="dark" content="点击进行排序" placement="top">
                      <div style="cursor:pointer;align:center;" @click="sort(field.code)">
                        <span style="color:#3FA1B6;">{{field.name}}</span>
                        <span v-if="sortItem===field.code&&orderStatus===2" class="el-icon-caret-bottom" style="color:#428bca;marginLeft:5px;"></span>
                        <span v-if="sortItem===field.code&&orderStatus===1" class="el-icon-caret-top" style="color:#428bca;marginLeft:5px;"></span>
                      </div>
                    </el-tooltip>
                  </template>
                  <template slot-scope="{ row }">
                    <span>{{transData(row[field.code], field)}}</span>
                  </template>
                </el-table-column>
              </template>
            </template>
            <el-table-column label="操作" min-width="160px" fixed="right">
              <template slot-scope="{$index,row}">
                <!-- <el-button type="text" class="custom-el-button" size="small">更换职位</el-button> -->
                <el-button type="text" class="custom-el-button danger" size="small" @click="deleteMember([row.id])">移除</el-button>
                <el-button type="text" class="custom-el-button" size="small" @click="seeMember(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- 底部 -->
        <el-footer class="unset-padding" height="auto">
          <div class="flex" style="padding: 16px 0;">
            <div>
              <batch-operation title="批量操作">
                <li @click="deleteMember(memberSelection)">移除成员</li>
                <!-- <li>更换职位</li> -->
              </batch-operation>
            </div>
            <div class="flex-fill-in-the-remaining-space text-align-right">
              <el-pagination :current-page="page.currentPage" background :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize" :total="memberTotal" :pager-count="5" layout="total, sizes, prev, pager, next, jumper"
                @current-change="pageChange" @size-change="sizeChange"></el-pagination>
            </div>
          </div>
        </el-footer>
        <!-- 新增修改弹框 -->
        <div class="dialogbox" v-show="memberFormEditVisible">
          <member-form-edit :user-id="memberFormId" v-if="memberFormEditVisible" @close="memberFormEditVisible = false" :educationList="educationList" :collegeList="collegeList" :majorList="majorList"
            :isBranchMember="true" @refresh-members="refreshMembers" />
        </div>
        <!-- 校友导入 -->
        <member-batch-import @queryTable="refreshMembers" @refresh-members="refreshMembers" :visible.sync="batchImportVisible" title="分会校友导入"></member-batch-import>
        <!-- 会员信息导出 -->
        <el-dialog title="导出会员信息" append-to-body :close-on-click-modal="false" :visible.sync="exportFormVisible" width="650px">
          <export-form v-if="exportFormVisible" @close="exportFormVisible = false" :conditionall="condition" :memberTotal="memberTotal" :isBranchMember="true" />
        </el-dialog>
        <!-- 查看详细信息 -->
        <div class="dialogbox" v-show="memberFormVisible">
          <member-info-show :user-id="memberFormId" v-if="memberFormVisible" @close="memberFormVisible = false" :educationList="educationList" :collegeList="collegeList" :majorList="majorList"
            @refresh-members="cancelShow" />
        </div>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import { formatDate } from "@/js/util/utilFunction";
import BatchOperation from "../../../util/BatchOperation";
import MemberFormEdit from "../member/allMember/memberForm/MemberFormEdit";
import MemberBatchImport from "../member/allMember/import/excel/MemberBatchImport";
import ExportForm from "../member/allMember/export/ExportForm";
import memberInfoShow from "../member/allMember/memberForm/memberInfoShow";
import {birthOptions} from "@/components/functions/organization/member/allMember/memberForm/data"
export default {
  name: "memberManage",
  components: {
    BatchOperation,
    MemberFormEdit,
    MemberBatchImport,
    ExportForm,
    memberInfoShow,
  },
  data() {
    return {
      birthOptions:birthOptions,
      memberList: [],
      showFieldListNew: [],
      filterObj: {
        searchContent: "",
        // telphone: "",
        // email: "",
        // workingCompany: "",
        // post: "",
        // college: "",
        // major: "",
        dateRange: [],
      },
      majorList: [],
      educationList: [],
      collegeList: [],
      page: {
        currentPage: 1,
        pageSize: 10,
      },
      memberFormEditVisible: false,
      memberFormId: "",
      batchImportVisible: false,
      exportFormVisible: false,
      memberTotal: 0,
      memberFormVisible: false,
      memberSelection: [],
      sortItem: "createTime",
      orderStatus: 2,
    };
  },
  computed: {
    condition() {
      let condition = {};
      for (const key in this.filterObj) {
        condition[key] = this.filterObj[key];
      }
      if (condition.dateRange && condition.dateRange.length > 1) {
        condition.dateRange[0] = condition.dateRange[0] + " 00:00:00";
        condition.dateRange[1] = condition.dateRange[1] + " 23:59:59";
      }
      condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
      condition.limit = this.page.pageSize;
      condition.orderField = this.sortItem;
      condition.orderStatus = this.orderStatus;
      return condition;
    },
  },
  created() {
    this.$request.get("/api/admin/associator/getFieldsByAuth").then(res => {
      var fieldList = res.data
      // 基本信息：0 工作信息：1  联系方式：2  在校就读经历：3 在校就职经历：4
      var index = fieldList.findIndex(item=>item.groupId==1||item.groupId==2)
      if(index>-1){
        fieldList.splice(index,0,{code: "label",name: "标签",parameter: {},detailList: []})
      }else{
        fieldList.push({code: "label",name: "标签",parameter: {},detailList: []})
      }
      var newList=[];
      for(var i=0;i<fieldList.length;i++){
        fieldList[i].detailList=[]
        if(fieldList[i].topicType==2){
          fieldList[i].parameter = fieldList[i].parameter?JSON.parse(fieldList[i].parameter):{options:""}
        }
        if(fieldList[i].groupId==3){
          var index = newList.findIndex(item=>item.code=='jiudu')
          if(index>-1){
            newList[index].detailList.push(fieldList[i])
          }else{
            newList.push({code: "jiudu",name: "就读经历",topicType: 13,parameter: {},detailList:[fieldList[i]]})
          }
        }else if(fieldList[i].groupId==4){
          var index = newList.findIndex(item=>item.code=='jiuzhi')
          if(index>-1){
            newList[index].detailList.push(fieldList[i])
          }else{
            newList.push({code: "jiuzhi",name: "就职经历",topicType: 13,parameter: {},detailList:[fieldList[i]]})
          }
        }else{
          newList.push(fieldList[i])
        }
      }
      newList=newList.concat([
        {code: "source",name: "注册方式",topicType: 0,parameter: {},detailList: [],notEdit:true},
        {code: "createTime",name: "创建时间",topicType: 5,parameter: {},detailList: [],notEdit:true},
        {code: "status",name: "账户状态",topicType: 2,parameter: {options: [{ key: "1", title: "已激活" },{ key: "0", title: "未激活" }]},detailList: [],notEdit:true}
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
      },
    },
  },
  methods: {
    handleSelectionChange(selection) {
      let arr = [];
      selection.forEach((item) => {
        arr.push(item.id);
      });
      this.memberSelection = arr;
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
    transData(val, field) {
      if (field.topicType == 2) {
        let { options } = field.parameter;
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
          if (valueObj.country) {str += valueObj.country + "-"}
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
    loadMembers(callback) {
      this.memberSelection = [];
      this.$request
        .get("/api/admin/branch/getBranchMemberInfoPage", { params: this.condition })
        .then((members) => {
          this.memberList = members.data.list;
          this.memberTotal = members.data.total;
          this.$nextTick(()=>{ this.loading = false; })
          setTimeout(() => {
            this.showPop = true;
          }, 500);
          callback && callback();
        });
    },
    refreshMembers(callback) {
      this.page.currentPage = 1;
      this.loadMembers(callback);
    },
    cancelShow() {
      this.loadMembers();
    },
    addMember() {
      this.memberFormId = "";
      this.memberFormEditVisible = true;
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
    seeMember(row) {
      this.memberFormId = row.id;
      this.memberFormVisible = true;
    },
    deleteMember(memberIds) {
      this.$confirm("此操作将删除成员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (memberIds.length === 0) {
            this.$message({
              message: "请先选择要删除的成员",
              type: "warning",
            });
          }
          this.$request
            .delete("/api/admin/branch/removeMemberBranch", {
              data: { memberIds },
            })
            .then((res) => {
              if (res.success) {
                this.refreshMembers();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //排序
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
      // if (this.orderStatus=0) {
      //   return
      // }
      this.sortItem = item;
      this.refreshMembers();
    },
  },
};
</script>

<style lang="less">
.w120 {
  width: 120px;
  margin-right: 20px;
  margin-bottom: 10px;
}
.w160 {
  width: 160px;
  margin-right: 20px;
  margin-bottom: 10px;
}
.dialogbox {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000000;
}
.tagsShow {
  color: #fff;
  padding: 2px 5px;
  margin-right: 5px;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>

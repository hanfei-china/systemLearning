<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="unset-padding position-relative">
      <el-container class="absolute-fill-parent background-color-white minwh980" style="padding: 0 16px;"
                    v-loading="loading">
        <el-header class="unset-padding flex" height="auto">
          <div class="flex-fill-in-the-remaining-space flex" style="padding: 16px 0;width: 194px;">
            <div class="flex flexwrap">
              <el-input class="w200" v-model="filterObj.searchContent" size="small" placeholder="请输入姓名/卡号"
                        clearable/>
              <el-select class="w160" size="small" v-model="filterObj.type" filterable placeholder="校友卡类型" clearable>
                <el-option v-for="item in typeList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <el-select class="w160" size="small" v-model="filterObj.identity" filterable placeholder="下拉选择学历"
                         clearable>
                <el-option v-for="item in identityList" :key="item.title" :label="item.title"
                           :value="item.title"></el-option>
              </el-select>
              <el-date-picker class="w160" v-model="filterObj.entranceDate" type="year" value-format="yyyy" size="small"
                              placeholder="选择入学年份"></el-date-picker>
              <el-date-picker class="w160" v-model="filterObj.graduationDate" type="year" value-format="yyyy"
                              size="small" placeholder="选择毕业年份"></el-date-picker>
              <el-select v-if="cardSettings&&cardSettings.enablePhysicsCard" class="w160" size="small"
                         v-model="filterObj.cardStatus" filterable placeholder="实体卡申领状态"
                         clearable>
                <el-option v-for="card in cardStatusList" :key="'card'+card.key" :label="card.title"
                           :value="card.key"></el-option>
              </el-select>
            </div>
          </div>
          <div class="text-align-right" style="padding: 16px 0 16px 16px;margin-left:50px;">
            <el-button class="plainBtnClass" size="small" @click="exportFormVisible=true">导出</el-button>
          </div>
        </el-header>

        <el-main class="unset-padding position-relative">
          <el-table ref="table" :header-cell-style="{textAlign:'center'}"
                    class="custom-el-table header-gray lrd-el-table" style="text-align: center;" stripe
                    highlight-current-row :data="memberList" size="small" border
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" fixed/>
            <el-table-column label="姓名" fixed>
              <span @click="memberDetail(row.memberId)" slot-scope={row} class="canClick">
                {{ row.name }}
              </span>
            </el-table-column>
            <el-table-column prop="englishName" label="英文名" fixed></el-table-column>
            <el-table-column prop="cardNo" label="校友卡号" fixed min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" label="一寸照" align="center" width="75px" fixed>
              <template slot-scope="scope">
                <el-popover placement="top-start" title="" trigger="click">
                  <img :src="scope.row.photo" alt="" style="width:150px;height:228px;object-fit: cover;"/>
                  <img slot="reference" :src="scope.row.photo" style="width:50px;height:70px;object-fit: cover;"/>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column label="学生卡信息">
              <el-table-column prop="identity" label="学历"></el-table-column>
              <el-table-column prop="entranceDate" label="入学年份"></el-table-column>
              <el-table-column prop="graduationDate" label="毕业年份"></el-table-column>
              <el-table-column prop="college" label="学院" show-overflow-tooltip></el-table-column>
              <!--              <el-table-column prop="major" label="专业" show-overflow-tooltip></el-table-column>-->
              <!--              <el-table-column prop="cless" label="班级" show-overflow-tooltip></el-table-column>-->
              <!--              <el-table-column prop="studentNo" label="学号" show-overflow-tooltip></el-table-column>-->
            </el-table-column>
            <el-table-column label="教职工卡信息">
              <el-table-column prop="department" label="就职部门" show-overflow-tooltip></el-table-column>
              <el-table-column prop="job" label="职务" show-overflow-tooltip></el-table-column>
              <!--              <el-table-column prop="jobNo" label="工号" show-overflow-tooltip></el-table-column>-->
            </el-table-column>
            <el-table-column label="实体卡申领信息" v-if="cardSettings&&cardSettings.enablePhysicsCard" :key="Math.random()">
              <el-table-column label="领取方式">
                <template slot-scope="{row}">
                  <span v-if="row.receiveWay=='0'">自取</span>
                  <span v-else-if="row.receiveWay=='1'">邮寄</span>
                  <span v-else-if="row.receiveWay=='2'">他人代领</span>
                </template>
              </el-table-column>
              <el-table-column prop="pickupAddress" label="领取地址" show-overflow-tooltip></el-table-column>
              <el-table-column prop="receiverName" min-width="90" label="收件人姓名" show-overflow-tooltip></el-table-column>
              <el-table-column label="收件地址" show-overflow-tooltip>
                <template slot-scope="{row}">{{ row.receiverAddress|addressFilter }}</template>
              </el-table-column>
              <el-table-column prop="receiverPhone" min-width="100" label="收件人手机号"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="substituteName" label="代领人" show-overflow-tooltip></el-table-column>
              <el-table-column prop="deliveryType" label="邮寄快递" show-overflow-tooltip></el-table-column>
              <el-table-column prop="deliveryCode" label="快递单号" show-overflow-tooltip></el-table-column>
            </el-table-column>
            <el-table-column label="实体卡申领状态" min-width="120" fixed="right"
                             v-if="cardSettings&&cardSettings.enablePhysicsCard" :key="Math.random()">
              <template slot-scope="{row}">
                <span v-if="row.cardStatus=='0'">不申领</span>
                <span v-else-if="row.cardStatus=='1'">待制卡</span>
                <span v-else-if="row.cardStatus=='2'">已制卡</span>
                <span v-else-if="row.cardStatus=='3'">已送出</span>
              </template>
            </el-table-column>
            <el-table-column label="实体卡申领时间" min-width="140" fixed="right"
                             v-if="cardSettings&&cardSettings.enablePhysicsCard" :key="Math.random()">
              <template slot-scope="{row}">
                {{ row.applicationTime|yyyyMMddHHmmss }}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120px" fixed="right">
              <template slot-scope="{ $index, row }">
                <el-button type="text" class="custom-el-button" size="small" @click="editCard(row.id)">修改</el-button>
                <el-button type="text" class="custom-el-button danger" size="small" @click="deleteCard(row)">删除
                </el-button>
                <el-button type="text" class="custom-el-button" size="small" @click="detailCard(row.id)">预览</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>

        <el-footer class="unset-padding" height="auto">
          <div class="flex" style="padding: 16px 0;">
            <div>
              <batch-operation title="批量操作">
                <li v-if="cardSettings&&cardSettings.enablePhysicsCard" @click="modifyEdit">修改实体卡申领状态</li>
                <li @click="deleteChosenData">删除</li>
                <li @click="exportChosenData">导出</li>
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
                @size-change="sizeChange">
              </el-pagination>
            </div>
          </div>
        </el-footer>
        <!-- 查看弹框 -->
        <div class="dialogbox" v-show="memberFormVisible">
          <member-form-new
            :member-id="memberId"
            :isFamous="isFamous"
            v-if="memberFormVisible"
            @close="memberFormVisible = false"
            :educationList="educationList"
            :collegeList="collegeList"
            :majorList="majorList"
            @refresh-members="refreshMembers"
          />
        </div>
        <!-- 详情弹框 -->
        <div class="dialogbox" v-show="cardDetailVisible">
          <card-detail :card-id="cardId" v-if="cardDetailVisible" @close="cardDetailVisible = false"
                       :identityList="identityList" @refresh="refreshCards" @edit="editCard"/>
        </div>
        <!-- 修改弹框 -->
        <div class="dialogbox" v-show="cardEditVisible">
          <card-edit :card-id="cardId" v-if="cardEditVisible" @close="cardEditVisible = false"
                     :identityList="identityList" @refresh="refreshCards"/>
        </div>
        <el-dialog title="导出校友卡信息" append-to-body :close-on-click-modal="false" :visible.sync="exportFormVisible"
                   width="650px">
          <export-form v-if="exportFormVisible" @close="exportFormVisible = false" :conditionall="condition"
                       :memberTotal="memberTotal"/>
        </el-dialog>
        <el-dialog title="批量修改" append-to-body :close-on-click-modal="false" :visible.sync="modifyNumsVisible"
                   width="650px">
          <ModifyCardStatus :memberSelection="memberSelection" v-if="modifyNumsVisible" @refresh="refreshCards"
                            @close="modifyNumsVisible=false"/>

        </el-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import ModifyCardStatus from "@/components/functions/organization/member/memberCard/ModifyCardStatus";
import CardEdit from "./CardEdit";
import BatchOperation from "@/components/util/BatchOperation";
import ExportForm from "./ExportForm";
import CardDetail from "./CardDetail";
import {exportExcel} from "../../../../../js/util/exportFile";
import memberFormNew from "../allMember/memberForm/MemberFormNew";

export default {
  name: "MemberTable",
  components: {
    ExportForm,
    BatchOperation,
    CardEdit,
    CardDetail,
    ModifyCardStatus,
    memberFormNew
  },
  props: ["memberDelete"],
  data() {
    return {
      showFieldListNew: [
        {code: "name", name: "姓名", topicType: 0, parameter: {}},
        {code: "photo", name: "一寸免冠照", topicType: 0, parameter: {}},
        {code: "sex", name: "性别", topicType: 2, parameter: {options: [{key: "男", title: "男"}, {key: "女", title: "女"}]}},
        {code: "identity", name: "学历", topicType: 2, parameter: {}},
        {code: "entranceDate", name: "入学年份", topicType: 5, parameter: {dateType: "year"}},
        {code: "graduationDate", name: "毕业年份", topicType: 5, parameter: {dateType: "year"}},
        {code: "college", name: "学院", topicType: 0, parameter: {}},
        {code: "major", name: "专业", topicType: 0, parameter: {}},
        {code: "cless", name: "班级", topicType: 0, parameter: {}},
        {code: "studentNo", name: "学号", topicType: 0, parameter: {}},
        {code: "department", name: "就职部门", topicType: 0, parameter: {}},
        {code: "job", name: "职务", topicType: 0, parameter: {}},
        {code: "jobNo", name: "工号", topicType: 0, parameter: {}},
      ],
      loading: false,
      memberSelection: [],
      memberList: [],
      //查询会员列表相关参数
      page: {
        currentPage: 1,
        pageSize: 10
      },
      memberTotal: 0,
      cardDetailVisible: false,
      cardEditVisible: false,
      //导出表单
      memberTypes: [],
      typeList: [
        {
          label: "学生卡",
          value: "0"
        },
        {
          label: "教职工卡",
          value: "1"
        }
      ],
      cardStatusList: [
        {key: "0", title: '未申领'},
        {key: "1", title: '待制卡'},
        {key: '2', title: '已制卡'},
        {key: '3', title: '已送出'},
      ],
      identityList: [],
      filterObj: {},
      exportFormVisible: false,
      modifyNumsVisible: false,        //批量修改的弹窗
      modifySelectInfo: {},         //批量修改时的选中项
      cardSettings: null,
      cardId: "",
      memberFormVisible: false,
      educationList: [],
      collegeList: [],
      majorList: [],
      memberId: '',
      isFamous:false
    };
  },
  computed: {
    OPprivileges() {
      return this.$store.state.OPprivileges.map(item => item.id)
    },
    condition() {
      let condition = {};
      for (const key in this.filterObj) {
        if (this.filterObj[key]) {
          condition[key] = this.filterObj[key]
        }
      }
      condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
      condition.limit = this.page.pageSize;
      condition.auditStatus = "1";
      return condition;
    }
  },
  methods: {
    memberDetail(id){
      this.$request.get('/api/admin/member/v2/getUserInfoAndMemberInfo',{params:{memberId:id}}).then(()=>{
          this.memberFormVisible=true;
          this.memberId=id;
      }).catch(()=>{
        this.$message.closeAll()
        this.$message.error('该校友不存在')
      })
    },
    getMemberFields(callback) {
      Promise.all([
        this.$request.get("/api/common/associator/historyCollege/educations"),
        this.$request.get("/api/common/associator/historyCollege/colleges"),
        this.$request.get("/api/common/associator/historyCollege/majors")
      ]).then(([educationList, collegeList, majorList]) => {
        this.educationList = educationList.data;
        this.collegeList = collegeList.data;
        this.majorList = majorList.data;
        callback && callback();
      });
    },
    refreshMembers() {
      this.$emit('refreshMembers');
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
        ids: memberIds
      }
      obj[this.modifySelectInfo.fieldId] = this.modifySelectInfo.content
      this.$request.put('/api/admin/member/card/batch', obj).then(res => {
        this.modifyNumsVisible = false
        if (res.success) {
          this.refreshCards();
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    exportChosenData() {
      if (this.memberSelection.length <= 0) {
        this.$message.warning('请选择要导出的校友卡');
        return;
      }
      let ids = [];
      this.memberSelection.forEach(item => {
        ids.push(item.id);
      });
      let condition = {
        exportQueryLimit: [1, this.memberSelection.length], ids
      };
      this.$request.post('/api/admin/member/card/export', condition, {
        responseType: 'blob',
      }).then(resp => {
        exportExcel(resp);
      });
    },
    deleteChosenData() {
      if (this.memberSelection.length <= 0) {
        this.$message.warning('请选择要删除的校友卡');
        return;
      }
      let memberIds = [];
      this.memberSelection.forEach(item => {
        memberIds.push(item.id);
      });
      this.$confirm("此操作将删除校友卡信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$request.delete("/api/admin/member/card/batch", {params: {ids: memberIds}}).then(res => {
          if (res.success) {
            this.$message.success("删除成功");
            this.refreshCards()
          }
        });
      });
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
      this.cardId = "";
      this.cardEditVisible = true;
    },
    editCard(id) {
      this.cardDetailVisible = false;
      this.cardId = id;
      this.cardEditVisible = true;
    },
    detailCard(id) {
      this.cardId = id;
      this.cardDetailVisible = true;
    },
    deleteCard(row) {
      this.$confirm("此操作将删除校友卡信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$request.delete("/api/admin/member/card", {params: {id: row.id}}).then(res => {
          if (res.success) {
            this.$message.success("校友卡已删除");
            this.refreshCards()
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
    refreshCards(callback) {
      this.page.currentPage = 1;
      this.loadMembers(callback);
    },
    loadMembers(callback) {
      this.memberSelection = [];
      this.loading = true;
      this.$request.get("/api/admin/member/card/list", {params: this.condition}).then(members => {
        this.memberList = members.data.list;
        this.memberTotal = members.data.total;
        this.$nextTick(() => {
          this.loading = false;
          this.$refs.table.doLayout()
        })
        callback && callback();
      });
    },
  },
  created() {

    this.$request.get("/api/common/associator/historyCollege/educations").then(r => {
      this.identityList = r.data;
    })
    this.getMemberFields()
    this.$request.get("/api/admin/settings/manage/getCommonSetting?type=20").then(r => {
      this.cardSettings = r.data;
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      })
      this.refreshCards();
    });
  },
  watch: {
    filterObj: {
      deep: true,
      handler() {
        this.refreshCards();
      }
    },
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
    width: 160px;
  }

  .w180 {
    width: 180px;
  }

  .w200 {
    width: 200px;
  }

  .el-input {
    margin-right: 15px;
    margin-bottom: 10px;
  }

  .el-select {
    margin-right: 15px;
    width: 200px;
  }

  .el-range-editor {
    width: 250px;
  }
}

.canClick {
  cursor: pointer;
  color: #3FA1B6;
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
</style>

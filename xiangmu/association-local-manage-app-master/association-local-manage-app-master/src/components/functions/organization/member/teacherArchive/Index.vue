<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-main class="unset-padding position-relative">
      <el-container class="absolute-fill-parent background-color-white minwh980" style="padding: 0 16px;" v-loading="loading">
        <el-header class="unset-padding flex" height="auto">
          <div class="flex-fill-in-the-remaining-space flex" style="padding: 16px 0;width: 194px;">
            <div class="flex flexwrap">
              <high-search :searchList="searchList"></high-search>
            </div>
          </div>
          <div class="text-align-right" style="padding: 16px 0 16px 16px;">
            <el-button class="primaryBtnClass" v-if="OPprivileges.includes('201022001')" type="primary" size="small" @click="addMember">新增</el-button>
            <el-button class="plainBtnClass" v-if="OPprivileges.includes('201022004')" size="small" @click="batchImportVisible=true">导入</el-button>
            <el-button class="plainBtnClass" v-if="OPprivileges.includes('201022005')" size="small" @click="exportFormVisible=true">导出</el-button>
            <el-button size="small" class="plainBtnClass" v-if="OPprivileges.includes('201022006')" @click="$router.push('/console/organization/member/teacherArchiveMerge')">合并重复</el-button>
          </div>
        </el-header>

        <el-main class="unset-padding position-relative">
          <el-table class="custom-el-table header-gray lrd-el-table" height="100%" style="min-width: 400px;" stripe highlight-current-row :data="memberList" size="small" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" fixed/>
            <template v-for="field in showFieldListNew">
              <el-table-column :key="field.code" show-overflow-tooltip :label="field.name" :prop="field.code" min-width="150">
                <template slot-scope="{ row }">
                  <span v-if="field.code=='name'" class="canClick" @click="editMember(row)">{{transData(row[field.code], field)}}</span>
                  <span v-else>{{transData(row[field.code], field)}}</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column label="操作"  min-width="100px" fixed="right" v-if="OPprivileges.includes('201022003')||OPprivileges.includes('201022002')">
              <template slot-scope="{ $index, row }">
                <el-button type="text" class="custom-el-button" size="small" v-if="OPprivileges.includes('201022003')" @click="editMember(row)">修改</el-button>
                <el-button type="text" class="custom-el-button danger" size="small" v-if="OPprivileges.includes('201022002')" @click="deleteMember(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>

        <el-footer class="unset-padding" height="auto">
          <div class="flex" style="padding: 16px 0;">
            <div>
              <batch-operation title="批量操作">
                <li @click="deleteChosenData" v-if="OPprivileges.includes('201022002')">删除</li>
                <li @click="exportChosenData" v-if="OPprivileges.includes('201022005')">导出</li>
                <li @click="modifyEdit" v-if="OPprivileges.includes('201022003')">批量修改</li>
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

        <!-- 新增修改弹框 -->
        <div class="dialogbox" v-show="memberFormEditVisible">
          <member-form-edit :user-id="memberFormId" v-if="memberFormEditVisible" @close="memberFormEditVisible = false"  @refresh-members="refreshMembers"/>
        </div>
        <!-- 批量修改 -->
        <el-dialog :visible.sync="modifyNumsVisible" title="批量修改" append-to-body :close-on-click-modal="false" width="800px">
          <modify-nums @selectItem="modifyItemSelect" :selectList="showFieldListNew" @close="modifyNumsVisible=false"></modify-nums>
        </el-dialog>

        <member-batch-import @queryTable="refreshMembers" @refresh-members="refreshMembers" :visible.sync="batchImportVisible" title="教职工档案导入"></member-batch-import>
        <el-dialog title="导出档案信息" append-to-body :close-on-click-modal="false" :visible.sync="exportFormVisible" width="650px">
          <export-form v-if="exportFormVisible" @close="exportFormVisible = false" :conditionall="condition" :memberTotal="memberTotal"/>
        </el-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import highSearch from '../../../../util/highSearch/highSearch'
import modifyNums from "./modifyNums";
import MemberBatchImport from "../allMember/import/excel/MemberBatchImport";
import MemberFormEdit from "./memberForm/MemberFormEdit";
import BatchOperation from "@/components/util/BatchOperation";
import ExportForm from "./export/ExportForm";
import { exportExcel } from "../../../../../js/util/exportFile";

export default {
  name: "teacherArchive",
  components: {
    ExportForm,
    BatchOperation,
    MemberFormEdit,
    MemberBatchImport,
    modifyNums,
    highSearch
  },
  data() {
    return {
      timer:null,
      showFieldListNew: [],
      loading: false,
      memberSelection: [],
      memberList: [],
      //查询会员列表相关参数
      page: {
        currentPage: 1,
        pageSize: 10
      },
      memberTotal: 0,
      //会员表单
      memberFormId: "",
      memberFormEditVisible: false,
      //导出表单
      memberTypes: [],
      //从Excel导入
      batchImportVisible: false,
      //从活动导入
      batchImportFormActVisible: false,
      exportFormVisible:false,
      modifyNumsVisible:false,        //批量修改的弹窗
      modifySelectInfo:{},         //批量修改时的选中项
      searchList:[],
    };
  },
  computed: {
    OPprivileges(){
      return this.$store.state.OPprivileges.map(item=>item.id)
    },
    condition() {
      let condition = {};
      condition.searchList=[];
      this.searchList.forEach(item=>{
        if (item.value&& item.value.length||item.value=='0') {
          condition.searchList.push({
            type:item.condition,
            value:Array.isArray(item.value) ? item.value.join("-") : item.value,
            field:item.key
          });
        }else {
          if (item.condition==3||item.condition==4||item.condition == 11) {
              condition.searchList.push({
                type:item.condition,
                value:Array.isArray(item.value) ? item.value.join("-") : item.value,
                field:item.key
            });
          }
        }
      })

      condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
      condition.limit = this.page.pageSize;
      return condition;
    }
  },
  methods: {
    modifyEdit(){
      if (this.memberSelection.length <= 0) {
        this.$message.warning('请选择要修改的校友');
        return;
      }
      this.modifyNumsVisible=true
    },
    //批量修改传值
    modifyItemSelect(data){
      this.modifySelectInfo=JSON.parse(JSON.stringify(data));
      let memberIds = [];
      this.memberSelection.forEach(item => { memberIds.push(item.id); });
      var obj = {
        ids:memberIds,
        fieldValues:{}
      }
      obj.fieldValues[this.modifySelectInfo.fieldId]=this.modifySelectInfo.content
      this.$request.put('/api/admin/member/teacher/archive/batch',obj).then(res=>{
        this.modifyNumsVisible = false
        if (res.success) {
          this.refreshMembers();
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    exportChosenData() {
      if (this.memberSelection.length <= 0) {
        this.$message.warning('请选择要导出的档案');
        return;
      }
      let ids = [];
      this.memberSelection.forEach(item => { ids.push(item.id); });
      let condition = {
          exportQueryLimit: [1, this.memberSelection.length],ids
      };
      this.$request.post('/api/admin/member/teacher/archive/export', condition, {
        responseType: 'blob',
      }).then(resp => {
        exportExcel(resp);
      });
    },
    deleteChosenData(){
      if (this.memberSelection.length <= 0) {
        this.$message.warning('请选择要删除的档案');
        return;
      }
      let memberIds = [];
      this.memberSelection.forEach(item => { memberIds.push(item.id); });
      this.$confirm("此操作将删除档案信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$request.delete("/api/admin/member/teacher/archive/batch", { params: { ids:memberIds  } }).then(res => {
          if (res.success) {
            this.$message.success("删除成功");
            this.refreshMembers()
          }
        });
      });
    },
    transData(val, field) {
      if (field.topicType == 2) {
        let { options } = field.parameter;
        if(options){
          if (options.length != 0) {
            for (let option of options) {
              if (option.key === val) {
                return option.title;
              }
            }
          } else {
            return val;
          }
        }else{
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
            str += valueObj.city+"-";
          }
          str=str.slice(0, -1)
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
    deleteMember(row) {
      this.$confirm("此操作将删除档案信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$request.delete("/api/admin/member/teacher/archive", { params: { id: row.id } }).then(res => {
          if (res.success) {
            this.$message.success("档案已删除");
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
      if(this.timer){
        clearTimeout(this.timer);
        this.timer = null
      }
      this.timer=setTimeout(()=>{
        this.page.currentPage = 1;
        this.loadMembers(callback);
      },500)
    },
    loadMembers(callback) {
      this.memberSelection = [];
      this.loading = true;
      // this.$request.get("/api/admin/member/teacher/archive/list", { params: this.condition }).then(members => {
      this.$request.post("/api/admin/member/teacher/archive/list", this.condition).then(members => {
        this.memberList = members.data.list;
        this.memberTotal = members.data.total;
        this.$nextTick(()=>{ this.loading = false; })
        callback && callback();
      });
    },
  },
  created() {
    let me = this;
    me.$request.get("/api/admin/member/archive/getAllFields?type=1").then(r=>{
      let fields = r.data.sort((a, b) => {
        return a.seq > b.seq;
      });
      fields.forEach(item => {
        if (null == item.parameter) {
          item.parameter = {};
        }else {
          item.parameter = JSON.parse(item.parameter);
        }
        if (item.code == 'education') {
          item.parameter.options = me.educationList;
        }
      });
      me.showFieldListNew = fields;
      me.refreshMembers(function (){
        setTimeout(function () {
          $('.el-table__fixed-body-wrapper').each(function(){
            $(this).css({top:$(this).prev().height()})
          });
        },50);
      });
    });
    me.$request.get('/api/admin/member/archive/getAllSearchFields', {params: {type: 1}}).then(res => {
      let arr = []
      if(Array.isArray(res.data)){
        res.data.map(item => {
          let obj = {};
          switch (item.topicType) {
            case 0:
              obj.type = 1;
              obj.condition = 5;
              break;
            case 2:
              obj.type = 3;
              obj.condition = 1;
              break;
            case 5:
              obj.condition = 1;
              if (item.code=='birthday') {
                obj.specialType='birth';
              }
              obj.type = 2;
              obj.timeType=item.parameter?'yyyy':'yyyy-MM-dd';
              obj.time = item.parameter?JSON.parse(item.parameter).dateType:'date';
              break;
            case 6:
              obj.condition = 1;
              obj.type = 3
              break;
          }
          obj.key = item.code;
          obj.title = item.name;
          obj.width = 'w160';
          obj.value = ''
          arr.push(obj)
        })
      }
      this.searchList = arr.sort((r,t)=>{
        return r['type'] - t['type']
      })
    })
  },
  watch: {
    searchList:{
      deep:true,
      handler(){
        this.refreshMembers();
      }
    },
  }
};
</script>

<style lang="less" scoped>
.flexwrap{
  flex-wrap: wrap;
  .w120{
    width: 120px;
  }
  .w160{
    width: 160px!important;
  }
  .el-input{
    margin-right: 15px;
    margin-bottom: 10px;
  }
  .el-select{
    margin-right: 15px;
    width: 200px;
  }
  .el-range-editor{
    width: 250px;
  }
}
.canClick{
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
.serachInput{
  line-height: 30px;
  cursor: pointer;
  &:hover{
    color: rgb(63, 161, 182);
    transform: scale(1.05);
  }
}
</style>

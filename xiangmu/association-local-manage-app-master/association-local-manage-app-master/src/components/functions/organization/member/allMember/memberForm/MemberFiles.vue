<template>
  <div style="height:100%;" v-loading="loading">

      <div style="margin: 0 20px;position:relative;height:100%;">
        <el-container class="absolute-fill-parent flexcol">
          <div class="archivesbox">
            <el-container class="elcontainer">
              <el-header height="32px" class="elhead">
                <h5>学生档案</h5>
                <el-button class="primaryBtnClass" size="small" @click="openDia">添加档案</el-button>
              </el-header>

              <el-main class="unset-padding position-relative">
                <el-table height="100%" style="min-width: 400px;width:100%;" highlight-current-row :data="memberList" size="small" border>
                  <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
                  <template v-for="field in showFieldListNew">
                    <el-table-column :key="field.code" show-overflow-tooltip :label="field.name" :prop="field.code" min-width="150">
                      <template slot-scope="{ row }">
                        <span>{{transData(row[field.code], field)}}</span>
                      </template>
                    </el-table-column>
                  </template>
                  <el-table-column label="操作" min-width="100px" fixed="right">
                    <template slot-scope="{ $index, row }">
                      <el-button type="text" class="custom-el-button danger" size="small" @click="deleteMember(row)">解除关联</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
            </el-container>
          </div>

          <div class="archivesbox">
            <el-container class="elcontainer">
              <el-header height="32px" class="elhead">
                <h5>教职工档案</h5>
                <el-button class="primaryBtnClass" size="small" @click="openTeacherDia">添加档案</el-button>
              </el-header>

              <el-main class="unset-padding position-relative">
                <el-table height="100%" style="min-width: 400px;width:100%;" highlight-current-row :data="teacherMemberList" size="small" border>
                  <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
                  <template v-for="field in teacherShowFieldListNew">
                    <el-table-column :key="field.code" show-overflow-tooltip :label="field.name" :prop="field.code" min-width="150">
                      <template slot-scope="{ row }">
                        <span>{{transData(row[field.code], field)}}</span>
                      </template>
                    </el-table-column>
                  </template>
                  <el-table-column label="操作" min-width="100px" fixed="right">
                    <template slot-scope="{ $index, row }">
                      <el-button type="text" class="custom-el-button danger" size="small" @click="deleteTeacher(row)">解除关联</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
            </el-container>
          </div>
        </el-container>
        <!-- 学生档案 -->
        <el-dialog title="添加档案" :visible.sync="dialogVisible" width="900px" append-to-body>
          <div>
            <el-input style="width:300px;margin-bottom:20px;" v-model="searchContent" size="small" placeholder="搜索姓名/身份证号/学院/专业/学号" clearable/>
            <el-table @selection-change="handleSelectionChange" style="min-width: 400px;" highlight-current-row :data="memberList1" size="small" border>
              <el-table-column type="selection" width="55" fixed/>
              <template v-for="field in showFieldListNew">
                <el-table-column :key="field.code" show-overflow-tooltip :label="field.name" :prop="field.code" min-width="150">
                  <template slot-scope="{ row }">
                    <span>{{transData(row[field.code], field)}}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <div class="flex" style="padding: 16px 0 0;">
              <div class="flex-fill-in-the-remaining-space text-align-right">
                <el-pagination :current-page="page1.currentPage" background :page-sizes="[10, 20, 50, 100]" :page-size="page1.pageSize" :total="memberTotal1" :pager-count="5" layout="total, sizes, prev, pager, next, jumper"
                  @current-change="pageChange1" @size-change="sizeChange1">
                </el-pagination>
              </div>
            </div>
          </div>
          <div slot="footer">
            <el-button size="small" class="plainBtnClass" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" class="primaryBtnClass" :disabled="multipleSelection.length==0" @click="confirmIds">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 教师档案 -->
        <el-dialog title="添加档案" :visible.sync="teacherDialogVisible" width="900px" append-to-body>
          <div>
            <el-input style="width:300px;margin-bottom:20px;" v-model="teacherSearchContent" size="small" placeholder="搜索姓名/身份证号/单位/职务/部门" clearable/>
            <el-table @selection-change="handTeacherleSelectionChange" style="min-width: 400px;" highlight-current-row :data="teacherList1" size="small" border>
              <el-table-column type="selection" width="55" fixed/>
              <template v-for="field in teacherShowFieldListNew">
                <el-table-column :key="field.code" show-overflow-tooltip :label="field.name" :prop="field.code" min-width="150">
                  <template slot-scope="{ row }">
                    <span>{{transData(row[field.code], field)}}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <div class="flex" style="padding: 16px 0 0;">
              <div class="flex-fill-in-the-remaining-space text-align-right">
                <el-pagination :current-page="teacherPage.currentPage" background :page-sizes="[10, 20, 50, 100]" :page-size="teacherPage.pageSize" :total="teacherTotal1" :pager-count="5" layout="total, sizes, prev, pager, next, jumper"
                  @current-change="teacherPageChange1" @size-change="teacherSizeChange1">
                </el-pagination>
              </div>
            </div>
          </div>
          <div slot="footer">
            <el-button size="small" class="plainBtnClass" @click="teacherDialogVisible = false">取 消</el-button>
            <el-button size="small" class="primaryBtnClass" :disabled="teacherSelection.length==0" @click="confirmTeacherIds">确 定</el-button>
          </div>
        </el-dialog>
      </div>
  </div>
</template>

<script>
export default {
  name: "MemberFiles",
  props: {
    memberId: {
      type: String,
      default: "",
    }
  },
  watch:{
    searchContent(){
      this.refreshMembers1();
    },
    teacherSearchContent(){
      this.refreshTeacher();
    }
  },
  filters: {
    filterTime(val) {
      if (val) {
        return formatDate(new Date(val), "yyyy-MM-dd");
      } else {
        return "";
      }
    },
    filterYear(val) {
      if (val) {
        return formatDate(new Date(val), "yyyy");
      } else {
        return "";
      }
    },
    filterPlace(val) {
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
        str = str.slice(0, -1);
      }
      return str;
    },
  },
  data() {
    return {
      loading: false,
      showFieldListNew: [],
      teacherShowFieldListNew:[],
      memberList: [],
      teacherMemberList: [],

      dialogVisible:false,
      teacherDialogVisible:false,
      memberList1: [],
      teacherList1: [],
      page1: { currentPage: 1,pageSize: 10},
      teacherPage: { currentPage: 1,pageSize: 10},
      memberTotal1: 0,
      teacherTotal1: 0,
      searchContent:"",
      teacherSearchContent:"",
      multipleSelection:[],
      teacherSelection: [],
    };
  },
  methods: {
    getData(callback){
      this.loading = true;
      var condition = {memberId:this.memberId,isMemberId:true,offset:0,limit:50}
      Promise.all([
        this.$request.get("/api/admin/member/archive/list", { params: condition }),
        this.$request.get("/api/admin/member/teacher/archive/list", { params: condition }),
      ]).then(([student,teacher])=>{
        this.memberList = student.data.list;
        this.teacherMemberList = teacher.data.list;
        this.$nextTick(()=>{ this.loading = false; })
        if(callback){
          callback();
        }
      })
    },
    getStudentData(){
      this.loading = true;
      var condition = {memberId:this.memberId,isMemberId:true,offset:0,limit:50}
      this.$request.get("/api/admin/member/archive/list", { params: condition }).then(r=>{
        this.memberList = r.data.list;
        this.$nextTick(()=>{ this.loading = false; })
      })
    },
    getTeacherData(){
      this.loading = true;
      var condition = {memberId:this.memberId,isMemberId:true,offset:0,limit:50}
      this.$request.get("/api/admin/member/teacher/archive/list", { params: condition }).then(r=>{
        this.teacherMemberList = r.data.list;
        this.$nextTick(()=>{ this.loading = false; })
      })
    },
    openDia(){
      this.refreshMembers1(()=>{
        this.dialogVisible = true;
      })
    },
    openTeacherDia(){
      this.refreshTeacher(()=>{
        this.teacherDialogVisible = true;
      })
    },
    confirmIds(){
      var obj = {
        operation:1,
        memberId:this.memberId,
        archiveId:this.multipleSelection.map((item)=>item.id)
      }
      this.$request.put('/api/admin/member/v2/disassociateMemberArchive',obj).then(res=>{
        if (res.success) {
          this.getStudentData();
          this.refreshMembers1();
          this.$message.success("添加成功")
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    confirmTeacherIds(){
      var obj = {
        operation:1,
        memberId:this.memberId,
        archiveId:this.teacherSelection.map((item)=>item.id)
      }
      this.$request.put('/api/admin/member/v2/disassociateMemberTeacherArchive',obj).then(res=>{
        if (res.success) {
          this.getTeacherData();
          this.refreshTeacher();
          this.$message.success("添加成功")
        }else{
          this.$message.error(res.msg);
        }
      })
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
            return "";
          }
        }else{
          return val
        }
      }
      // if (field.topicType === 5) {
      //   if (val) {
      //     if(field.parameter&&field.parameter.dateType=="year"){
      //       return formatDate(new Date(val), "yyyy");
      //     }else{
      //       return formatDate(new Date(val), "yyyy-MM-dd");
      //     }
      //   } else {
      //     return "";
      //   }
      // }
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handTeacherleSelectionChange(val){
      this.teacherSelection= val;
    },
    deleteMember(row) {
      this.$confirm("此操作将解除关联, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var obj = {
        operation:2,
        memberId:this.memberId,
        archiveId:[row.id]
      }
      this.$request.put('/api/admin/member/v2/disassociateMemberArchive',obj).then(res=>{
        if (res.success) {
          this.getStudentData();
          this.$message.success("解除关联成功")
        }else{
          this.$message.error(res.msg);
        }
      })
      });
    },
    deleteTeacher(row) {
      this.$confirm("此操作将解除关联, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var obj = {
        operation:2,
        memberId:this.memberId,
        archiveId:[row.id]
      }
      this.$request.put('/api/admin/member/v2/disassociateMemberTeacherArchive',obj).then(res=>{
        if (res.success) {
          this.getTeacherData();
          this.$message.success("解除关联成功")
        }else{
          this.$message.error(res.msg);
        }
      })
      });
    },
    refreshMembers1(callback) {
      this.page1.currentPage = 1;
      this.loadOtherMembers(callback);
    },
    refreshTeacher(callback) {
      this.teacherPage.currentPage = 1;
      this.loadOtherTeacher(callback);
    },
    loadOtherMembers(callback) {
      this.multipleSelection = []
      var condition = {memberId:this.memberId,isMemberId:false,offset:(this.page1.currentPage - 1) * this.page1.pageSize,limit:this.page1.pageSize,searchContent:this.searchContent}
      this.$request.get("/api/admin/member/archive/list", { params: condition }).then(members => {
        this.memberList1 = members.data.list;
        this.memberTotal1 = members.data.total;
        callback&&callback()
      });
    },
    loadOtherTeacher(callback) {
      this.teacherSelection = []
      var condition = {memberId:this.memberId,isMemberId:false,offset:(this.teacherPage.currentPage - 1) * this.teacherPage.pageSize,limit:this.teacherPage.pageSize,searchContent:this.teacherSearchContent}
      this.$request.get("/api/admin/member/teacher/archive/list", { params: condition }).then(members => {
        this.teacherList1 = members.data.list;
        this.teacherTotal1 = members.data.total;
        callback&&callback()
      });
    },
    pageChange1(pageIndex) {
      this.page1.currentPage = pageIndex;
      this.loadOtherMembers();
    },
    teacherPageChange1(pageIndex) {
      this.teacherPage.currentPage = pageIndex;
      this.loadOtherTeacher();
    },
    sizeChange1(pageSize) {
      this.page1.currentPage = 1;
      this.page1.pageSize = pageSize;
      this.loadOtherMembers();
    },
    teacherSizeChange1(pageSize) {
      this.teacherPage.currentPage = 1;
      this.teacherPage.pageSize = pageSize;
      this.loadOtherTeacher();
    },
  },
  created() {
    let me = this;
    me.$request.get("/api/admin/member/archive/getAllFields?type=0").then(r=>{
      r.data.forEach(item=>{
        if(null==item.parameter){
          item.parameter={};
        }
      })
      me.showFieldListNew = r.data;
    });
    me.$request.get("/api/admin/member/archive/getAllFields?type=1").then(r=>{
      r.data.forEach(item=>{
        if(null==item.parameter){
          item.parameter={};
        }
      })
      me.teacherShowFieldListNew = r.data;
    });
    me.getData(
      function (){
        setTimeout(function () {
          $('.el-table__fixed-body-wrapper').each(function(){
            $(this).css({top:$(this).prev().height()})
          });
        },50);
      }
    );
  },
};
</script>
<style lang="less" scoped>
.elhead{
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h5{
    padding: 0 10px;
    border-left: 3px solid #28394b;
    font-size: 16px;
    font-weight: 700;
    color: #222;
    line-height: 16px;
    height: 16px;
  }
}
.flexcol{
  flex-direction: column;
  .archivesbox{
    width: 100%;
    height: 50%;
    box-sizing: border-box;
    .elcontainer{
      height: 100%;
    }
  }
  .archivesbox:first-child{
    padding-bottom: 20px;
  }
}

</style>

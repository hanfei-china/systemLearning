<template>
  <div style="height:100%;" v-loading="loading">

      <div style="margin: 0 20px;position:relative;height:100%;">
        <el-container class="absolute-fill-parent">
          <el-header height="50px" class="elhead">
            <el-button class="primaryBtnClass" size="small" @click="openDia">添加档案</el-button>
          </el-header>

          <el-main class="unset-padding position-relative">
            <el-table  style="min-width: 400px;" highlight-current-row :data="memberList" size="small" border>
              <el-table-column type="index" width="50" label="序号"></el-table-column>
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

          <el-footer class="unset-padding" height="auto">
            <div class="flex" style="padding: 16px 0;">
              <div class="flex-fill-in-the-remaining-space text-align-right">
                <el-pagination :current-page="page.currentPage" background :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize" :total="memberTotal" :pager-count="5" layout="total, sizes, prev, pager, next, jumper"
                  @current-change="pageChange" @size-change="sizeChange">
                </el-pagination>
              </div>
            </div>
          </el-footer>
        </el-container>

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
      </div>
  </div>
</template>

<script>
export default {
  name: "MemberForm",
  props: {
    userId: {
      type: String,
      default: "",
    },
    originalGroups: Array,
    educationList: Array,
    collegeList: Array,
    majorList: Array,
  },
  watch:{
    searchContent(){
      this.refreshMembers1();
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
    },
  },
  data() {
    return {
      loading: false,
      showFieldListNew: [
        {code: "name",name: "姓名",topicType: 0,parameter: {}},
        {code: "sex",name: "性别",topicType: 2,parameter: {options:[{key:"1",title:"男"},{key:"2",title:"女"}]}},
        {code: "idNumber",name: "身份证号",topicType: 0,parameter: {}},
        {code: "birthday",name: "出生日期",topicType: 5,parameter: {}},
        {code: "education",name: "学历",topicType: 2,parameter: {}},
        {code: "college",name: "学院",topicType: 0,parameter: {}},
        {code: "major",name: "专业",topicType: 0,parameter: {}},
        {code: "cless",name: "班级",topicType: 0,parameter: {}},
        {code: "studentNo",name: "学号",topicType: 0,parameter: {}},
        {code: "entranceDate",name: "入学年份",topicType: 5,parameter: {dateType:"year"}},
        {code: "graduationDate",name: "毕业年份",topicType: 5,parameter: {dateType:"year"}},
      ],
      memberList: [],
      page: { currentPage: 1,pageSize: 10},
      memberTotal: 0,

      dialogVisible:false,
      memberSelection: [],
      memberList1: [],
      page1: { currentPage: 1,pageSize: 10},
      memberTotal1: 0,
      searchContent:"",
      multipleSelection:[]
    };
  },
  methods: {
    openDia(){
      this.refreshMembers1(()=>{
        this.dialogVisible = true;
      })
    },
    confirmIds(){
      var obj = {
        operation:1,
        memberId:this.userId,
        archiveId:this.multipleSelection.map((item)=>item.id)
      }
      this.$request.put('/api/admin/member/v2/disassociateMemberArchive',obj).then(res=>{
        if (res.success) {
          this.refreshMembers();
          this.refreshMembers1();
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
    deleteMember(row) {
      this.$confirm("此操作将解除关联, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var obj = {
        operation:2,
        memberId:this.userId,
        archiveId:[row.id]
      }
      this.$request.put('/api/admin/member/v2/disassociateMemberArchive',obj).then(res=>{
        if (res.success) {
          this.refreshMembers();
          this.$message.success("解除关联成功")
        }else{
          this.$message.error(res.msg);
        }
      })
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
    refreshMembers() {
      this.page.currentPage = 1;
      this.loadMembers();
    },
    loadMembers() {
      this.loading = true;
      var condition = {memberId:this.userId,isMemberId:true}
      condition.offset = (this.page.currentPage - 1) * this.page.pageSize;
      condition.limit = this.page.pageSize;
      this.$request.get("/api/admin/member/archive/list", { params: condition }).then(members => {
        this.memberList = members.data.list;
        this.memberTotal = members.data.total;
        this.$nextTick(()=>{ this.loading = false; })
      });
    },

    refreshMembers1(callback) {
      this.page1.currentPage = 1;
      this.loadOtherMembers(callback);
    },
    loadOtherMembers(callback) {
      this.multipleSelection = []
      var condition = {memberId:this.userId,isMemberId:false,offset:(this.page1.currentPage - 1) * this.page1.pageSize,limit:this.page1.pageSize,searchContent:this.searchContent}
      this.$request.get("/api/admin/member/archive/list", { params: condition }).then(members => {
        this.memberList1 = members.data.list;
        this.memberTotal1 = members.data.total;
        callback&&callback()
      });
    },
    pageChange1(pageIndex) {
      this.page1.currentPage = pageIndex;
      this.loadOtherMembers();
    },
    sizeChange1(pageSize) {
      this.page1.currentPage = 1;
      this.page1.pageSize = pageSize;
      this.loadOtherMembers();
    },
  },
  created() {
    this.refreshMembers();
  },
};
</script>
<style lang="less" scoped>
.elhead{
  padding: 0;
}
</style>

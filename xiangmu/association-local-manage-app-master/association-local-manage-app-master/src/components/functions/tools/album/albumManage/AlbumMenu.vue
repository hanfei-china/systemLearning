<template>
  <el-container class="absolute-fill-parent">
    <el-header class="flex flex-column flex-center border-bottom" style="padding-top:10px;">
      <div class="flex">
        <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">相册主题</div>
        <div class="flex flex-column flex-center" v-if="operable">
          <el-button icon="el-icon-plus" size="mini" type="text" @click="createRole" class="unset-padding theme-color">新增主题</el-button>
        </div>
      </div>
    </el-header>
    <el-main class="unset-padding position-relative">
      <div class="absolute-fill-parent">
        <vue-scroll :ops="{ scrollPanel: { scrollingX: false } }">
          <el-menu @select="setChosenRole" class="border-right-unset custom-el-menu" :default-active="chosenRole">
            <el-menu-item v-for="role of list" :index="role.id" :key="role.id" class="cusmenuItem">
              <div class="text-overflow" style="width: 160px;">{{ role.name }}</div>
              <div class="more" v-if="role.id !== '0' && ((role.isFolder) || (role.groupType === 0))&&operable">
                <i class="el-icon-more"></i>
                <div class="editbox">
                  <p @click="openEditRole(role)">编辑</p>
                  <p @click="deleteRole(role.id)">删除</p>
                </div>
              </div>
            </el-menu-item>
          </el-menu>
        </vue-scroll>
      </div>
    </el-main>
    <el-dialog :title="roleFormTitle" :visible.sync="roleFormVisible" width="600px" append-to-body :close-on-click-modal="false" class="collegedia">
      <el-form ref="collegeForm" :model="collegeForm" :rules="collegeRules" label-width="100px">
        <el-form-item label="主题名称" size="small" prop="name">
          <el-input v-model="collegeForm.name" placeholder="请输入主题名称"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="el-icon-error" type="danger" size="small" @click="roleFormVisible = false">取消返回</el-button>
        <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
      </template>
    </el-dialog>

  </el-container>
</template>

<script>
export default {
  props:{
    operable:{
      type:Boolean,
      default:true
    }
  },
  name: "AlbumMenu",
  data() {
    return {
      list: [],
      chosenRole: "",
      roleFormVisible: false,
      roleFormTitle: "",
      roleFormId: "",
      collegeForm: {
        name: "",
      },
      collegeRules: {
        name: [ { required: true, message: "请输入主题名称", trigger: "blur" } ]
      },
      editRow:null
    };
  },
  methods: {
    openEditRole(row){
      this.collegeForm.name = row.name;
      this.roleFormTitle = "编辑主题";
      this.roleFormId = row.id;
      this.editRow = row;
      this.roleFormVisible = true;
    },
    deleteRole(id){
      this.$msgbox.confirm("删除操作是不可逆的，是否继续删除？", "提示", {
        type: "warning",
        confirmButtonText: "确认删除"
      }).then(() => {
        this.$request.delete("/api/admin/group/deleteGroup",{params: { id }}).then(() => {
          this.$message.success(`删除成功`);
          this.getList();
        });
      }).catch(() => {});
    },
    getList() {
      this.list=[{name:"全部相册",id:"0"}]
      this.$request.get("/api/admin/group/getGroup",{params: {type: "2"}}).then((res) => {
        var list = res.data.filter(item=>item.otherType!==0)
        this.list = this.list.concat(list);
        if(this.roleFormId){
          this.chosenRole = this.roleFormId;
          let role = this.list.find((item) => item.id === this.roleFormId);
          this.$emit("select", role);
        }else{
          this.chosenRole = this.list[0].id;
        }
        this.$emit("setMenuList", this.list);
      });
    },
    setChosenRole(roleId) {
      this.chosenRole = roleId;
    },
    createRole() {
      this.roleFormTitle = "新增主题";
      this.roleFormId = "";
      this.roleFormVisible = true;
      this.collegeForm.name = "";
    },
    submitData() {
      this.$refs["collegeForm"].validate(valid=>{
        var params ={
          name:this.collegeForm.name,
          type:"2",
          isFolder: true,
        }
        if(valid){
          if(this.roleFormId){
            params.id = this.roleFormId;
            params.seq = this.editRow.seq;
            this.$request.put("/api/admin/group/updateGroup", params).then(() => {
              this.getList();
              this.roleFormVisible = false;
              this.$message.success("主题修改成功");
            });
          }else{
            if(this.list.length>0&&this.list[this.list.length-1].seq){
              params.seq=this.list[this.list.length-1].seq+1
            }else{
              params.seq=1
            }
            this.$request.post("/api/admin/group/addGroup", params).then(() => {
              this.getList();
              this.roleFormVisible = false;
              this.$message.success("主题创建成功");
            });
          }
        }
      })
    },
  },
  created() {
    this.getList();
  },
  watch: {
    chosenRole(val) {
      let role = this.list.find((item) => item.id === val);
      this.$emit("select", role);
    },
  },
};
</script>
<style lang="less" scoped>
.cusmenuItem {
  line-height: 40px;
  height: 40px;
  color: #8f9399;
  .more {
    z-index: 99;
    position: absolute;
    right: 0;
    top: 0;
    display: none;
    text-align: center;
    width: 25px;
    i {
      transform: rotate(90deg);
    }
    .editbox {
      position: absolute;
      border: 1px solid #e4e4e4;
      background: white;
      right: 0;
      top: 34px;
      z-index: 100;
      padding: 0 3px;
      display: none;
      p {
        color: #999999;
        line-height: 20px;
        margin: 0;
        font-size: 12px;
      }
      p:hover {
        color: #409eff;
      }
    }
  }
  .more:hover .editbox {
    display: block;
  }
}

.custom-el-menu .cusmenuItem.is-active .more {
  display: block;
}
.custom-el-menu /deep/.el-submenu__title {
  height: 40px;
  line-height: 40px;
}
.collegedia /deep/.el-dialog__body{
  padding: 30px 40px 30px 20px;
}
.posirela{
  position: relative;
  .addmanage{
    position: absolute;
    top: 9px;
    right: -20px;
    cursor: pointer;
  }
}
</style>

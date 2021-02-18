<template>
  <div class="addBranch">
    <div class="addBranchHeader">
      <div class="addBranchHeader-left">新建分会</div>
      <div>
        <el-button size="small" @click="$emit('close')">关闭</el-button>
        <el-button
            size="small"
            style="background-color: #3FA1B6;color:#fff;"
            @click="submitAddBranch"
        >保存
        </el-button>
      </div>
    </div>
    <!-- 分会基本信息 -->
    <div class="addBranchForm">
      <div class="addBranchForm-header">基本信息</div>
      <div class="addBranchForm-info">
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">
            <span style="color:red;marginRight:3px;">*</span>分会类型：
          </div>
          <div class="addBRanchForm-info__itemRight">
            <el-select v-model="addBranchForm.branchClass" size="small" placeholder="请选择分会类型">
              <el-option
                  v-for="item in branchList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">
            <span style="color:red;marginRight:3px;">*</span>分会名称：
          </div>
          <div class="addBRanchForm-info__itemRight">
            <el-input
                v-model="addBranchForm.name"
                size="small"
                placeholder="请输入分会名称"
                style="width:215px;"
            ></el-input>
          </div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">分会所在地：</div>
          <div class="addBRanchForm-info__itemRight">
            <el-cascader
                v-model="addBranchForm.address"
                placeholder="请选择所在地"
                separator="-"
                :props="lazyAreas"
                size="small"
                clearable
            ></el-cascader>
          </div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">分会负责人：</div>
          <div class="addBRanchForm-info__itemRight">
            <el-input
                v-model="addBranchForm.responsibility"
                size="small"
                placeholder="请输入分会负责人"
                style="width:215px;"
            ></el-input>
          </div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">联系电话：</div>
          <div class="addBRanchForm-info__itemRight">
            <el-input
                v-model="addBranchForm.contactPhone"
                size="small"
                placeholder="请输入联系电话"
                style="width:215px;"
            ></el-input>
          </div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">分会联系人：</div>
          <div class="addBRanchForm-info__itemRight">
            <el-input
                v-model="addBranchForm.contactPerson"
                size="small"
                placeholder="请输入分会联系人"
                style="width:215px;"
            ></el-input>
          </div>
        </div>
        <!-- <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">所属院系：</div>
          <div class="addBRanchForm-info__itemRight">
            <el-select
              v-model="addBranchForm.collegeName"
              size="small"
              clearable
              placeholder="请选择所属院系"
            >
              <el-option
                v-for="item in colleageList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
        </div> -->
        <div v-if="addBranchForm.branchClass==='5505252D543C4BEB83890B212E146FA5'" class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">所属行业：</div>
          <div class="addBRanchForm-info__itemRight">
            <el-select
                v-model="addBranchForm.industry"
                clearable
                size="small"
                placeholder="请选择所属行业"
            >
              <el-option
                  v-for="item in industryList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.title"
              ></el-option>
              <!-- <el-option label="区域二" value="beijing"></el-option> -->
            </el-select>
          </div>
        </div>
        <div class="addBRanchForm-info__item">
          <div class="addBRanchForm-info__itemLeft">分会管理员：</div>
          <el-select
              remote
              :remote-method="remoteMethod"
              v-model="addBranchForm.branchManagerIds"
              filterable
              multiple
              placeholder="请选择分会管理员"
              class="addBRanchForm-info__itemRight"
              size="small"
          >
            <el-option
                v-for="item in allManagers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
            <template slot="empty">
              <div class="searchNoManager" @click="addManagerClick">没有查询到此管理者，点击添加管理者</div>
            </template>
          </el-select>
          <div class="addBRanchForm-textarea__itemIcon">
            <span class="el-icon-circle-plus-outline" @click="addManagerVisible=true"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分会介绍 -->
    <div class="addBranchForm">
      <div class="addBranchForm-header">分会介绍</div>
      <div class="addBranchForm-textarea">
        <div class="addBranchForm-textarea__item">
          <div class="addBRanchForm-textarea__itemLeft">分会简介：</div>
          <el-input
              type="textarea"
              resize="none"
              rows="6"
              placeholder="请输入内容"
              class="addBRanchForm-textarea__itemRight"
              v-model="addBranchForm.introduce"
          ></el-input>
        </div>
      </div>
      <div class="addBranchForm-textarea">
        <div class="addBranchForm-textarea__item">
          <div class="addBRanchForm-textarea__itemLeft">分会宣传文案：</div>
          <editor style="width:650px;" v-model="addBranchForm.content" ref="editor"></editor>
        </div>
      </div>
    </div>
    <el-dialog
        title="添加管理者"
        :visible.sync="addManagerVisible"
        append-to-body
        width="700px"
        :close-on-click-modal="false"
    >
      <el-form
          ref="addManagerForm"
          :model="addManagerForm"
          :rules="addManagerRules"
          label-width="120px"
          before-close="closeManagerDialog"
      >
        <el-form-item label="姓名" size="small" style="width:500px;" prop="name">
          <el-input v-model="addManagerForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="small" style="width:500px;">
          <el-select v-model="addManagerForm.sex" placeholder="请选择性别" style="width:380px;">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" size="small" style="width:500px;">
          <el-input v-model="addManagerForm.telephone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" size="small" style="width:500px;">
          <el-input v-model="addManagerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="登陆用户名" size="small" style="width:500px;" prop="loginName">
          <el-input v-model="addManagerForm.loginName" placeholder="请输入用户登录名"></el-input>
        </el-form-item>
        <el-form-item label="密码" size="small" style="width:500px;" prop="password">
          <el-input v-model="addManagerForm.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" size="small" style="width:500px;" prop="deptId">
          <el-input v-model="addManagerForm.deptId" placeholder="请再次输入密码" show-password></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button type="primary" @click="sureAddManager">确定</el-button>
        <el-button @click="cancleAddManager">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import editor from "../../../util/editor/Editor";
import cities from "./util/city";

export default {
  name: "addBranch",
  components: {editor},
  props: ["branchForm"],
  data() {
    return {
      addBranchForm: {
        branchClass: "",
        name: "",
        address: "",
        contactPerson: "",
        contactPhone: "",
        industry: "",
        branchManagerIds: [],
        introduce: "",
        content: "",
        responsibility: ""
      },
      industryList: [],
      cities: [],
      allManagers: [],
      //   managerOptions: [],
      loading: false,
      branchList: [],
      colleageList: [],
      addManagerVisible: false,
      addManagerForm: {
        name: "",
        sex: "",
        telephone: "",
        email: "",
        loginName: "",
        password: "",
        deptId: ""
      },
      addManagerRules: {
        name: [
          {required: true, message: "请输入管理者姓名", trigger: "blur"}
        ],
        loginName: [
          {required: true, message: "请输入登录用户名", trigger: "blur"}
        ],
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
        deptId: [{required: true, message: "请确认密码", trigger: "blur"}]
      },
      timer: null
    };
  },
  computed: {
    lazyAreas() {
      return {
        checkStrictly: true,
        lazy: true,
        lazyLoad: this.lazyLoad,
      }
    },
  },
  created() {
    if (this.branchForm) {
      this.dataProcess();
    }
    this.cities = cities;
    this.getallManagers();
    this.getIndustryList();
    this.getBranchList();
    this.getColleageList();
  },
  methods: {
    lazyLoad(node, resolve) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getArea(node, resolve)
      },500)
    },
    getArea(node, resolve) {
      let params = {};
      if (node.level === 0) {
        params.level = 0
      } else {
        params.parentId = node.data.parentId
      }
      this.$request.get('/api/common/anon/worldArea', {
        params: params
      }).then(res => {
        if (res.success) {
          const nodes = res.data.map(item => ({
            value: item.name,
            label: item.name,
            parentId: item.id,
            leaf: node.level >= 2
          }))
          resolve(nodes)
        }

      })
    },
    //数据处理
    dataProcess() {
      this.addBranchForm = {
        branchClass: this.branchForm.branchClass,
        name: this.branchForm.name,
        address: JSON.parse(this.branchForm.address),
        contactPerson: this.branchForm.contactPerson,
        contactPhone: this.branchForm.contactPhone,
        industry: this.branchForm.industry,
        branchManagerIds: [],
        introduce: this.branchForm.introduce,
        content: this.branchForm.content,
        responsibility: this.branchForm.responsibility,
        id: this.branchForm.id
      };
      this.branchForm.managers.forEach(item => {
        this.addBranchForm.branchManagerIds.push(item.id);
      });
    },
    sureAddManager() {
      this.$refs["addManagerForm"].validate(valid => {
        if (valid) {
          //判断密码和确认密码是否相同
          if (this.addManagerForm.password !== this.addManagerForm.deptId) {
            this.$message({
              message: "确认密码和密码不相符，请重新输入",
              type: "warning"
            });
            return false;
          }
          this.addManagerForm.deptId = '';
          this.$request
              .post("/api/admin/account", this.addManagerForm)
              .then(res => {
                // console.log(res);
                if (res.success) {
                  this.addManagerVisible = false;
                  this.addBranchForm.branchManagerIds.push(res.data);
                  this.getallManagers();
                  this.addManagerForm = {
                    name: "",
                    sex: "",
                    telephone: "",
                    email: "",
                    loginName: "",
                    password: "",
                    deptId: ""
                  };
                }
              });
        } else {
          return false;
        }
      });
    },
    //点击添加管理者
    addManagerClick() {
      this.addManagerVisible = true;
    },
    //搜索管理者时触发的事件
    remoteMethod(keyword) {
      this.$request
          .get("/api/admin/account/list", {
            params: {
              keyword,
              isNeed: 1
            }
          })
          .then(res => {
            this.allManagers = res.data.list;
            if (this.allManagers.length === 0) {
              this.addManagerForm.name = keyword;
            }
          });
    },
    //点击取消添加管理者按钮
    cancleAddManager() {
      this.addManagerVisible = false;
      this.addManagerForm = {
        name: "",
        sex: "",
        telephone: "",
        email: "",
        loginName: "",
        password: "",
        deptId: ""
      };
    },
    //获取分会管理员
    getallManagers() {
      this.$request
          .get("/api/admin/account/list", {
            params: {
              keyword: "",
              isNeed: 1
            }
          })
          .then(res => {
            this.allManagers = res.data.list;
          });
    },
    //获取行业列表
    getIndustryList() {
      this.$request
          .get("/api/admin/organization/category/listOrganizationCategory")
          .then(res => {
            this.industryList = JSON.parse(JSON.stringify(res.data));
          });
    },
    //获取分会类型
    getBranchList() {
      this.$request
          .get("/api/common/branch/branchListAndBranchType")
          .then(res => {
            this.branchList = JSON.parse(JSON.stringify(res.data));
          });
    },
    //获取学院列表
    getColleageList() {
      this.$request.get("/api/admin/branch/getCollegeList").then(res => {
        // console.log(res);
        this.colleageList = JSON.parse(JSON.stringify(res.data));
      });
    },
    //新增分会
    submitAddBranch() {
      if (!this.addBranchForm.branchClass) {
        this.$message({
          message: "请选择分会类型",
          type: "warning"
        });
        return;
      }
      if (!this.addBranchForm.name) {
        this.$message({
          message: "请输入分会名称",
          type: "warning"
        });
        return;
      }
      if (this.addBranchForm.address && this.addBranchForm.address.length > 0) {
        this.addBranchForm.address = JSON.stringify(this.addBranchForm.address);
      } else {
        this.addBranchForm.address = null;
      }
      if (this.branchForm) {
        this.$request.put('/api/admin/branch', this.addBranchForm).then(res => {
          if (res.success) {
            this.$emit("close", true);
          }
        })
      } else {
        this.$request
            .post("/api/admin/branch", this.addBranchForm)
            .then(res => {
              //   console.log(res);
              if (res.success) {
                this.$emit("close", true);
              }
            });
      }
    }
  },
  mounted() {
    setInterval(function () {
      document.querySelectorAll('.el-cascader-node__label').forEach(el => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click()
        }
      })
    }, 1000)
  }
};
</script>
<style lang="less" >
.el-cascader-node>.el-radio {
  display: none;
}
</style>
<style lang="less" scoped>
.addBranch {
  .addBranchHeader {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    border-bottom: 1px solid #e6e6e6;
    align-items: center;

    .addBranchHeader-left {
      font-size: 16px;
      color: #222222;
      padding-left: 6px;
      border-left: 3px solid #28394b;
      height: 16px;
      line-height: 16px;
    }
  }

  .addBranchForm {
    padding: 0 20px;
    border-bottom: 1px dashed #e6e6e6;
    padding-bottom: 20px;

    .addBranchForm-header {
      padding: 20px 0;
      font-size: 14px;
      line-height: 14px;
      font-weight: 600;
    }

    .addBranchForm-info {
      //   padding-left: 20px;
      display: flex;
      flex-wrap: wrap;
      width: 900px;

      .addBRanchForm-info__item {
        margin-right: 100px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        &:nth-child(2n) {
          margin-right: 0;
        }

        .addBRanchForm-info__itemLeft {
          width: 120px;
          text-align: right;
        }

        .addBRanchForm-info__itemRight {
          width: 215px;
        }

        .addBRanchForm-textarea__itemIcon {
          font-size: 16px;
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }

    .addBranchForm-textarea {
      width: 900px;

      .addBranchForm-textarea__item {
        display: flex;
        margin-bottom: 20px;

        .addBRanchForm-textarea__itemLeft {
          width: 120px;
          text-align: right;
        }

        .addBRanchForm-textarea__itemRight {
          width: 650px;
        }
      }
    }
  }
}

.searchNoManager {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 34px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
}

.addManagerForm {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

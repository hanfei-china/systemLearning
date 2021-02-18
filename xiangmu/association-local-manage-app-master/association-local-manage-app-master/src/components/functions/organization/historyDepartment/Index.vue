<template>
  <el-container class="absolute-fill-parent background-color-white memberTypeContainer">
    <el-aside class="border-right" width="300px">
      <div class="treebox">
        <div class="yearbox">
          <el-date-picker style="width:100%;" size="mini" @change="yearChange" :clearable="false" value-format="yyyy" v-model="year" type="year" placeholder="选择年"></el-date-picker>
        </div>
        <el-input class="filterinp" size="mini" placeholder="请输入关键字" v-model="filterText"></el-input>
        <div style="text-align:right;margin-top:5px;">
          <el-popover placement="bottom-start" trigger="hover" width="80" popperClass="cuspopclass" v-model="popVisible">
            <el-button @click="addNew('college')" size="mini" type="text">新增学院</el-button><br />
            <el-button @click="addNew('major')" size="mini" type="text">新增专业</el-button>
            <el-button slot="reference" size="mini" type="text"><i class="el-icon-plus">新增</i></el-button>
          </el-popover>
        </div>
        <el-tree @node-click="nodeClick" :expand-on-click-node="false" node-key="id" :data="data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" draggable :highlight-current="!!currentNode"
          ref="tree" :allow-drop="allowDrop">
          <span slot-scope="{ node, data }" :class="node.data.level==1?'collegeitem':''">
            <i :class="node.data.level==1?'iconfont icon-xueyuan':'iconfont icon-zhuanye'"></i> {{ node.label }}
          </span>
        </el-tree>
      </div>
    </el-aside>
    <el-main class="position-relative unset-padding">
      <div class="formbox">
        <el-button-group style="margin-bottom:30px;">
          <el-button @click="saveItem" size="mini" icon="el-icon-circle-check">保存</el-button>
          <el-button :disabled="!currentNode" @click="deleteItem" size="mini" icon="el-icon-remove-outline">删除</el-button>
          <el-button @click="batchImportVisible=true" size="mini" icon="el-icon-upload">导入</el-button>
          <el-button @click="downLoad" size="mini" icon="el-icon-upload">导出</el-button>
        </el-button-group>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
          <el-form-item label="代码" prop="code">
            <el-input v-model="form.code" @blur="findCollege" :disabled="!!currentNode"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="学院" prop="parentCode" v-if="addType=='major'">
            <el-select v-model="form.parentCode" placeholder="请选择学院" clearable>
              <el-option v-for="(item,index) in data" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学历" v-if="addType=='major'" prop="extend">
            <el-select v-model="form.extend" placeholder="请选择学历" clearable>
              <el-option v-for="(item,index) in educationList" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="现属学院" prop="currentCollegeId" v-if="addType=='major'">
            <el-select v-model="form.currentCollegeId" placeholder="请选择现属学院" clearable>
              <el-option v-for="(item,index) in collegeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-main>

    <member-batch-import @queryTable="getTree" @refresh-members="getTree" :visible.sync="batchImportVisible" title="历史院系导入"></member-batch-import>
  </el-container>
</template>

<script>
import { exportExcel } from "../../../../js/util/exportFile";
import MemberBatchImport from "@/components/functions/organization/member/allMember/import/excel/MemberBatchImport";
export default {
  components: { MemberBatchImport },
  data() {
    let year = String(new Date().getFullYear());
    return {
      year,
      filterText: "",
      currentNode: null,
      form: {
        code: "",
        name: "",
        parentCode: "",
        extend: "",
        currentCollegeId: "",
      },
      data: [],
      defaultProps: {
        children: "subNodes",
        label: "name",
      },
      educationList: [],
      collegeList: [],
      rules: {
        code: [
          {
            required: true,
            message: "请输入代码",
            trigger: ["blur", "change"],
          },
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: ["blur", "change"],
          },
        ],
        parentCode: [
          {
            required: true,
            message: "请选择学院",
            trigger: ["blur", "change"],
          },
        ],
        extend: [
          {
            required: false,
            message: "请选择学历",
            trigger: ["blur", "change"],
          },
        ],
      },
      addType: "college",
      popVisible: false,
      batchImportVisible: false,
    };
  },
  methods: {
    addNew(type) {
      this.addType = type;
      this.currentNode = null;
      this.popVisible = false;
      this.$refs.form.resetFields();
      this.form.currentCollegeId = "";
    },
    saveItem() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          var node = Object.assign({}, this.form);
          node.year = this.year;
          if (this.currentNode) {
            this.$request.put("/api/admin/college/history", node).then(() => {
              this.getTree();
              this.$message.success(`修改成功`);
            });
          } else {
            this.$request.post("/api/admin/college/history", node).then(() => {
              this.getTree();
              this.$message.success(`新增成功`);
            });
          }
        } else {
          return false;
        }
      });
    },
    findCollege() {
      if (this.addType == "college") {
        var obj = this.collegeList.find((item) => item.key == this.form.code);
        if (obj && obj.currentKey) {
          this.form.currentCollegeId = obj.currentKey;
        } else {
          this.form.currentCollegeId = "";
        }
      }
    },
    deleteItem() {
      this.$msgbox
        .confirm("删除操作是不可逆的，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除",
        })
        .then(() => {
          this.$request
            .delete("/api/admin/college/history", {
              params: { code: this.currentNode.code, year: this.year },
            })
            .then(() => {
              this.getTree();
              this.$message.success(`删除成功`);
            });
        })
        .catch(() => {});
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    nodeClick(a, b, c) {
      this.currentNode = a;
      for (const key in this.form) {
        this.form[key] = a[key];
      }
      if (b && b.level == 2) {
        this.form.parentCode = b.parent.data.code;
        this.$request.get("/api/admin/college/history/currentCollege",{ params:{majorCode:a.code} }).then((res) => {
          this.form.currentCollegeId = res.data?res.data.id:'';
        });
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level == 1) {
        if (dropNode.level == 1) {
          return type !== "inner";
        } else {
          return false;
        }
      } else if (draggingNode.level == 2) {
        if (
          dropNode.level == 2 &&
          draggingNode.parent.id == dropNode.parent.id
        ) {
          return type !== "inner";
        } else {
          return false;
        }
      }
    },
    yearChange() {
      this.getTree();
    },
    getTree() {
      this.$request.get("/api/admin/college/history/year/" + this.year).then((res) => {
        if (res.data) {
          this.data = res.data.subNodes;
        } else {
          this.data = [];
          this.currentNode = null;
          this.$refs.form.resetFields();
        }
        this.$request.get("/api/admin/college/getCollegeList").then((res) => {
          this.collegeList = res.data;
          if (this.data.length) {
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.data[0].id);
              this.nodeClick(this.data[0]);
            });
          }
        });
      });
    },
    downLoad(){
      this.$request
        .post("/api/admin/college/history/exportCollegeExcel",{},{
          responseType: "blob"
        })
        .then(resp => {
          exportExcel(resp);
        });
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    currentNode: {
      handler(val) {
        if (val) {
          if (val.level == 1) {
            this.addType = "college";
          } else {
            this.addType = "major";
          }
        }
      },
    },
  },
  created() {
    this.getTree();
    this.$request
      .get("/api/common/associator/historyCollege/educations")
      .then((res) => {
        this.educationList = res.data;
      });
  },
};
</script>
<style lang="less" scoped>
.treebox {
  padding: 10px;
  .yearbox {
    display: flex;
    align-items: center;
  }
  .filterinp {
    margin-top: 10px;
  }
  .collegeitem {
    font-weight: bold;
  }
  // /deep/.is-current{
  //     .el-tree-node__content{
  //         background: #66b1ff;
  //     }
  // }
}
.formbox {
  padding: 10px 20px;
  width: 500px;
  .el-select {
    display: block;
  }
}
</style>
<style lang="less" scoped>
.cuspopclass {
  min-width: 50px;
}
</style>

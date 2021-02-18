<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-header class="flex flex-column flex-center border-bottom" style="padding-top:10px;">
      <div class="flex">
        <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">所有分组</div>
        <div class="flex flex-column flex-center" v-if="operable">
          <el-button icon="el-icon-plus" size="mini" type="text" @click="addFolder" class="unset-padding theme-color">新增分组</el-button>
        </div>
      </div>
    </el-header>

    <el-main class="unset-padding position-relative" v-loading="loading">
      <div class="absolute-fill-parent">
        <vue-scroll :ops="{scrollPanel : {scrollingX : true}, bar : {keepShow : true}}">
          <div style="padding: 10px 0;">
            <el-tree ref="tree" highlight-current :props="treeProps" @current-change="currentChange" :data="groupList" node-key="id" :expand-on-click-node="false" draggable @node-drop="handleDrop" :allow-drop="allowDrop" :allow-drag="allowDrag" @node-expand="nodeExpand" @node-collapse="nodeCollapse" :default-expanded-keys="expandedList">
              <div class="flex flex-fill-in-the-remaining-space" slot-scope="{ node, data }">
                <i v-if="data.isFolder" class="el-icon-folder" style="margin-right: 5px;line-height: 19px;"></i>
                <i v-if="data.groupType === 0" class="el-icon-video-pause" style="margin-right: 5px;line-height: 19px;"></i>
                <el-tooltip effect="dark" :content="node.label" placement="bottom">
                  <div class="flex-fill-in-the-remaining-space text-overflow" style="width: 80px;">
                    {{ node.label }}
                  </div>
                </el-tooltip>
                <div v-if="data.id !== '0' && operable && data.otherType!==0 && ((data.isFolder) || (data.groupType === 0))" style="padding-right: 6px;"
                  :style="{display: treeNodeVisibleId === data.id || chosenKey === data.id ?'block':'none'}">
                  <el-button type="text" class="custom-el-button unset-padding" size="mini" icon="el-icon-edit" @click="editGroup(data.id, data.groupType)" />
                  <el-button style="margin-left: 6px;" :disabled="(data.isFolder || data.groupType === 0 || data.groupType === 1) && (data.children.length > 0 || data.memberNum > 0)" type="text"
                    @click="deleteGroup(data.id)" class="custom-el-button unset-padding danger" size="mini" icon="el-icon-delete" />
                </div>
              </div>
            </el-tree>
          </div>
        </vue-scroll>
      </div>
    </el-main>

    <el-dialog :title="formTitle" :visible.sync="formVisible" append-to-body width="800px" :close-on-click-modal="false">
      <group-form v-if="formVisible" :id="formId" @refresh="refreshList" :max-level="maxLevel" :describable="describable" @close="formVisible = false" :type-name="typeName" :groupList="groupList" :parent-id="formParentId" :seq="formSeq"
        :groupType="groupType" :isFolder="isFolder" :groupInfoType="groupInfoType" />
    </el-dialog>

  </el-container>
</template>

<script>
import GroupForm from "./GroupForm";

export default {
  name: "GroupList",
  components: { GroupForm },
  props: {
    chosenGroup: Object,
    typeName: String,
    groupType: String,
    title: {
      type: String,
      default: "所有分组",
    },
    allGroup: {
      type: String,
      default: "所有分组",
    },
    hasAll: {
      type: Boolean,
      default: true,
    },
    maxLevel: {
      type: Number,
      default: null,
    },
    operable: {
      type: Boolean,
      default: true,
    },
    describable: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: "chosenGroup",
    event: "change",
  },
  computed: {
    allNode() {
      if (this.hasAll) {
        return [
          {
            id: this.rootId,
            name: this.allGroup,
            parentId: null,
            createuser: "",
            createTime: 1573110741000,
            modifyUser: "",
            modifyTime: "",
            seq: -1,
            isUsed: "",
            type: "",
            memberNum: 1,
            children: [],
            otherType: null,
          },
        ];
      } else {
        return [];
      }
    },
  },
  data() {
    return {
      rootId: "0",
      chosenKey: "0",

      groupList: [],
      treeProps: {
        label: "name",
      },
      expandedList:[],
      formTitle: "",
      formVisible: false,
      formId: "",
      formParentId: null,
      formSeq: 0,

      nodeIds: [],

      chosenNode: null,
      loading: true,

      isFolder: null, //创建文件夹或分组
      parentFolder: null, //创建分组或文件夹的上一级是否是文件夹

      createItems: [
        {
          id: -1,
          title: "文件夹",
        }
      ], //选择创建文件夹还是分组
      groupInfoType: null, //创建的分组类型

      treeNodeVisibleId: "",
    };
  },
  methods: {
    nodeExpand(data) {
      this.expandedList.push(data.id); // 在节点展开是添加到默认展开数组
    },
    nodeCollapse(data) {
      this.expandedList.splice(this.expandedList.indexOf(data.id), 1); // 收起时删除数组里对应选项
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.id === this.rootId) {
        if (
          draggingNode.data.parentId === null ||
          draggingNode.data.parentId === undefined
        ) {
          return type !== "inner" && type !== "prev";
        } else {
          return false;
        }
      } else {
        if (draggingNode.data.parentId === dropNode.data.parentId) {
          return type !== "inner";
        } else {
          return false;
        }
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.id !== this.rootId;
    },
    handleDrop() {
      if (this.nodeIds && this.nodeIds.length === 0) {
        this.getNodeId(this.groupList);
      } else {
        this.nodeIds = [];
        this.getNodeId(this.groupList);
      }

      // this.$request
      //   .post("/api/admin/group/orderGroup", null, {
      //     params: { ids: this.nodeIds.reverse() },
      //   })
      //   .then((res) => {
      //     if (res.success) {
      //       this.getGroupList();
      //     }
      //   });

      let ids = this.nodeIds.reverse()
      this.$request.post("/api/admin/group/orderGroup", {ids},{
        newHeader:{
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With":"XMLHttpRequest"
        },serialize:true
      }).then((res) => {
        if (res.success) {
          this.getGroupList();
        }
      });
    },
    getNodeId(list) {
      for (let item of list) {
        this.nodeIds.push(item.id);
        if (item.children && item.children.length > 0) {
          this.getNodeId(item.children);
        }
      }
    },

    getGroupList(sortable) {
      this.loading = true;
      this.$request.get("/api/admin/group/getGroup", { params: { type: this.groupType } }).then((res) => {
        var list = res.data.filter(item=>item.otherType!==0)
        this.groupList = this.allNode.concat(list);
        this.$nextTick(()=>{
          this.$refs.tree.setCurrentKey(this.chosenKey);
          this.currentChange(this.$refs.tree.getCurrentNode());
         })
        this.$emit("setMenuList", this.groupList);
        this.$nextTick(()=>{ this.loading = false; })
      });
      // if (sortable) {
      //   this.handleDrop();
      // }

    },
    refreshList() {
      this.getGroupList(true);
    },

    //获取选中分组信息
    getGroupInfo(val) {
      if (this.formParentId) {
        this.$request
          .get("/api/admin/group/getGroup", {
            params: { id: this.formParentId, operate: 0, type: this.groupType },
          })
          .then((resp) => {
            let data = resp.data[0];
            this.parentFolder = data.isFolder;
            this.handleCreate(val);
          });
      } else {
        this.parentFolder = true;
        this.handleCreate(val);
      }
    },
    //新建分组或文件夹
    handleCreate(val) {
      if (this.parentFolder) {
        if (this.groupInfoType === -1) {
          this.isFolder = true;
          this.formTitle = "新增文件夹";
        } else {
          this.isFolder = false;
          this.formTitle = `新增${val.title}`;
        }
        this.formId = "";
        this.formVisible = true;
      } else {
        if (this.groupInfoType === -1) {
          this.$message.warning("新建文件夹的上一级不能是分组");
          return;
        } else {
          this.isFolder = false;
          this.formTitle = `新增${val.title}`;
          this.formId = "";
          this.formVisible = true;
        }
      }
    },
    addFolder() {
      var val = this.createItems[0];
      this.groupInfoType = val.id;
      this.getGroupInfo(val);
    },
    editGroup(formId, groupType) {
      let groupTypeName = null;
      if (groupType === 0) {
        groupTypeName = "静态分组";
      } else if (groupType === 1) {
        groupTypeName = "条件分组";
      } else if (groupType === 2) {
        groupTypeName = "枚举分组";
      } else if (groupType === 3) {
        groupTypeName = "标签分组";
      } else {
        groupTypeName = "文件夹";
      }
      this.formTitle = `编辑${this.typeName}信息-${groupTypeName}`;
      this.formId = formId;
      this.formParentId = "";
      this.formVisible = true;
    },
    deleteGroup(formId) {
      this.$confirm(`此操作将永久删除该${this.typeName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request
            .delete("/api/admin/group/deleteGroup", {
              params: {
                id: formId,
              },
            })
            .then((res) => {
              if (res.success) {
                this.$message.success("删除成功");
                this.chosenKey = "0"
                this.getGroupList(true);
              }
            });
        })
        .catch(() => {});
    },
    currentChange(data, node) {
      this.chosenNode = node;
      let { id } = data;
      this.chosenKey = data.id;
      // if (!data.memberNum || data.memberNum < 1) {
        this.formParentId = id === this.rootId ? null : id;
      // } else {
      //   this.formParentId = null;
      // }

      this.$emit("change", data);
    },
  },
  created() {
    this.getGroupList();
  },
};
</script>

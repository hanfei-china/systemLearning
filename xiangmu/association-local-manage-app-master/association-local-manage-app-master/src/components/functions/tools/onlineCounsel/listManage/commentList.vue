<template>
  <el-container style="padding: 0 16px 16px;" class="absolute-fill-parent background-color-white">
    <el-header class="unset-padding flex flex-column flex-center">
      <div class="flex">
        <div class="flex-fill-in-the-remaining-space flex">
          <el-input
            style="width: 300px;"
            size="small"
            v-model="formInfo.content"
            clearable
            placeholder="输入内容或手机号进行搜索"
          />
        </div>
        <!-- <div >
                    <el-button size="small" type="primary" @click="newClass">新增分类</el-button>
        </div>-->
      </div>
    </el-header>
    <el-main class="unset-padding position-relative">
      <el-draggable-table
        :list="list"
        :el-table-props="elTableProps"
        class="custom-el-table header-gray"
        :options="dragOptions"
        dragSelector="tbody"
        @end="sort"
      >
        <el-table-column
          class-name="item-un-sort"
          type="index"
          align="center"
          label="序号"
          width="80"
        />
        <!-- <el-table-column
          class-name="item-un-sort"
          label="联系人ID"
          prop="id"
          show-overflow-tooltip
          width="300px"
        /> -->
        <el-table-column class-name="item-un-sort" label="工号" width="200px">
          <template slot-scope="{row}">{{row.jobNumber}}</template>
        </el-table-column>
        <el-table-column class-name="item-un-sort" label="项目编号" width="200px">
          <template slot-scope="{row}">{{row.projectNumber}}</template>
        </el-table-column>
        <el-table-column class-name="item-un-sort" label="留言内容" show-overflow-tooltip>
          <template v-slot="{row}">
            <span v-hyperlink="{innerHtml:row.content}" />
          </template>
        </el-table-column>
        <el-table-column class-name="item-un-sort" label="留言时间" width="200px">
          <template slot-scope="{row}">{{row.createTime | yyyyMMddHHmm}}</template>
        </el-table-column>
        <el-table-column
          class-name="item-un-sort"
          label="联系方式"
          show-overflow-tooltip
          prop="telphone"
          width="200px"
        />
        <!-- <el-table-column label="操作" width="180px">
                    <template slot-scope="{row}">
                        <el-button class="custom-el-button unset-padding item-un-sort" type="text"
                                   @click="editClass(row)">编辑</el-button>
                        <el-button class="custom-el-button danger unset-padding item-un-sort" type="text"
                                   @click="deleteClass(row)">删除</el-button>
                        <el-button class="custom-el-button unset-padding item-sort" type="text" >排序</el-button>
                    </template>
        </el-table-column>-->
      </el-draggable-table>
    </el-main>
    <div style="display:flex;justifyContent:center;padding-top:16px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 20, 50]"
        :page-size="formInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </el-container>
</template>

<script>
import ElDraggableTable from "../../../../util/elTableDraggable/ElDraggableTable";
export default {
  name: "commentList",
  components: { ElDraggableTable },
  data() {
    return {
      list: [],
      title: "",

      classFormVisible: false,
      classFormTitle: "",
      classFormInfo: {
        title: "",
        description: "",
        id: ""
      },
      dragOptions: {
        filter: ".item-un-sort",
        draggable: ".el-table__row",
        animation: 150
      },
      elTableProps: {
        height: "100%",
        size: "small",
        border: true,
        stripe: true
      },
      formInfo: {
        content: "",
        sort: 2,
        limit: 5,
        offset: 0
      },
      total:0
    };
  },
  methods: {
    sort() {
      let ids = [];
      for (let item of this.list) {
        ids.push(item.id);
      }

      this.$request.put("/api/admin/onlineFormClass/sort", { ids }).then(() => {
        this.$message.success("分类排序成功");
      });
    },
    getList() {
      this.$request
        .get("/api/message/getCustomerMessageRecord?content="+this.formInfo.content+'&sort='+this.formInfo.sort+'&limit='+this.formInfo.limit+'&offset='+this.formInfo.offset)
        .then(res => {
            // console.log(res);
          this.list = res.data.list;
          this.total=res.data.total;
        });
    },
    deleteClass(row) {
      this.$msgbox
        .confirm("删除不可恢复，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除"
        })
        .then(() => {
          this.$request
            .delete("/api/admin/onlineFormClass", {
              params: { id: row.id }
            })
            .then(data => {
              if (data.success) {
                this.getList();
                this.$message.success(`【${row.title}】已成功删除`);
              }
            });
        })
        .catch(() => {});
    },
    handleSizeChange(e) {
        // console.log(e)
        this.formInfo.limit=e;
        this.formInfo.offset=0;
        this.getList();
    },
    handleCurrentChange(e) {
        // console.log(e);
        this.formInfo.offset=(e-1)*this.formInfo.limit;
        this.getList()
    }
  },
  created() {
    this.getList();
    //更新待处理留言数量
    this.$request.get('/api/message/updateCustomerMessageRecord');
  },
  watch: {
    'formInfo.content' () {
      this.getList();
    }
  }
};
</script>

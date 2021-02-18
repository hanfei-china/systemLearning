<template>
  <el-container style="padding: 0 16px 16px;" class="absolute-fill-parent background-color-white">
    <el-header class="unset-padding flex flex-column flex-center">
      <div class="flex">
        <div class="flex-fill-in-the-remaining-space flex ">
          <industry-choose style="width: 250px;" collapse-tags v-model="industryList" />
          <el-input style="width: 300px;margin-left: 16px;" size="small" v-model="title" clearable placeholder="输入单位名称进行搜索" />
          <div class="flex flex-column flex-center" style="margin-left: 16px;">
            <!-- <el-checkbox v-model="showSchoolmateUnit">只显示校友企业</el-checkbox> -->
          </div>
        </div>
        <div>
          <el-button size="small" type="primary" @click="newUnit">新增单位</el-button>
        </div>
      </div>
    </el-header>
    <el-main class="unset-padding position-relative">
      <el-table :data="list" height="100%" class="custom-el-table header-gray" size="small" border stripe @row-click="viewUnitDetail">
        <el-table-column label="序号" width="50" fixed>
          <template v-slot="{$index}">
            <div class="text-align-center">
              {{$index+1}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单位名称" min-width="200" prop="organizationName" show-tooltip-when-overflow />
        <el-table-column label="单位logo" align="center">
          <template v-slot="{row}">
            <el-image :src="row.logoUrl" fit="cover" style="width: 20px;height: 20px;">
              <div slot="error" style="font-size: 18px;color: #909399;line-height: 20px;text-align: center;">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="所属行业" min-width="150" show-tooltip-when-overflow>
          <template v-slot="{row}">
            {{row.industry}}
          </template>
        </el-table-column>
        <el-table-column label="所在城市" min-width="150" show-tooltip-when-overflow>
          <template v-slot="{row}">
            {{transferCity(row.organizationAddress)}}
          </template>
        </el-table-column>
        <el-table-column label="联系人姓名" min-width="150" prop="contactPerson" show-tooltip-when-overflow />
        <el-table-column label="联系人联系方式" min-width="150" prop="contactPhone" show-tooltip-when-overflow />
        <el-table-column label="联系地址" min-width="150" prop="contactAddress" show-tooltip-when-overflow />
        <el-table-column label="单位描述" min-width="150">
          <template>
            <el-button type="text" size="small" class="unset-padding">点击查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="校友企业" width="100">
          <template v-slot="{row}">
            {{row.isSchoolFellow ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column label="校友姓名" min-width="150" prop="schoolFellowName" show-tooltip-when-overflow />
        <el-table-column label="校友联系方式" min-width="150" prop="schoolFellowPhone" show-tooltip-when-overflow />
        <el-table-column class-name="item-un-sort" label="创建时间" width="150px">
          <template v-slot="{row}">
            {{row.createTime | yyyyMMddHHmm}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px" fixed="right">
          <template v-slot="{row}">
            <el-button class="custom-el-button unset-padding item-un-sort" type="text" @click.stop="editUnit(row)">编辑
            </el-button>
            <el-button class="custom-el-button danger unset-padding item-un-sort" type="text" @click.stop="deleteUnit(row)">删除
            </el-button>
            <el-button size="mini" class="unset-padding" type="text" @click.stop="setTop(row,true)" v-if="!row.isTop">置顶
            </el-button>
            <el-button size="mini" class="unset-padding" type="text" @click.stop="setTop(row,false)" v-if="row.isTop">取消置顶
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="auto" class="unset-padding">
      <div style="padding-bottom: 16px;padding-top: 16px;" class="flex">
        <div class="flex-fill-in-the-remaining-space"></div>
        <div>
          <el-pagination background :total="total" :page-size="page.pageSize" :current-page="page.pageNum" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,50]" @size-change="sizeChange"
            @current-change="currentChange" />
        </div>
      </div>
    </el-footer>
    <el-dialog :visible.sync="unitFormVisible" :title="unitFormTitle" append-to-body :close-on-click-modal="false" width="800px">
      <unit-form v-if="unitFormVisible" :id="unitFormId" @refresh-list="getList" @close="unitFormVisible=false" />
    </el-dialog>
    <el-drawer :visible.sync="unitDetailVisible" size="600px" append-to-body :show-close="false" :withHeader="false" custom-class="drawerClass">
      <div class="position-relative" style="width: 100%;height: 100%;">
        <unit-info v-if="unitDetailVisible" :unitInfo="unitInfo" />
      </div>
    </el-drawer>
  </el-container>
</template>

<script>
import UnitForm from "./UnitForm";
import IndustryChoose from "../industryManage/IndustryChoose";
import {
  objectArraySplit,
  objectArrayToString,
} from "../../../../../js/util/utilFunction";
import UnitInfo from "./unitInfo/UnitInfo";

export default {
  name: "UnitManage",
  components: { UnitInfo, IndustryChoose, UnitForm },
  data() {
    return {
      page: {
        pageSize: 20,
        pageNum: 1,
      },
      title: "",
      total: 0,
      list: [],
      showSchoolmateUnit: false, //只显示校友企业

      industryList: [],

      unitFormVisible: false,
      unitFormTitle: "",
      unitFormId: "",

      unitDetailVisible: false,
      unitInfo: {},
    };
  },
  methods: {
    setTop(row,bol) {
      this.$request.put("/api/admin/organization/updateOrganizationTopById", {
        id: row.id,
        isTop: bol,
      }).then(() => {
        this.$message.success(bol?'置顶成功':'取消置顶成功')
        this.getList();
      });
    },
    refresh() {
      this.page.pageNum = 1;
      this.getList();
    },
    sizeChange(size) {
      this.page.pageSize = size;
      this.refresh();
    },
    currentChange(current) {
      this.page.pageNum = current;
      this.getList();
    },
    getList() {
      let params = {
        orderWay: 1,
        searchContent: this.title,
        limit: this.page.pageSize,
        offset: (this.page.pageNum - 1) * this.page.pageSize,
        organizationClasses: this.industryList,
        // isSchoolFellowOrg: this.showSchoolmateUnit,
      };
      this.$request
        .get("/api/admin/organization/listOrganizationByCondition", { params })
        .then((resp) => {
          let { data } = resp;
          this.list = data.list;
          this.total = data.total;
        });
    },
    newUnit() {
      this.unitFormId = "";
      this.unitFormTitle = "新增单位";
      this.unitFormVisible = true;
    },
    editUnit(row) {
      this.unitFormId = row.id;
      this.unitFormTitle = "编辑单位";
      this.unitFormVisible = true;
    },
    deleteUnit(row) {
      this.$msgbox
        .confirm("删除不可恢复，是否继续删除？", "提示", {
          type: "warning",
          confirmButtonText: "确认删除",
        })
        .then(() => {
          this.$request
            .delete("/api/admin/organization/deleteOrganization", {
              params: { id: row.id },
            })
            .then((data) => {
              if (data.success) {
                this.refresh();
                this.$message.success(`【${row.organizationName}】已成功删除`);
              }
            });
        })
        .catch(() => {});
    },
    transferCity(cities) {
      return objectArraySplit(cities);
    },
    viewUnitDetail(row) {
      this.unitInfo = row;
      this.unitDetailVisible = true;
    },
  },
  created() {
    this.refresh();
  },
  watch: {
    title() {
      this.refresh();
    },
    industryList() {
      this.refresh();
    },
    // showSchoolmateUnit() {
    //   this.refresh();
    // },
  },
};
</script>

<style>
.drawerClass .el-drawer__header {
  margin: 0 !important;
  padding: 0 !important;
}
</style>

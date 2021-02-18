<template>
  <el-container
    class="absolute-fill-parent background-color-white"
    style="padding: 0 16px 16px;"
    v-loading="loading"
  >
    <el-header class="unset-padding border-bottom" height="auto" style="margin-bottom: 16px;">
      <div style="padding: 16px 0;">
        <el-cascader
          style="min-width: 300px;"
          placeholder="请选择字段表"
          size="small"
          v-model="fieldTable"
          :options="allFieldTables"
          :props="props"
        />
      </div>
    </el-header>
    <el-main class="position-relative unset-padding">
      <el-container class="absolute-fill-parent">
        <el-main class="unset-padding position-relative">
          <el-container class="absolute-fill-parent border-right" style="padding-right: 16px;">
            <el-header class="unset-padding" height="auto">
              <el-alert
                style="margin-bottom: 16px;"
                show-icon
                :closable="false"
                title="温馨提示：各字段可拖曳排序"
                type="info"
              />
            </el-header>
            <el-main class="unset-padding position-relative">
              <div class="absolute-fill-parent">
                <vue-scroll>
                  <div ref="sort" style="padding-bottom: 16px;">
                    <div v-for="(field,index) in fieldList" :key="index" style="margin-bottom:15px;">
                      <member-field-simple-preview
                        :seq="fieldList.length"
                        :table-name="fieldTableId"
                        :index="index"
                        :data="field"
                        @refresh-fields="refreshFields"
                        @manage-detail-table="manageDetailTable"
                      />
                    </div>
                  </div>
                </vue-scroll>
              </div>
            </el-main>
          </el-container>
        </el-main>
        <el-aside class="unset-padding position-relative" width="307px">
          <member-field-choose
            @add-field="addField"
            :field-table="fieldTableId"
            :default-fields="defaultFields"
          />
        </el-aside>
      </el-container>
    </el-main>
    <el-dialog
      title="新增字段"
      :visible.sync="dialogShow"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <!-- <member-field-form v-if="dialogShow" :data="transferData"
                               :table-name="fieldTableId" :seq="fieldList.length"
      @close="dialogShow = false" @created-fields="refreshFields"/>-->
      <member-field-form
        :data="transferData"
        :table-name="fieldTableId"
        :seq="fieldList.length"
        @close="dialogShow = false"
        @created-fields="refreshFields"
      />
    </el-dialog>
  </el-container>
</template>

<script>
import MemberFieldChoose from "./MemberFieldChoose";
import MemberFieldSimplePreview from "./MemberFieldSimplePreview";
import MemberFieldForm from "./MemberFieldForm";
import Sortable from "sortablejs";

export default {
  name: "MemberFieldManage",
  components: {
    MemberFieldSimplePreview,
    MemberFieldChoose,
    MemberFieldForm
  },
  data() {
    return {
      fieldTable: ["0"],
      detailTables: [],

      defaultFields: [],
      props: {
        value: "id",
        label: "name"
      },
      dialogShow: false,
      transferData: {},
      fieldList: [],
      loading: false
    };
  },
  computed: {
    allFieldTables() {
      if (this.detailTables.length > 0) {
        return [
          { name: "基础字段表", id: "0" },
          { name: "明细表", id: "-1", children: this.detailTables }
        ];
      } else {
        return [{ name: "基础字段表", id: "0" }];
      }
    },
    fieldTableId() {
      return this.fieldTable[this.fieldTable.length - 1];
    },
  },
  methods: {
    drag() {
      let el = this.$refs.sort;
      Sortable.create(el, {
        disabled: false,
        handle: ".item-sort",
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          let { oldIndex, newIndex } = evt;
          let copyValue = JSON.parse(JSON.stringify(this.fieldList));
          if (oldIndex < newIndex) {
            let oldItem = copyValue[oldIndex];
            copyValue.splice(newIndex + 1, 0, oldItem);
            copyValue.splice(oldIndex, 1);
            this.sortFields(copyValue,true);
          }
          if (oldIndex > newIndex) {
            let oldItem = copyValue[oldIndex];
            copyValue.splice(newIndex, 0, oldItem);
            copyValue.splice(oldIndex + 1, 1);
            this.sortFields(copyValue,true);
          }
        }
      });
    },
    refreshFields() {
      this.refreshAllData(() => {
        this.sortFields();
      });
    },
    getFieldList(callback) {
      let params = {};
      if (this.fieldTableId !== "0") {
        params.parentId = this.fieldTableId;
      }
      this.$request
        .get("/api/admin/associator/getFieldsInfo", { params })
        .then(resp => {
          this.fieldList = JSON.parse(JSON.stringify(resp.data));
          this.$nextTick(()=>{ this.loading = false; })
          callback && callback();
        });
    },
    sortFields(fieldList, refresh) {
      if (!fieldList) {
        fieldList = this.fieldList;
      }
      if (!fieldList || fieldList.length < 1) {
        return;
      }
      let orderList = fieldList.map(item => {
        return item.id;
      });
      this.$request.post("/api/admin/associator/orderFields", null, {
          params: { idList: orderList }
        }).then(data => {
          if (data.success) {
            if (refresh) {
              this.$message.success("修改顺序成功");
              this.fieldList = [];
              setTimeout(() => {
                this.refreshAllData();
              }, 1);
            }
          }
        });
    },
    addField(field) {
      this.transferData = Object.assign({}, field);
      this.dialogShow = true;
    },
    refreshAllData(callback) {
      this.loading = true;
      if (this.fieldTableId !== "0") {
        this.getFieldList(callback);
      } else {
        Promise.all([
          this.$request.get("/api/admin/associator/getFieldsInfo"),
          this.$request.get("/api/admin/associator/getDefaultFields"),
          this.$request.get("/api/admin/associator/getFieldsInfo", { params: { topicTypes: [9] } })
        ]).then(
          ([
            fieldList,
            defaultFieldList,
            defaultTables
          ]) => {
            if (fieldList.success) {
              this.fieldList = JSON.parse(JSON.stringify(fieldList.data));
            }
            if (defaultFieldList.success) {
              this.defaultFields = defaultFieldList.data;
            }
            if (defaultTables.success) {
              this.detailTables = defaultTables.data;
            }
            this.$nextTick(()=>{ this.loading = false; })
            callback && callback();
          }
        );
      }
    },
    manageDetailTable(data) {
      this.fieldTable = Object.assign([], data);
    }
  },
  mounted() {
    this.refreshAllData();
    this.drag();
  },
  watch: {
    fieldTableId() {
      this.getFieldList();
    }
  }
};
</script>

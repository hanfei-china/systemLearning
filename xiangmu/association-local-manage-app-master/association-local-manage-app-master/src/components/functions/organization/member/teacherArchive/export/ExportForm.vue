<template>
  <el-container v-loading="loading" element-loading-text="数据导出中，请勿关闭本窗口，谢谢您的耐心等待...">
    <el-header class="unset-padding" height="auto">
      <div>
        共查询到符合条件的数据<span class="success-tip"> {{memberTotal}} </span>条
        <!-- 单次导出数据不能超过<span class="danger-tip"> 10000 </span>条 -->
      </div>
    </el-header>
    <!-- <el-main class="unset-horizontal-padding" style="overflow: hidden;">
            <el-form size="small" label-width="83px">
                <el-form-item label="分会选择：" v-if="!branchId">
                    <branch-choose v-model="exportBranchId" style="width: 100%;"/>
                </el-form-item>
                <el-form-item label="导出范围：" v-show="memberTotal">
                    <input-number-area v-model="numbers" style="width: 300px;" :max="memberTotal" :diff="10000">
                        至
                    </input-number-area>
                </el-form-item>
            </el-form>
        </el-main> -->
    <el-footer class="unset-padding text-align-right" height="auto">
      <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消</el-button>
      <el-button icon="el-icon-download" type="primary" :disabled="memberTotal<=0" size="small" @click="exportData">导出</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import BranchChoose from "../../../../util/branch/BranchChoose";
import { exportExcel } from "../../../../../../js/util/exportFile";

export default {
  props: {
    conditionall: {
      type: Object,
      default() {
        return {};
      },
    },
    memberTotal: {
      type: Number,
      default: 0,
    },
  },
  name: "ExportForm",
  components: { BranchChoose },
  data() {
    return {
      exportBranchId: "",
      numbers: [1, 1000],
      loading: false,
    };
  },
  methods: {
    exportData() {
      this.loading = true;
      var obj = JSON.parse(JSON.stringify(this.conditionall));
      if (obj.limit) {
        delete obj.limit;
      }
      if (obj.offset) {
        delete obj.offset;
      }
      this.$request
        .post("/api/admin/member/teacher/archive/export", obj, {
          responseType: "blob",
        })
        .then((resp) => {
          exportExcel(resp);
          this.$nextTick(()=>{ this.loading = false; })
          this.$emit("close");
        });
    },
  },
};
</script>

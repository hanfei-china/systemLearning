<template>
  <div :style="style"
       class="giving-table-container"
       :class="customClasses">
    <el-table :data="listData" :max-height="module.attributes.layoutGroup.attributes.layout.value.height - 90">
      <el-table-column prop="donationName" label="捐赠方">
        <template slot-scope="{row}">
          {{row.groupName || row.donationName}}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="捐赠项目"></el-table-column>
      <el-table-column prop="donationAmount" label="捐赠金额" width="150" align="right">
        <template slot-scope="{row}">
          <div style="text-align: right">
          {{row.donationAmount | currency}} 元
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="donationTime" label="捐赠日期" width="150" align="center">
        <template slot-scope="{row}">
          {{row.donationTime | dateFilter}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pageNumber" background :page-size="pageSize"
                    :total="total" :pager-count="5"
                    layout="total, ->, prev, pager, next, jumper"
                    @current-change="pageChange"
                    style="margin-top: 10px">
    </el-pagination>
  </div>
</template>
<script>
import {formatDate, currency} from "@/js/util/utilFunction";
export default {
  props: {
    module: Object,
    design: Boolean
  },
  data () {
    return {
      formId: '',
      listData: [],
      pageSize: 20,
      pageNumber: 1,
      total: 0,
    }
  },
  computed: {
    style() {
      let style = {
        borderTopLeftRadius:
          this.module.attributes.styleGroup.attributes.borderRadius.value
            .leftTop + "px",
        borderBottomLeftRadius:
          this.module.attributes.styleGroup.attributes.borderRadius.value
            .leftBottom + "px",
        borderTopRightRadius:
          this.module.attributes.styleGroup.attributes.borderRadius.value
            .rightTop + "px",
        borderBottomRightRadius:
          this.module.attributes.styleGroup.attributes.borderRadius.value
            .rightBottom + "px",

        borderTopColor: this.module.attributes.styleGroup.attributes.border
          .value.top.borderColor,
        borderTopStyle: this.module.attributes.styleGroup.attributes.border
          .value.top.borderStyle,
        borderTopWidth:
          this.module.attributes.styleGroup.attributes.border.value.top
            .borderWidth + "px",

        borderBottomColor: this.module.attributes.styleGroup.attributes.border
          .value.bottom.borderColor,
        borderBottomStyle: this.module.attributes.styleGroup.attributes.border
          .value.bottom.borderStyle,
        borderBottomWidth:
          this.module.attributes.styleGroup.attributes.border.value.bottom
            .borderWidth + "px",

        borderLeftColor: this.module.attributes.styleGroup.attributes.border
          .value.left.borderColor,
        borderLeftStyle: this.module.attributes.styleGroup.attributes.border
          .value.left.borderStyle,
        borderLeftWidth:
          this.module.attributes.styleGroup.attributes.border.value.left
            .borderWidth + "px",

        borderRightColor: this.module.attributes.styleGroup.attributes.border
          .value.right.borderColor,
        borderRightStyle: this.module.attributes.styleGroup.attributes.border
          .value.right.borderStyle,
        borderRightWidth:
          this.module.attributes.styleGroup.attributes.border.value.right
            .borderWidth + "px",

        boxShadow: this.boxShadow,

        paddingTop:
          this.module.attributes.styleGroup.attributes.padding.value.top + "px",
        paddingBottom:
          this.module.attributes.styleGroup.attributes.padding.value.bottom +
          "px",
        paddingLeft:
          this.module.attributes.styleGroup.attributes.padding.value.left +
          "px",
        paddingRight:
          this.module.attributes.styleGroup.attributes.padding.value.right +
          "px"
      };

      let {
        backgroundImage,
        backgroundColor,
        backgroundPositionX,
        backgroundPositionY,
        backgroundSize,
        backgroundRepeatX,
        backgroundRepeatY
      } = this.module.attributes.styleGroup.attributes.background.value;

      if (backgroundImage) {
        style.backgroundImage = `url(${backgroundImage})`;
      }

      if (backgroundColor) {
        style.backgroundColor = backgroundColor;
      }

      if (backgroundPositionX) {
        style.backgroundPositionX = backgroundPositionX;
      }

      if (backgroundPositionY) {
        style.backgroundPositionY = backgroundPositionY;
      }

      if (backgroundSize) {
        style.backgroundSize = backgroundSize;
      }

      if (backgroundRepeatX && backgroundRepeatY) {
        style.backgroundRepeat = "repeat";
      }

      if (backgroundRepeatX && !backgroundRepeatY) {
        style.backgroundRepeat = "repeat-x";
      }

      if (!backgroundRepeatX && backgroundRepeatY) {
        style.backgroundRepeat = "repeat-y";
      }

      if (!backgroundRepeatX && !backgroundRepeatY) {
        style.backgroundRepeat = "no-repeat";
      }

      if (!this.design) {
        style.width =
          this.module.attributes.layoutGroup.attributes.layout.value.width +
          "px";
        style.height =
          this.module.attributes.layoutGroup.attributes.layout.value.height +
          "px";
        style.height = 'auto';
        style.left =
          this.module.attributes.layoutGroup.attributes.layout.value.left +
          "px";
        style.top =
          this.module.attributes.layoutGroup.attributes.layout.value.top + "px";
        style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
        style.position = "absolute";
      }

      return style;
    },
    customClasses() {
      return this.module.attributes.otherGroup.attributes.customClasses.value;
    },
  },
  methods: {
    pageChange (pageIndex) {
      this.pageNumber = pageIndex;
      this.getData();
    },
    getData() {
      let params = {
        id: this.formId,
        limit: this.pageSize,
        offset: this.pageSize * (this.pageNumber - 1)
      };
      // this.listData = listData;
      // this.listData.forEach(item => item.title = '捐赠项目')
      this.$request
        .get("/api/admin/onlineForm/anon/submitHistory/list", {
          params: params
        })
        .then(res => {
          if (res.success) {
            let list = res.data.list;
            this.listData = list;
            this.total = res.data.total;
          }
        });
    },
  },
  created () {
    let attributes = this.module.attributes;
    let formDataSrc = attributes.formDataGroup.attributes.formDataSrc;
    this.formId = formDataSrc.value.formId;
    this.getData();
  },
  filters: {
    dateFilter (value) {
      let date = new Date(value);
      return formatDate(date, 'yyyy-MM-dd');
    },
    currency (value) {
      return currency(value);
    }
  }
}
</script>
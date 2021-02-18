<template>

  <div v-show="show">
    <attribute-title v-show="showTitle">{{title}}</attribute-title>
    <div>
      <div class="website-pro-flex"
           style="margin-bottom: 10px;">
        <div class="website-pro-layout-attr-title horizontal">表单分类选择</div>
        <div class="flex-fill-in-the-remaining-space">
          <form-class-setting ref="classId"
                              :attributes="{showClear:true}"
                              style="width: 100%;"
                              v-model="attribute.value.classId" />
        </div>
      </div>
      <div class="website-pro-flex"
           style="margin-bottom: 10px;">
        <div class="website-pro-layout-attr-title horizontal">表单标签选择</div>
        <div class="flex-fill-in-the-remaining-space">
          <form-label-setting ref="labelId"
                              :attributes="{showClear:true}"
                              :class-id="attribute.value.classId"
                              style="width: 100%;"
                              v-model="attribute.value.formId" />
        </div>
      </div>
      <div v-if="attribute.value.formId">
        <div class="website-pro-flex"
             style="margin-bottom: 10px;">
          <div class="website-pro-layout-attr-title horizontal">标签字段选择</div>
          <div class="flex-fill-in-the-remaining-space">
            <form-prop-setting ref="labelId"
                               :attributes="{showClear:true}"
                               :fields="fields"
                               style="width: 100%;"
                               v-model="attribute.value.tagProp" />
          </div>
        </div>
        <div class="website-pro-flex"
             style="margin-bottom: 10px;">
          <div class="website-pro-layout-attr-title horizontal">标题字段选择</div>
          <div class="flex-fill-in-the-remaining-space">
            <form-prop-setting ref="labelId"
                               :attributes="{showClear:true}"
                               :fields="fields"
                               style="width: 100%;"
                               v-model="attribute.value.titleProp" />
          </div>
        </div>
        <div class="website-pro-flex"
             style="margin-bottom: 10px;">
          <div class="website-pro-layout-attr-title horizontal">数据字段选择</div>
          <div class="flex-fill-in-the-remaining-space">
            <form-prop-setting ref="labelId"
                               :attributes="{showClear:true}"
                               :fields="fields"
                               multiple
                               style="width: 100%;"
                               v-model="attribute.value.dataProps" />
          </div>
        </div>
      </div>
      <div class="website-pro-flex" style="margin-bottom: 10px;">
        <el-checkbox v-model="attribute.value.linkProp.linkBtn">链接按钮</el-checkbox>
      </div>
      <div v-if="attribute.value.linkProp.linkBtn">
        <div class="website-pro-flex"
            style="margin-bottom: 10px;">
          <div class="website-pro-layout-attr-title horizontal">按钮名称</div>
          <div class="flex-fill-in-the-remaining-space">
            <el-input size="mini" v-model="attribute.value.linkProp.linkTitle"/>
          </div>
        </div>
        <div class="website-pro-flex"
            style="margin-bottom: 10px;">
          <div class="website-pro-layout-attr-title horizontal">跳转链接</div>
          <div class="flex-fill-in-the-remaining-space">
            <el-input size="mini" v-model="attribute.value.linkProp.linkUrl"/>
          </div>
        </div>
        <div class="website-pro-flex"
            style="margin-bottom: 10px;">
          <div class="website-pro-layout-attr-title horizontal">跳转链接字段</div>
          <div class="flex-fill-in-the-remaining-space">
            <form-prop-setting ref="labelId"
                               :attributes="{showClear:true}"
                               :fields="fields"
                               style="width: 100%;"
                               v-model="attribute.value.linkProp.linkColId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AttributeTitle from "./AttributeTitle";
import FormClassSetting from "../common/FormClassSetting";
import FormLabelSetting from "../common/FormLabelSetting";
import FormPropSetting from "../common/FormPropSetting";
export default {
  name: "FormDataSrcAttr",
  components: { AttributeTitle, FormClassSetting, FormLabelSetting, FormPropSetting },
  props: {
    attribute: Object
  },
  data () {
    return {
      fields: [],
    }
  },
  computed: {
    showTitle() {
      return this.attribute.showTitle;
    },
    title() {
      return this.attribute.title;
    },
    attributes() {
      return this.attribute.attributes || {};
    },
    show() {
      if (this.attribute.show) {
        return this.attribute.show();
      } else {
        return true;
      }
    },
  },
  created () {
    this.getFormFields();
  },
  methods: {
    isChildren(e) {
      let target = e.target || e.srcElement;
      return (
        target === this.$el ||
        this.$el.contains(target) ||
        this.$refs.dataSrc.$refs.popper.$el.contains(target) ||
        this.$refs.classId.$refs.container.$refs.popper.$el.contains(target) ||
        this.$refs.labelId.$refs.container.$refs.popper.$el.contains(target)
      );
    },
    getFormFields () {
      if (this.attribute.value.formId) {
        this.loading = true;
        this.$request
          .get("/api/admin/onlineForm", {
            params: { id: this.attribute.value.formId }
          })
          .then(res => {
            let formAttr = res.data;
            let fields = JSON.parse(formAttr.fields);
            this.fields = fields;
          });
      } else {
        this.fields = [];
      }
    },
  },
  watch: {
    'attribute.value.formId': function () {
      this.attribute.value.tagProp = '';
      this.attribute.value.titleProp = '';
      this.attribute.value.linkProp.linkColId = '';
      this.attribute.value.dataProps = [];
      this.getFormFields();
    }
  }
};
</script>
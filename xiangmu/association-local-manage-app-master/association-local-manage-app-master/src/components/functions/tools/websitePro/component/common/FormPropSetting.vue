
<template>
  <el-select ref="container"
             v-model="copyValue"
             :clearable="showClear"
             size="mini"
             :multiple="multiple"
             :disabled="disabled"
             :placeholder="placeholder">
    <el-option v-for="item in fields"
               :key="item.id"
               :value="item.id"
               :label="item.title"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "FormPropSetting",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    attributes: {
      type: Object,
      default() {
        return {
          showClear: true,
          placeholder: "请选择表单标签"
        };
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Array],
      default: ""
    },
    required: {
      type: Boolean,
      default: true
    },
    fields: {
      type: Array,
      default: function() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    placeholder() {
      if (
        this.attributes &&
        this.attributes.placeholder &&
        this.attributes.placeholder !== ""
      ) {
        return this.attributes.placeholder;
      }

      return "请选择表单标签";
    },
    showClear() {
      if (
        this.attributes &&
        this.attributes.showClear !== undefined &&
        this.attributes.showClear !== null
      ) {
        return this.attributes.showClear;
      }

      return true;
    }
  },
  data() {
    return {
      copyValue: this.value,
      loading: false,
      initComplete: false,
    };
  },
  methods: {
  },
  created() {
  },
  watch: {
    copyValue(value) {
      this.$emit("change", value);
    },
  }
};
</script>
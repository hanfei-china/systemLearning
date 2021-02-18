<template>
  <div class="absolute-fill-parent">
    <vue-scroll>
      <div style="padding: 0 0 0 16px;">
        <div class="member-fields-area default-member-fields-area" v-show="fieldTable == '0'">
          <div class="member-fields-area-title">
            <fieldset class="border-top">
              <legend>系统字段</legend>
            </fieldset>
          </div>
          <div class="member-fields flex flex-wrap">
            <el-tooltip v-for="(item,index) in defaultFields" v-if="!item.buildIn" :key="index" effect="dark" :content="item.name">
              <div
                :class="{clicked:item.inUse === 1}"
                class="member-field"
                @click="addField({...item,isDefault:true})"
              >{{item.name}}</div>
            </el-tooltip>
          </div>
        </div>
        <!-- <div class="member-fields-area default-member-fields-area" v-show="fieldTable == '0'">
          <div class="member-fields-area-title">
            <fieldset class="border-top">
              <legend>组合字段</legend>
            </fieldset>
          </div>
          <div class="member-fields flex flex-wrap composeWord" @click="groupAddField(groupFields)">
            <div :class="{clicked:groupIfInUse}" class="member-field">
              <span>入学年份</span>
            </div>
            <div :class="{clicked:groupIfInUse}" class="member-field">
              <span>就读学院</span>
            </div>
          </div>
        </div> -->
        <div class="member-fields-area member-fields-area">
          <div class="member-fields-area-title">
            <fieldset class="border-top">
              <legend>扩展字段</legend>
            </fieldset>
          </div>
          <div class="member-fields flex flex-wrap">
            <div
              class="member-field"
              @click="addField({name:'单行文本', topicType:0 ,isDefault:false})"
            >
              <span>单行文本</span>
            </div>
            <div
              class="member-field"
              @click="addField({name:'多行文本', topicType:1 ,isDefault:false})"
            >
              <span>多行文本</span>
            </div>
            <div
              class="member-field"
              @click="addField({name:'单选值', topicType:2, parameter: {options:[{ title: '选项', optionType: 0 }]},isDefault:false})"
            >
              <span>单选值</span>
            </div>
            <div
              class="member-field"
              @click="addField({name:'多选值', topicType:3, parameter: {options:[{ title: '选项', optionType: 0 }]},isDefault:false})"
            >
              <span>多选值</span>
            </div>
            <div class="member-field" @click="addField({name:'图片', topicType:4, isDefault:false})">
              <span>图片</span>
            </div>
            <div
              class="member-field"
              @click="addField({name:'日期时间', topicType:5, isDefault:false, parameter:{dateType:'date'}})"
            >
              <span>日期时间</span>
            </div>
            <div
              class="member-field"
              @click="addField({name:'地区', topicType: 6 ,isDefault:false, parameter:{cityType:'city'}})"
            >
              <span>地区</span>
            </div>
            <div
              class="member-field"
              @click="addField({name:'多级下拉', topicType:8, isDefault:false, parameter:{enumId: null}})"
            >
              <span style="vertical-align:top;">多级下拉</span>
            </div>
            <div
              class="member-field"
              v-show="fieldTable == '0'"
              @click="addField({name:'明细表', topicType:9, isDefault:false, noRepeatable: false})"
            >
              <span style="vertical-align:top;">明细表</span>
            </div>
          </div>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
export default {
  name: "MemberFieldChoose",
  props: {
    fieldTable: {
      type: String,
      default: "0"
    },
    defaultFields: {
      type: Array,
      default() {
        return [];
      }
    },
    groupFields: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    groupIfInUse() {
      return false
      if (this.groupFields.length===0) {
        return false;
      }
      if (this.groupFields[0].inUse === 1 || this.groupFields[1].inUse === 1) {
        return true;
      } else {
        this.defaultFields.forEach(item => {
          if (item.topicType === 5 && item.inUse === 1) {
            return true;
          } else if (item.topicType === 13 && item.inUse === 1) {
            return true;
          }
        });
      }
    },
    defaultInUse() {
      if (this.groupFields[0].inUse === 1 && this.groupFields[1].inUse === 1) {
        return true;
      }
    }
  },
  data() {
    return {
      memberTypeList: []
    };
  },
  methods: {
    addField(field) {
      field = { ...field };
      console.log(field)
      if (field.inUse === 1) {
        return;
      }
      field = Object.assign(field, {
        id: null,
        nullable: false,
        selfModify: false,
        privacy: false,
        description: "",
        onlyAdmin: false,
        enabled: true,
        noRepeatable: false,
        necessary: false,
        seq: 0,
        fieldSetting: true
      });
      if (field.parameter && typeof field.parameter == "string") {
        try {
          field.parameter = JSON.parse(field.parameter);
        } catch (e) {
          this.$message.error(e.message);
        }
      }
      this.$emit("add-field", field);
    },
    //组合字段
    groupAddField(field) {
      //   if (field[0].inUse === 1 || field[1].inUse === 1) {
      //     return;
      //   }
      if (this.groupIfInUse) {
        return 
      }
      var obj = JSON.stringify(field);
      var arr = JSON.parse(obj);
      arr.forEach(item => {
        item = Object.assign(item, {
          id: null,
          nullable: false,
          selfModify: false,
          privacy: false,
          description: "",
          onlyAdmin: false,
          enabled: true,
          noRepeatable: false,
          necessary: false,
          seq: 0,
          fieldSetting: true,
          isDefault: true //这个信息不传入了，直接放进去
        });
        if (item.parameter && typeof item.parameter == "string") {
          try {
            item.parameter = JSON.parse(item.parameter);
          } catch (e) {
            this.$message.error(e.message);
          }
        }
      });
      //   var groupFields={
      //       groupInfo:field
      //   }
      this.$emit("add-group-field", arr);
    }
  }
};
</script>

<style lang="less" scoped>
.composeWord {
  padding-top: 5px;
  width: 200px;
  border: 1px dashed #ecf1f4;
}
</style>

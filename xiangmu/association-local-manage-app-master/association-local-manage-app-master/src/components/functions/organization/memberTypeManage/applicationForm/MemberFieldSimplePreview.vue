<template>
  <div class="member-field-simple-info cusfieldbox" :class="(nowField&&nowField.id==data.id)?'selected':''" style="height:initial;">
    <div class="flex">
      <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
        <span class="topic-index">{{ index + 1 }}、</span>
        <span class="txt_show">{{ data.name }}</span>
      </div>
      <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
        <span class="type_txt">({{ fieldType[data.topicType] }})</span>
      </div>
      <div class="member-field-simple-info-handle" style="padding-left: 16px;">
        <el-button class="custom-el-button item-sort" type="text">排序</el-button>
        <el-button class="custom-el-button danger" type="text" @click="deleteField">移除</el-button>
      </div>
    </div>
    

    <div v-if="data.topicType==13">
      <div class="member-field-simple-infozuhe flex" v-for="(item,index) in data.detailList" :key="index">
        <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
            <span class="txt_show">{{item.name}}</span>
        </div>
        <div class="member-field-simple-info-item flex-fill-in-the-remaining-space text-overflow">
            <span class="type_txt">({{fieldType[item.topicType]}})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fieldType } from "../../../../../js/util/constantStore";

export default {
  name: "MemberFieldSimplePreview",
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    nowField: {
      type: Object,
      default() {
        return null;
      },
    },
    formType: String,
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fieldType
    };
  },
  methods: {
    deleteField() {
      this.$emit("removeField", this.formType, this.index, this.data);
    },
  },
};
</script>
<style lang="less" scoped>
.cusfieldbox:hover {
  border-color: #ff8e3d;
}
.cusfieldbox.selected {
  border-color: #ff8e3d;
}
.member-field-simple-infozuhe{
  background-color: #eee;
  border-radius: 4px;
  font-size: 12px;
  color: #333333;
  border: 1px solid #d7d7d7;
  padding: 0 12px;
  height: 30px;
  line-height: 30px;
  margin: 5px 10px;
} 


</style>

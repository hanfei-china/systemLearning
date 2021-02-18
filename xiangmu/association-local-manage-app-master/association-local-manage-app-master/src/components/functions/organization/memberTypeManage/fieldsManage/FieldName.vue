<template>
  <el-select multiple filterable v-model="checkedList" style="width: 100%;">
    <el-option v-for="item in notBoundList" :key="item.id" :label="item.name" :value="item.id">
        <span style="float: right;color: #8492a6; font-size: 13px" v-if="item.isGroup">组合字段</span>
        <span style="float: left; " v-if="item.isGroup">{{ item.name }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "FieldName",
  props: ["list", "memberTypeId"],
  data() {
    return {
      notBoundList: [], //未绑定的项
      checkedList: this.list, //选中的id列表
      groupList:[]      //组合字段的列表
    };
  },
  model: {
    prop: "list",
    event: "change"
  },
  watch: {
    checkedList(val) {
      this.$emit("change", val);
    },
    list(val) {
      this.checkedList = val;
    }
  },
  methods: {
    //未绑定的list
    getAvailableFieldsInfoByMemberType() {
        this.groupList=[];
      this.$request
        .get("/api/admin/memberType/getAvailableFieldsInfoByMemberType", {
          params: { memberTypeId: this.memberTypeId }
        })
        .then(res => {
          if (res.success) {
            // this.notBoundList = res.data;
            this.notBoundList = JSON.parse(JSON.stringify(res.data));
            // this.showFieldList = JSON.parse(JSON.stringify(res.data));
            var num = 0;
            var a = 0;
            res.data.forEach((item, index) => {
              if (item.isGroup) {
                num++;
                this.groupList.splice(index, 1, item);
                a = index;
              }
            });
            if (num > 0) {
              var obj = {
                isGroup: true,
                name: this.groupList[0].name + "--" + this.groupList[1].name,
                code: "组合",
                id: this.groupList[0].id + "," + this.groupList[1].id
              };
              this.notBoundList.splice(a - num + 1, num, obj);
            }
          }
        });
    }
  },
  created() {
    if (this.memberTypeId) {
      this.getAvailableFieldsInfoByMemberType();
    }
  }
};
</script>

<style scoped>
</style>
<template>
  <el-form ref="form" label-width="110px" size="small">
    <el-form-item label="申领状态">
      <el-select v-model="cardStatus" placeholder="请选择申领状态">
        <el-option v-for="cardStatus of cardStatusList" :key="'cardStatus'+cardStatus.key"
                   :label="cardStatus.title"
                   :value="cardStatus.key"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "modifyCardStatus",
  props: ['memberSelection'],
  data() {
    return {
      cardStatusList: [
        {key: "0", title: '未申领'},
        {key: "1", title: '待制卡'},
        {key: '2', title: '已制卡'},
        {key: '3', title: '已送出'},
      ],
      cardStatus: '',
    }
  },
  computed: {
    modifyParams() {
      let ids = []
      this.memberSelection.forEach(item => {
        ids.push(item.id)
      })
      return {
        ids:ids,
        cardStatus : this.cardStatus
      }
    }
  },
  methods: {
    onSubmit() {
      this.$request.put('/api/admin/member/card/modifyStatus', this.modifyParams).then(() => {
        this.$message.success("批量修改成功")
        this.$emit('close')
        this.$emit('refresh')
      });
    }
  },
}
</script>

<style scoped>

</style>
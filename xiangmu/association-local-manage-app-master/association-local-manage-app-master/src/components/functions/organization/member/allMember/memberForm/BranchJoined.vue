<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-header class="flex flex-align-center">
      <p class="title">已加入的分会</p>
    </el-header>
    <el-main class="position-relative padding">
      <!--      内容区-->
      <el-table
          class="custom-el-table header-gray lrd-el-table"
          :data="branchList"
          tooltip-effect="dark"
          highlight-current-row
      >
        <el-table-column
            type="index"
            width="55"
            align="center"
        >
        </el-table-column>
        <el-table-column
            align="center"
            :label="branch.title"
            :prop="branch.value"
            show-tooltip-when-overflow
            v-for="(branch,index) of tableFormatList"
            :key="'branch'+index"
        >
          <template v-if="branch.value==='bindingTime'" v-slot="{row}">
            {{ row.bindingTime|yyyyMMdd }}
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            min-width="120"
            align="center"
            label="操作"
        >
          <template v-slot="{row}">
            <el-button type="text" size="small" class="custom-el-button danger" @click="exitBranch(row.id)">移出分会
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: "BranchJoined",
  props: ['memberId'],
  data() {
    return {
      branchList: [],
      tableFormatList: [
        {title: '分会名称', value: 'branchName'},
        {title: '分会类型', value: 'branchTypeName'},
        {title: '申请理由', value: 'description'},
        {title: '入会时间', value: 'bindingTime'},
      ],
      branchChoose: [],
    }
  },
  methods: {
    getBranchJoinedData() {
      const loading = this.$loading({fullscreen: true, lock: true})
      this.$request.get('/api/admin/member/v2/getMemberJoinBranches', {params: {memberId: this.memberId}}).then(res => {
        loading.close()
        this.branchList = res.data
      })
    },
    exitBranch(id) {
      this.$confirm('确定移出所选分会？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.delete('/api/admin/member/v2/removeBranchOfMember', {params: {bindingId : id}}).then(() => {
          this.$message.success('移出成功')
          this.getBranchJoinedData()
        })
      })
    }
  },
  created() {
    this.getBranchJoinedData()
  }
}
</script>

<style scoped lang="less">
.flex-align-center {
  align-items: center;
}

.mar-b-r {
  margin-right: 15px;
}

.title {
  font-size: 16px;
  color: #222222;
  font-weight: 400;
  display: flex;
  align-items: center;
  line-height: 60px;
  position: relative;
  padding-left: 10px;
  box-sizing: border-box;

  &:after {
    display: block;
    content: "";
    clear: both;
    width: 3px;
    height: 15px;
    background: #3FA1B6;
    position: absolute;
    left: 0;
  }
}
</style>
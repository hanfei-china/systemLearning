<template>
  <el-container class="unset-padding">
    <el-header>
      <el-input style="width: 230px" v-model="searchInfo" placeholder="请输入姓名或电话号码进行搜索" clearable></el-input>
    </el-header>
    <el-main>
      <el-table
        :data="memberList"
        height="250"
        border
        style="width: 100%"
        highlight-current-row
        tooltip-effect="dark"

      >
        <el-table-column
          type="index"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="memberName"
          label="姓名"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="telPhone"
          align="center"
          label="电话">
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <div class="flex" style="padding: 16px 0;">
        <div class="flex-fill-in-the-remaining-space text-align-right">
          <el-pagination
            :current-page="page.currentPage"
            background
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page.pageSize"
            :total="page.memberTotal"
            :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="pageChange"
            @size-change="sizeChange"
          >
          </el-pagination>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "memberForm",
  props: {
    sendMemParm: {
      type: Object,
    }
  },
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10,
        memberTotal: 0
      },
      memberList: [],
      timer: null,
      searchInfo: ''
    }
  },
  computed: {
    copySendMemParm() {
      let params = {}
      params.offset = (this.page.currentPage - 1) * this.page.pageSize;
      params.limit = this.page.pageSize;
      params.id = this.sendMemParm.id
      params.sendType = this.sendMemParm.sendType
      params.searchContent = this.searchInfo
      return params
    }
  },
  watch: {
    searchInfo() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.getSendList()
      }, 500)
    }

  },
  methods: {
    pageChange(pageIndex) {
      this.page.currentPage = pageIndex;
      this.getSendList();
    },
    sizeChange(pageSize) {
      this.page.currentPage = 1;
      this.page.pageSize = pageSize;
      this.getSendList();
    },
    getSendList() {
      this.$request.get('/api/admin/emailTelPhone/getSendRecordDetail', {params: this.copySendMemParm})
        .then(res => {
          this.memberList = res.data.list
          this.page.memberTotal = res.data.total
        })
    },
  },
  mounted() {
    this.getSendList()
  }
}
</script>

<style scoped>

</style>
<template>
  <el-container class="unset-padding">
    <el-header class="flex flex-end flex-align-top unset-padding padding-horizontal" height="40px">
      <el-button class="plainBtnClass" size="small" @click="$emit('close')">取消</el-button>
      <el-button class="primaryBtnClass" size="small" @click="saveSelection">确定</el-button>
    </el-header>
    <el-main class="position-relative unset-padding">
      <el-table
          v-loading="loading"
          ref="multipleTable"
          tooltip-effect="dark"
          border
          highlight-current-row
          @selection-change="handleSelectionChange"
          :data="dataList"
      >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            label="标题"
            prop="title"
            show-tooltip-when-overflow
        >
        </el-table-column>
        <el-table-column
            label="发布时间"
            prop="createTime"
            align="center"
        >
          <template v-slot="{row}">
            {{ row.createTime | yyyyMMdd }}
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="flex flex-end unset-padding flex-align-end">
      <div class="flex-fill-in-the-remaining-space text-align-right">
        <el-pagination
            :current-page="page.currentPage"
            background
            :page-sizes="[10, 20]"
            :page-size="page.pageSize"
            :total="page.total"
            :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="pageChange"
            @size-change="sizeChange"
        >
        </el-pagination>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "DialogConfigure",
  props: ['configureType', 'noticeListLength'],
  data() {
    return {
      timer: null,
      loading: false,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dataList: [],
      dataSelection: []
    }
  },
  computed: {
    queryParams() {
      return {
        limit: this.page.pageSize,
        offset: (this.page.currentPage - 1) * this.page.pageSize,
      }
    }
  },
  methods: {
    pageChange(pageIndex) {
      this.page.currentPage = pageIndex
      this.getList()
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.page.currentPage = 1
      this.getList()
    },
    getWebsiteArticleList() {
      this.loading = true
      this.$request.get('/api/admin/mp/zq/articles', {params: this.queryParams}).then(res => {
        this.loading = false
        this.page.total = res.data.total
        this.dataList = res.data.list
      })
    },
    getWeChatArticleList() {
      this.loading = true
      this.$request.get('/api/admin/mp/wx/articles', {params: this.queryParams}).then(res => {
        this.loading = false
        this.page.total = res.data.total
        this.dataList = res.data.list
      })
    },
    getList() {
      if (this.configureType === 'website') {
        this.getWebsiteArticleList()
      } else if (this.configureType === 'wechat') {
        this.getWeChatArticleList()
      }
    },
    handleSelectionChange(val) {
      this.dataSelection = val
    },
    saveSelection() {
      if (this.dataSelection.length === 0) {
        this.$message.warning('未选择任何项')
        return
      }
      if(this.loading){
        return;
      }
      this.loading = true
      this.saveFun(this.noticeListLength)
    },
    saveFun(num) {
      if (this.dataSelection.length === 0) {
        this.$message.success(`添加${this.configureType === 'website' ? '站群文章' : '微信公众号文章'}成功`)
        this.loading = false
        this.$emit('close')
        this.$emit('refreshList')
        return;
      }
      let obj = {
        articleTime: '',
        content: '',
        createTime: '',
        creator: '',
        enable: false,
        picture: '',
        seq: num++,
        source: '',
        sourceExtends: '',
        sourceId: '',
        title: '',
        updateTime: '',
        views: 0
      }
      let params = Object.assign(obj, this.dataSelection.shift())
      this.$request.post('/api/admin/mp/notice', params).then(()=>{
        return this.saveFun(num)
      })

    }
  },
  created() {
    this.getList()
  }
}
</script>

<style scoped>
.flex-align-top {
  align-items: top;
}

.flex-align-end {
  align-items: flex-end;
}

</style>
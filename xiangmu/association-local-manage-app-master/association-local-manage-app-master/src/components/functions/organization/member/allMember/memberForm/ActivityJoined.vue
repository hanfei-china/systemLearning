<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-header class="flex flex-align-center">
      <p class="title">已参与的活动</p>
    </el-header>
    <el-main class="position-relative padding">
      <!--      内容区-->
      <el-table
          class="custom-el-table header-gray lrd-el-table"
          tooltip-effect="dark"
          highlight-current-row
          :data="activityList"
          border
      >
        <el-table-column
            type="index"
            width="55"
            align="center"
        >
        </el-table-column>
        <el-table-column
            align="center"
            v-for="(active,index) of tableFormatList" :key="'active'+index"
            :label="active.title"
            :prop="active.value"
            show-tooltip-when-overflow
        >
          <template v-slot="{row}" v-if="active.type==='pic'">
            <el-popover placement="top-start" title="" trigger="click">
              <img :src="row[active.value]" alt="" style="width:150px;height:228px;object-fit: cover;"/>
              <img slot="reference" :src="row[active.value]" style="width:50px;height:70px;object-fit: cover;"/>
            </el-popover>
          </template>
          <template v-slot="{row}" v-else-if="active.type==='date'">
            {{ row[active.value]|yyyyMMdd }}
          </template>
          <template v-slot="{row}" v-else-if="active.type==='flag'">
            {{ row[active.value] === '0' ? '否' : '是' }}
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="padding" height="auto">
      <div class="flex">
        <div class="flex-fill-in-the-remaining-space text-align-right">
          <el-pagination
              :current-page="page.currentPage"
              background
              :page-sizes="[10, 20, 50, 100]"
              :page-size="page.pageSize"
              :total="page.total"
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
  name: "ActivityJoined",
  props: ['userId'],
  data() {
    return {
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      activityStatusList:[
        {label:'已通过',value:'0'},
        {label:'待审核',value:'1'},
        {label:'未通过',value:'2'}
      ],
      tableFormatList: [
        {title: '活动主题', value: 'theme', type: ''},
        {title: '活动海报', value: 'posterUrl', type: 'pic'},
        {title: '活动地址', value: 'address', type: ''},
        {title: '活动开始时间', value: 'beginTime', type: 'date'},
        {title: '活动结束时间', value: 'endTime', type: 'date'},
        {title: '是否已签到', value: 'signInFlag', type: 'flag'},
        {title: '用户签到码', value: 'signInCode', type: ''},
        {title: '用户签到时间', value: 'signInTime', type: 'date'},
      ],
      activityList: []
    }
  },
  computed: {
    queryParm() {
      let params = {}
      params.limit = this.page.pageSize
      params.offset = this.page.pageSize * (this.page.currentPage - 1)
      params.userId = this.userId
      return params
    }
  },
  methods: {
    pageChange(val) {
      this.page.currentPage = val
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.refresh()
    },
    refresh() {
      this.page.currentPage = 1
      this.getActivityListData()
    },
    getActivityListData() {
      const loading = this.$loading({fullscreen:true,lock:true})
      this.$request.get('/api/admin/member/v2/getActivitiesOfUserJoin', {params: this.queryParm}).then(res=>{
        loading.close()
        this.activityList = res.data.list;
        this.page.total=res.data.total
      })
    }
  },
  created() {
    this.getActivityListData()
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
<template>
  <el-container class="absolute-fill-parent background-color-white">
    <el-header class="border-bottom flex flex-align-center">
      <p class="title">通知公告</p>
    </el-header>
    <el-main class="position-relative padding">
      <!--      搜索区-->
      <template>
        <div class="flex padding-bottom">
          <el-input
              placeholder="请输入标题 / 创建人"
              prefix-icon="el-icon-search"
              v-model="searchInfo.title"
              size="small"
              style="width: 285px"
              class="mar-b-r"
              clearable
          >
          </el-input>
          <el-select clearable class="mar-b-r" size="small" v-model="searchInfo.source" placeholder="选择来源">
            <el-option
                v-for="sourceItem in sourceList"
                :key="'sourceItem'+sourceItem.value"
                :label="sourceItem.label"
                :value="sourceItem.value">
            </el-option>
          </el-select>
          <el-button size="small" class="primaryBtnClass" @click="searchNotice">查询</el-button>
          <el-button size="small" class="plainBtnClass" @click="clearSearch">清空</el-button>
        </div>
        <div class="padding-bottom">
          <el-button size="small" class="primaryBtnClass" @click="editCreatedNotice('')">新建</el-button>
          <el-button size="small" class="plainBtnClass" @click="addWebsiteArticle">添加站群文章</el-button>
          <el-button size="small" class="plainBtnClass" @click="addWeChatArticle">添加微信公众号文章</el-button>
        </div>
      </template>
      <!--      内容区-->
      <el-table
          ref="multipleTable"
          :data="noticeList"
          tooltip-effect="dark"
          border
          highlight-current-row
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            v-for="(tableTitle,index) of tableTitleList"
            :key="'tableTitle'+index"
            :label="tableTitle.title"
            :prop="tableTitle.value"
            :min-width="tableTitle.width"
            :fixed="tableTitle.isFixed"
            :sortable="tableTitle.sortable"
            :align="tableTitle.align"
            show-tooltip-when-overflow
        >
          <template v-if="tableTitle.value==='source'" v-slot="{row}">
            <span v-show="row.source==='0'">新建</span>
            <span v-show="row.source==='1'">站群</span>
            <span v-show="row.source==='2'">微信公众号</span>
          </template>
          <template v-else-if="tableTitle.value==='createTime'||tableTitle.value==='updateTime'" v-slot="{row}">
            {{ row[tableTitle.value] | yyyyMMdd }}
          </template>
          <template v-else-if="tableTitle.value==='enable'" v-slot="{row}">
            <el-switch
                v-model="row.enable"
                active-color="#3FA1B6"
                inactive-color="#CCCCCC"
                @change="rowChange(row.id,row.enable,'enable')"
            >
            </el-switch>
          </template>
          <div class="position-relative" v-else-if="tableTitle.value==='seq'" slot-scope="{row}">
            <el-input style="width: 86px" @change="rowChange(row.id,Number(row.seq),'seq')" placeholder="请输入排序值" size="mini"
                      type="number"
                      v-model="row.seq"></el-input>
          </div>
        </el-table-column>
        <el-table-column
            fixed="right"
            min-width="120"
            align="center"
            label="操作"
        >
          <template v-slot="{row}">
            <el-button type="text" size="small" class="custom-el-button" @click="editCreatedNotice(row.id)">编辑
            </el-button>
            <el-button type="text" size="small" class="custom-el-button danger" @click="deleteChosenData(row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="padding" height="auto">
      <div class="flex">
        <div>
          <batch-operation title="批量操作">
            <li @click="deleteChosenData('')">删除</li>
          </batch-operation>
        </div>
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
    <el-dialog :title="`添加${noConfigureType==='website'?'站群':'微信公众号'}文章`" append-to-body
               :visible.sync="dialogNoConfigureFlag" width="500px">
      <dialog-no-configure :noConfigureType="noConfigureType" v-if="dialogNoConfigureFlag"
                           @close="dialogNoConfigureFlag=false"/>
    </el-dialog>
    <el-dialog :title="configureTitle" append-to-body :visible.sync="dialogConfigureFlag" width="800px">
      <dialog-configure :noticeListLength="noticeList.length" :configureType="configureType" v-if="dialogConfigureFlag"
                        @refreshList="getList" @close="dialogConfigureFlag=false"/>
    </el-dialog>
    <el-dialog :title="editCreatedNoticeTitle" append-to-body :visible.sync="editCreatedNoticeFlag" width="800px">
      <created-notice :noticeListLength="page.total" :editCreatedNoticeId="editCreatedNoticeId"
                      v-if="editCreatedNoticeFlag"
                      @refreshList="getList" @close="editCreatedNoticeFlag=false"/>
    </el-dialog>
  </el-container>
</template>

<script>
import BatchOperation from "@/components/util/BatchOperation";
import DialogNoConfigure from "@/components/functions/tools/noticeManage/DialogNoConfigure";
import DialogConfigure from "@/components/functions/tools/noticeManage/DialogConfigure";
import CreatedNotice from "@/components/functions/tools/noticeManage/EditCreatedNotice";

export default {
  name: "NoticeManage",
  components: {BatchOperation, DialogNoConfigure, DialogConfigure, CreatedNotice},
  data() {
    return {
      tableTitleList: [
        {title: '标题', value: 'title', width: '300', align: 'left', isFixed: 'left', sortable: false},
        {title: '来源', value: 'source', width: '120', align: 'center', isFixed: false, sortable: false},
        {title: '创建人', value: 'creator', width: '120', align: 'center', isFixed: false, sortable: false},
        {title: '浏览量', value: 'views', width: '120', align: 'center', isFixed: false, sortable: true},
        {title: '创建时间', value: 'createTime', width: '120', align: 'center', isFixed: false, sortable: false},
        {title: '更新时间', value: 'updateTime', width: '120', align: 'center', isFixed: false, sortable: false},
        {title: '发布', value: 'enable', width: '120', align: 'center', isFixed: 'right', sortable: false},
        {title: '排序', value: 'seq', width: '120', align: 'center', isFixed: 'right', sortable: false},
      ],
      sourceList: [
        {value: '0', label: '新建'},
        {value: '1', label: '站群'},
        {value: '2', label: '微信公众号'}
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchInfo: {
        title: '',
        source: '',
        // createTime: '',
        // updateTime: ''
      },
      noticeList: [],
      noticeSelection: [],

      dialogNoConfigureFlag: false,
      noConfigureType: '',

      dialogConfigureFlag: false,
      configureTitle: '',
      configureType: '',

      editCreatedNoticeFlag: false,
      editCreatedNoticeTitle: '',
      editCreatedNoticeId: '',
    }
  },
  computed: {
    queryParams() {
      return {
        limit: this.page.pageSize,
        offset: this.page.pageSize * (this.page.currentPage - 1),
        searchContent: this.searchInfo.title,
        source: this.searchInfo.source,
      }
    }
  },
  methods: {
    pageChange(pageIndex) {
      this.page.currentPage = pageIndex;
      this.getList();
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.refresh()
    },
    searchNotice() {
      this.refresh()
    },
    clearSearch() {
      this.searchInfo.title = '';
      this.searchInfo.source = ''
      this.refresh()
    },
    refresh() {
      this.page.currentPage = 1
      this.getList()
    },
    getList() {
      const loading = this.$loading({fullscreen: true, lock: true});
      this.$request.get('/api/admin/mp/notice', {params: this.queryParams}).then(res => {
        loading.close()
        this.page.total = res.data.total
        this.noticeList = res.data.list
      })
    },
    handleSelectionChange(val) {
      let arr = []
      val.forEach(item => {
        arr.push(item.id)
      })
      this.noticeSelection = arr
    },
    deleteChosenData(id) {
      if (id !== '') {
        this.noticeSelection = [id]
      }
      if (this.noticeSelection.length === 0) {
        this.$message.warning('未选择任何项')
        return
      }
      this.$confirm('确定删除选中的通知公告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning"
      }).then(() => {
        this.$request.delete('/api/admin/mp/notice', {params: {ids: this.noticeSelection}}).then(() => {
          this.$message.success("删除成功");
          this.refresh()
        })
      })
    },
    editCreatedNotice(id) {
      if (id === '') {
        this.editCreatedNoticeTitle = '新建公告'
        this.editCreatedNoticeId = ''
        this.editCreatedNoticeFlag = true
      } else {
        this.editCreatedNoticeTitle = '编辑公告'
        this.editCreatedNoticeId = id
        this.editCreatedNoticeFlag = true
      }
    },
    addWebsiteArticle() {
      new Promise(resolve => {
        this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 21}}).then(res => {
          if (res.data && Object.keys(res.data).length) {
            resolve()
          } else {
            this.dialogNoConfigureFlag = true;
            this.noConfigureType = 'website'
          }
        })
      }).then(() => {

        this.dialogConfigureFlag = true;
        this.configureTitle = '添加站群文章 - 栏目：通知公告'
        this.configureType = 'website'
      })
    },
    addWeChatArticle() {
      new Promise(resolve => {
        this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 11}}).then(res => {
          if (res.data && Object.keys(res.data).length) {
            resolve()
          } else {
            this.dialogNoConfigureFlag = true;
            this.noConfigureType = 'wechat'
          }
        })
      }).then(() => {
        this.dialogConfigureFlag = true;
        this.configureTitle = '添加微信公众号文章 - 栏目：通知公告'
        this.configureType = 'wechat'
      })
    },
    rowChange(id, val,key) {
      const loading = this.$loading({fullscreen: true, lock: true})
      this.$request.put('/api/admin/mp/notice', {id:id,[key]:val}).then(() => {
        loading.close()
        this.$message.success('修改成功')
      })
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style>
/*去掉type为number的箭头*/
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
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

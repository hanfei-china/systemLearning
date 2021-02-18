<template>
  <div class="absolute-fill-parent background-color-white">
    <vue-scroll>
      <div style="padding: 16px;">
        <el-card style="margin-top: 16px;" header="站群接口配置（苏迪）" shadow="never">
          <el-form label-width="150px" size="small">
            <el-form-item label="通知公告接口地址" required>
              <el-input v-model="websiteSetting.sdNotice" placeholder="请输入苏迪-通知公告接口地址"/>
            </el-form-item>
            <el-form-item label="动态接口地址" required>
              <el-input v-model="websiteSetting.sdTrends" placeholder="请输入苏迪-动态接口地址"/>
            </el-form-item>
            <el-form-item label="校友风采接口地址" required>
              <el-input v-model="websiteSetting.sdAlumniMien" placeholder="请输入苏迪-校友风采接口地址"/>
            </el-form-item>
            <el-form-item label="新闻中心接口地址" required>
              <el-input v-model="websiteSetting.sdNews" placeholder="请输入苏迪-新闻中心接口地址"/>
            </el-form-item>
            <el-form-item>
              <div class="text-align-right">
                <el-button type="primary" @click="updateWebsiteSetting">保存配置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </vue-scroll>
  </div>
</template>

<script>

export default {
  name: "WebsiteSetting",
  data() {
    return {
      websiteSetting: {
        sdNotice: '',
        sdTrends: '',
        sdAlumniMien: '',
        sdNews: ''
      },
    }
  },
  methods: {
    updateWebsiteSetting() {
      this.$request.post('/api/admin/settings/manage/insertOrUpdateCommonSettings', {
        id: 21,
        setting: JSON.stringify(this.websiteSetting)
      }).then(()=>{
        this.$message.success('配置已更新');
      })
    },
    getSetting() {
      this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 21}}).then((res) => {
        this.websiteSetting = res.data
      })
    }
  },
  created() {
    this.getSetting();
  }
}
</script>

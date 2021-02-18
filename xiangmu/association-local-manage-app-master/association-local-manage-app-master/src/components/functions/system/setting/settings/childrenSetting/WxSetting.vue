<template>
  <div class="absolute-fill-parent background-color-white">
    <vue-scroll>
      <div style="padding: 16px;">
        <el-card header="小程序配置" shadow="never" :body-style="{ padding: '16px' }">
          <el-form label-width="95px" size="small">
            <el-form-item label="appId" required>
              <el-input v-model="mpSetting.id" placeholder="请输入小程序appId"/>
            </el-form-item>
            <el-form-item label="appSecret" required>
              <el-input v-model="mpSetting.secret" placeholder="请输入小程序appSecret"/>
            </el-form-item>
            <el-form-item label="token" required>
              <el-input v-model="mpSetting.token" placeholder="请输入小程序管理后台设置的token"/>
            </el-form-item>
            <el-form-item>
              <div class="text-align-right">
                <el-button type="primary" @click="saveSetting('updateMiniProgram',mpSetting)">保存配置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-top: 16px;" header="微信商户配置" shadow="never">
          <el-form label-width="85px" size="small">
            <el-form-item label="appId" required>
              <el-input v-model="wxPaySetting.appId" placeholder="请输入微信公众号或者小程序的appId"/>
            </el-form-item>
            <el-form-item label="商户号" required>
              <el-input v-model="wxPaySetting.mchId" placeholder="请输入微信支付商户号"/>
            </el-form-item>
            <el-form-item label="商户密钥" required>
              <el-input v-model="wxPaySetting.mchKey" placeholder="请输入微信支付商户密钥"/>
            </el-form-item>
            <el-form-item label="回调地址" required>
              <el-input v-model="wxPaySetting.notifyUrl" placeholder="支付回调地址"/>
            </el-form-item>
            <el-form-item>
              <div class="text-align-right">
                <el-button type="primary" @click="saveSetting('updateWxPay',wxPaySetting)">保存配置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-top: 16px;" header="公众号配置" shadow="never">
          <el-form label-width="85px" size="small">
            <el-form-item label="appId" required>
              <el-input v-model="wxGZHSetting.appId" placeholder="请输入公众号appId"/>
            </el-form-item>
            <el-form-item label="secret" required>
              <el-input v-model="wxGZHSetting.secret" placeholder="请输入公众号appSecret"/>
            </el-form-item>
            <el-form-item label="token" required>
              <el-input v-model="wxGZHSetting.token" placeholder="请输入公众号管理后台设置的token"/>
            </el-form-item>
            <el-form-item label="aesKey" required>
              <el-input v-model="wxGZHSetting.aesKey" placeholder="请输入公众号管理后台设置的aesKey"/>
            </el-form-item>
            <el-form-item>
              <div class="text-align-right">
                <el-button type="primary" @click="saveSetting('updateWxGZH',wxGZHSetting)">保存配置</el-button>
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
  name: "WxSetting",
  data() {
    return {
      mpSetting: {
        id: null,
        secret: null,
        token: null
      },
      wxPaySetting: {
        appId: null,
        mchId: null,
        mchKey: null,
        notifyUrl: null
      },
      wxGZHSetting: {
        appId: null,
        secret: null,
        token: null,
        aesKey: null
      },
    }
  },
  methods: {
    saveSetting(path, originalSetting) {
      let setting = {...originalSetting};
      this.$request.post(`/api/admin/settings/manage/${path}`, setting).then(() => {
        this.$message.success('配置已更新');
      })
    },
    getSetting() {
      Promise.all([this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 9}}),
        this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 10}}),
        this.$request.get('/api/admin/settings/manage/getCommonSetting', {params: {type: 11}}),
      ])
        .then(([mpRes, wxPayRes, wxGZHRes]) => {
          this.mpSetting = mpRes.data;
          this.wxPaySetting = wxPayRes.data;
          this.wxGZHSetting = wxGZHRes.data;
        })
    }
  },
  created() {
    this.getSetting();
  }
}
</script>

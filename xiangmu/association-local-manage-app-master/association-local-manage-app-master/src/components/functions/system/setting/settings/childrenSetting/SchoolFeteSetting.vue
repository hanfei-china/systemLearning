<template>
  <div class="absolute-fill-parent background-color-white">
    <vue-scroll>
      <div style="padding: 16px;">
        <el-card header="点亮地图配置" shadow="never" :body-style="{ padding: '16px' }">
          <el-form label-width="95px" size="small">
            <el-form-item label="标题" required>
              <el-input v-model="litMapSetting.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="封面图">
              <image-upload v-model="litMapSetting.homePageBackground" :attributes="{width: 200,height: 356,uploadBtnText: '上传图片',maxSize: 200 * 1024,isContain: false}">
                <span style="font-size: 12px;">点击上传</span>
              </image-upload>
            </el-form-item>
            <el-form-item label="小图一">
              <image-upload v-model="litMapSetting.mapPageBackground" :attributes="{width: 200,height: 100,uploadBtnText: '上传图片',maxSize: 200 * 1024,isContain: false}">
                <span style="font-size: 12px;">点击上传</span>
              </image-upload>
            </el-form-item>
            <el-form-item label="小图二">
              <image-upload v-model="litMapSetting.chartPageBackground" :attributes="{width: 200,height: 80,uploadBtnText: '上传图片',maxSize: 200 * 1024,isContain: false}">
                <span style="font-size: 12px;">点击上传</span>
              </image-upload>
            </el-form-item>
            <el-form-item>
              <div class="text-align-right">
                <el-button type="primary" @click="saveSetting(22,litMapSetting)">保存配置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-top: 16px;" header="校庆专属头像配置" shadow="never">
          <el-form label-width="85px" size="small">
            <el-form-item label="标题" required>
              <el-input v-model="avatarSetting.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="封面图">
              <image-upload v-model="avatarSetting.homePageBackground" :attributes="{width: 200,height: 356,uploadBtnText: '上传图片',maxSize: 200 * 1024,isContain: false}">
                <span style="font-size: 12px;">点击上传</span>
              </image-upload>
            </el-form-item>

            <template v-for="(item, index) in avatarSetting.avatars">
              <el-form-item label="头像样式" :key="index" class="headitem">
                <image-upload class="headbox" unrestricted  v-model="item.image" :attributes="{width: 180,height: 180,uploadBtnText: '上传图片',maxSize: 200 * 1024,isContain: false}">
                  <span style="font-size: 12px;">点击上传</span>
                </image-upload>
                <el-input class="scaleinp" v-model="item.scale" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
                <i v-if="avatarSetting.avatars.length !== 1" @click="removeEnvironmentForm(item)" style="font-size:28px;cursor:pointer;margin-right:30px;" class="el-icon-delete"></i>
                <el-button @click="addEnvironmentForm" size="mini" class="el-icon-plus"></el-button>
              </el-form-item>
            </template>
            <el-form-item>
              <div class="text-align-right">
                <el-button type="primary" @click="saveSetting(23,avatarSetting)">保存配置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </vue-scroll>
  </div>
</template>

<script>

import ImageUpload from "@/components/util/ImageUpload";

export default {
  name: "SchoolFeteSetting",
  components: { ImageUpload },
  data() {
    return {
      litMapSetting: {
        title: null,
        homePageBackground: null,
        mapPageBackground: null,
        chartPageBackground: null
      },
      avatarSetting: {
        title: null,
        homePageBackground: null,
        avatars: []
      }
    }
  },
  methods: {
    saveSetting(id, settings) {
      let setting = {
        id: id,
        setting: JSON.stringify(settings)
      };
      this.$request.post(`/api/admin/settings/manage/insertOrUpdateCommonSettings`, setting).then(() => {
        this.$message.success('配置已更新');
      })
    },
    getSetting() {
      Promise.all([
        this.$request.get('/api/admin/settings/manage/getCommonSetting', { params: { type: 22 } }),
        this.$request.get('/api/admin/settings/manage/getCommonSetting', { params: { type: 23 } }),
      ])
        .then(([litMapResult, avatarResult]) => {
          this.litMapSetting = litMapResult.data ? JSON.parse(litMapResult.data) : this.litMapSetting;
          this.avatarSetting = avatarResult.data ? JSON.parse(avatarResult.data) : this.avatarSetting;
        })
    },
    removeEnvironmentForm(item) {
      let index = this.avatarSetting.avatars.indexOf(item)
      if (index !== -1) {
        this.avatarSetting.avatars.splice(index, 1)
      }
    },
    addEnvironmentForm() {
      this.avatarSetting.avatars.push({
        image: '',
        scale: 0.5
      });
    }
  },
  created() {
    this.getSetting();
  }
}
</script>

<style lang="less" scoped>
.headitem{
  /deep/.el-form-item__content{
    display: flex;
    align-items: center;
    .headbox{
      /deep/.lrd-image-upload-attr-image-preview{
        width: 180px;
        flex-shrink: 0;
      }
    }
    .scaleinp{
      width: 140px;
      margin:0 30px;
    }
  }
}
</style>

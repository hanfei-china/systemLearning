<template>
  <div class="flex flex-fill-in-the-remaining-space">
    <!--            图片-->
    <div style="width: 185px;">
      <div class="border"
           style="background: rgba(248, 248, 248, 0.5);width: 100%;height:100px;position: relative;box-sizing: border-box"
      >
        <div class="img-cover" v-if="editBanner.picture">
          <img :src="editBanner.picture" style="width: 100%;height: 100px;object-fit: cover">
          <div class="cover-inner">
            <el-upload
                :action="action"
                :show-file-list="false"
                :on-change='changeUpload'
            >
              <i class="el-icon-edit-outline"></i>
            </el-upload>
            <i @click="deleteImg" class="el-icon-delete"></i>
            <i @click="cropImg" class="el-icon-crop"></i>
          </div>
        </div>
        <el-upload
            v-else
            class="flex-align-center flex-center"
            :action="action"
            :show-file-list="false"
            :on-change='changeUpload'
        >
          <div class="flex flex-column flex-align-center flex-center"
               style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;">
            <i class="el-icon-plus avatar-uploader-icon"
               style="color: #63BCC0;font-size: 18px;font-weight:bold"></i>
            <span style="font-size: 12px;line-height:12px;color: #63BCC0;margin-top: 16px">添加图片</span>
          </div>
        </el-upload>
      </div>
    </div>
    <!--            内容-->
    <div style="margin-left: 23px;padding-right: 30px;" class="flex-fill-in-the-remaining-space">
      <!--              标题-->
      <div class="flex">
        <el-input class="flex-fill-in-the-remaining-space" placeholder="请输入标题" size="small"
                  v-model="editBanner.title"/>
        <div style="width: 150px" class="flex flex-end">
          <span>{{ editBanner.enable ? '启用' : '未启用' }}</span>
          <el-switch style="margin-left: 10px;" v-model="editBanner.enable"/>
        </div>
      </div>
      <!--              描述-->
      <div class="flex flex-align-center border-top border-bottom" style="padding: 6px 0;margin-top: 14px">
        <span style="white-space: nowrap;color: #888888">跳转链接</span>
        <span style="width: 1px;height: 20px;background: #E8E8E8;margin: 0 14px"></span>
        <el-select @change="editBanner.link=''" v-model="editBanner.linkType" size="small"
                   style="margin-right: 13px;width: 100px">
          <el-option v-for="jumpItem in jumpOptions" :key="'jumpItem'+jumpItem.key" :label="jumpItem.title"
                     :value="jumpItem.key"></el-option>
        </el-select>
        <div class="flex-fill-in-the-remaining-space">
          <div v-show="editBanner.linkType==='1'">
            <el-cascader placeholder="请选择内容" size="small" filterable clearable style="width: 100%"
                         v-model="editBanner.link" :props="lazyContent"/>
          </div>
          <div v-show="editBanner.linkType==='2'">
            <el-cascader placeholder="请选择活动" filterable size="small" clearable style="width: 100%"
                         v-model="editBanner.link" :props="lazyActivity"/>
          </div>
          <div v-show="editBanner.linkType==='3'">
            <el-cascader placeholder="请选择商品" filterable size="small" clearable
                         style="width: 100%"
                         v-model="editBanner.link" :props="lazyGoods"/>
          </div>
          <div v-show="editBanner.linkType==='6'">
            <el-input placeholder="请输入链接" size="small" clearable
                      v-model="editBanner.link"></el-input>
          </div>
        </div>
        <div style="width: 150px" class="flex flex-end">
          <el-button type="text" @click="bannerSave()">确定</el-button>
          <el-button type="text" @click="$emit('close')">取消</el-button>
        </div>
      </div>
    </div>
    <crop-img :cropperImg="cropperImg" :cropperDialog="cropperDialog" :fileInfo="fileInfo"
              @getUrlData="getUrlData" @getCropperDialog="getCropperDialog"></crop-img>
  </div>
</template>

<script>
import {requestBaseUrl} from "@/js/config/serviceConfig";
import CropImg from './CropImg'

export default {
  name: "EditCarouse",
  props: {
    editId: {
      type: String,
      default: ''
    },
    total: {
      type: Number
    }
  },
  components: {CropImg},
  data() {
    return {
      timer: null,
      editBanner: {},
      action: requestBaseUrl + "/api/common/anon/uploadFile", //图片上传地址,
      jumpOptions: [
        {key: '0', title: '不跳转'},
        {key: '1', title: '图文'},
        {key: '2', title: '活动'},
        {key: '3', title: '商城宝贝'},
        {key: '6', title: '外部链接 '}
      ],
      //手动上传的图片
      fileInfo: null,
      //图片裁剪弹框
      cropperDialog: false,
      //传递给cropperImg组件的图片
      cropperImg: '',
    }
  },
  computed: {
    lazyContent() {
      return {
        lazy: true,
        lazyLoad: this.lazyContentLoad,
      }
    },
    lazyActivity() {
      return {
        lazy: true,
        lazyLoad: this.lazyActivityLoad,
      }
    },
    lazyGoods() {
      return {
        lazy: true,
        lazyLoad: this.lazyGoodsLoad,
      }
    }
  },
  methods: {
    //截取海报组件
    getUrlData(data) {
      this.editBanner.picture = data
    },
    getCropperDialog(data) {
      this.cropperDialog = data;
    },
    // 内容级联
    async lazyContentLoad(node, resolve) {
      const {level} = node;
      if (level === 0) {
        await this.$request.get('/api/admin/contentClass/list',).then(res => {
          const nodes = res.data.map(item => ({
            value: item.id,
            label: item.title,
          }))
          resolve(nodes)
        })
      } else if (level === 1) {
        await this.$request.get('/api/common/content/anon/list', {
          params: {
            classId: node.value,
            title: '',
            limit: 1000,
            offset: 0,
            topModel: true,
            isAdmin: true
          }
        }).then(res => {
          const nodes = res.data.list.map(item => ({
            value: item.id,
            label: item.title,
            leaf: level >= 1
          }))
          resolve(nodes)
        })
      }
    },
    async lazyActivityLoad(node, resolve) {
      const {level} = node;
      await this.$request.get('/api/admin/activityInfo/getActivityInfosOfMyBranch', {
        params: {
          activityCategoryId: "",
          activityTitle: "",
          condition: 0,
          limit: 1000,
          offset: 0,
          branchId: "",
          activityStatus: "",
          isPublic: ""
        }
      }).then(res => {
        const nodes = res.data.list.map(item => ({
          value: item.id,
          label: item.theme,
          leaf: level >= 0
        }))
        resolve(nodes)
      })
    },
    async lazyGoodsLoad(node, resolve) {
      const {level} = node;
      if (level === 0) {
        await this.$request.get('api/admin/goods/category/getGoodsCategory')
            .then(res => {
              const nodes = res.data.map(item => ({
                value: item.id,
                label: item.title,
              }))
              resolve(nodes)
            })
      } else if (level === 1) {
        await this.$request.get('/api/admin/goods/listGoodsInfoForAdmin', {
          params: {
            categoryId: node.value,
            limit: 1000,
            offset: 0,
            searchContent: ''
          }
        }).then(res => {
          const nodes = res.data.list.map(item => ({
            value: item.id,
            label: item.goodsName,
            leaf: level >= 1
          }))
          resolve(nodes)
        })
      }

    },
    // 图片处理
    deleteImg() {
      this.editBanner.picture = ''
    },
    cropImg() {
      let index = this.editBanner.picture.lastIndexOf('/')
      let str = this.editBanner.picture.substring(index + 1)
      this.fileInfo = {name: str}
      this.cropperImg = this.editBanner.picture
      this.getCropperDialog(true)
    },
    //上传图片
    changeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传封面图片大小不能超过 5MB!");
      }
      this.fileInfo = file;
      // 上传成功后将图片地址赋值给裁剪框显示图片
      if (file.response) {
        this.$nextTick(() => {
          this.cropperImg = file.response.data;
          this.cropperDialog = true
        })
      }
    },
    // 保存
    bannerSave() {
      if (!this.editBanner.picture) {
        this.$message.warning('请上传图片')
        return
      }
      if (!this.editBanner.title) {
        this.$message.warning('请输入标题')
        return;
      }
      if (!this.editBanner.linkType) {
        this.$message.warning('请输入/选择跳转链接')
        return;
      }
      if ((!this.editBanner.link || this.editBanner.link.length === 0) && this.editBanner.linkType !== '0') {
        this.$message.warning('请输入/选择跳转链接')
        return;
      }
      let params = {
        ...this.editBanner,
        link:['1','2','3'].includes(this.editBanner.linkType)?JSON.stringify(this.editBanner.link):this.editBanner.link,
        createTime: this.editBanner.createTime?this.editBanner.createTime:new Date().getTime()
      }
      if (this.editBanner.id) {
        this.$request.put('/api/admin/mp/banner', params)
            .then(() => {
              this.$message.success('修改成功')
              this.$emit('close')
              this.$emit('refresh')
            })
      } else {
        this.$request.post('/api/admin/mp/banner', params)
            .then(() => {
              this.$message.success('添加成功')
              this.$emit('close')
              this.$emit('refresh')
            })
      }
    },
    // 获取编辑项数据
    getBannerItem(id) {
      this.$request.get('/api/admin/mp/banner/detail', {params: {id: id}}).then(res => {
        let obj = {
          ...res.data,
          link:['1','2','3'].includes(res.data.linkType)?JSON.parse(res.data.link):res.data.link
        }

        this.editBanner = obj
      })
    }
  },
  created() {
    if (this.editId.length) {
      this.getBannerItem(this.editId)
    } else {
      this.editBanner = {
        createTime:'',
        enable: false,
        link: null,
        linkType: "",
        picture: "",
        seq: this.total,
        title: ""
      }
    }
  }
}

</script>

<style scoped lang="less">
.flex-align-center {
  align-items: center;
}

.img-cover:hover {
  width: 100%;
  height: 100px;
  position: relative;

  .cover-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transition: 0.3s;
    display: flex;
    justify-content: space-evenly;
    align-items: flex-end;

    i {
      cursor: pointer;
      line-height: 40px;
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      color: white;
    }
  }
}
</style>
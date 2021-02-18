<template>
  <el-container class="absolute-fill-parent">
    <el-header class="header flex border-bottom" style="line-height: 60px;">
      <div class="flex-fill-in-the-remaining-space">{{formTitle}}</div>
      <div>
        <el-button size="small" icon="el-icon-circle-close" type="danger" @click="$emit('closeAdd')">取消返回</el-button>
        <el-button size="small" icon="el-icon-success" type="primary" @click="toSave">保存</el-button>
      </div>
    </el-header>
    <el-main>
      <vue-scroll>
        <div class="onlineMallForm">
          <el-form label-width="150px" size="small">
            <el-form-item>
              <span slot="label">
                <i class="required">*</i>商品名称
              </span>
              <el-input maxlength="64" placeholder="请输入商品名称，64字以内" v-model="goodsName"></el-input>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <i class="required">*</i>商品价格
              </span>
              <el-input placeholder="请输入商品价格，需不小于0，精确到小数点后两位，0表示该商品免费" v-model="price"></el-input>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <i class="required">*</i>商品总量
              </span>
              <el-input placeholder="请输入商品总量，总量应大于1" v-model="goodsNum"></el-input>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <i class="required">*</i>商品分类
              </span>
              <el-select v-model="categoryId">
                <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.title"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span slot="label">所需积分</span>
              <el-input placeholder="请输入商品所需积分" v-model="integral"></el-input>
            </el-form-item>
            <el-form-item>
              <span slot="label">每人限购数量</span>
              <el-input placeholder="请输入每人限购数量" type="number" v-model.number="limitedNum"></el-input>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <i class="required">*</i>上架
              </span>
              <el-switch v-model="isShelves"></el-switch>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <i class="required">*</i>海报
              </span>
              <div class="flex">
                <div class="posterNew">
                  <div class="posterNewItem" v-for="(item,index) in posterUrl" :key="index">
                    <img :src="item" style="display:block;width:100%;height:100%;" />
                    <div class="posterNewIcon" @click="deletImage(item)">
                      <i class="el-icon-circle-close" style="width:100%;height:100%;color:red;"></i>
                    </div>
                  </div>
                </div>
                <!-- <div class="posterNew" v-else>
                  <el-image
                    v-for="(item,index) in posterImage"
                    :key="index"
                    :src="item"
                    style="width: 200px;height: 190px;margin:0 15px 10px 0;"
                    fit="cover"
                  ></el-image>
                </div> -->
                <div class="flex flex-column flex-end" style="padding-left: 10px;">
                  <div>
                    <span style="color: red;font-size: 12px;">请上传234*220的或相同比例的图片，单张图片质量应小于1M</span>
                  </div>
                  <div>
                    <el-upload :action="action" :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" accept="image/png, image/jpeg, image/gif, image/jpg" multiple :limit="9"
                      :on-exceed="exceedImage">
                      <el-button size="small" type="primary">上传海报</el-button>
                    </el-upload>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="商品详情">
              <editor v-model="details"></editor>
            </el-form-item>
          </el-form>
        </div>
      </vue-scroll>
    </el-main>
  </el-container>
</template>

<script>
import Editor from "../../../../util/editor/Editor";
import { requestBaseUrl } from "../../../../../js/config/serviceConfig";

export default {
  name: "GoodsForm",
  components: { Editor },
  props: ["goodsInfo", "formTitle"],
  data() {
    return {
      action: requestBaseUrl + "/api/common/anon/uploadFile", //图片上传地址
      categoryList: [], //商品分类列表

      categoryId: "", //分类id
      details: "", //详情
      goodsName: "", //商品名称
      goodsNum: "", //商品数量
      integral: "", //商品积分
      limitedNum:"", //限购数量
      isShelves: false, //是否上架
      posterUrl: [], //海报url
      price: "", //价格
      posterImage: [], //上传的图片
    };
  },
  created() {
    this.getCategoryList();
    this.getGoodsInfo();
  },
  methods: {
    //编辑的商品信息
    getGoodsInfo() {
      // if (this.goodsInfo) {
      //     this.goodsName = this.goodsInfo.goodsName;
      //     this.price = this.goodsInfo.price;
      //     this.goodsNum = this.goodsInfo.goodsNum;
      //     this.integral = this.goodsInfo.integral;
      //     this.categoryId = this.goodsInfo.categoryId;
      //     this.isShelves = this.goodsInfo.isShelves;
      //     this.posterUrl = this.goodsInfo.posterUrl;
      //     this.details = this.goodsInfo.details;
      // }
      if (this.goodsInfo) {
        this.$request
          .get("/api/common/goods/getGoodsDetails?goodsId=" + this.goodsInfo.id)
          .then((res) => {
            this.goodsName = res.data.goodsName;
            this.price = res.data.price;
            this.goodsNum = res.data.goodsNum;
            this.integral = res.data.integral;
            this.limitedNum = res.data.limitedNum,
            this.categoryId = res.data.categoryId;
            this.isShelves = res.data.isShelves;
            this.posterUrl = res.data.posterUrls;
            this.details = res.data.details;
          });
      }
    },

    // 上传本地图片   限制图片大小
    beforeAvatarUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
        return false;
      }
    },
    handleAvatarSuccess(res, file) {
      // console.log(file.response)
      this.posterUrl.push(file.response.data);
      // this.posterImage.push(file.response.data);
    },
    //获取商品分类
    getCategoryList() {
      this.$request
        .get("/api/admin/goods/category/getGoodsCategory")
        .then((res) => {
          if (res.success) {
            this.categoryList = res.data;
          }
        });
    },
    //保存
    toSave() {
      if (!this.goodsName) {
        this.$message.error("请输入商品名称");
        return;
      }

      if (!this.goodsNum) {
        this.$message.error("请输入商品数量");
        return;
      }

      if (!this.categoryId) {
        this.$message.error("请输入商品分类");
        return;
      }

      if (!this.posterUrl) {
        this.$message.error("请上传商品海报");
        return;
      }

      if (!this.price) {
        this.price = 0;
      }

      let params = {
        goodsName: this.goodsName,
        price: this.price,
        goodsNum: this.goodsNum,
        integral: Number(this.integral),
        limitedNum:this.limitedNum,
        categoryId: this.categoryId,
        isShelves: this.isShelves,
        posterUrl: this.posterUrl,
        details: this.details,
      };

      if (this.goodsInfo) {
        this.$request
          .post("/api/admin/goods/updateGoods", {
            goodsName: this.goodsName,
            price: this.price,
            goodsNum: this.goodsNum,
            integral: Number(this.integral),
            limitedNum:this.limitedNum,
            categoryId: this.categoryId,
            isShelves: this.isShelves,
            posterUrl: this.posterUrl,
            // posterUrl:
            //   this.posterImage.length == 0 ? this.posterUrl : this.posterImage,
            details: this.details,
            id: this.goodsInfo.id,
          })
          .then((res) => {
            if (res.success) {
              this.$message.success("编辑成功");
              this.$emit("refresh");
            }
          });
      } else {
        this.$request.post("/api/admin/goods/addGoods", params).then((res) => {
          if (res.success) {
            this.$message.success("新增成功");
            this.$emit("refresh");
          }
        });
      }
    },
    //上传图片超出限制时的钩子函数
    exceedImage() {
      this.$message({
        type: "info",
        message: "最多上传9张图片",
      });
    },
    //删除图片后的钩子函数
    deletImage(url) {
      this.posterUrl = this.posterUrl.filter((item) => {
        return item !== url;
      });
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
}
.posterNew {
  width: 100%;
  display: flex;
  background-color: #fff;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.posterNewItem {
  position: relative;
  width: 200px;
  height: 190px;
  margin: 0 15px 10px 0;
}
.posterNewIcon {
  position: absolute;
  top: 10px;
  left: 0px;
  width: 30px;
  height: 30px;
  padding-left: 10px;
}
</style>

<template>
    <el-dialog :visible.sync="visible" :append-to-body="true" width="680px" :close-on-click-modal="false" :show-close="false">
        <div class="el-dialogInner">
            <div class="uploadPic-wrap">
                <el-upload :action="action" :show-file-list="false" :on-change='changeUpload'
                           accept="image/png,image/jpeg,image/gif,image/jpg" class="myupload-input">
                    <div>
                        <div>
                            <img src="../../../../../assets/add.png" alt="上传图片">
                        </div>
                        <div class="upload-desc">从电脑中上传图片</div>
                        <div class="upload-suggestion">建议尺寸700*375，不大于1M</div>
                    </div>
                </el-upload>
            </div>
            <div class="pic-arr-title">
                    <span class="pic-btn" :class="{active :classifyActiveId === -1}"
                          @click.stop="getPosterDataList()">全部</span>
                <span v-for="item in posterClassifyList" :key="item.id" @click="getPosterDataList(item.id)">
                        <span class="pic-btn" :class="{active :classifyActiveId === item.id}" v-if="item.isUsed">
                            {{item.title}}
                        </span>
                    </span>
            </div>
            <vue-scroll>
                <div class="nav_wrap" v-infinite-scroll="load">
                    <div class="system-pic" v-for="item in posterDataList" :key="item.id" @click="setImgUrl(item)">
                        <img :src="item.posterUrl">
                        <i class="iconfont icon-queding2 sureIcon1" :class="{sureIcon:sureIcon === item.id}"></i>
                    </div>
                </div>
            </vue-scroll>
        </div>
        <span slot="footer">
            <el-button size="small" @click="close">取消</el-button>
            <el-button type="primary" size="small" @click="uploaded">确定</el-button>
        </span>

        <!-- vueCropper 剪裁图片实现-->
        <cropper-img :cropperImg="cropperImg" :cropperDialog="cropperDialog" :fileInfo="fileInfo"
                     @getUrlData="getUrlData" @getDialog="getDialog" @getCropperDialog="getCropperDialog"></cropper-img>
    </el-dialog>
</template>

<script>
    import {requestBaseUrl} from '../../../../../js/config/serviceConfig';
    import CropperImg from '../util/CropperImg';

    export default {
        name: "UploadImg",
        components: {CropperImg},
        props: ["visible","value"],
        model:{
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                //海报列表
                posterDataList: [],
                //海报分类列表
                posterClassifyList: [],
                //海报总数
                posterTotalCount: 0,
                //查询条数
                posterCount: 9,
                //查询海报偏移量
                posterOffset: 0,
                //给选定的分类加class
                classifyActiveId: -1,
                //选定的图片的确定图标
                sureIcon: '',
                //图片上传地址
                action: requestBaseUrl + '/api/common/anon/uploadFile',

                //手动上传的图片
                fileInfo: "",

                //图片裁剪弹框
                cropperDialog: false,
                //传递给cropperImg组件的图片
                cropperImg: '',

                imgUrl: ''
            }
        },
        mounted() {
            this.getPosterClassifyList();//获取海报分类
            this.getPosterDataList();//获取海报图片
        },
        methods: {
            // 上传本地图片   限制图片大小
            changeUpload(file) {
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    this.$message.error('上传文件大小不能超过 1MB!');
                    return false
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
            //获取海报分类
            getPosterClassifyList() {
                this.$request.get('/api/admin/activity/poster/category/list', {}).then(res => {
                    if (res.success) {
                        this.posterClassifyList = res.data
                    }
                })
            },
            //获取海报
            getPosterDataList(id) {
                let params = {};
                if (id) {
                    this.classifyActiveId = id;
                    params = {
                        categoryId: id,
                        limit: this.posterCount,
                        offset: this.posterOffset
                    }
                } else {
                    this.classifyActiveId = -1;
                    params = {
                        limit: this.posterCount,
                        offset: this.posterOffset
                    }
                }
                this.$request.get('/api/admin/activity/poster/getPosterByCondition', {params: params}).then(res => {
                    if (res.success) {
                        this.posterTotalCount = res.data.total;
                        this.posterDataList = res.data.list
                    }
                })
            },
            load() {
                if (this.posterCount < this.posterTotalCount) {
                    this.posterCount += 6;
                    this.getPosterDataList()
                }
            },
            //上传海报
            setImgUrl(item) {
                this.sureIcon = item.id;
                this.imgUrl = item.posterUrl;
            },
            uploaded() {
                this.$emit("change",this.imgUrl);
                this.close();

            },
            close() {
                this.$emit("update:visible",false);
            },

            //截取海报组件
            getUrlData(data) {
                this.$emit("change",data);
                this.close();
            },
            getDialog(data) {
                this.cropperDialog = data;
                this.close();
            },
            getCropperDialog(data) {
                this.cropperDialog = data;
            },
        }
    }
</script>

<style scoped>
    .el-dialogInner .uploadPic-wrap {
        width: 640px;
        height: 145px;
        background-color: #f3f3f3;
        text-align: center;
        cursor: pointer;
        position: relative;
    }

    .el-dialogInner .uploadPic-wrap .myupload-input {
        position: absolute;
        width: 640px;
        height: 145px;
        left: 0;
        top: 0;

        display: flex;
        -ms-flex-pack: center;
        justify-content: center;
        -ms-flex-align: center;
        align-items: center;
        margin: 0 auto;
    }

    .el-dialogInner .uploadPic-wrap .upload-desc {
        color: #3a3a3a;
        line-height: 14px;
        margin-top: 12px;
    }

    .el-dialogInner .uploadPic-wrap .upload-suggestion {
        color: #b4b4b4;
        font-size: 12px;
        line-height: 12px;
        margin-top: 17px;
    }

    .el-dialogInner .pic-arr-title {
        margin-top: 12px;
    }

    .el-dialogInner .pic-arr-title .pic-btn {
        display: inline-block;
        min-width: 80px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        border: 1px solid #b4b4b4;
        border-radius: 4px;
        color: #b4b4b4;
        justify-content: center;
        transition: all .4s ease;
    }

    .el-dialogInner .pic-arr-title .pic-btn.active {
        color: #48a6d6;
        border-color: #48a6d6;
        transition: all .4s ease;
    }

    .el-dialogInner .nav_wrap {
        height: 300px;
        /*margin-top: 10px;*/
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .el-dialogInner .nav_wrap .system-pic {
        height: 114px;
        margin-bottom: 15px;
        cursor: pointer;
        position: relative;
    }

    .el-dialogInner .nav_wrap .system-pic .sureIcon1 {
        font-size: 30px;
        color: #FFFFFF;
        position: absolute;
        right: 8px;
        top: 5px;
        display: none;
    }

    .el-dialogInner .nav_wrap .system-pic .sureIcon {
        display: block;
    }

    .el-dialogInner .nav_wrap .system-pic img {
        width: 194px;
        height: 104px;
    }
</style>

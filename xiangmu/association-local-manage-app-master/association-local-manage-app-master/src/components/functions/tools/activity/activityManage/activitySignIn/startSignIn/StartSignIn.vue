<template>
    <el-container class="absolute-fill-parent">
        <el-header class="border-bottom" style="padding-top: 18px;">
            <el-page-header @back="$emit('close')"
                            :content="'开始签到(' + `${signLocationForm.address}` + ')'"/>
        </el-header>
        <el-main class="position-relative">
            <el-container class="absolute-fill-parent">
                <el-main class="position-relative unset-padding">
                    <template v-if="searchInputStatus">
                        <el-container class="is-vertical absolute-fill-parent">
                            <el-main style="padding-top: 100px;">
                                <div class="text-align-center" style="padding-bottom: 20px;">
                                    <div class="text-align-center">
                                        <div>
                                            <canvas v-if="signLocationForm.qrCode" ref="canvas" style="width: 180px;height: 180px;"/>
                                        </div>
                                        <img @load="drawCanvas" ref="image" crossorigin="anonymous" :src="signLocationForm.qrCode"
                                             style="width: 180px; height: 180px;display: none;"/>
                                        <div style="font-size: 14px;padding-top:0;height: 35px;text-align: center;"><a @click.stop="downloadCode" class="lrd-a"><i class="el-icon-download" style="padding-right: 6px;"/>下载活动签到二维码</a></div>
                                    </div>
                                </div>
                                <div class="flex flex-center" >
                                    <div style="width: 500px;">
                                        <el-input ref="input" v-model="searchStr" placeholder="请输入签到码、姓名或手机号获取"
                                                  @keyup.enter.native="getActivityRegister">
                                            <el-button slot="append" type="primary" size="small"
                                                       @click="getActivityRegister">搜索
                                            </el-button>
                                        </el-input>
                                    </div>
                                    <div style="margin-left: 30px;height: 40px;" class="flex flex-column flex-center">
                                        <el-checkbox v-model="autoSignIn" style="color: #409EFF;">自动签到</el-checkbox>
                                    </div>
                                </div>
                            </el-main>
                        </el-container>
                    </template>
                    <template v-else>
                        <sign-card v-if="totalCount > 0" :signUserInfo="signUserInfo" :total="totalCount"
                                   :searchStr="searchStr"
                                   :autoSignIn="autoSignIn" :addressSignId="signLocationForm.id" @cancel="cancel"/>
                    </template>

                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import SignCard from './SignCard'
    import {download} from "../../../../../../../js/util/download";

    export default {
        name: "StartSignIn",
        components: {SignCard},
        props: ['activityId', 'signLocationForm'],
        inject: ['activityInfo'],
        data() {
            return {
                searchStr: '',//搜索的值
                currentPage: 1,
                pageSize: 1,
                autoSignIn: false,//是否自动签到
                searchInputStatus: true,//是否显示搜索框

                signUserInfo: null,//用户信息
                totalCount: 0,//总数
            }
        },
        methods: {
            getActivityRegister() {

                this.$request.get('/api/admin/activity/address/getActivityRegisterInfoBySignInCode', {
                    params: {
                        activityId: this.activityId,
                        limit: this.pageSize,
                        offset: (this.currentPage - 1) * this.pageSize,
                        searchStr: this.searchStr
                    }
                }).then(res => {
                    if (res.success) {
                        let {total,list} = res.data;
                        if(total > 0){
                            this.signUserInfo = list[0];
                            this.searchInputStatus = false;
                        }else{
                            this.$message.warning('未查询到有效的报名记录');
                        }
                        this.totalCount = total;
                    }
                })
            },
            cancel() {
                this.searchInputStatus = true;
                this.signUserInfo = null;
                this.totalCount = 0;
            },
            drawCanvas() {
                let canvas = this.$refs.canvas;
                let image = this.$refs.image;
                canvas.width = image.width;
                canvas.height = image.height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
            },
            downloadCode() {
                let data = this.$refs.canvas.toDataURL('image/png', 1);
                download(data, `${this.activityInfo.theme}-${this.signLocationForm.address}.png`, "image/png");
            },
        },
        mounted() {
            this.$refs.input.focus();
        }
    }
</script>

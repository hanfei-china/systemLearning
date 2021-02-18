<template>
    <div class="absolute-fill-parent flex flex-column flex-center background-color-white" v-loading="loading"
         :element-loading-text="loadingText"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255, 255, 255, .1)">
        <a v-show="!loading" class="website-pro-to-design website-pro-position-relative" :href="src" target="_blank">
            <div class="website-pro-flex">
                <div style="width: 70px;">
                    <i style="font-size: 60px;" class="el-icon-s-promotion"/>
                </div>
                <div class="flex-fill-in-the-remaining-space" style="font-size: 14px;padding-top: 14px;">
                    首页设计需打开新的窗口，<a>点击这里</a>去设计【{{roleName}}】首页吧
                </div>
            </div>
        </a>
    </div>
</template>

<script>
    import WsCellContainer from "../../../../tools/websitePro/js/modules/layout/wsCell/wsCellContainer";
    export default {
        name: "MemberHomepageDesign",
        props:{
            roleId: String,
            roleName: String
        },
        data() {
            return {
                loading: true,
                loadingText: '数据请求中...',
            }
        },
        computed:{
            src(){
                return this.$router.resolve({path:`/portal/design/${this.roleId}`}).href;
            }
        },
        methods: {
            getWebsiteInfo() {
                this.loading = true;
                this.loadingText = '数据请求中...';

                this.$request.post(`api/admin/designTemplate/portal/${this.roleId}`,{templateConfig: JSON.stringify(new WsCellContainer({}).toJson())}).then(()=>{
                    this.loadingText = '数据初始化成功';
                    setTimeout(()=>{
                        this.$nextTick(()=>{ this.loading = false; })
                    },500);
                });
            },
        },
        created() {
            this.$nextTick(()=>{ this.loading = false; })
            this.getWebsiteInfo();
        },
        watch:{
            roleId(){
                this.getWebsiteInfo();
            }
        }
    }
</script>

<template>
    <div class="absolute-fill-parent flex flex-column flex-center background-color-white" v-loading="loading"
         :element-loading-text="loadingText"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.1)">
        <a v-show="!loading" class="website-pro-to-design website-pro-position-relative" :href="src" target="_blank">
            <div class="website-pro-flex">
                <div style="width: 70px;">
                    <i style="font-size: 60px;" class="el-icon-s-promotion"></i>
                </div>
                <div class="flex-fill-in-the-remaining-space" style="font-size: 14px;padding-top: 12px;">
                    网站设计需打开新的窗口，<a>点击这里</a>去管理和设计你的网站吧
                </div>
            </div>
        </a>
    </div>
</template>

<script>

    export default {
        name: "DesignBase",
        data() {
            return {
                loading: true,
                loadingText: '数据请求中...',
                src:''
            }
        },
        methods: {
            getWebsiteInfo() {
                this.loading = true;
                this.loadingText = '数据请求中...';
                this.$request.get('/api/admin/website').then(res=>{
                    let {data} = res;
                    if (data.pageMains.length < 1) {
                        this.$request.post('/api/admin/website/pageMain',{title: '页面', modules: '[]', otherSetting: '{}'}).then(res=>{
                            let {data:pageId} = res;
                            this.loadingText = '数据初始化成功';
                            this.src = this.$router.resolve({path:`/website/design/${pageId}/main`}).href;
                            setTimeout(()=>{
                                this.$nextTick(()=>{ this.loading = false; })
                            },500);
                        });
                    } else {
                        this.loadingText = '数据初始化成功';
                        this.src = this.$router.resolve({path:`/website/design/${data.pageMains[0].id}/main`}).href;
                        setTimeout(()=>{
                            this.$nextTick(()=>{ this.loading = false; })
                        },500);
                    }
                });
            },
        },
        created() {
            this.$nextTick(()=>{ this.loading = false; })
            this.getWebsiteInfo();
        }
    }
</script>

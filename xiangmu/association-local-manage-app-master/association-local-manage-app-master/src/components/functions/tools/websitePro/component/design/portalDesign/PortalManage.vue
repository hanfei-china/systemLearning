<template>
    <div class="absolute-fill-parent flex flex-column flex-center background-color-white" v-loading="loading"
         :element-loading-text="loadingText"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.1)">
        <a v-show="!loading" class="website-pro-to-design website-pro-position-relative" :href="src" target="_blank">
            <div class="website-pro-flex">
                <div style="width: 70px;">
                    <i style="font-size: 60px;" class="el-icon-s-promotion"/>
                </div>
                <div class="flex-fill-in-the-remaining-space" style="font-size: 14px;padding-top: 14px;">
                    {{moduleName}}设计需打开新的窗口，<a>点击这里</a>去设计{{moduleName}}吧
                </div>
            </div>
        </a>
    </div>
</template>

<script>
    import WsCellContainer from "../../../js/modules/layout/wsCell/wsCellContainer";
    export default {
        name: "PortalManage",
        data() {
            return {
                loading: true,
                loadingText: '数据请求中...',
                src:''
            }
        },
        computed:{
            moduleId(){
                return this.$route.params.moduleId
            },
            moduleName(){
                if(this.moduleId === 'main'){
                    return '总会首页';
                }else if(this.moduleId === 'branch'){
                    return '分会首页';
                }else if(this.moduleId === 'member'){
                    return '个人会员首页';
                }else if(this.moduleId === 'groupMember'){
                    return '团体会员首页';
                }else{
                    return '';
                }
            },
        },
        methods: {
            getWebsiteInfo() {
                this.loading = true;
                this.loadingText = '数据请求中...';
                let params = {
                    limit: 10,
                    offset: 0,
                    templateType: 2
                };

                this.$request.post('/api/common/designTemplate/list',params).then(res=>{
                    let {data} = res;
                    this.list = data.list;
                    if(data.list.length < 1){
                        this.$request.post('api/admin/designTemplate/portal',{templateConfig: JSON.stringify(new WsCellContainer({}).toJson())}).then(()=>{

                            this.loadingText = '数据初始化成功';
                            this.src = this.$router.resolve({path:`/portal/design/${this.moduleId}`}).href;
                            setTimeout(()=>{
                                this.$nextTick(()=>{ this.loading = false; })
                            },500);
                        });
                    }else{
                        this.loadingText = '数据初始化成功';
                        this.src = this.$router.resolve({path:`/portal/design/${this.moduleId}`}).href;
                        setTimeout(()=>{
                            this.$nextTick(()=>{ this.loading = false; })
                        },500);
                    }
                })
            },
        },
        created() {
            this.$nextTick(()=>{ this.loading = false; })
            this.getWebsiteInfo();
        }
    }
</script>

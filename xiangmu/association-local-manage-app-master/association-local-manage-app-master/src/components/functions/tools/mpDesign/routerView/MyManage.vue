<template>
    <div class="absolute-fill-parent flex flex-column flex-center background-color-white"
         v-loading="loading"
         :element-loading-text="loadingText"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.1)">
        <div class="flex flex-space-between" v-show="!loading">
            <new-mp-hover v-if="mpInfo" icon="icon-mp-design" class="mp-bgc" :href="$router.resolve({path:`/mpDesign/${mpInfo.id}`}).href" tip="去设计总会小程序"/>
            <new-mp-hover v-else class="mp-bgc" @click="createMP(false)" icon="el-icon-circle-plus-outline" tip="创建总会小程序"/>
            <new-mp-hover v-if="branchMpInfo" icon="icon-mp-design" class="branch-mp-bgc" :href="$router.resolve({path:`/mpDesign/${branchMpInfo.id}`}).href" tip="去设计分会小程序"/>
            <new-mp-hover v-else class="branch-mp-bgc"  @click="createMP(true)" icon="el-icon-circle-plus-outline" tip="创建分会小程序"/>
        </div>
    </div>
</template>

<script>
    import MiniProgram from '../../../../../js/miniProgram/MiniProgram';
    import NewMpHover from "../util/NewMpHover";

    //用户管理的小程序
    export default {
        name: "MpDesignContainer",
        components: {NewMpHover},
        data(){
            return {
                loading:true,
                loadingText: '数据校验中......',
                list:[]
            }
        },
        computed:{
            mpInfo(){
                for(let mp of this.list){
                    if(!mp.isBranchMP){
                        return mp;
                    }
                }

                return null;
            },
            branchMpInfo(){
                for(let mp of this.list){
                    if(mp.isBranchMP){
                        return mp;
                    }
                }

                return null;
            },
        },
        methods:{
            createMP(isBranchMP){
                this.loadingText = isBranchMP? '正在创建分会小程序......' : '正在分会创建小程序......';
                this.loading = true;
                let mp = new MiniProgram();
                mp.addPage({title: '首页', pageId: 'page1'});
                mp.addTab({title: '首页', attributes:{pagePath : 'page1'}});
                this.$request.post('/api/admin/mp',{mpConfig:mp.toJsonString(),isBranchMP}).then(()=>{
                    this.loadingText = '小程序创建完成，数据校验中......';
                    this.mpList();
                })
            },
            mpList(){
                this.loading = true;
                this.$request.get('/api/admin/mp/list').then(res=>{
                    this.list = res.data;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
        },
        created() {
            this.mpList();
        },
    }
</script>

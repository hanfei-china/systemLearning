<template>
    <el-container class="absolute-fill-parent">
        <el-aside width="200px" class="border-right position-relative">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-column flex-center border-bottom">
                    <div class="flex">
                        <div style="font-size: 16px;" class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                            所有方案
                        </div>
                        <div>
                            <el-button size="small" icon="el-icon-plus" @click="newQuery" type="text" class="custom-el-button">新建方案</el-button>
                        </div>
                    </div>
                </el-header>
                <el-main class="unset-padding position-relative">
                    <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                        <el-menu class="border-right-unset custom-el-menu" :default-active="chosenQuery">
                            <el-menu-item v-for="query of list" :index="query.id" :key="query.id" @click="setChosenQuery(query)">
                                <div class="flex">
                                    <div class="flex-fill-in-the-remaining-space" >
                                        {{query.queryTitle}}
                                    </div>
                                    <div style="flex: 0 0 31px;">
                                        <el-tooltip class="item" effect="dark" content=" 编辑 " placement="top">
                                            <el-button class="custom-el-button" style="width: 16px" @click.stop="editQuery(query.id)" size="small" icon="el-icon-edit" type="text"/>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" content=" 删除 " placement="top">
                                            <el-button class="custom-el-button danger" style="width: 16px" @click.stop="deleteQuery(query)" size="small" icon="el-icon-delete" type="text"/>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </el-menu-item>
                        </el-menu>
                    </vue-scroll>
                </el-main>
            </el-container>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-column flex-center border-bottom">
                    <div class="flex">
                        <div style="font-size: 14px;" class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                            关键字
                        </div>
                    </div>
                </el-header>
                <el-main class="unset-padding position-relative">
                    <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                        <el-menu class="border-right-unset custom-el-menu" :default-active="defaultKeyword">
                            <el-menu-item v-for="keyword of keywords" :index="keyword" :key="keyword" @click="setKeyWord(keyword)">
                                <div class="flex">
                                    <div class="flex-fill-in-the-remaining-space" >
                                        {{keyword}}
                                    </div>
                                </div>
                            </el-menu-item>
                        </el-menu>
                    </vue-scroll>
                </el-main>
            </el-container>
        </el-main>
        <el-dialog :visible.sync="queryFormVisible" :title="queryFormTitle" width="637px"
                   append-to-body :close-on-click-modal="false">
            <match-query-form v-if="queryFormVisible" :id="queryFormId"
                                   @close="queryFormVisible = false" @refresh-list="getQueryList"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import MatchQueryForm from "./MatchQueryForm";
    export default {
        name: "MatchQueryList",
        components: {MatchQueryForm},
        data(){
            return {
                queryFormTitle: '',
                queryFormVisible: false,
                queryFormId: null,

                list:[],
                chosenQuery: '',
                chosenQueryEntity: null,
                defaultKeyword: ''
            }
        },
        computed:{
            keywords(){
                if(this.chosenQueryEntity){
                    let queryConfig = this.chosenQueryEntity.queryConfig;
                    if(queryConfig){
                        queryConfig = queryConfig.replace(/\\s*|\t|\r|\n|,|，/g,' ')
                            .replace(/&nbsp;/g,' ').trim();

                        return queryConfig.split(' ');
                    }
                }

                return [];
            }
        },
        methods:{
            newQuery(){
                this.queryFormTitle = '新建方案';
                this.queryFormId = null;
                this.queryFormVisible = true;
            },
            editQuery(id){
                this.queryFormTitle = '修改方案';
                this.queryFormId = id;
                this.queryFormVisible = true;
            },
            deleteQuery(query){
                this.$msgbox.confirm('删除不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/member/match/query',{
                        params:{id:query.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.getQueryList();
                            this.$message.success(`【${query.queryTitle}】已成功删除`);
                        }
                    })
                }).catch(()=>{});
            },
            getQueryList(){
                this.$request.get('/api/admin/member/match/query/list').then(res=>{
                    this.list = res.data;
                    if(res.data.length > 0){
                        this.chosenQuery = res.data[0].id;
                        this.chosenQueryEntity = res.data[0];
                    }else{
                        this.visible = true;
                    }
                })
            },
            setChosenQuery(query){
                this.chosenQuery = query.id;
                this.chosenQueryEntity = query;
            },
            setKeyWord(keyword){
                this.$emit('keyword',keyword);
                this.defaultKeyword = keyword;
            }
        },
        created() {
            this.getQueryList();
        },
        watch:{
            chosenQueryEntity(val){
                this.$emit('select',val);
            },
            keywords(val){
                if(val.length > 0){
                    this.setKeyWord(val[0]);
                }
            }
        }
    }
</script>

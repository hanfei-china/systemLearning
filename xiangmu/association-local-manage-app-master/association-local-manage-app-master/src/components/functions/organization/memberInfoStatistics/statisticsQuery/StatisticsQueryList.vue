<template>
    <el-container class="absolute-fill-parent">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div style="font-size: 16px;" class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                    所有查询
                </div>
                <div>
                    <el-button size="small" icon="el-icon-plus" @click="newQuery" type="text" class="custom-el-button">新建查询</el-button>
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
        <el-dialog :visible.sync="queryFormVisible" :title="queryFormTitle" width="704px"
                   append-to-body :close-on-click-modal="false">
            <statistics-query-form v-if="queryFormVisible" :id="queryFormId"
                                   @close="queryFormVisible = false" @refresh-list="getQueryList"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import StatisticsQueryForm from "./StatisticsQueryForm";
    export default {
        name: "StatisticsQueryList",
        components: {StatisticsQueryForm},
        data(){
            return {
                queryFormTitle: '',
                queryFormVisible: false,
                queryFormId: null,

                list:[],
                chosenQuery: '',
                chosenQueryEntity: null
            }
        },
        computed:{
            queryId(){
                return this.$route.query.queryId;
            }
        },
        methods:{
            newQuery(){
                this.queryFormTitle = '新建查询';
                this.queryFormId = null;
                this.queryFormVisible = true;
            },
            editQuery(id){
                this.queryFormTitle = '修改查询';
                this.queryFormId = id;
                this.queryFormVisible = true;
            },
            deleteQuery(query){
                this.$msgbox.confirm('删除不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/member/statistics/query',{
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
                this.$request.get('/api/admin/member/statistics/query/list').then(res=>{
                    this.list = res.data;
                    if(res.data.length > 0){
                        let query = res.data[0];
                        if(this.queryId){
                            for (let _query of res.data){
                                if(_query.id === this.queryId){
                                    query = _query;
                                    break;
                                }
                            }
                        }

                        this.chosenQuery =  query.id;
                        this.chosenQueryEntity = query;
                    }else{
                        this.visible = true;
                    }
                })
            },
            setChosenQuery(query){
                this.chosenQuery = query.id;
                this.chosenQueryEntity = query;
            }
        },
        created() {
            this.getQueryList();
        },
        watch:{
            chosenQueryEntity(val){
                this.$emit('select',val);
            }
        }
    }
</script>

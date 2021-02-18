<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">所有会议</div>
                <div class="flex flex-column flex-center">
                    <div>
                        <el-tooltip content="新增会议" placement="top-start">
                            <el-button type="text" size="small" class="unset-padding" @click="createMeeting" icon="el-icon-plus">新增</el-button>
                        </el-tooltip>
<!--                        <el-button style="margin-left: 4px;" icon="iconfont icon-filter" size="small" type="text" class="unset-padding">筛选</el-button>-->
                    </div>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative" v-loading="loading">
            <div class="absolute-fill-parent">
                <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                    <el-menu @select="setChosen" class="border-right-unset custom-el-menu" :default-active="chosenKey">
                        <el-menu-item v-for="meeting of list" :index="meeting.id" :key="meeting.id">
                            <div class="flex static-group">
                                <div class="flex-fill-in-the-remaining-space text-overflow" style="width: 160px;">{{meeting.title}}</div>
                                <div class="static-group-handle" :class="{'choose-group':chosenKey === meeting.id}">
                                    <i class="el-icon-edit primary-tip" style="font-size: 14px;width: 16px;"  @click.stop="editMeeting(meeting)"></i>
                                    <i class="el-icon-delete danger-tip" style="font-size: 14px;width: 16px;margin-right: 0;" @click.stop="deleteMeeting(meeting)" ></i>
                                </div>
                            </div>
                        </el-menu-item>
                    </el-menu>
                </vue-scroll>
            </div>
        </el-main>
        <el-footer class="flex flex-column flex-center border-top">
            <div class="text-align-right">
                <el-pagination :current-page="page.currentPage" background
                               :page-size="page.pageSize"
                               :total="total" :pager-count="5"
                               layout="total, prev, next"
                               @current-change="pageChange"
                               @size-change="sizeChange">
                </el-pagination>
            </div>
        </el-footer>
    </el-container>
</template>

<script>

    export default {
        name: "MeetingMenu",
        props: {
            chosenMeeting: Object,
            handleMeeting: Object
        },
        data() {
            return {
                form:{
                    visible: false,
                    title: '新增会议'
                },

                queryCondition:{
                    classId: ''
                },

                list: [],
                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                total: 0,

                chosenKey: '',
                handleRow: null,
                loading: true
            }
        },
        computed:{
            condition(){
                return {
                    ...this.queryCondition,
                    limit: this.page.pageSize,
                    offset: (this.page.currentPage - 1) * this.page.pageSize
                }
            },
        },
        methods: {
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
            },
            setChosen(chosenKey){
                this.chosenKey = chosenKey;
            },
            refreshList(){
                this.page.currentPage = 1;
                this.getList();
            },
            getList(){
                this.loading = true;
                this.$request.get('/api/admin/meeting/listMeeting',{params:this.condition}).then(res=>{
                    let {list,total} = res.data;
                    this.list = list;
                    this.total = total;
                    if(list.length>0){
                        this.chosenKey = list[0].id;
                    }

                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            createMeeting(){
                this.$emit('update:handleMeeting',{visible:true,entity:null})
            },
            editMeeting(row){
                this.$emit('update:handleMeeting',{visible:true,entity:row})
            },
            deleteMeeting(row){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/meeting/deleteMeeting',{
                        params:{id:row.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.$message.success(`${row.title}已删除`);
                            this.refreshList();
                        }
                    })
                }).catch(()=>{});
            }
        },
        mounted() {
            this.getList();
        },
        watch:{
            condition() {
                this.getList();
            },
            chosenKey(val){
                for(let item of this.list){
                    if(val === item.id){
                        this.$emit('update:chosenMeeting',{...item});
                        return;
                    }
                }
            }
        }
    }
</script>
<style lang="less">
    .static-group-handle:not(.choose-group){
        display: none;
    }
    .static-group:hover{

        .static-group-handle{
            display: block;
        }
    }
</style>

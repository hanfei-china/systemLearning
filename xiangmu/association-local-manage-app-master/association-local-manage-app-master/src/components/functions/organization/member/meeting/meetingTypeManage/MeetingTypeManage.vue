<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-center flex-column">
           <div class="flex">
               <div class="flex-fill-in-the-remaining-space flex">
                   <el-input size="small" style="width:300px;" v-model="queryCondition.meetingClassNameSearch" placeholder="请输入分类名称进行搜索"/>
               </div>
               <div>
                   <el-button icon="el-icon-plus" size="small" type="primary" @click="newMeetingType">新增会议类型</el-button>
               </div>
           </div>
        </el-header>
        <el-main style="padding-bottom: 16px;padding-top: 0;">
            <el-table class="custom-el-table header-gray lrd-el-table" size="small" height="100%"
                      style="min-width: 400px;" stripe highlight-current-row border
                      :data="list">
                <el-table-column type="index" label="序号" align="center" fixed></el-table-column>
                <el-table-column label="类型名称" prop="title"></el-table-column>
                <el-table-column label="会员职务">
                    <template v-slot="{row}">
                        {{row.postInfos | postInfos}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template v-slot="{row}">
                        <el-button size="small" class="custom-el-button unset-padding" type="text" @click="updateMeetingType(row)">编辑</el-button>
                        <el-button size="small" class="custom-el-button unset-padding danger" type="text" @click="deleteMeetingType(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog :title="classForm.title" :visible.sync="classForm.visible" append-to-body width="700px" :close-on-click-modal="false">
            <meeting-type-form v-if="classForm.visible" :meeting-type="handleRow" :seq="list.length"
                               @close="classForm.visible = false" @refresh="getList"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import MeetingTypeForm from "./MeetingTypeForm";
    export default {
        name: "MeetingTypeManage",
        components: {MeetingTypeForm},
        filters:{
            postInfos(postInfos){
                let result = '';
                let length = postInfos.length;
                postInfos.forEach((postInfo,index)=>{
                    result += postInfo.postName + (index === length -1 ?  '' : '，') ;
                });

                return result;
            }
        },
        data(){
            return {
                queryCondition:{
                    meetingClassNameSearch: '',
                },
                loading: true,
                list: [],

                handleRow: null,

                classForm:{
                    visible: false,
                    title: '新增会议类型',
                }
            }
        },
        methods:{
            newMeetingType(){
                this.handleRow = null;
                this.classForm.title = '新增会议类型';
                this.classForm.visible = true;
            },
            updateMeetingType(row){
                let postIds = [];
                row.postInfos.forEach(postInfo=>{
                    postIds.push(postInfo.postId)
                });
                this.handleRow = {...row,postIds};
                this.classForm.title = '编辑会议类型';
                this.classForm.visible = true;
            },
            deleteMeetingType(row){
                this.$msgbox.confirm('会议类型删除后不可恢复，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/meeting/deleteMeetingClass',{
                        params:{id:row.id}
                    }).then((data)=>{
                        if (data.success) {
                            this.getList();
                            this.$message.success(`【${row.title}】已成功删除`);
                        }
                    })
                }).catch(()=>{});
            },
            getList(){
                this.loading = true;
                this.$request.get('/api/admin/meeting/getMeetingClasses',{params:this.queryCondition}).then(res=>{
                    this.list = res.data;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
        },
        created() {
            this.getList();
        },
        watch:{
            'queryCondition.meetingClassNameSearch'(){
                this.getList();
            }
        }
    }
</script>

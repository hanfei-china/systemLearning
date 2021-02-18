<template>
    <el-container class="absolute-fill-parent background-color-white" style="z-index: 2000;">
        <el-header class="border-bottom flex flex-center flex-column">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex flex-center flex-column" style="font-size: 14px;">
                    {{containerTitle}}
                </div>
                <div>
                    <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                    <el-button icon="el-icon-s-claim" type="primary" size="small" @click="save">发布</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="position-relative unset-padding">
            <el-container class="absolute-fill-parent">
                <el-main class="position-relative unset-padding">
                    <vue-scroll>
                        <div style="margin: 0 auto;max-width: 800px;padding: 16px;">
                            <el-form size="small" label-width="80px">
                                <el-form-item>
                                    <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            标题：
                                        </div>
                                    </template>
                                    <el-input v-model="notice.title" placeholder="请输入标题，50字以内" :maxlength="50"/>
                                </el-form-item>
                                <el-form-item>
                                    <template v-slot:label>
                                        <div class="custom-el-form-item-label required">
                                            内容：
                                        </div>
                                    </template>
                                    <editor v-model="notice.content"/>
                                </el-form-item>
                            </el-form>
                        </div>
                    </vue-scroll>
                </el-main>
                <el-aside width="400px" class="border-left position-relative">
                    <vue-scroll>
                        <div style="padding: 16px;">
                            <div>其他设置</div>
                            <div style="margin-top: 10px;"><el-checkbox :disabled="noticeEntity" v-model="notice.isCharge">涉及收费项目</el-checkbox></div>
                            <div style="margin-top: 16px;">接收人设置</div>
                            <div style="margin-top: 10px;">
                                <member-group-multi-tree style="width: 100%;" v-model="groupIds"  only-static :group-nodes="groupList"/>
                            </div>
                        </div>
                    </vue-scroll>
                </el-aside>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import Editor from "../../../../util/editor/Editor";
    import {treeFormingVirtualGroup} from "../../../util/group/memberGroup/js/memberGroupTools";
    import MemberGroupMultiTree from "../../../util/group/memberGroup/MemberGroupMultiTree";

    export default {
        name: "SystemNoticeForm",
        components: {MemberGroupMultiTree, Editor},
        props:{
            routeTitle: String,
            noticeEntity: Object,
            userIds: Array
        },
        computed:{
            containerTitle(){
                let title = '新增';
                if(this.noticeEntity){
                    title = '编辑';
                }
                title += this.routeTitle;
                return title;
            },
            allNode() {
                return [];
            },
            branchId(){
                return this.$store.state.branchId;
            }
        },
        data(){
            return {
                rootId: '0',
                groupIds: ['0'],
                notice: this.noticeEntity ? Object.assign({
                    title: '',
                    content: '',
                    isCharge: false,
                    userIds: this.userIds || [],
                }, this.noticeEntity.record) : {
                    title: '',
                    content: '',
                    isCharge: false,
                    userIds: this.userIds || [],
                },
                groupList: [],
            }
        },
        methods:{
            getGroupList() {
                this.loading = true;
                this.$request.get('/api/admin/group/getMemberGroup').then(res => {
                    this.groupList = treeFormingVirtualGroup(this.allNode.concat(res.data),this.resource);
                });
            },
            save(){
                if(this.noticeEntity){
                    //修改
                    this.$request.post('/api/admin/flow/updateNotice',{...this.notice,id: this.noticeEntity.id}).then(()=>{
                        if(this.notice.isCharge && this.branchId){
                            this.$message.success("公告包含收费项目，已重新提交总会审核");
                        }else{
                            this.$message.success("公告已发布");
                        }
                        this.$emit('refresh');
                        this.$emit('close');
                    })
                }else{
                    //新增
                    this.$request.post('/api/admin/flow/createNotice',this.notice).then(()=>{
                        if(this.notice.isCharge && this.branchId){
                            this.$message.success("公告包含收费项目，已提交总会审核");
                        }else{
                            this.$message.success("公告已发布");
                        }
                        this.$emit('refresh');
                        this.$emit('close');
                    })
                }
            },
        },
        created() {
            this.getGroupList();
        },
    }
</script>
<style lang="less">
    .member-user{
        &:not(:last-child){
            margin-bottom: 4px;
        }
    }
</style>

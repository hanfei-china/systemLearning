<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside class="position-relative border-right" width="200px">
            <meeting-menu ref="menu" :handle-meeting.sync="handleMeeting" :chosen-meeting.sync="chosenMeeting"/>
        </el-aside>
        <el-main class="position-relative unset-padding">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-center flex-column"  style="padding: 0 16px;">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space flex">
                            <div style="width: 300px;">
                                <el-input size="small" v-model="queryCondition.memberNameSearch" prefix-icon="el-icon-search" placeholder="请输入会员名称进行搜索"></el-input>
                            </div>
                            <div class="flex" style="margin-left: 16px;">
                                <div class="flex flex-center flex-column">职务：</div>
                                <div>
                                    <member-post-choose v-model="queryCondition.postId"/>
                                </div>
                            </div>
                        </div>
                        <div class="flex" style="padding-left: 16px;">
                            <el-button style="position: relative;" type="primary" icon="el-icon-download" size="small">
                                <span style="opacity: 0;">导出</span>
                                <a style="color: inherit;padding-left: 29px;text-align: left;" class="absolute-fill-parent flex flex-column flex-center" :href="exportUrl">导出</a>
                            </el-button>
                        </div>
                    </div>
                </el-header>
                <el-main style="padding: 0 16px;">
                    <el-table v-if="chosenMeeting" class="custom-el-table header-gray lrd-el-table" size="small" height="100%"
                              style="min-width: 400px;" stripe highlight-current-row border :data="list">
                        <el-table-column type="index" label="序号" align="center" fixed></el-table-column>
                        <el-table-column label="会员名称" prop="memberName" show-tooltip-when-overflow></el-table-column>
                        <el-table-column label="职务" prop="postName" show-tooltip-when-overflow></el-table-column>
                        <el-table-column label="会议名称" show-tooltip-when-overflow>
                            <template>
                                {{chosenMeeting.title}}
                            </template>
                        </el-table-column>
                        <el-table-column label="会议时间" width="130px">
                            <template>
                                {{chosenMeeting.meetingTime | yyyyMMddHHmm}}
                            </template>
                        </el-table-column>
                        <el-table-column label="会议地点" show-tooltip-when-overflow>
                            <template>
                                {{chosenMeeting.meetingAddress}}
                            </template>
                        </el-table-column>
                        <el-table-column label="是否出席" width="80px">
                            <template v-slot="{row}">
                                {{row.state ? '是' : '否'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120px" fixed="right" align="center">
                            <template v-slot="{row}">
                                <el-button size="small" type="text" @click="updateState(row)">修改参会状态</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer class="unset-padding" height="auto">
                    <div class="flex" style="padding: 16px;">
                        <div>

                        </div>
                        <div class="flex-fill-in-the-remaining-space text-align-right">
                            <el-pagination :current-page="page.currentPage" background
                                           :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                           :total="total" :pager-count="5"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           @current-change="pageChange"
                                           @size-change="sizeChange">
                            </el-pagination>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
        <meeting-form :meeting="handleMeeting.entity" :visible.sync="handleMeeting.visible" v-if="handleMeeting.visible"
                      @close="handleMeeting.visible=false" @refresh="refreshMeeting"/>
    </el-container>
</template>

<script>
    import MeetingMenu from "./MeetingMenu";
    import MeetingForm from "./MeetingForm";
    import MemberPostChoose from "../../../../util/member/MemberPostChoose";
    import {requestBaseUrl} from "../../../../../../js/config/serviceConfig";

    export default {
        name: "MeetingManage",
        components: {MemberPostChoose, MeetingForm, MeetingMenu},
        data(){
            return {
                handleMeeting:{
                    visible: false,
                    entity: null
                },
                chosenMeeting: null,

                queryCondition:{
                    memberNameSearch: '',
                    postId: ''
                },

                list: [],
                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                total: 0,
                loading: false
            }
        },
        computed:{
            condition(){
                return {
                    ...this.queryCondition,
                    meetingId: this.chosenMeeting ? this.chosenMeeting.id : '',
                    limit: this.page.pageSize,
                    offset: (this.page.currentPage - 1) * this.page.pageSize
                }
            },
            exportUrl(){
                return this.chosenMeeting ? requestBaseUrl + '/api/admin/meeting/downloadMeetingJoinInfo/'+ this.chosenMeeting.id : '';
            }
        },
        methods:{
            refreshMeeting(){
                this.$refs.menu.refreshList();
                this.refreshList();
            },
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
                this.getList();
            },
            refreshList(){
                this.page.currentPage = 1;
                this.getList();
            },
            getList(){
                if(this.chosenMeeting){
                    this.loading = true;
                    this.$request.get('/api/admin/meeting/getMemberOfMeeting',{params:this.condition}).then(res=>{
                        let {list,total} = res.data;
                        this.list = list;
                        this.total = total;
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }
            },
            updateState(row){
                this.$request.put('/api/admin/meeting/updateJoinState',{
                    meetingId: this.chosenMeeting.id,
                    state: !row.state,
                    memberId: row.memberId
                }).then(()=>{
                    this.getList();
                    this.$message.success('参会状态已更新');
                })
            }
        },
        created() {
            this.getList();
        },
        watch:{
            condition(){
                this.refreshList();
            },
            chosenMeeting(){
                this.refreshList();
            },
        }
    }
</script>


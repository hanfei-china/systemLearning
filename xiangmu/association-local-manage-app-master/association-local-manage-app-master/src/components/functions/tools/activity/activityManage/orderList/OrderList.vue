<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-main v-if="templateUploadVisible" class="unset-padding position-relative">
            <template-upload :visible.sync="templateUploadVisible" :activityId="activityId"
                             @refresh="refresh"/>
        </el-main>
        <el-main v-else class="unset-padding position-relative">
            <el-container class="absolute-fill-parent" style="padding: 0 15px;">
                <el-header class="unset-padding flex border-bottom active-common-header">
                    <div class="nav flex-fill-in-the-remaining-space">
                    <span class="navWrap cursor-pointer" v-for="item in navList" :key="item.status"
                          @click="getActivityAssociator(item.status)">
                        <span class="nav-item" :class="{active:activeNav === item.status}">{{item.title}}</span>
                    </span>
                    </div>
                    <div class="search_Create">
                        <el-input class="small-input"
                                  placeholder="姓名/手机号" clearable size="small" v-model="searchWord"/>
                        <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                                   @click="toAdd">新增参与人员
                        </el-button>
                        <el-button type="primary" icon="el-icon-upload2" size="small"
                                   @click="templateUploadVisible = true">导入报名数据
                        </el-button>
                        <el-button type="primary" icon="el-icon-download" size="small">
                            <a :href="downloadUrl" style="color: inherit;">导出报名数据</a>
                        </el-button>
                        <el-button @click="smsListVisible=true" type="primary" icon="el-icon-message" size="small">短信日志</el-button>
                    </div>
                </el-header>
                <el-main style="padding: 10px 0 0;">
                    <el-table :data="associatorList" v-show="associatorList.length > 0 || loaded" height="100%"
                              class="custom-el-table header-gray" size="small" border stripe @selection-change="handleSelectionChange">
                        <el-table-column fixed type="selection" width="55" align="center"/>
                        <el-table-column fixed type="index" width="55" align="center" label="序号"/>
                        <el-table-column v-for="field of activityFields" :key="field.code" show-overflow-tooltip
                                         :label="field.name" width="150px">
                            <template slot-scope="{row}">
                                <activity-sign-in-info-table-preview-field :field="field" :value="row[field.code]"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="签到码" min-width="130px" show-overflow-tooltip>>
                            <template slot-scope="{row}">
                                <span>{{row.signInCode}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="报名时间" min-width="130px" show-overflow-tooltip>>
                            <template slot-scope="{row}">
                                <span>{{row.createTime | yyyyMMddHHmm}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="报名方式" min-width="155px" show-overflow-tooltip>
                            <template slot-scope="{row}">
                                <span>{{row.signUpType | activitySignUpType}}</span>
                                <span v-if="row.signUpType !== '0'">
                                    <span :style="{color: row.userId ? '#67C23A':'#F56C6C'}">{{row.userId ? '（已绑定用户）':'（未绑定用户）'}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="审核状态" width="150px" show-overflow-tooltip>>
                            <template slot-scope="{row}">
                                {{row.status | activitySignUpExamineStatus}}
                            </template>
                        </el-table-column>
                        <el-table-column label="审核时间" min-width="130px" show-overflow-tooltip>>
                            <template slot-scope="{row}">
                                <span>{{row.verifyTime | yyyyMMddHHmm}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="签到状态" width="150px" show-overflow-tooltip>>
                            <template slot-scope="{row}">
                                {{row.signInFlag | activitySignInStatus}}
                            </template>
                        </el-table-column>
                        <el-table-column label="签到时间" min-width="130px" show-overflow-tooltip>>
                            <template slot-scope="{row}">
                                <span>{{row.signInTime | yyyyMMddHHmm}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="150px"
                                         v-if="activeNav === '1' || activeNav === '-1'">
                            <template slot-scope="{row}">
                                <el-button type="text" size="small" v-if="row.status === '1'"
                                           @click="toHandle(row.relationId,0)">同意
                                </el-button>
                                <el-button type="text" size="small" class="custom-el-button danger"
                                           v-if="row.status === '1'"
                                           @click="toHandle(row.relationId,2)">拒绝
                                </el-button>
                                <el-button type="text" size="small"
                                           @click="toEdit(row.relationId)">编辑</el-button>
                                <el-button type="text" size="small" style="color: #F56C6C;"
                                           @click="toDelete(row.relationId)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer class="flex flex-column flex-center unset-padding">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space">
                            <batch-operation>
                                <!-- <li>
                                    <el-button type="text" size="small" class="unset-padding"
                                               @click="templateSendVisible = true">模板发送邮件
                                    </el-button>
                                </li>
                                <li>
                                    <el-button type="text" size="small" class="unset-padding"
                                               :disabled="receiverList.length === 0"
                                               @click="notTemplateSendVisible = true">非模板发送邮件
                                    </el-button>
                                </li> -->
                                <li>
                                    <el-button type="text" size="small" class="unset-padding"
                                               @click="sendSms">发送短信
                                    </el-button>
                                </li>
                                <li>
                                    <el-button type="text" size="small" class="unset-padding custom-el-button danger"
                                               @click="clearOneActivityAllSignRecord">清空报名数据
                                    </el-button>
                                </li>
                            </batch-operation>
                        </div>
                        <div>
                            <el-pagination size="small" @size-change="handleSizeChange"
                                           @current-change="handleCurrentChange"
                                           :current-page="page.currentPage" :page-sizes="[10,20,50,100]"
                                           :page-size="page.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="page.total"
                                           background/>
                        </div>
                    </div>
                </el-footer>
                <el-dialog :title="formTitle" :visible.sync="participantVisible" append-to-body
                           :close-on-click-modal="false"
                           width="800px">
                    <participant-form v-if="participantVisible"
                                      :activityId="activityId" :relation-id="formId"
                                      @close="close" @refresh="refresh"/>
                </el-dialog>
                <!-- <el-dialog :visible.sync="templateSendVisible" title="模板发送邮件" append-to-body
                           :close-on-click-modal="false"
                           width="800px">
                    <template-send v-if="templateSendVisible" :activityId="activityId" :receiverList="receiverList"
                                   @close="templateSendVisible = false"/>
                </el-dialog>
                <el-dialog :visible.sync="notTemplateSendVisible" title="非模板发送邮件" append-to-body
                           :close-on-click-modal="false"
                           width="800px">
                    <not-template-send v-if="notTemplateSendVisible" :activityId="activityId"
                                       :receiverList="receiverList"
                                       @close="notTemplateSendVisible = false"/>
                </el-dialog> -->
                <div class="dialogbox" v-if="sendSmsVisible">
                    <send-sms :sendSmsList="sendSmsList" :activityId="activityId" @close="sendSmsVisible=false"></send-sms>
                </div>
                <div class="dialogbox" v-if="smsListVisible">
                    <sms-list @close="smsListVisible=false"></sms-list>
                </div>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import ActivitySignInInfoTablePreviewField from "../../util/ActivitySignInInfoTablePreviewField";
    import {requestBaseUrl} from "../../../../../../js/config/serviceConfig";
    import ParticipantForm from "./ParticipantForm";
    import TemplateUpload from "./TemplateUpload";
    import BatchOperation from "../../../../../util/BatchOperation";
    import TemplateSend from "./TemplateSend";
    import NotTemplateSend from "./NotTemplateSend";
    import sendSms from './sendSms/index'
    import smsList from './smsList'

    export default {
        name: "OrderList",
        components: {
            NotTemplateSend,
            TemplateSend, BatchOperation, TemplateUpload, ParticipantForm, ActivitySignInInfoTablePreviewField, sendSms, smsList
        },
        data() {
            return {
                searchWord: '',//搜索关键字
                page: {
                    currentPage: 1,//默认开始页
                    pageSize: 10,//默认每页条数
                    total: 0//总条数
                },
                associatorList: [],//列表信息
                activeNav: '-1',
                navList: [
                    {
                        status: "-1",
                        title: "全部"
                    },
                    {
                        status: '1',
                        title: "待审核"
                    },
                    {
                        status: '0',
                        title: "审核通过"
                    },
                    {
                        status: '2',
                        title: "审核拒绝"
                    }
                ],
                activityFields: [],
                loaded: false,
                templateUploadVisible: false,//模板上传

                templateSendVisible: false,
                notTemplateSendVisible: false,
                receiverList: [],//选中的列表


                participantVisible: false,//新增参与人员
                formTitle: '新增参与人员',
                formId: '',
                sendSmsVisible:false,
                sendSmsList:[],
                smsListVisible:false
            }
        },
        created() {
            this.getActivityFieldsInfo();
            this.getActivityAssociator('-1');
        },
        computed: {
            activityId() {
                return this.$route.params.activityId;
            },
            downloadUrl() {
                return `${requestBaseUrl}/api/admin/activityInfo/downloadActivityPerson/${this.activityId}/${this.activeNav}`
            }
        },
        methods: {
            getActivityFieldsInfo() {
                if (!this.activityId) {
                    return;
                }
                this.activityFields = [];
                this.$request.get('/api/common/activity/getActivityFieldsInfo', {
                    params: {
                        activityId: this.activityId
                    }
                }).then(res => {
                    if (res.success) {
                        this.activityFields = res.data;
                    }
                })
            },
            //获取报名参会人员
            getActivityAssociator(num) {
                if (!this.activityId) {
                    return;
                }
                let status = '';
                if (!num) {
                    num = this.activeNav;
                }
                this.activeNav = num;
                if (num === '-1') {
                    status = ''
                } else {
                    status = num
                }

                this.associatorList = [];
                this.$request.get('/api/admin/activityInfo/getActivityAssociatorsByCondition', {
                    params: {
                        activityId: this.activityId,
                        limit: this.page.pageSize,
                        offset: (this.page.currentPage - 1) * this.page.pageSize,
                        content: this.searchWord,
                        status: status,
                    }
                }).then(res => {
                    if (res.success) {
                        this.associatorList = res.data.list;
                        this.page.total = res.data.total;
                        this.loaded = true;
                    }
                })
            },
            //分页变化
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getActivityAssociator()
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getActivityAssociator()
            },
            //审批同意
            toHandle(id, status) {
                this.$request.put('/api/admin/activityInfo/updateActivityAssocitorStatus', {
                    activityId: this.activityId,
                    ids: [id],
                    status: status
                }).then(res => {
                    if (res.success) {
                        this.$message.success("已审批");
                        this.getActivityAssociator(this.activeNav);
                    }
                })
            },
            toAdd(){
                this.formId = '';
                this.formTitle = '新增参与人员';
                this.participantVisible = true;
            },
            toEdit(formId){
                this.formId = formId;
                this.formTitle = '编辑报名信息';
                this.participantVisible = true;
            },
            //删除活动报名人员
            toDelete(id) {
                this.$confirm('此操作将永久删除该报名人员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/activityInfo/deleteActivityAssociator', {params: {relationId: id}}).then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.refresh();
                        }
                    })
                }).catch(() => {
                })
            },
            handleSelectionChange(selectList) {
                this.receiverList = [];
                for (let item of selectList) {
                    this.receiverList.push(item.relationId)
                }
            },
            //关闭弹窗
            close() {
                this.participantVisible = false;
            },
            refresh() {
                this.getActivityAssociator();
            },
            clearOneActivityAllSignRecord(){
                this.$confirm('此操作将永久删除报名人员信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.post('/api/admin/activityInfo/clearOneActivityAllSignRecord', {activityId: this.activityId}).then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.refresh();
                        }
                    })
                }).catch(() => {
                })
            },
            //发送短信
            sendSms(){
                if (this.receiverList.length==0) {
                    this.$message({
                    message: '请先选择要发送短信的成员',
                    type: 'warning'
                    });
                    return ;
                }
                var obj={};
                this.receiverList.forEach(item=>{
                    obj[item]=1;
                })
                var arr=[];
                this.associatorList.forEach(item=>{
                    if (obj[item.relationId]) {
                        arr.push({
                            id:item.relationId,
                            telphone:item.phone,
                            name:item.name
                        })
                    }
                })
                this.sendSmsList=JSON.parse(JSON.stringify(arr));
                this.sendSmsVisible=true;
            }
        },
        watch: {
            activeNav() {
                this.loaded = false;
            },
            activityId() {
                this.getActivityFieldsInfo();
                this.getActivityAssociator('-1');
            },
            searchWord() {
                this.getActivityAssociator();
            }
        }
    }
</script>

<style lang="less" scoped>
.dialogbox {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000000;
  background-color: #fff;
  cursor: pointer;
}
</style>

<template>
    <div class="absolute-fill-parent" style="z-index: 3000;background-color: #ffffff;min-width: 800px;"
         v-show="visible">
        <el-container class="absolute-fill-parent" style="padding: 16px;">
            <el-header class="border-bottom" height="auto" style="padding: 0 0 16px;">
                <div class="flex">
                    <div>
                        <el-button class="unset-padding" style="height: 32px;line-height: 32px;font-size: 14px;"
                                   type="text" size="small" icon="el-icon-arrow-left"
                                   @click="$emit('update:visible',false)"/>
                    </div>
                    <div>
                        <span style="height: 32px;line-height: 32px;font-size: 14px;padding-left: 8px;">批量导入会员</span>
                    </div>
                    <div style="height: 32px;line-height: 32px;font-size: 14px;padding-left: 16px;" class="flex">
                        <div>
                            <span class="border-left-black"
                                  style="padding-left: 16px;line-height: initial;padding-right: 5px;">活动名称：</span>
                        </div>
                        <div style="width: 300px;">
                            <el-input size="small" v-model="activityTitle" clearable placeholder="请输入活动名称进行搜索"/>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main class="position-relative unset-padding">
                <div class="absolute-fill-parent">
                    <vue-scroll>
                        <div class="member-import-from-activity flex flex-wrap"
                             style="width: 1030px;margin: 0 auto;padding: 16px;">
                            <el-card class="activity-item" shadow="hover" :body-style="{ padding: '6px' }"
                                     v-for="activity of activities" :key="activity.id">
                                <div class="activity-item-bgc"
                                     :style="{backgroundImage: 'url('+activity.posterUrl+')'}"></div>
                                <div class="activity-item-name">{{activity.theme}}</div>
                                <div class="flex">
                                    <div class="flex-fill-in-the-remaining-space activity-item-time">
                                        <i class="el-icon-time"></i>{{activity.beginTime | yyyyMMddHHmmss}}
                                    </div>
                                    <div>
                                        <el-button size="mini" type="text" @click="importFrom(activity)">从该活动导入
                                        </el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                    </vue-scroll>
                </div>
            </el-main>
            <el-footer class="unset-padding border-top" height="auto">
                <div class="flex" style="padding: 16px 16px 0 16px;">
                    <div class="flex-fill-in-the-remaining-space text-align-right">
                        <el-pagination :current-page="page.currentPage" background
                                       :page-sizes="[10, 20, 50, 100]" :page-size="page.pageSize"
                                       :total="total"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       @current-change="pageChange"
                                       @size-change="sizeChange">
                        </el-pagination>
                    </div>
                </div>
            </el-footer>
        </el-container>
        <el-dialog title="字段调整" :visible.sync="dialogShow" append-to-body width="800px" :close-on-click-modal="false">
            <activity-field-match v-if="dialogShow" :activity-fields="activityFields"
                                  :member-fields="memberFields" :task-id="activityId"
                                  @import-success="importSuccess" @close="dialogShow = false"/>
        </el-dialog>
        <el-dialog title="导入结果" :visible.sync="importDetailDialogShow" append-to-body :close-on-click-modal="false"
                   width="800px">
            <div style="padding-bottom: 16px;">
                <div style="padding-bottom: 8px;font-size: 16px;">总览</div>
                <div class="flex">
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title">报名人员总数</div>
                        <div class="member-import-result-item-content">{{importResult.cellNum}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title danger">系统重复</div>
                        <div class="member-import-result-item-content danger">{{importResult.repeatInTable}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title success">新增条数</div>
                        <div class="member-import-result-item-content success">{{importResult.hasAdded}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title">更新条数</div>
                        <div class="member-import-result-item-content success">{{importResult.updateNum}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title">系统原有条数</div>
                        <div class="member-import-result-item-content success">{{importResult.originalNum}}</div>
                    </div>
                    <div class="flex-fill-in-the-remaining-space member-import-result-item">
                        <div class="member-import-result-item-title">导入后条数</div>
                        <div class="member-import-result-item-content success">{{importResult.currentNum}}</div>
                    </div>
                </div>
            </div>
            <div v-if="importResult.failureInfos && importResult.failureInfos.length > 0">
                <div style="padding-bottom: 8px;font-size: 16px;">错误详情</div>
                <el-table :data="importResult.failureInfos" size="mini" max-height="200px" border stripe>
                    <el-table-column prop="name" label="报名姓名" width="100px" show-overflow-tooltip/>
                    <el-table-column prop="uniqueValue" label="唯一项" width="150px" show-overflow-tooltip/>
                    <el-table-column prop="reason" label="失败原因"/>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ActivityFieldMatch from './ActivityFieldMatch';

    export default {
        name: "MemberBatchImportFromActivity",
        components: {ActivityFieldMatch},
        props: ['visible'],
        data() {
            return {
                activityTitle: '',
                page: {
                    currentPage: 1,
                    pageSize: 20
                },
                activities: [],
                total: 0,

                dialogShow: false,
                importDetailDialogShow: false,
                activityFields: [],
                memberFields: [],
                activityId: '',

                importResult: {
                    cellNum: 0,
                    repeatInTable: 0,
                    hasAdded: 0,
                    updateNum: 0,
                    originalNum: 0,
                    currentNum: 0,
                    failureInfos: []
                }
            }
        },
        methods: {
            getActivities() {
                this.$request.get('/api/admin/activityInfo/getActivityInfosOfMyBranch', {
                    params: {
                        activityTitle: this.activityTitle,
                        condition: '0',
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1)
                    }
                }).then(res => {
                    if (res.success) {
                        this.activities = res.data.list;
                        this.total = res.data.total;
                    }
                })
            },
            pageChange(pageIndex) {
                this.page.currentPage = pageIndex;
                this.getActivities();
            },
            sizeChange(pageSize) {
                this.page.currentPage = 1;
                this.page.pageSize = pageSize;
                this.getActivities();
            },
            getMemberFields() {
                this.$request.get('/api/admin/associator/getFieldsInfo').then(res => {
                    if (res.success) {
                        this.memberFields = res.data.filter(field => {
                            let {topicType} = field;
                            return topicType === 0 || topicType === 1 || topicType === 2 || topicType === 3 || topicType === 5;
                        });
                    }
                })
            },

            importFrom(activity) {
                this.$request.get('/api/common/activity/getActivityFieldsInfo', {
                    params: {
                        activityId: activity.id
                    }
                }).then(res => {
                    if (res.success) {
                        res.data.map(field=>{
                            let {topicType,parameter,code} = field;
                            field.self = {
                                topicType,parameter,code
                            };

                            field.parameter = '';
                        });

                        this.activityFields = res.data;
                    }
                    this.activityId = activity.id;
                    this.dialogShow = true;
                })
            },
            importSuccess(res) {
                this.importResult = Object.assign(this.importResult, res.data);
                this.dialogShow = false;
                this.importDetailDialogShow = true;
                this.$emit('refresh-members');
            }
        },
        created() {
            this.getActivities();
            this.getMemberFields();
        },
        watch: {
            activityTitle() {
                this.page.currentPage = 1;
                this.getActivities();
            }
        }
    }
</script>

<template>
    <el-container class="absolute-fill-parent">
        <el-header class="flex border-bottom">
            <div class="flex flex-column flex-center">
                <el-page-header @back="$emit('close')" content="签到数据"/>
            </div>
            <div class="flex-fill-in-the-remaining-space flex flex-column flex-center" style="padding-left: 16px;">
                <el-input style="max-width: 300px;" size="small" v-model="searchStr" placeholder="请输入姓名或签到码"></el-input>
            </div>
            <div class="flex flex-column flex-center">
                <div>
                    <el-button style="position: relative;" type="primary" icon="el-icon-download" size="small">
                        <span style="opacity: 0;">导出签到数据</span>
                        <a style="color: inherit;padding-left: 29px;text-align: left;" class="absolute-fill-parent flex flex-column flex-center" :href="downloadUrl">导出签到数据</a>
                    </el-button>
                </div>
            </div>
        </el-header>
        <el-main v-loading="loading">
            <el-table :data="signDataList" v-show="signDataList.length>0" height="100%" class="custom-el-table header-gray" size="small" border
                      stripe>
                <el-table-column type="index" width="55" align="center" label="序号" fixed/>
                <el-table-column v-for="field of activityFields" :key="field.code" show-overflow-tooltip
                                 :label="field.name" width="150px">
                    <template slot-scope="{row}">
                        <activity-sign-in-info-table-preview-field :field="field" :value="row[field.code]"/>
                    </template>
                </el-table-column>
                <el-table-column label="签到码" prop="signInCode" fixed="right"/>
                <el-table-column label="签到方式" fixed="right">
                    <template slot-scope="{row}">
                        <span>{{row.signInWay | activitySignInType}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="签到时间" width="150" fixed="right">
                    <template slot-scope="{row}">
                        <span>{{row.signTime | yyyyMMddHHmmss}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer class="text-align-right" style="padding:14px 0 0;">
            <el-pagination size="small" @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-sizes="[10,20,50,100]" :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="totalCount"
                           background/>
        </el-footer>
    </el-container>
</template>

<script>
    import {requestBaseUrl} from "../../../../../../../js/config/serviceConfig";
    import ActivitySignInInfoTablePreviewField from "../../../util/ActivitySignInInfoTablePreviewField";

    export default {
        name: "SignData",
        components: {ActivitySignInInfoTablePreviewField},
        props: ['signLocationForm'],
        data() {
            return {
                currentPage: 1,
                pageSize: 20,
                totalCount: 0,
                signDataList: [],
                searchStr: '',//搜索框
                activityFields: [],
                loading: true
            }
        },
        computed:{
            activityId(){
                return this.$route.params.activityId;
            },
            addressSignId(){
                return this.signLocationForm.id;
            },
            downloadUrl(){
                return `${requestBaseUrl}/api/admin/activity/signRecord/downloadSignRecordData/${this.addressSignId}/-1`;
            }
        },
        created() {
            this.getActivityFieldsInfo(()=>{
                this.getList();
            })
        },
        watch: {
            signLocationForm(val) {
                this.addressSignId = val.id;
                this.getList();
            },
            searchStr() {
                this.getList()
            }
        },
        methods: {
            getActivityFieldsInfo(callback) {
                if (!this.activityId) {
                    return;
                }
                this.activityFields = [];
                this.$request.get('/api/common/activity/getActivityFieldsInfo', {
                    params: {
                        activityId: this.activityId
                    }
                }).then(res => {
                    this.activityFields = res.data;
                    callback && callback();
                })
            },
            getList() {
                if (this.signLocationForm) {
                    this.loading = true;
                    this.$request.get('/api/admin/activity/signRecord/getSignRecordsByAddressSignId', {
                        params: {
                            activityId: this.activityId,
                            addressSignId: this.addressSignId,
                            limit: this.pageSize,
                            offset: (this.currentPage - 1) * this.pageSize,
                            searchStr: this.searchStr
                        }
                    }).then(res => {
                        this.signDataList = res.data.list;
                        this.totalCount = res.data.total;
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            }
        }
    }
</script>

<style scoped>

</style>

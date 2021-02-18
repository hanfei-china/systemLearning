<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-header class="flex flex-wrap height-condition" style="line-height: 45px;">
            <div>
                模块标题：
                <el-input size="small" class="small-input" v-model="title" placeholder="请输入"></el-input>
            </div>
            <div>
                操作人员：
                <el-input size="small" class="small-input" v-model="userName" placeholder="请输入"></el-input>
            </div>
            <div>
                操作类型：
                <el-select size="small" class="small-input" v-model="operateType" clearable>
                    <el-option v-for="item in allOperateTypes" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </div>
            <div>
                操作状态：
                <el-select size="small" class="small-input" v-model="states" clearable>
                    <el-option v-for="item in allStates" :key="item.value" :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </div>
            <div>
                操作时间：
                <el-date-picker
                        v-model="time"
                        class="small-date"
                        size="small"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </el-header>
        <el-main style="padding: 0 20px;">
            <el-table :data="logList" style="width: 100%" height="100%" class="custom-el-table header-gray" size="small"
                      border
                      stripe @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" fixed/>
                <el-table-column label="序号" align="center" type="index" fixed/>
                <el-table-column label="用户名" width="100px">
                    <template slot-scope="{row}">
                        <span>{{row.name | formatNull}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="模块标题" prop="title" show-tooltip-when-overflow/>
                <el-table-column label="操作类型">
                    <template slot-scope="{row}">
                        <div v-for="item in allOperateTypes" :key="item.value">
                            <span v-if="row.operateType === item.value">{{item.label}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="请求URL" prop="requestURL" show-tooltip-when-overflow/>
                <el-table-column label="请求方式" prop="requestMethod"/>
                <el-table-column label="操作状态">
                    <template slot-scope="{row}">
                        <span v-if="row.states">成功</span>
                        <span v-else>失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作ip" width="150px" prop="ip" show-tooltip-when-overflow/>
                <el-table-column label="操作时间" width="150px" prop="requestURL" show-tooltip-when-overflow>
                    <template slot-scope="{row}">
                        {{row.createTime | yyyyMMddHHmmss}}
                    </template>
                </el-table-column>
                <el-table-column label="错误消息" prop="errorMessage" show-tooltip-when-overflow/>
            </el-table>
        </el-main>
        <el-footer class="flex">
            <div class="flex-fill-in-the-remaining-space" style="padding-top: 12px;">
                <batch-operation>
                    <li @click="deleteItems">删除</li>
                    <li @click="emptyItems">清空</li>
                    <li>导出</li>
                </batch-operation>
            </div>
            <div style="padding-top: 14px;">
                <el-pagination background
                        size="small"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                </el-pagination>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import BatchOperation from "../../../../util/BatchOperation";

    export default {
        name: "CommonTable",
        components: {BatchOperation},
        props: ['logType'],
        data() {
            return {
                allOperateTypes: [],//操作类型列表
                operateType: '',//操作类型
                allStates: [
                    {
                        value: true,
                        label: '成功'
                    }, {
                        value: false,
                        label: '失败'
                    }
                ],//操作状态列表
                states: '',//操作状态
                title: '',//系统模块
                userName: '',//操作人员
                time: [],//时间

                logList: [],//日志列表
                currentPage: 1,//第几页
                pageSize: 20,//每页条数
                totalCount: 0,//总数

                selectList: [],//选中的id列表
            }
        },
        filters: {
            formatNull(val) {
                if (val) {
                    return val;
                } else {
                    return '-'
                }
            }
        },
        created() {
            this.getOperateTypes();
            this.getLog();
        },
        watch: {
            operateType() {
                this.getLog();
            },
            states() {
                this.getLog();
            },
            title() {
                this.getLog();
            },
            userName() {
                this.getLog();
            },
            time() {
                this.getLog();
            },
        },
        methods: {
            handleSizeChange(val) {
                this.currentPage = 1;
                this.pageSize = val;
                this.getLog();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getLog();
            },
            //获取操作类型列表
            getOperateTypes() {
                this.$request.get('/api/admin/log/getOperateType').then(res => {
                    if (res.success) {
                        this.allOperateTypes = res.data;
                    }
                })
            },
            //获取日志
            getLog() {
                let params = {
                    limit: this.pageSize,
                    offset: (this.currentPage - 1) * this.pageSize,
                    operateType: this.operateType,
                    states: this.states,
                    time: this.time,
                    title: this.title,
                    userName: this.userName
                };

                if (this.logType === 'adminLog') {
                    this.$request.post('/api/admin/log/getAdminLogs', params).then(res => {
                        if (res.success) {
                            this.logList = res.data.list;
                            this.totalCount = res.data.total;
                        }
                    })
                } else if (this.logType === 'userLog') {
                    this.$request.post('/api/admin/log/getMemberLogs', params).then(res => {
                        if (res.success) {
                            this.logList = res.data.list;
                            this.totalCount = res.data.total;
                        }
                    })
                }
            },
            //选中
            handleSelectionChange(val) {
                let ids = [];
                ids = val.map(item => item.id);
                this.selectList = ids;
            },
            //删除
            deleteItems() {
                if (this.selectList && this.selectList.length === 0) {
                    this.$message.warning('请选择要删除的项');
                    return;
                }

                this.$confirm('此操作将永久删除选中的项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/log/deleteOperateLogs', {params: {array: this.selectList}}).then(res => {
                        if (res.success) {
                            this.$message.success("删除成功");
                            this.getLog();
                        }
                    })
                }).catch(()=>{})
            },
            //清空
            emptyItems() {
                this.$confirm('此操作将永久删除以生成的日志, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/log/emptyOperateLogs', {params: {userType: this.logType === 'adminLog' ? '1' : '2'}}).then(res => {
                        if (res.success) {
                            this.$message.success("已清空全部项");
                            this.getLog();
                        }
                    })
                }).catch(()=>{})
            }
        }
    }
</script>

<style scoped>
    .small-input {
        width: 120px;
        margin-right: 20px;
    }

    .small-date {
        width: 220px;
    }
    .absolute-fill-parent .height-condition{
        height: auto !important;
        margin: 10px 0;
    }
</style>

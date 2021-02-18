<template>
    <el-container class="absolute-fill-parent">
        <el-header class="flex" style="padding-top: 14px;">
            <div style="width: 400px;">
                <el-input size="small" v-model="searchVal" placeholder="请输入搜索关键字，包括审批标题、编号、正文内容、审批意见"></el-input>
            </div>
            <div class="flex" style="margin-left: 32px;line-height: 32px;">
                审批类型：
                <el-select size="small" v-model="approvalType" placeholder="请选择">
                    <el-option v-for="item in approvalTypes" :key="item.label" :value="item.label"
                               :label="item.value"></el-option>
                </el-select>
            </div>
        </el-header>
        <el-main style="padding: 0 20px 20px;">
            <el-table :data="list" height="100%" class="custom-el-table header-gray" size="small"
                      border stripe>
                <el-table-column label="姓名">
                    <template slot-scope="{row}">
                        <p class="cursor-pointer" @click="getInformation(row)">{{row.name}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="{row}">
                        <p class="cursor-pointer" @click="getInformation(row)">{{row.time | yyyyMMddHHmmss}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="审批项目">
                    <template slot-scope="{row}">
                        <p class="cursor-pointer" @click="getInformation(row)">{{row.item}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="审批类型">
                    <template slot-scope="{row}">
                        <p class="cursor-pointer" @click="getInformation(row)">{{row.type}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="审批文件">
                    <template slot-scope="{row}">
                        <a class="lrd-a underline text-overflow" @click="getInformation(row)">{{row.fileUrl}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template>
                        <el-button class="custom-el-button unset-padding" type="text">同意</el-button>
                        <el-button class="custom-el-button danger unset-padding" type="text">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-drawer :visible.sync="drawer" :show-close="false">
            <div slot="title">
                <div class="flex">
                    <div style="line-height: 32px;">审批信息</div>
                    <div class="flex-fill-in-the-remaining-space text-align-right">
                        <el-button size="small" type="primary">同意</el-button>
                        <el-button size="small" type="warning">拒绝</el-button>
                    </div>
                </div>
            </div>
            <div style="width: 100%;height: 100%;" class="position-relative">
                <div class="absolute-fill-parent">
                    <vue-scroll>
                        <div style="padding-left: 20px;line-height: 30px;color: #777777;">
                            <p>姓名：{{clickItem.name}}</p>
                            <p>创建时间：{{clickItem.time | yyyyMMddHHmmss}}</p>
                            <p>审批项目：{{clickItem.item}}</p>
                            <p>审批类型：{{clickItem.type}}</p>
                            <p>审批文件：<a class="lrd-a underline text-overflow">{{clickItem.fileUrl}}</a></p>
                        </div>
                        <div  style="padding-left: 20px;color: #777777;height: 300px;">
                            <div style="line-height: 40px;">审批轨迹</div>
                            <el-timeline reverse="false">
                                <el-timeline-item
                                        v-for="(activity, index) in activities"
                                        :key="index"
                                        :color="activity.color"
                                        :size="activity.size"
                                        :timestamp="activity.timestamp">
                                    {{activity.content}}
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </vue-scroll>
                </div>
            </div>
        </el-drawer>
    </el-container>
</template>

<script>
    export default {
        name: "AlreadyApproval",
        props: ['approveList'],
        data() {
            return {
                searchVal: '',
                approvalType: '',
                approvalTypes: [
                    {
                        label: '1',
                        value: '类型1'
                    }, {
                        label: '2',
                        value: '类型2'
                    }, {
                        label: '3',
                        value: '类型3'
                    },
                ],
                list: this.approveList,
                drawer: false,
                clickItem: {},
                activities: [{
                    content: '审批人：分会工作人员',
                    timestamp: '2019-11-12',
                }, {
                    content: '审批人：分会管理员',
                    timestamp: '2019-11-12',
                }, {
                    content: '等待审批：总部工作人员',
                    timestamp: '',
                    color: 'red',
                    size: 'large'
                }]
            }
        },
        methods: {
            getInformation(row) {
                this.drawer = true;
                this.clickItem = row
            }
        }
    }
</script>

<style scoped>

</style>
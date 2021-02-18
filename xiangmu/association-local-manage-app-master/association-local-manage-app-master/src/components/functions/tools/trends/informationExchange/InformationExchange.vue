<template>
    <el-container class="absolute-fill-parent background-color-white flex">
        <el-aside class="border-right position-relative" style="width: 207px;">
            <group-list describable v-model="chosenGroup" :max-level="1" groupType="4" all-group="所有交换" type-name="分类" title="所有分类"/>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent background-color-white trendManage" style="padding: 0 20px;">
                <el-header class="flex header filterHeader unset-padding" style="line-height: 60px;">
                    <div class="marginDistance">
                        <el-dropdown trigger="click" @command="selectDropDownItem">
                                <span class="el-dropdown-link">{{dropDownItem}}
                                    <i class="el-icon-arrow-down el-icon--right"/>
                                </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="item in dropDownItems" :key="item.label" :command="item">
                                    {{item.value}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="marginDistance">
                        <el-input class="input-short" size="small" prefix-icon="el-icon-search"
                                  placeholder="搜索用户昵称、姓名、手机号" v-model="searchContent"
                                  @blur="getInformationList"/>
                    </div>
                    <div class="marginDistance">
                        <span>对接状态：</span>
                        <el-select class="select-short" size="small" v-model="exchangeStatus"
                                   @change="getInformationList">
                            <el-option v-for="item in exchangeStatusList" :key="item.value" :label="item.label"
                                       :value="item.value"/>
                        </el-select>
                    </div>
                    <div class="marginDistance">
                        <span>发布时间：</span>
                        <el-date-picker class="date-short" size="small" type="daterange"
                                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                v-model="timeRange" clearable format="yyyy-MM-dd" @blur="getInformationList"/>
                    </div>
                </el-header>
                <el-main v-show="trendList.length>0"  v-loading="loading" class="trendWrap unset-padding">
                    <vue-scroll>
                        <div class="trendList">
                            <div class="trendInner flex flex-wrap">
                                <div class="dynamicItem" style="width: 357px;" v-for="item in trendList" :key="item.id">
                                    <trend-item :trendItem="item" :checkedItemStatus="checkedItemStatus"
                                                @addCheckedItem="addCheckedItem" @reduceCheckedItem="reduceCheckedItem"
                                                @deleteItem="deleteItem"/>
                                </div>
                            </div>
                        </div>
                    </vue-scroll>
                </el-main>
                <el-main v-show="trendList.length<=0"   v-loading="loading" class="position-relative">
                    <div class="position-absolute nodata_image">
                        <img src="../../../../../assets/nodata.png" style="width: 100%;height: 100%;">
                    </div>
                </el-main>
                <el-footer class="unset-padding">
                    <div class="flex" style="padding-top: 12px;">
                        <div class="flex-fill-in-the-remaining-space">
                            <batch-operation title="更多操作">
                                <template>
                                    <li>
                                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll"
                                                     @change="checkAllChange" :disabled="trendList.length === 0">全选
                                        </el-checkbox>
                                    </li>
                                    <li @click="deleteItems">删除</li>
                                </template>
                            </batch-operation>
                        </div>
                        <div class="flex-fill-in-the-remaining-space text-align-right">
                            <el-pagination
                                    size="small"
                                    background
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-sizes="[20, 50, 100, 200]"
                                    :page-size="pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="trendTotal">
                            </el-pagination>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import BatchOperation from '../../../../util/BatchOperation';
    import TrendItem from './TrendItem';
    import GroupList from "../../../util/group/GroupList";

    export default {
        name: "InformationExchange",
        components: {GroupList, BatchOperation, TrendItem},
        data() {
            return {
                classId: '',//对接类型
                chosenGroup: {
                    id: null
                },
                dropDownItems: [
                    {
                        label: '0',
                        value: '发布时间倒序'
                    },
                    {
                        label: '1',
                        value: '发布时间正序'
                    },
                    {
                        label: '2',
                        value: '分享数从高到低'
                    },
                    {
                        label: '3',
                        value: '分享数从低到高'
                    }
                ],
                dropDownItem: '发布时间倒序',
                orderWay: '0',//排序方式
                exchangeStatusList: [
                    {
                        value: '-1',
                        label: '全部'
                    }, {
                        value: '0',
                        label: '对接中'
                    }, {
                        value: '1',
                        label: '已关闭'
                    }, {
                        value: '2',
                        label: '对接成功'
                    }, {
                        value: '3',
                        label: '对接失败'
                    },
                ],//对接状态
                exchangeStatus: '-1',//选中的对接状态
                searchContent: '',//搜索内容
                timeRange: [],//时间段
                pageSize: 10,//每页条数
                currentPage: 1,//当前页数
                checkedAll: false,//全选
                isIndeterminate: false,//开启全选
                checkedItemStatus: false,//某一项是否选中
                checkedList: [],//选中id的列表
                trendIdList: [],//动态id列表
                trendList: [],//动态列表
                trendTotal: 0,//列表数量

                loading: false
            }
        },
        created() {
            this.getInformationList();
        },
        watch: {
            'chosenGroup.id'() {
                this.getInformationList()
            }
        },
        methods: {
            selectDropDownItem(command) {
                this.dropDownItem = command.value;
                this.orderWay = command.label;
                this.getInformationList();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.currentPage = 1;
                this.getInformationList()
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getInformationList()
            },
            //全选
            checkAllChange(val) {
                this.checkedList = val ? this.trendIdList : [];
                this.isIndeterminate = false;
                this.checkedItemStatus = val;
            },
            //选择某一项动态
            addCheckedItem(val) {
                this.checkedList.push(val);
                this.checkedAllStatus()
            },
            //不选中某一项动态
            reduceCheckedItem(val) {
                for (let i = 0; i < this.checkedList.length; i++) {
                    if (this.checkedList[i] === val) {
                        this.checkedList.splice(i, 1)
                    }
                }
                this.checkedAllStatus()
            },
            //全选状态
            checkedAllStatus() {
                let checkedCount = this.checkedList.length;
                this.checkedAll = checkedCount === this.trendList.length && checkedCount>0;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.trendList.length;
                // this.checkedItemStatus = checkedCount === this.trendList.length;
            },
            //获取动态列表
            getInformationList() {
                this.loading = true;
                this.checkedList = [];
                this.checkedAll = false;
                this.trendIdList = [];

                if(this.chosenGroup.id !== null && this.chosenGroup.id !== undefined){
                    let classId = this.chosenGroup.id === '0' ?  null : this.chosenGroup.id;
                    let params = {
                        classId,
                        exchangeStatus: this.exchangeStatus === '-1' ? '' : this.exchangeStatus,
                        orderWay: this.orderWay,
                        searchContent: this.searchContent,
                        timeRange: this.timeRange,
                        limit: this.pageSize,
                        offset: this.pageSize * (this.currentPage - 1)
                    };

                    this.$request.post('/api/admin/information/exchange/manage/listInformationExchangeByAdmin', params).then(res => {
                        if (res.success) {
                            this.trendList = res.data.list;
                            this.trendTotal = res.data.total;

                            this.trendList.map(item => {
                                this.$set(item, 'checkedItem', false);
                            });

                            for (let i = 0; i < this.trendList.length; i++) {
                                this.trendIdList.push(this.trendList[i].id)
                            }

                            this.checkedAllStatus();
                            this.$nextTick(()=>{ this.loading = false; })
                        }
                    })
                }
            },
            //删除多项
            deleteItems() {
                if (this.checkedList.length === 0) {
                    this.$message.warning('请选择要删除的项');
                    return;
                }

                this.$confirm('此操作将永久删除该交换, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/information/exchange/manage/batchDeleteInformationExchange', {params: {ids: this.checkedList}}).then(
                        res => {
                            if (res.success) {
                                this.$message.success("删除成功");
                                this.getInformationList();
                                this.checkedList = [];
                            }
                        }
                    )
                }).catch(()=>{})
            },
            //删除某一项
            deleteItem(val) {
                this.$confirm('此操作将永久删除该交换, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/information/exchange/manage/batchDeleteInformationExchange', {params: {ids: [val]}}).then(
                        res => {
                            if (res.success) {
                                this.$message.success("删除成功");
                                if (this.checkedList.length > 0) {
                                    this.reduceCheckedItem(val);
                                }
                                this.trendTotal = this.trendTotal - 1;
                                for (let i = 0; i < this.trendList.length; i++) {
                                    if (this.trendList[i].id === val) {
                                        this.trendList.splice(i, 1)
                                    }
                                }
                                for (let i = 0; i < this.trendIdList.length; i++) {
                                    if (this.trendIdList[i] === val) {
                                        this.trendIdList.splice(i, 1)
                                    }
                                }
                                this.checkedAllStatus();
                            }
                        }
                    )
                }).catch(()=>{})
            },
        }
    }
</script>

<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 0 20px;">
        <el-header class="unset-padding border-bottom flex flex-column flex-center">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex" style="line-height: 22px;padding: 5px 0 5px 10px;">
                    <i style="width: 3px;height: 22px;margin-right: 5px;background-image: linear-gradient(#E6A23C, #e66465);"></i>嘉宾库
                </div>
                <div>
                    <el-input size="small" style="width: 180px;margin-right: 16px;" v-model="searchStr"
                              placeholder="支持姓名 职位搜索"></el-input>
                    <el-button size="small" type="primary" @click="guestSelect"
                               :disabled="guestLibraryList && guestLibraryList.length === 0">从嘉宾库选择
                    </el-button>
                    <el-button size="small" type="warning" @click="addGuest">新增嘉宾</el-button>
                </div>
            </div>
        </el-header>
        <el-main v-if="list.length > 0" style="padding: 16px 0;">
            <vue-scroll>
                <div class="flex flex-wrap">
                    <div v-for="item in list" :key="item.id" style="padding: 0 16px 16px 0;">
                        <el-card shadow="always" class="card">
                            <div class="operate text-align-right">
                                <div class="suspension">
                                    <i class="el-icon-edit" @click="editGuest(item.id)"/>
                                    <span>|</span>
                                    <i class="el-icon-delete" @click="deleteGuest(item.id,item.name)"/>
                                </div>
                            </div>
                            <div class="flex" style="width: 360px;height: 116px;">
                                <div style="width: 116px;height: 116px;border-radius: 50%;overflow: hidden;">
                                    <el-image :src="item.headImg" fit="cover"
                                              style="width: 100%;height: 100%;"/>
                                </div>
                                <div class="flex-fill-in-the-remaining-space" style="padding: 0 16px;">
                                    <p class="text-overflow" style="line-height: 58px;font-size: 18px;color: #252424;">
                                        {{item.name}}</p>
                                    <p class="text-overflow" style="line-height: 58px;color: #a5a5a6;">
                                        {{item.positionTitle}}</p>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
            </vue-scroll>
        </el-main>
        <el-main v-else class="position-relative">
            <no-data/>
        </el-main>
        <el-footer class="unset-padding flex flex-column flex-center text-align-right">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    :page-sizes="[20, 50, 100, 200]"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="page.total" background>
            </el-pagination>
        </el-footer>
        <el-dialog :title="guestFormTitle" :visible.sync="guestFormVisible" append-to-body :close-on-click-modal="false"
                   width="800px">
            <guest-form v-if="guestFormVisible" :guestId="guestId" :activityId="activityId" @close="close"
                        @refresh="refresh"/>
        </el-dialog>
        <el-dialog title="从嘉宾库选择" :visible.sync="guestSelectVisible" append-to-body :close-on-click-modal="false"
                   width="800px">
            <guest-select v-if="guestSelectVisible" :activityId="activityId" @close="closeGuestSelect"
                          @refresh="refresh"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import NoData from "../../../../../util/noData/NoData";
    import GuestForm from "./GuestForm";
    import GuestSelect from "./GuestSelect";

    export default {
        name: "ActivityGuestManage",
        components: {GuestSelect, GuestForm, NoData},
        data() {
            return {
                searchStr: '',
                page: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0,
                },
                list: [],
                guestLibraryList: [],
                guestFormVisible: false,
                guestFormTitle: '新增嘉宾',
                guestSelectVisible: false,
                guestId: '',
                activityId: ''
            }
        },
        watch: {
            searchStr() {
                this.getList();
            }
        },
        created() {
            if (this.$route.params.activityId) {
                this.activityId = this.$route.params.activityId;
                this.getGuestLibraryList();
                this.getList();
            }
        },
        methods: {
            getList() {
                this.$request.get('/api/admin/HonoredGuest/getHonoredGuests', {
                    params: {
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1),
                        searchStr: this.searchStr,
                        activityId: this.activityId
                    }
                }).then(res => {
                    if (res.success) {
                        this.list = res.data.list;
                        this.page.total = res.data.total;
                    }
                })
            },
            getGuestLibraryList() {
                this.$request.get('/api/admin/HonoredGuest/getOtherGuestInActivity', {
                    params: {
                        activityId: this.activityId
                    }
                }).then(res => {
                    if (res.success) {
                        this.guestLibraryList = res.data.list;
                    }
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getList();
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList();
            },
            addGuest() {
                this.guestFormVisible = true;
                this.guestFormTitle = '新增嘉宾';
                this.guestId = ''
            },
            guestSelect() {
                this.guestSelectVisible = true;
            },
            editGuest(id) {
                this.guestFormVisible = true;
                this.guestFormTitle = '编辑嘉宾';
                this.guestId = id
            },
            deleteGuest(id, name) {
                this.$confirm('此操作将永久删除该嘉宾, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$request.delete('/api/admin/HonoredGuest/deleteGuestInActivity', {
                        params: {
                            guestId: id,
                            activityId: this.activityId
                        }
                    }).then(res => {
                        if (res.success) {
                            this.$message.success('嘉宾' + name + '删除成功');
                            this.refresh();
                        }
                    })
                }).catch(() => {
                })
            },
            close() {
                this.guestFormVisible = false;
            },
            refresh() {
                this.getList();
            },
            closeGuestSelect() {
                this.guestSelectVisible = false
            }
        }
    }
</script>

<style scoped>
    .operate {
        font-size: 17px;
        color: #393939;
        height: 23px;
        line-height: 23px;
    }

    .operate .suspension {
        display: none;
    }

    .card:hover .suspension {
        display: block;
    }

    .operate span {
        vertical-align: 2px;
        padding: 0 10px;
    }

    .operate i {
        cursor: pointer;
        font-style: normal;
        display: inline-block;
    }
</style>

<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="120px">
                <el-form-item label="嘉宾：">
                    <el-input placeholder="支持姓名 职位搜索" v-model="searchStr"></el-input>
                </el-form-item>
                <el-form-item label="选择嘉宾：">
                    <div class="fromGuest position-relative">
                        <vue-scroll v-if="guestList && guestList.length>0">
                            <div style="padding: 10px;">
                                <el-checkbox-group v-model="guestIds">
                                        <el-checkbox v-for="item in guestList" :key="item.id" :label="item.id">
                                            <div class="flex">
                                                <div style="width: 70px;height: 70px;">
                                                    <el-image :src="item.headImg" style="width: 100%;height: 100%;"
                                                              fit="cover"></el-image>
                                                </div>
                                                <div class="flex-fill-in-the-remaining-space"
                                                     style="padding-left: 20px;">
                                                    <p class="text-overflow" style="line-height: 35px;color: #252424;">
                                                        {{item.name}}</p>
                                                    <p class="text-overflow" style="line-height: 35px;color: #a5a5a6;">
                                                        {{item.positionTitle}}</p>
                                                </div>
                                            </div>
                                        </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </vue-scroll>
                        <no-data v-else></no-data>
                    </div>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex flex-center flex-column unset-padding" height="auto"
                   style="padding-top: 16px !important;">
            <div class="flex flex-end">
                <el-button size="small" icon="el-icon-error" type="danger" @click="$emit('close')">取消返回</el-button>
                <el-button size="small" icon="el-icon-success" type="primary" @click="saveData">确 定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import NoData from "../../../../../util/noData/NoData";
    export default {
        name: "GuestSelect",
        components: {NoData},
        props: ['activityId'],
        data() {
            return {
                searchStr: '',
                guestList: [],
                guestIds: []
            }
        },
        watch: {
            searchStr: function () {
                this.getGuestList();
            }
        },
        created() {
            this.getGuestList();
        },
        methods: {
            getGuestList() {
                this.$request.get('/api/admin/HonoredGuest/getOtherGuestInActivity', {
                    params: {
                        activityId: this.activityId,
                        searchStr: this.searchStr
                    }
                }).then(res => {
                    if (res.success) {
                        this.guestList = res.data;
                    }
                })
            },
            saveData() {
                if (this.guestIds && this.guestIds.length === 0) {
                    this.$message.warning('请选择要添加的项');
                    return
                }
                this.$request.post('/api/admin/HonoredGuest/batchAddGuestInActivity', {
                    activityId: this.activityId,
                    guestIds: this.guestIds
                }).then(res => {
                    if (res.success) {
                        this.$message.success('添加成功');
                        this.$emit("close");
                        this.$emit("refresh");
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .fromGuest {
        width: 100%;
        height: 100px;
        min-height: 300px;
        box-sizing: border-box;
        border: 1px solid #dcdfe6;
    }

    .el-checkbox {
        margin-right: 0;
    }

    .el-checkbox, .el-checkbox__input {
        display: block;
    }
</style>

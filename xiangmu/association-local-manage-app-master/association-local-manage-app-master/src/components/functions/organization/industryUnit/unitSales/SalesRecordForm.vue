<template>
    <el-container>
        <el-main class="unset-padding" style="overflow: hidden;height: 400px;">
            <vue-scroll>
                <el-form size="small" label-width="125px">
                    <el-form-item label="企业单位：" required>
                        <el-select clearable filterable placeholder="请选择消费企业" v-model="info.organizationId"
                                   style="width: 100%;">
                            <el-option v-for="item in unitList" :key="item.organizationId" :value="item.organizationId"
                                       :label="item.organizationName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="消费用户：" required>
                        <el-select placeholder="请选择消费用户" v-model="info.memberId" clearable filterable
                                   style="width: 100%;">
                            <el-option v-for="item in memberList" :key="item.id" :value="item.id"
                                       :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="消费时间：" required>
                        <el-date-picker v-model="info.consumeTime" type="datetime" placeholder="选择日期时间"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="消费产品：" required>
                        <el-select placeholder="请选择消费产品" v-model="info.serverIds" multiple clearable filterable
                                   style="width: 100%;">
                            <el-option v-for="item in productList" :key="item.serverId" :value="item.serverId"
                                       :label="item.serverTitle"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系人：">
                        <el-input v-model="info.contactPerson" placeholder="请输入联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话：">
                        <el-input v-model="info.contactPhone" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                    <el-form-item label="消费备注：" required>
                        <el-input type="textarea" v-model="info.remark" :rows="5" resize="none"
                                  placeholder="请输入消费备注"></el-input>
                    </el-form-item>
                </el-form>
            </vue-scroll>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "SalesRecordForm",
        props: {salesInfo: {type: Object}},
        data() {
            return {
                unitList: [],
                memberList: [],
                productList: [],//产品
                info: {
                    memberId: '',//会员id
                    consumeTime: '',//消费时间
                    serverIds: [],//服务ids
                    contactPerson: '',//联系人
                    contactPhone: '',//联系电话
                    remark: '',//备注
                    organizationId: ''//企业id
                },
            }
        },
        created() {
            this.getUnitList();
            this.getMemberList();
            if (this.salesInfo.recordId) {
                this.info.organizationId = this.salesInfo.organizationId;
                this.info.memberId = this.salesInfo.memberId;
                this.info.consumeTime = this.salesInfo.consumeTime;
                this.info.contactPerson = this.salesInfo.contactPerson;
                this.info.contactPhone = this.salesInfo.contactPhone;
                this.info.remark = this.salesInfo.remark;
                this.info.serverIds = this.salesInfo.serverIds.split(',');
                this.getProductList(this.salesInfo.organizationId);
            }
        },
        watch: {
            'info.organizationId': function () {
                this.info.serverIds = [];
                this.getProductList(this.info.organizationId);
            }
        },
        methods: {
            getUnitList() {
                this.$request.get('/api/admin/organization/listOrganizationForSelect').then(res => {
                    if (res.success) {
                        this.unitList = res.data;
                    }
                })
            },
            getMemberList() {
                this.$request.get('/api/admin/member/listForSearch').then(res => {
                    if (res.success) {
                        this.memberList = res.data;
                    }
                })
            },
            getProductList(id) {
                this.$request.get('/api/admin/organization/server/getOrganizationServerListForSearch', {
                    params: {
                        organizationId: id
                    }
                }).then(res => {
                    this.productList = res.data;
                })
            },
            submitData() {
                if (!this.info.organizationId) {
                    this.$message.warning("请选择企业单位");
                    return;
                }
                if (!this.info.memberId) {
                    this.$message.warning("请选择消费用户");
                    return;
                }
                if (!this.info.consumeTime) {
                    this.$message.warning("请选择消费时间");
                    return;
                }
                if (this.info.serverIds.length === 0) {
                    this.$message.warning("请选择消费产品");
                    return;
                }
                if (!this.info.remark) {
                    this.$message.warning("请选择消费备注");
                    return;
                }

                if (this.salesInfo.recordId) {
                    this.info.id = this.salesInfo.recordId;
                    this.$request.put('/api/admin/organization/server/updateOrganizationServerRecord', this.info).then(res => {
                        if (res.success) {
                            this.$message.success("修改成功");
                            this.$emit("close");
                            this.$emit("refresh")
                        }
                    })
                } else {
                    this.$request.post('/api/admin/organization/server/addOrganizationServerRecord', this.info).then(res => {
                        if (res.success) {
                            this.$message.success("添加成功");
                            this.$emit("close");
                            this.$emit("refresh")
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
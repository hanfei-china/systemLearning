<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form label-width="100px" size="small" style="overflow: hidden;">
                <el-form-item label="跟踪类型：" required>
                    <visit-type-select placeholder="请选择跟踪类型" :entity.sync="type" v-model="formInfo.visitType" />
                </el-form-item>
                <el-form-item label="跟踪时间：" required>
                    <el-date-picker v-model="formInfo.time" type="datetime" placeholder="请选择跟踪时间" format="yyyy-MM-dd HH:mm" />
                </el-form-item>
                <el-form-item v-show="!memberId" label="目标会员：" required>
                    <el-select style="width: 100%;" :multiple="!formId" clearable
                               v-model="formInfo.targetMember" filterable remote reserve-keyword
                               placeholder="请输入会员姓名进行搜索" :remote-method="remoteMethod" :loading="loading">
                        <el-option v-for="item in targetMemberList" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件地点：" :required="!type.isOnline">
                    <el-input v-model="formInfo.address" placeholder="请输入事件地点，100字以内" :maxlength="100"/>
                </el-form-item>
                <el-form-item label="详细说明：">
                    <el-input type="textarea" placeholder="详细说明，500字以内" :maxlength="500" :rows="8" resize="none" v-model="formInfo.description"/>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex flex-center flex-column unset-padding" height="auto"
                   style="padding-top: 16px !important;">
            <div class="flex flex-end">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="saveData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import VisitTypeSelect from "./util/visitTypeSelect";
    export default {
        name: "RecordForm",
        components: {VisitTypeSelect},
        props: {
            formId: String,
            memberId: String,
        },
        data() {
            return {
                formInfo: {
                    address: '',
                    description: '',
                    targetMember: '',
                    time: '',
                    visitType: null,
                },
                loading: false,
                targetMemberList: [],
                type: {}
            }
        },
        created() {
            if (this.formId) {
                this.$request.get('/api/admin/visit/memberVisit/getVisitById', {
                    params: {
                        id: this.formId
                    }
                }).then(res => {
                    if (res.success) {
                        this.formInfo = res.data;
                        this.targetMemberList.push({
                            id: res.data.targetMember,
                            name: res.data.targetMemberName
                        })
                    }
                })
            }
        },
        methods: {
            getVisitType(val){
                this.formInfo.visitType = val;
            },
            saveData() {
                if(!this.formInfo.visitType){
                    this.$message.warning("请选择跟踪类型");
                    return;
                }

                if(!this.formInfo.time){
                    this.$message.warning("请选择跟踪时间");
                    return;
                }

                if(!this.type.isOnline && !this.formInfo.address){
                    this.$message.warning("请输入事件地点");
                    return;
                }

                let data = {...this.formInfo};

                if (!this.formId) {

                    if(!this.memberId && (!this.formInfo.targetMember || this.formInfo.targetMember.length < 1)){
                        this.$message.warning("请选择目标会员");
                        return;
                    }

                    if(this.memberId){
                        data.targetMembers = [this.memberId];
                    }else{
                        data.targetMembers = this.formInfo.targetMember;
                    }


                    data.targetMember = null;

                    this.$request.post('/api/admin/visit/memberVisit/addVisit', data).then(res => {
                        if (res.success) {
                            this.$message.success("记录添加成功");
                            this.$emit("refresh");
                            this.$emit("close");
                        }
                    })
                } else {
                    if(!this.memberId && !this.formInfo.targetMember){
                        this.$message.warning("请选择目标会员");
                        return;
                    }

                    data.id = this.formId;

                    this.$request.put('/api/admin/visit/memberVisit/updateVisit', data).then(res => {
                        if (res.success) {
                            this.$message.success("记录修改成功");
                            this.$emit("refresh");
                            this.$emit("close");
                        }
                    })
                }
            },
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.$nextTick(()=>{ this.loading = false; })
                        this.$request.get('/api/admin/member/getMemberIdAndNameByName', {
                            params: {
                                name: query
                            }
                        }).then(res => {
                            if (res.success) {
                                this.targetMemberList = res.data;
                            }
                        })
                    }, 200);
                } else {
                    this.targetMemberList = [];
                }
            },
        }
    }
</script>

<template>
    <el-container>
        <el-main class="unset-padding position-relative">
            <el-form size="small" label-width="100px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            关联分会：
                        </div>
                    </template>
                    <el-select placeholder="请选择要关联的分会" style="width: 450px;" v-model="chosenBranchIds" multiple filterable remote :remote-method="getBranchList">
                        <el-option v-for="branch of branchList" :key="branch.id" :label="branch.name" :value="branch.id">
                            <template>
                                {{branch.name+'（'+branch.branchClassName+'）'}}
                            </template>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            关联账号：
                        </div>
                    </template>
                    <el-select placeholder="请选择要关联的用户" style="width: 450px;" v-model="chosenAdmins" multiple filterable remote :remote-method="getAdminAccountList">
                        <el-option v-for="admin of adminList" :key="admin.id" :label="admin.name" :value="admin.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding flex flex-column flex-center" height="auto">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "BranchRoleRelevantAdminUserList",
        props:{
            roleId: String
        },
        data(){
            return {
                adminList: [],
                chosenAdmins:[],

                branchList: [],
                chosenBranchIds: []
            }
        },
        methods:{
            getAdminAccountList(keyword){
                this.$request.get('/api/admin/account/list',{
                    params:{
                        keyword
                    }
                }).then(res=>{
                    this.adminList = res.data.list;
                });
            },
            getBranchList(keyword){
                let params = {
                    name: keyword,
                    needMain: true
                };

                this.$request.get('/api/common/branch/branchList',{params}).then((resp)=>{
                    let {data} = resp;
                    this.branchList = data.list;
                })
            },
            submitData(){
                if(!this.chosenBranchIds || this.chosenBranchIds.length < 1){
                    this.$message.warning("请选择要关联的分会");
                    return;
                }

                if(!this.chosenAdmins || this.chosenAdmins.length < 1){
                    this.$message.warning("请选择要关联的用户");
                    return;
                }

                this.$request.post('/api/admin/privilege/adminLinkRole',{
                    adminIds: this.chosenAdmins,
                    branchIds: this.chosenBranchIds,
                    roleId: this.roleId
                }).then(()=>{
                    this.$emit('refresh');
                    this.$emit('close');
                    this.$message.success("所选用户已成功关联");
                })
            },
        },
        created(){
            this.getAdminAccountList();
            this.getBranchList();
        }

    }
</script>

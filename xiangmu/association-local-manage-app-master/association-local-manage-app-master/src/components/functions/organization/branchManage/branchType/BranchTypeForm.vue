<template>
    <el-container style="height: 246px;">
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent">
                <vue-scroll>
                    <el-form ref="form" size="small" label-width="100px" :model="branchType" :rules="rules">
                        <el-form-item label="类型名称：" prop="name">
                            <el-input placeholder="分会类型名称，20字以内" v-model="branchType.name" :maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="描述：">
                            <el-input placeholder="分会类型简介，100字以内" type="textarea" :maxlength="100" :rows="3"
                                      resize="none"
                                      v-model="branchType.description"></el-input>
                        </el-form-item>
                        <el-form-item label="启用状态：" prop="isUsed">
                            <el-switch v-model="branchType.isUsed"></el-switch>
                        </el-form-item>
                    </el-form>
                </vue-scroll>
            </div>
        </el-main>
        <el-footer height="auto">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="save">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>

    export default {
        name: "BranchTypeForm",
        props: {
            data: {
                type: Object,
                default() {
                    return {
                        id: '',
                        name: '',
                        description: '',
                        isUsed: true
                    }
                }
            }
        },
        data() {
            return {

                rules: {
                    name: [
                        {required: true, message: '请输入类型名称', trigger: 'blur'}
                    ],
                    isUsed: [
                        {required: true}
                    ]
                },
                branchType: {...this.data}
            }
        },
        methods: {
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.branchType.id) {
                            this.updateType();
                        } else {
                            this.newType();
                        }
                    }
                });
            },
            newType() {
                this.$request.get('/api/admin/branchType/getBranchTypeInfos').then(res=>{
                    if (res.success) {
                        let seq = res.data.length;
                        this.$request.post('/api/admin/branchType/addBranchType',{
                            name: this.branchType.name,
                            description: this.branchType.description,
                            isUsed: this.branchType.isUsed,
                            seq
                        }).then(res =>{
                            this.$message.success("新增分会类型成功");
                            if (res.success) {
                                this.$emit('refresh-types');
                                this.$emit('close');
                            }
                        })
                    }
                })
            },
            updateType() {
                this.$request.put('/api/admin/branchType/updateBranchType',{
                    id: this.branchType.id,
                    name: this.branchType.name,
                    description: this.branchType.description,
                    isUsed: this.branchType.isUsed,
                }).then(res =>{
                    this.$message.success("修改分会类型成功");
                    if (res.success) {
                        this.$emit('refresh-types');
                        this.$emit('close');
                    }
                })
            }
        }
    }
</script>

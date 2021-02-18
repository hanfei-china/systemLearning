<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form label-width="90px" size="small">
                <el-form-item label="建会上限：">
                    <span style="color: red;">{{num}}</span>
                </el-form-item>
                <el-form-item label="修改上限：">
                    <el-input placeholder="请设置建会申请上限" v-model="createBranchNumLimit"></el-input>
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
    export default {
        name: "ApplyMountForm",
        data(){
            return {
                createBranchNumLimit: '',
                num: 0,//建会上限
            }
        },
        created(){
            this.getNum();
        },
        methods: {
            getNum(){
                this.$request.get('/api/common/setting/anon/getCommonSetting',{params: {type: 3}}).then(res => {
                    if(res.success){
                        this.num = res.data;
                    }
                })
            },
            saveData(){
                this.$request.post('/api/admin/settings/manage/updateBranchApplySetting',null, {params: {createBranchNumLimit: this.createBranchNumLimit}}).then(res => {
                    if(res.success){
                        this.$message.success('设置成功');
                        this.$emit("close")
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
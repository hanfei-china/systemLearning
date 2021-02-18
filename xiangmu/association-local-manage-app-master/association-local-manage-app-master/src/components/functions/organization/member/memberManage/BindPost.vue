<template>
    <el-container style="overflow: hidden;">
        <el-main class="unset-padding" style="overflow: hidden;">
            <el-form size="small" label-width="100px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            职务名称：
                        </div>
                    </template>
                    <el-select style="width: 100%;" v-model="postId">
                        <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.postName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="saveSetting">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "BindPost",
        props: {
            branchId: String,
            memberId: String,
            defaultPost: String
        },
        data(){
            return {
                postId: this.defaultPost,
                list: []
            }
        },
        created() {
            this.$request.get('/api/admin/post/list').then(res => {
                if(res.success){
                    this.list = res.data;
                }
            })
        },
        methods: {
            saveSetting(){
                if(!this.postId){
                    this.$message.warning('请选择职务');
                    return;
                }

                this.$request.put('/api/admin/post/memberPostBinding',{
                    targetBranchId: this.branchId,
                    memberId: this.memberId,
                    postId: this.postId,
                }).then(res => {
                    if(res.success){
                        this.$message.success('职务变更成功');
                        this.$emit('refresh');
                        this.$emit('close')
                    }
                })
            }
        }
    }
</script>

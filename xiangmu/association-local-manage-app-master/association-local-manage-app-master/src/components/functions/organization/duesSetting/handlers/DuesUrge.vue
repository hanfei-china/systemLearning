<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form label-width="80px" size="small">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            备注：
                        </div>
                    </template>
                    <el-input v-model="content" :maxlength="200" placeholder="备注信息，200字以内"
                              type="textarea" resize="none" :rows="5"/>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right" style="padding-top: 16px">
                <el-button icon="el-icon-error" type="danger" @click="$emit('close')" size="small">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">发送通知</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        name: "DuesUrge",
        props: {
            memberInfo:{
                type: Object,
                default(){
                    return {}
                }
            }
        },
        computed:{
            branchId(){
                return this.$store.state.branchId;
            }
        },
        data(){
            return {
                content: ''
            }
        },
        methods:{
            submitData(){
                if(!this.memberInfo.id){
                    this.$message.error('会员ID为空');
                    return;
                }

                if(!this.branchId){
                    this.$message.error('会场ID为空');
                    return;
                }

                this.$request.post('/api/admin/branch/duesUrge',{
                    branchId: this.branchId,
                    content: this.content,
                    userId: this.memberInfo.id
                }).then(()=>{
                    this.$message.success('会费催缴通知发送成功');
                    this.$emit('close');
                })

            },
        }
    }
</script>


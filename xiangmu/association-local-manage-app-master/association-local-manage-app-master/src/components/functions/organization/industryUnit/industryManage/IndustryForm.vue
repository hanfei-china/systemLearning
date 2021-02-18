<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            行业名称：
                        </div>
                    </template>
                    <el-input :maxlength="20" placeholder="行业名称，20字以内" v-model="title"></el-input>
                </el-form-item>
            </el-form>
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
        name: "IndustryForm",
        props:{
            industryInfo: {
                type: Object,
                default(){
                    return {
                        title: '',
                        id: ''
                    }
                }
            },
            seq:{
                type: Number,
                default: 0
            }
        },
        data(){
            return {
                title: this.industryInfo.title
            }
        },
        methods:{
            submitData(){
                if(!this.title){
                    this.$message.warning('请输入行业名称');
                    return;
                }

                let data = {
                    title: this.title
                };

                if(this.industryInfo.id){
                    data.id = this.industryInfo.id;
                    this.$request.put('/api/admin/organization/category/updateOrganizationCategory',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('行业信息修改成功');
                    })
                }else{
                    data.seq = this.seq;
                    this.$request.post('/api/admin/organization/category/addOrganizationCategory',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('行业新增成功');
                    })
                }
            }
        }
    }
</script>

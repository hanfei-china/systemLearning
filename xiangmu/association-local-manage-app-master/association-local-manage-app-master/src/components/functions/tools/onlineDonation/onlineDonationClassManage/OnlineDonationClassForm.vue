<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            分类名称：
                        </div>
                    </template>
                    <el-input :maxlength="20" placeholder="分类名称，20字以内" v-model="title"></el-input>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            分类描述：
                        </div>
                    </template>
                    <el-input :maxlength="200" type="textarea" v-model="description" :rows="5" resize="none" placeholder="分类描述，200字以内"></el-input>
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
        name: "OnlineDonationClassForm",
        props:{
            classInfo: {
                type: Object,
                default(){
                    return {
                        title: '',
                        description: '',
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
                title: this.classInfo.title,
                description: this.classInfo.description
            }
        },
        methods:{
            submitData(){
                if(!this.title){
                    this.$message.warning('请输入分类名称');
                    return;
                }

                let data = {
                    title: this.title,
                    description: this.description
                };

                if(this.classInfo.id){
                    data.id = this.classInfo.id;
                    this.$request.put('/api/admin/onlineDonationClass',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('分类修改成功');
                    })
                }else{
                    data.seq = this.seq;
                    this.$request.post('/api/admin/onlineDonationClass',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('分类新增成功');
                    })
                }
            }
        }
    }
</script>

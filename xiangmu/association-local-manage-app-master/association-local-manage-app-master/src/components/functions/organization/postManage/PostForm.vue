<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            职务名称：
                        </div>
                    </template>
                    <el-input :maxlength="20" placeholder="职务名称，20字以内" v-model="postName"></el-input>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            职务描述：
                        </div>
                    </template>
                    <el-input :maxlength="200" type="textarea" v-model="postDescription" :rows="5" resize="none" placeholder="职务描述，200字以内"></el-input>
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
        name: "PostForm",
        props:{
            id:String,
            seq: Number
        },
        data(){
            return {
                postName: '',
                postDescription: ''
            }
        },
        methods:{
            submitData(){
                if(!this.postName){
                    this.$message.warning('请输入职务名称');
                    return;
                }

                let data = {
                    postName: this.postName,
                    postDescription: this.postDescription
                }

                if(this.id){
                    data.id = this.id;
                    this.$request.put('/api/admin/post',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('职务修改成功');
                    })
                }else{
                    data.seq = this.seq;
                    this.$request.post('/api/admin/post',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('职务新增成功');
                    })
                }
            },
            getDetail(){
                if(this.id){
                    this.$request.get('/api/admin/post',{
                        params:{
                            id: this.id
                        }
                    }).then(res=>{
                        this.postName = res.data.postName;
                        this.postDescription = res.data.postDescription;
                    })
                }
            }
        },
        created() {
            this.getDetail();
        }
    }
</script>

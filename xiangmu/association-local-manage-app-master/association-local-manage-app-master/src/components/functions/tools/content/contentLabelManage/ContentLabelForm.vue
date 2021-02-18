<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            标签名称：
                        </div>
                    </template>
                    <el-input :maxlength="20" placeholder="标签名称，20字以内" v-model="title"></el-input>
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
        name: "ContentLabelForm",
        props:{
            classId:String,
            id:String,
            seq:{
                type: Number,
                default: 0
            }
        },
        data(){
            return {
                title: '',
                description: ''
            }
        },
        methods:{
            submitData(){
                if(!this.title){
                    this.$message.warning('请输入标签名称');
                    return;
                }

                let data = {
                    title: this.title,
                    classId: this.classId
                }

                if(this.id){
                    data.id = this.id;
                    this.$request.put('/api/admin/contentLabel',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('标签修改成功');
                    })
                }else{
                    data.seq = this.seq;
                    this.$request.post('/api/admin/contentLabel',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('标签新增成功');
                    })
                }
            },
            getDetail(){
                if(this.id){
                    this.$request.get('/api/admin/contentLabel',{
                        params:{
                            id: this.id
                        }
                    }).then(res=>{
                        this.title = res.data.title;
                    })
                }
            }
        },
        created() {
            this.getDetail();
        }
    }
</script>

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
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            其他设置：
                        </div>
                    </template>
                    <el-checkbox v-model="isOpenMemberPrivilege">
                        <span>开启会员权限校验</span>
                        <el-tooltip class="item" effect="dark" content="开启后，该分类下的文章将对有权限会员进行开放" placement="top-start">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </el-checkbox>
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
        name: "ContentClassForm",
        props:{
            id:String,
            seq:{
                type: Number,
                default: 0
            }
        },
        data(){
            return {
                title: '',
                description: '',
                isOpenMemberPrivilege: false
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
                    description: this.description,
                    isOpenMemberPrivilege: this.isOpenMemberPrivilege
                };

                if(this.id){
                    data.id = this.id;
                    this.$request.put('/api/admin/contentClass',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('分类修改成功');
                    })
                }else{
                    data.seq = this.seq;
                    this.$request.post('/api/admin/contentClass',data).then(()=>{
                        this.$emit('refresh-list');
                        this.$emit('close');
                        this.$message.success('分类新增成功');
                    })
                }
            },
            getDetail(){
                if(this.id){
                    this.$request.get('/api/admin/contentClass',{
                        params:{
                            id: this.id
                        }
                    }).then(res=>{
                        this.title = res.data.title;
                        this.description = res.data.description;
                        this.isOpenMemberPrivilege = res.data.isOpenMemberPrivilege;
                    })
                }
            }
        },
        created() {
            this.getDetail();
        }
    }
</script>

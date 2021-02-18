<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="100px">
                <el-form-item label="模版名称：" required>
                    <el-input placeholder="请输入模版名称，50字以内" :maxLength="50" v-model="templateInfo.templateName"/>
                </el-form-item>
                <el-form-item label="示例图：">
                    <image-upload v-model="templateInfo.templateExample"/>
                </el-form-item>
                <el-form-item label="其他设置：">
                    <el-checkbox v-model="templateInfo.isOpen">开放模版</el-checkbox>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="save">确定</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import ImageUpload from "../../../../util/ImageUpload";
    export default {
        name: "TemplateForm",
        components: {ImageUpload},
        props:{
            seq: Number,
            templateId: String,
            templateType: Number,
            moduleId: String,
            templateConfig: String
        },
        data(){
            return {
                templateInfo:{
                    templateName: '',
                    templateExample: '',
                    isOpen: false
                }
            }
        },
        methods:{
            save(){
                let data = {
                    templateType: this.templateType,
                    moduleId: this.moduleId,
                    templateName: this.templateInfo.templateName,
                    templateExample: this.templateInfo.templateExample,
                    templateConfig: this.templateConfig,
                    isOpen: this.templateInfo.isOpen,
                    seq: this.seq
                };
                if(this.templateId){
                    data.id = this.templateId;
                    this.$request.put('/api/admin/designTemplate',data).then(()=>{
                        this.$message.success('模版修改成功');
                        this.$emit('refresh');
                        this.$emit('close');
                    })
                }else{
                    this.$request.post('/api/admin/designTemplate',data).then(()=>{
                        this.$message.success('模版创建成功');
                        this.$emit('refresh');
                        this.$emit('close');
                    })

                }
            },
            getTemplateInfo(){
                if(this.templateId){
                    this.$request.post('/api/common/designTemplate/info',{
                        id: this.templateId
                    }).then(({data})=>{
                        this.templateInfo.templateName = data.templateName;
                        this.templateInfo.templateExample = data.templateExample;
                        this.templateInfo.isOpen = data.isOpen;
                    })
                }
            }
        },
        created() {
            this.getTemplateInfo();
        }
    }
</script>

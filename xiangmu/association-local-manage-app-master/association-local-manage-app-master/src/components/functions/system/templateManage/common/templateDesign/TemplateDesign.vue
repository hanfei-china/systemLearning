<template>
    <el-container class="fixed-fill-parent">
        <el-header class="border-bottom flex flex-center flex-column">
            <div style="width: 1280px;margin: 0 auto;" class="flex">
                <div class="flex-fill-in-the-remaining-space flex flex-center flex-column">
                    <span style="font-size: 16px;">模版设计【{{templateInfo.templateName}}】</span>
                </div>
                <div>
                    <el-button type="primary" @click="save">保存模版</el-button>
                    <el-button type="danger" style="position: relative;">
                        <span style="opacity: 0;">预览模版</span>
                        <a :href="preview" target="_blank" class="absolute-fill-parent" style="color: #ffffff;line-height: 36px;">预览</a>
                    </el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <website-page-template-design v-if="templateInfo.templateType === 0"
                                          :template-config="templateInfo.templateConfig"
                                          @change="configChange"/>

            <website-module-template-design v-else-if="templateInfo.templateType === 1"
                                            :template-config="templateInfo.templateConfig" :module-id="templateInfo.moduleId"
                                            @change="configChange"/>
        </el-main>
    </el-container>
</template>

<script>
    import WebsitePageTemplateDesign from "./WebsitePageTemplateDesign";
    import WebsiteModuleTemplateDesign from "./webisteModule/WebsiteModuleTemplateDesign";
    export default {
        name: "TemplateDesign",
        components: {WebsiteModuleTemplateDesign, WebsitePageTemplateDesign},
        computed:{
            templateId(){
                return this.$route.params.templateId
            },
            preview(){
                return this.$router.resolve(`/template/preview/${this.templateId}`).href;
            }
        },
        data(){
            return {
                templateInfo:{
                    templateName: '',
                    templateExample: '',
                    isOpen: false,
                    templateConfig: null,
                    templateType: null,
                    moduleId: null
                },
                templateConfig: ''
            }
        },
        methods:{
            getTemplateInfo(){
                if(this.templateId){
                    this.$request.post('/api/common/designTemplate/info',{
                        id: this.templateId
                    }).then(({data})=>{
                        this.templateInfo.templateName = data.templateName;
                        this.templateInfo.templateExample = data.templateExample;
                        this.templateInfo.isOpen = data.isOpen;
                        this.templateInfo.templateType = data.templateType;
                        this.templateInfo.moduleId = data.moduleId;
                        this.templateInfo.templateConfig = JSON.parse(data.templateConfig);
                    })
                }
            },
            configChange(templateConfig){
                this.templateConfig = templateConfig;
            },
            save(){
                this.$request.put('/api/admin/designTemplate/config',{
                    id: this.templateId,
                    ...this.templateInfo,
                    templateConfig: this.templateConfig
                }).then(()=>{
                    this.$message.success('模版已更新');
                })
            }
        },
        mounted() {
            this.getTemplateInfo();
        },
        watch:{
            templateId(){
                this.getTemplateInfo();
            }
        }
    }
</script>

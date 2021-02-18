<template>
    <el-container class="fixed-fill-parent">
        <el-header class="border-bottom flex flex-center flex-column">
            <div style="width: 1280px;margin: 0 auto;" class="flex">
                <div class="flex-fill-in-the-remaining-space flex flex-center flex-column">
                    <span style="font-size: 16px;">模版预览【{{templateInfo.templateName}}】</span>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <website-page-template-preview v-if="templateInfo.templateType === 0"
                                           :template-config="templateInfo.templateConfig"/>
            <website-module-template-preview v-else-if="templateInfo.templateType === 1"
                                             :template-config="templateInfo.templateConfig"
                                             :module-id="templateInfo.moduleId"/>
        </el-main>
    </el-container>
</template>

<script>

    import WebsitePageTemplatePreview from "./WebsitePageTemplatePreview";
    import WebsiteModuleTemplatePreview from "./WebsiteModuleTemplatePreview";
    export default {
        name: "TemplatePreview",
        components: {WebsiteModuleTemplatePreview, WebsitePageTemplatePreview},
        computed:{
            templateId(){
                return this.$route.params.templateId
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

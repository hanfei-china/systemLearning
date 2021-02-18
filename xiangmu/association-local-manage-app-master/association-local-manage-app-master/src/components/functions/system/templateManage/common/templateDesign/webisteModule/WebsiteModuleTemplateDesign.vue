<template>
    <website-layout-module-template-design v-if="['wsFreeContainer','wsFillContainer'].indexOf(this.moduleId) > -1"
                                           :module-id="moduleId" :template-config="templateConfig"
                                           @change="change"/>
    <website-un-layout-module-template-design v-else
                                              :module-id="moduleId" :template-config="templateConfig"
                                              @change="change"/>
</template>

<script>
    import WebsiteLayoutModuleTemplateDesign from "./WebsiteLayoutModuleTemplateDesign";
    import WebsiteUnLayoutModuleTemplateDesign from "./WebsiteUnLayoutModuleTemplateDesign";
    export default {
        name: "WebsiteModuleTemplateDesign",
        components: {WebsiteUnLayoutModuleTemplateDesign, WebsiteLayoutModuleTemplateDesign},
        props:{
            templateConfig:Object,
            moduleId: String
        },
        methods:{
            change(moduleConfig){
                this.$emit('change',moduleConfig);
            }
        }
    }
</script>

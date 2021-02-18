<template>
    <div class="website-pro-module-group-row-container">
        <div class="website-pro-module-group-row">
            <module-choose-item v-for="module of modules" :un-used-modules="unUsedModules"
                                :key="module.name" :module="module"
                                :template-group="templateGroup" :choose-module="moduleName"
                                @dragstart="dragStart" @dragend="dragEnd" @show-templates="showTemplates"/>
        </div>
    </div>
</template>

<script>
    import ModuleChooseItem from "./ModuleChooseItem";
    export default {
        name: "ModuleChooseItemRow",
        components: {ModuleChooseItem},
        props:{
            modules: Array,
            unUsedModules: Array,
            templateGroup: Object,
            moduleName: String,
        },
        data(){
            return {

            }
        },
        methods:{
            dragStart(event, name, moduleConfig) {
                this.$emit('dragstart', event, name, moduleConfig);
            },
            dragEnd() {
                this.$emit('dragend');
            },
            showTemplates(templates,moduleName,moduleTitle){
                this.$emit('show-templates', templates, moduleName,moduleTitle);
            },
        }
    }
</script>

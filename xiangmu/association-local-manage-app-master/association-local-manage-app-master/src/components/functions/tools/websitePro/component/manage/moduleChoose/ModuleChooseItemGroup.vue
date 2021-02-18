<template>
    <div class="website-module-group">
        <div class="website-pro-module-group-title">{{group.title}}</div>
        <div class="website-pro-module-group-content">
            <module-choose-item-row v-for="(modules,index) of moduleRows" :key="index" :module-name="moduleName"
                                    :un-used-modules="unUsedModules" :modules="modules" :template-group="templateGroup"
                                    @dragstart="dragStart" @dragend="dragEnd" @show-templates="showTemplates"/>
        </div>
    </div>
</template>

<script>
    import ModuleChooseItemRow from "./ModuleChooseItemRow";
    export default {
        name: "ModuleChooseItemGroup",
        components: {ModuleChooseItemRow},
        props:{
            group: Object,
            unUsedModules: Array,
            templateGroup: Object,
            moduleName: String,
            colCount: {
                type: Number,
                default: 4
            }
        },
        computed:{
            moduleRows(){
                let colCount = this.colCount;
                let array_2d = [];
                for (let index = 0; index < this.group.modules.length; index += colCount) {
                    let temp = this.group.modules.slice(index, index + colCount);
                    array_2d.push(temp);
                }
                return array_2d;
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

<template>
    <div class="website-pro-absolute-fill-parent">
        <vue-scroll>
            <module-choose-item-group v-for="group of showModuleGroups" :key="group.name" :module-name="moduleName" :col-count="colCount"
                                      :group="group" :un-used-modules="unUsedModules" :template-group="templateGroup"
                                      @dragstart="dragStart" @dragend="dragEnd" @show-templates="showTemplates"/>
        </vue-scroll>
        <el-container class="website-pro-module-template-container" :class="{show:isShowTemplates}">
            <el-header class="website-pro-flex column center border-bottom" style="padding: 0 12px;" height="50px">
                <div class="website-pro-flex">
                    <div class="flex-fill-in-the-remaining-space" style="font-size: 15px;">{{`【${moduleTitle}】模版`}}</div>
                    <div>
                        <i class="el-icon-close module-template-close" @click="templatesVisible=false"/>
                    </div>
                </div>
            </el-header>
            <el-main class="website-pro-unset-padding">
                <vue-scroll>
                    <div class="website-pro-flex wrap" style="padding: 12px 16px;">
                        <module-template-item v-for="templateInfo of templates" :key="templateInfo.id"
                                              :template-info="templateInfo" :img-width="imgWidth"
                                              @dragend="dragEnd"  @dragstart="templateDragStart"/>
                    </div>
                </vue-scroll>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import {moduleGroups} from "../../../js/modules/moduleBuilder";
    import ModuleChooseItemGroup from "./ModuleChooseItemGroup";
    import ModuleTemplateItem from "./ModuleTemplateItem";

    export default {
        name: "ModuleChoose",
        components: {ModuleTemplateItem, ModuleChooseItemGroup},
        props:{
            unUsedModules: Array,
            showModules: Array,
            colCount: {
                type: Number,
                default: 4
            },
            imgWidth: {
                type: Number,
                default: 150
            },
            isGetTemplates: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                list: [],
                total: 0,
                moduleGroups,
                moduleName: '',

                templatesVisible: false,
                templates: [],
                moduleTitle: ''
            }
        },
        methods: {
            dragStart(event, name, moduleConfig) {
                this.$emit('set-group','website-module');
                this.$emit('set-module',name, moduleConfig);
            },
            dragEnd() {
                this.$emit('set-group','');
                this.$emit('set-module','', null);
            },
            getModuleTemplates(){
                if(!this.isGetTemplates){
                    return;
                }
                let params = {
                    limit: 10000,
                    offset: 0,
                    templateType: 1,
                    filterUnOpen: true
                };

                this.$request.post('/api/common/designTemplate/list',params).then(res=>{
                    this.list = res.data.list;
                    this.total = res.data.total;
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            showTemplates(templates,moduleName,moduleTitle){
                this.templates = templates;
                this.templatesVisible = true;
                this.moduleTitle = moduleTitle;
                // this.moduleName = moduleName;
            },
            templateDragStart(event,moduleConfig){
                moduleConfig = JSON.parse(moduleConfig);
                this.$emit('set-group','website-module');
                this.$emit('set-module', moduleConfig.name, moduleConfig);
            },
        },
        computed:{
            showModuleGroups(){
                if(this.showModules && this.showModules.length > 0){
                    return this.showModules;
                }
                return this.moduleGroups;
            },
            isShowTemplates(){
                return this.templatesVisible && this.templates.length > 0;
            },
            templateGroup(){
                let templateGroup = {};
                for(let template of this.list){
                    let {moduleId} = template;
                    if(templateGroup.hasOwnProperty(moduleId) && templateGroup[moduleId]){
                        templateGroup[moduleId].push(template);
                    }else{
                        templateGroup[moduleId] = [template];
                    }
                }

                return templateGroup;
            }
        },
        mounted() {
            this.getModuleTemplates();
        }
    }
</script>
<style lang="less">
    .website-pro-module-template-container{
        transition: all .4s;
        padding: 0;
        overflow: hidden;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 0;
        background-color: #ffffff;

        &.show{
            height: 642px;
        }

        .module-template-close{
            font-size: 20px;
            cursor: pointer;

            &:hover{
                color: #00a0e9;
            }
        }
    }
</style>

<template>
    <div class="absolute-fill-parent">
        <vue-scroll>
            <div>
                <div>
                    <div class="module-group-title">
                        <span>活动模块</span>
                    </div>
                    <div class="module-group">
                        <draggable :list="activityModules" :clone="clone" :sort="false" :group="{ name: 'newActivityModule', pull: 'clone', put: false }">
                            <div class="module-label-container" v-for="module of activityModules" :key="module.name">
                                <div class="module-label">
                                    <div class="module-icon"><img :src="module.icon" /></div>
                                    <span class="module-title">{{module.title}}</span>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
                <div v-show="customModules.length > 0">
                    <div class="module-group-title">
                        <span>自定义模块</span>
                    </div>
                    <div class="module-group">
                        <draggable :list="customModules" :clone="clone" :sort="false" :group="{ name: 'newActivityModule', pull: 'clone', put: false }">
                            <div class="module-label-container" v-for="module of customModules" :key="module.name">
                                <div class="module-label">
                                    <div class="module-icon"><img :src="module.icon" /></div>
                                    <span class="module-title">{{module.title}}</span>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </div>
        </vue-scroll>
    </div>
</template>

<script>

    import ButtonModule from "../js/module/buttonModule";
    import FallFlowModule from "../js/module/fallFlowModule";

    export default {
        name: "TemplateModules",
        props:{
            moduleConfig: Object
        },
        computed:{
            index(){
                return this.moduleConfig.index;
            },
            template(){
                return this.moduleConfig.templates[this.index];
            },
            activityModules(){
                return this.template.activityModules;
            },
            customModules(){
                return this.template.customModules;
            }
        },
        methods:{
            clone(data){
                let module = null;
                if(data instanceof ButtonModule){
                    let iconBackgroundColor = data.attributes.iconGroup.attributes.iconBackgroundColor.value;
                    module = new ButtonModule(data.name, data.id, data.icon, data.title, iconBackgroundColor,data.isActivityModule);
                    return module;
                }else if(data instanceof FallFlowModule){
                    module = new FallFlowModule(data.name, data.id, data.icon, data.title, data.isActivityModule);
                    return module;
                }else{
                    this.$message.warning('未注册的模块');
                    return false;
                }
            }
        }
    }
</script>

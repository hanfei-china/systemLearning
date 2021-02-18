<template>
    <el-container style="width: 375px;background-color: #F1F1F1;margin: 0 auto;height: 650px;box-shadow: rgba(150, 150, 150, 0.8) 2px 2px 4px 2px;"
                  class="position-relative">
        <el-main class="unset-padding position-relative flow-hidden">
            <component :template="template" :is="template.name" @setting="setting" :activity-info="activityInfo"/>
        </el-main>
    </el-container>
</template>

<script>
    import ActivityTemplate1 from "./template/ActivityTemplate1";
    import ActivityTemplate2 from "./template/ActivityTemplate2";
    export default {
        name: "DesignPanel",
        components: {ActivityTemplate2, ActivityTemplate1},
        props:{
            moduleConfig: Object,
            activityInfo: Object,
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
            },
            modules(){
                return this.template.modules;
            },
        },
        methods:{
            setting(module){
              this.$emit('setting',module);
            },
        }
    }
</script>

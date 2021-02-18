<template>
   <div class="absolute-fill-parent" v-loading="loading">
       <el-container class="absolute-fill-parent" v-if="!loading">
           <el-aside class="background-color-white position-relative" width="414px">
               <el-container class="absolute-fill-parent">
                   <el-aside width="70px" class="position-relative flow-hidden" style="border-right: rgba(0,0,0,.1) 1px solid;">
                       <vue-scroll>
                           <el-menu class="design-el-menu" :default-active="panel" mode="vertical"
                                    :collapse="true" @select="panelSelect">
                               <el-menu-item index="templates" style="padding: 0;">
                                   <div class="design-el-menu-item">
                                       <label><i class="icon iconfont icon-mp-template design-el-menu-item-icon"/></label>
                                       <label class="design-el-menu-item-title">模版</label>
                                   </div>
                               </el-menu-item>
                               <el-menu-item index="modules" style="padding: 0;">
                                   <div class="design-el-menu-item">
                                       <label><i class="icon iconfont icon-mp-module design-el-menu-item-icon"/></label>
                                       <label class="design-el-menu-item-title">模块</label>
                                   </div>
                               </el-menu-item>
                           </el-menu>
                       </vue-scroll>
                   </el-aside>
                   <el-main class="unset-padding position-relative">
                       <activity-templates v-show=" panel==='templates' " :module-config="config"/>
                       <template-modules v-show=" panel==='modules' " :module-config="config"/>
                   </el-main>
               </el-container>
           </el-aside>
           <el-main>
               <design-panel :module-config="config" :activity-info="activityInfo" @setting="setting"/>
           </el-main>
           <el-aside width="340px" class="background-color-white position-relative" v-show="isSetting">
              <el-container class="absolute-fill-parent">
                  <el-header height="50px" class="flex flex-center flex-column">
                      <div class="flex">
                          <div class="flex-fill-in-the-remaining-space">属性设置</div>
                          <div class="activity-design-setting-closer" @click="isSetting = false"><i class="el-icon-close"/></div>
                      </div>
                  </el-header>
                  <el-main class="unset-padding position-relative">
                      <div class="absolute-fill-parent">
                          <attribute-setting hidden-module-title :module="settingModule"/>
                      </div>
                  </el-main>
              </el-container>
           </el-aside>
       </el-container>
   </div>
</template>

<script>
    import ActivityTemplateConfig from "./js/base/activityTemplateConfig";
    import ActivityTemplates from "./component/ActivityTemplates";
    import TemplateModules from "./component/TemplateModules";
    import DesignPanel from "./component/DesignPanel";
    import Vue from 'vue';
    import AttributeSetting from "../../../websitePro/component/attribute/AttributeSetting";
    import debounce from 'lodash/debounce';
    export default {
        name: "ActivityDesign",
        components: {AttributeSetting, DesignPanel, TemplateModules, ActivityTemplates},
        data() {
            return {
                panel: 'modules',
                loading: true,
                config: null,
                activityInfo: null,
                settingModule: null,
                isSetting: false,
            }
        },
        computed:{
            activityId(){
                return this.$route.params.activityId;
            },
        },
        methods:{
            panelSelect(value) {
                this.panel = value;
            },
            getActivityInfo() {
                this.loading = true;
                Promise.all([
                    this.$request.get('/api/common/activityCommonInfo/getActivityInfoById', {
                    params: {activityId: this.activityId}}),
                    this.$request.get('/api/common/template', {
                        params: {templateId: this.activityId}})
                ]).then(([activityInfo,templateInfo])=>{
                    this.activityInfo = activityInfo.data;
                    this.config = Vue.observable(new ActivityTemplateConfig(JSON.parse(templateInfo.data.config)))
                    setTimeout(()=>{
                        this.$nextTick(()=>{ this.loading = false; })
                    },100);
                });
            },
            setting(module){
                this.settingModule = module;
                this.isSetting = true;
            },
            updateConfig(val){
                if(!this.loading){
                    this.$request.put('/api/admin/template',{
                        id: this.activityId,
                        config: JSON.stringify(val.toJson())
                    }).then(()=>{})
                }
            }
        },
        mounted() {
            this.getActivityInfo();
            this.updateConfig = debounce(this.updateConfig,300);
        },
        watch:{
            config:{
                deep: true,
                handler(val){
                    this.updateConfig(val);
                }
            }
        }
    }
</script>
<style lang="less">
    .activity-design-setting-closer{
        cursor: pointer;

        &>i{
            font-size: 18px;
        }

        &:hover{
            color: #00a0e9;
        }
    }
</style>

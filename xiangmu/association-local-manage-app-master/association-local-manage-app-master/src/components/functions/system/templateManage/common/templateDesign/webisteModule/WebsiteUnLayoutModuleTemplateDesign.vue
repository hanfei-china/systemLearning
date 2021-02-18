<template>
    <div class="website-pro-absolute-fill-parent" :style="style">
        <div class="website-pro-absolute-fill-parent website-pro-flex column">
            <div class="website-pro-unset-padding website-pro-position-relative flex-fill-in-the-remaining-space">
                <div class="website-pro-absolute-fill-parent website-pro website-pro-flex column">
                    <vue-scroll class="flex-fill-in-the-remaining-space" ref="scroll">
                        <div style="z-index: 1;" ref="drop" class="website-pro-module-drop-div" :style="{width: width+'px',height:height+'px'}">
                            <component :is="module.name + 'Setting'" :ref="module.id" :module="module"
                                       @setting="setting"  :can-delete="false"/>
                        </div>
                    </vue-scroll>
                </div>
            </div>
        </div>
        <attribute-panel ref="settingPanel" :visible.sync="settingPanelVisible" :module="settingModule"/>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {addEvent,removeEvent} from "../../../../../tools/websitePro/js/util/dom";
    import AttributePanel from "../../../../../tools/websitePro/component/attribute/AttributePanel";
    import {moduleBuilder} from "../../../../../tools/websitePro/js/modules/moduleBuilder";

    import WsButtonSetting from "../../../../../tools/websitePro/component/modules/frequently/wsButton/WsButtonSetting";
    import WsTextSetting from "../../../../../tools/websitePro/component/modules/frequently/wsText/WsTextSetting";
    import WsImageSetting from "../../../../../tools/websitePro/component/modules/frequently/wsImage/WsImageSetting";
    import WsFillContainerSetting from "../../../../../tools/websitePro/component/modules/layout/wsFillContainer/WsFillContainerSetting";
    import WsFreeContainerSetting from "../../../../../tools/websitePro/component/modules/layout/wsFreeContainer/WsFreeContainerSetting";
    import WsArticleListSetting from "../../../../../tools/websitePro/component/modules/base/wsArticleList/WsArticleListSetting";
    import WsGreatEventsSetting from "../../../../../tools/websitePro/component/modules/base/wsGreatEvents/WsGreatEventsSetting";
    import WsMenuSetting from "../../../../../tools/websitePro/component/modules/base/wsMenu/WsMenuSetting";
    import WsRichTextSetting from "../../../../../tools/websitePro/component/modules/base/wsRichText/WsRichTextSetting";
    import WsWheelPlantingSetting from "../../../../../tools/websitePro/component/modules/base/wsWheelPlanting/WsWheelPlantingSetting";
    import WsBreadcrumbSetting from "../../../../../tools/websitePro/component/modules/base/wsBreadcrumb/WsBreadcrumbSetting";

    import DraggableResizable from "../../../../../tools/websitePro/component/modules/vue-draggable-resizable/DraggableResizable";
    import WsSideMenuSetting from "../../../../../tools/websitePro/component/modules/base/wsSideMenu/WsSideMenuSetting";

    export default {
        name: "WebsiteUnLayoutModuleTemplateDesign",
        components: {
            WsSideMenuSetting,
            DraggableResizable,
            AttributePanel,

            WsBreadcrumbSetting,
            WsWheelPlantingSetting,
            WsRichTextSetting,
            WsMenuSetting,
            WsGreatEventsSetting,
            WsArticleListSetting,
            WsFreeContainerSetting,
            WsFillContainerSetting, WsImageSetting, WsTextSetting, WsButtonSetting
        },
        props:{
            templateConfig:Object,
            moduleId: String
        },
        data(){
            return {
                style: {},
                provideData: null,
                //组件属性设置面板
                settingModule: null,
                //属性面板显示
                settingPanelVisible: false,

                module: {},

                width: window.innerWidth,
            }
        },
        provide(){
            const provideData = Vue.observable({
                scrollEl: null,
                settingPanel: null,
                group: '',
                dropModule:''
            });
            this.provideData = provideData;
            return {
                designProvide: provideData
            };
        },
        computed:{
            height(){
                let result = 0;
                if(this.module){
                    let {attributes} = this.module;

                    let {top,height} = attributes.layoutGroup.attributes.layout.value;

                    if(top+height > result){
                        result = top + height;
                    }
                }

                return result;
            }
        },
        methods:{
            computeContainerStyle(){
                this.width = window.innerWidth;
                this.style = {
                    width: window.innerWidth+'px',
                    height: window.innerHeight-60+'px'
                };
            },
            setting(module){
                this.settingModule = module;
                this.settingPanelVisible = true;
            },
            emitChange(){
                let result = this.module.toJsonWithoutId();

                this.$emit('change',JSON.stringify(result));
            }
        },
        mounted() {
            this.provideData.scrollEl = this.$refs.scroll.$refs.scrollPanel;
            this.provideData.settingPanel = this.$refs.settingPanel;
        },
        created() {
            this.computeContainerStyle();
            addEvent(window,'resize',this.computeContainerStyle);

            this.module = Vue.observable(moduleBuilder(this.moduleId,this.templateConfig));
        },
        beforeDestroy() {
            removeEvent(window,'resize', this.computeContainerStyle);
        },
        watch:{
            module:{
                deep: true,
                handler(){
                    this.emitChange();
                }
            }
        }
    }
</script>

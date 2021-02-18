<template>
    <un-resize-setting-container ref="setting" class="website-pro-absolute-fill-parent" :title="module.title" :class="{active:dropTip}"
                                 @setting="settingModule(module)" @delete="$emit('delete')"
                                 @setting-if-setting="settingIfSetting(module)">
        <div style="z-index: 1;" ref="drop" class="website-pro-absolute-fill-parent website-pro-flex"
             @drop="drop" :style="styles.containerStyle">
            <div class="flex-fill-in-the-remaining-space website-pro-flex" :style="componentContainerStyle">
                <component v-for="(child,index) of module.modules" :is="child.name + 'Setting'" :ref="child.id" :key="child.id" :module="child"
                           @setting="settingModule" @delete="deleteModule(index)"
                           @setting-if-setting="settingIfSetting"/>
            </div>
            <div class="website-pro-flex column center" :style="styles.dropTipStyle" style="overflow: hidden;background-color: rgba(50,128,127,.5);" v-show="dropTip">
                <div class="website-pro-text-center" style="font-size: 14px;color: #333333;letter-spacing: 2px;">放在这里</div>
            </div>
        </div>
    </un-resize-setting-container>
</template>

<script>
    import UnResizeSettingContainer from "../../../UnResizeSettingContainer";
    import {moduleBuilder} from "../../../../../js/modules/moduleBuilder";
    import {addEvent, removeEvent} from "../../../../../js/util/dom";
    import WsPortalNoticeSetting from "../wsPortalNotice/WsPortalNoticeSetting";
    import WsPortalButtonSetting from "../wsPortalButton/WsPortalButtonSetting";
    import WsPortalChartSetting from "../wsPortalChart/WsPortalChartSetting";
    import WsPortalRichTextSetting from "../wsPortalRichText/WsPortalRichTextSetting";

    export default {
        name: "WsCellTabPaneSetting",
        components: {
            WsPortalRichTextSetting,
            WsPortalChartSetting,
            WsPortalButtonSetting,
            WsPortalNoticeSetting,
            WsColSetting: () => import('../wsCol/WsColSetting'),
            WsRowSetting: () => import('../wsRow/WsRowSetting'),
            WsCellTitleContainerSetting: ()=> import('../wsCellTitleContainer/WsCellTitleContainerSetting'),
            UnResizeSettingContainer
        },
        props:{
            module: Object,
            canDelete: {
                type: Boolean,
                default: true
            },
        },
        data(){
            return {
                dropTip: false
            }
        },
        inject:['designProvide'],
        computed:{
            scrollEl(){
                return this.designProvide.scrollEl;
            },
            group(){
                return this.designProvide.group;
            },
            dropModule(){
                return this.designProvide.dropModule;
            },
            dropModuleConfig(){
                return this.designProvide.dropModuleConfig;
            },
            isHasRow(){
                for(let module of this.module.modules){
                    let {name} = module;
                    if(name === 'wsRow'){
                        return true;
                    }
                }
                return false;
            },
            isHasCol(){
                for(let module of this.module.modules){
                    let {name} = module;
                    if(name === 'wsCol'){
                        return true;
                    }
                }
                return false;
            },
            isEmptyContainer(){
                return this.module.modules.length<1;
            },
            componentContainerStyle(){
                if(this.isHasRow){
                    return {
                        flexDirection: 'column'
                    }
                }

                return {};
            },
            styles(){
                let moduleName = this.dropModule;
                if(moduleName === 'wsCol'){
                    return {
                        containerStyle: {},
                        dropTipStyle:{
                            flex: '0 0 80px',
                        },
                        isCol: true
                    }
                }else if(moduleName === 'wsRow'){
                    return {
                        containerStyle: {
                            flexDirection: 'column'
                        },
                        dropTipStyle:{
                            flex: '0 0 80px',
                        },
                        isRow: true
                    }
                }else{
                    return {
                        containerStyle: {
                            flexDirection: 'column'
                        },
                        dropTipStyle:{
                            flex: '0 0 80px',
                        },
                        isCell: true
                    }
                }
            },
        },
        methods:{
            settingModule(module){
                this.$emit('setting',module);
            },
            settingIfSetting(module){
                this.$emit('setting-if-setting',module);
            },
            deleteModule(index){
                this.module.deleteModule(index);
                this.$emit('deleted');
            },
            drop(event) {
                event.stopPropagation();
                if(this.dropTip){
                    let moduleName = this.dropModule;

                    let module = moduleBuilder(moduleName, this.dropModuleConfig);
                    this.module.addModule(module);
                }
            },
            windowDragOver(event) {
                event.preventDefault();
                if((this.isEmptyContainer
                    || this.isHasRow && this.styles.isRow
                    || this.isHasCol && this.styles.isCol) &&  this.dropModule !== 'wsCellTabPane'){
                    this.dropTip = true;
                }
            },
            windowDragEnd() {
                this.dropTip = false;
            },
        },
        created() {
            addEvent(window, 'dragover', this.windowDragOver);
            addEvent(window, 'dragend', this.windowDragEnd);
        },
        beforeDestroy() {
            removeEvent(window, 'dragover', this.windowDragOver);
            removeEvent(window, 'dragend', this.windowDragEnd);
        },
    }
</script>

<template>
    <un-resize-setting-container style="flex:1;" ref="setting" :title="module.title"
                                 @setting="settingModule(module)" @delete="$emit('delete')"
                                 @setting-if-setting="settingIfSetting(module)">
        <el-container class="website-pro-absolute-fill-parent">
            <el-header height="auto" class="website-pro-flex" :style="titleStyle" v-if="showHeader">
                <div class="website-pro-flex column center">
                    <img v-if="showIcon && icon" :src="icon" :style="iconStyle"/>
                </div>
                <span class="website-pro-flex column center">{{module.attributes.titleGroup.attributes.title.value}}</span>
            </el-header>
            <el-main class="website-pro-unset-padding website-pro-position-relative" :style="mainStyle">
                <div style="z-index: 1;" ref="drop" class="website-pro-absolute-fill-parent website-pro-flex"
                     @drop="drop" :style="styles.containerStyle">
                    <div v-if="isNormalContainer" class="flex-fill-in-the-remaining-space website-pro-flex" :style="componentContainerStyle">
                        <component v-for="(child,index) of module.modules" :is="child.name + 'Setting'" :ref="child.id" :key="child.id" :module="child"
                                   @setting="settingModule" @delete="deleteModule(index)"
                                   @setting-if-setting="settingIfSetting"/>
                    </div>
                    <div v-if="isTabContainer" class="flex-fill-in-the-remaining-space website-pro-flex column">
                        <el-menu class="website-pro-cell-tabs" mode="horizontal" :default-active="activeMenu" @select="setActiveMenu">
                            <el-menu-item v-for="child of module.modules" :key="child.id" :index="child.id">
                                <temp-var :iconGroup="child.attributes.iconGroup.attributes"
                                          :titleGroup="child.attributes.titleGroup.attributes">
                                    <template v-slot="{iconGroup,titleGroup}">
                                        <span class="website-pro-flex">
                                            <temp-var :showIcon="iconGroup.showIcon.value" :icon="iconGroup.icon.value"
                                                      :iconStyle="{height: iconGroup.iconHeight.value+'px',marginRight: iconGroup.iconMarginRight.value+'px',}">
                                                <template v-slot="{showIcon,icon,iconStyle}">
                                                    <span class="website-pro-flex column center">
                                                        <img v-if="showIcon && icon" :src="icon" :style="iconStyle"/>
                                                    </span>
                                                </template>
                                            </temp-var>
                                            <temp-var :title="titleGroup.title.value">
                                                <template v-slot="{title}">
                                                    <span class="website-pro-flex column center">
                                                        {{title}}
                                                    </span>
                                                </template>
                                            </temp-var>
                                        </span>
                                    </template>
                                </temp-var>
                            </el-menu-item>
                        </el-menu>
                        <div class="flex-fill-in-the-remaining-space website-pro-position-relative">
                            <component v-for="(child,index) of module.modules" v-show="activeMenu === child.id" :is="child.name + 'Setting'" :ref="child.id" :key="child.id" :module="child"
                                       @setting="settingModule" @delete="deleteModule(index)"
                                       @setting-if-setting="settingIfSetting"/>
                        </div>
                    </div>
                    <div class="website-pro-flex column center" :style="styles.dropTipStyle" style="overflow: hidden;background-color: rgba(50,128,127,.5);" v-show="dropTip">
                        <div class="website-pro-text-center" style="font-size: 14px;color: #333333;letter-spacing: 2px;">放在这里</div>
                    </div>
                </div>
            </el-main>
        </el-container>
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
    import WsCellTabPaneSetting from "../wsCellTabPane/WsCellTabPaneSetting";
    import TempVar from "../../../../../../../../util/TempVar";

    export default {
        name: "WsCellTitleContainerSetting",
        components: {
            TempVar,
            WsCellTabPaneSetting,
            WsPortalRichTextSetting,
            WsPortalChartSetting,
            WsPortalButtonSetting,
            WsPortalNoticeSetting,
            UnResizeSettingContainer,
            WsColSetting: ()=> import('../wsCol/WsColSetting'),
            WsRowSetting: ()=> import('../wsRow/WsRowSetting'),
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
                dropTip: false,
                activeMenu: ''
            }
        },
        inject:['designProvide'],
        computed:{
            iconGroup(){
                return this.module.attributes.iconGroup.attributes;
            },
            showIcon(){
                return this.iconGroup.showIcon.value;
            },
            iconStyle(){
                return {
                    height: this.iconGroup.iconHeight.value+'px',
                    marginRight: this.iconGroup.iconMarginRight.value+'px',
                }
            },
            icon(){
                return this.iconGroup.icon.value;
            },
            titleGroup(){
                return this.module.attributes.titleGroup.attributes;
            },
            showTitle(){
                return this.titleGroup.showTitle.value;
            },
            titleStyle(){
                if(!this.showTitle){
                    return {};
                }else{
                    let {font,titlePadding,titleBorderRadius,titleBorder,titleBackground} = this.titleGroup;

                    let style = {
                        borderTopLeftRadius: titleBorderRadius.value.leftTop + 'px',
                        borderBottomLeftRadius: titleBorderRadius.value.leftBottom + 'px',
                        borderTopRightRadius: titleBorderRadius.value.rightTop + 'px',
                        borderBottomRightRadius: titleBorderRadius.value.rightBottom + 'px',

                        borderTopColor: titleBorder.value.top.borderColor,
                        borderTopStyle: titleBorder.value.top.borderStyle,
                        borderTopWidth: titleBorder.value.top.borderWidth + 'px',

                        borderBottomColor: titleBorder.value.bottom.borderColor,
                        borderBottomStyle: titleBorder.value.bottom.borderStyle,
                        borderBottomWidth: titleBorder.value.bottom.borderWidth + 'px',

                        borderLeftColor: titleBorder.value.left.borderColor,
                        borderLeftStyle: titleBorder.value.left.borderStyle,
                        borderLeftWidth: titleBorder.value.left.borderWidth + 'px',

                        borderRightColor: titleBorder.value.right.borderColor,
                        borderRightStyle: titleBorder.value.right.borderStyle,
                        borderRightWidth: titleBorder.value.right.borderWidth + 'px',

                        paddingTop: titlePadding.value.top + 'px',
                        paddingBottom: titlePadding.value.bottom + 'px',
                        paddingLeft: titlePadding.value.left + 'px',
                        paddingRight: titlePadding.value.right + 'px',

                        color: font.value.color,
                        fontFamily: font.value.fontFamily,
                        fontSize:font.value.fontSize,
                        textDecoration:font.value.textDecoration ? 'underline' : 'none',
                        fontStyle:font.value.italic ? 'italic' : 'normal',
                        fontWeight:font.value.bold ? 'bold' : 'normal',
                    };

                    let {
                        backgroundImage, backgroundColor,
                        backgroundPositionX, backgroundPositionY, backgroundSize,
                        backgroundRepeatX, backgroundRepeatY
                    } = titleBackground.value;

                    if (backgroundImage) {
                        style.backgroundImage = `url(${backgroundImage})`;
                    }

                    if (backgroundColor) {
                        style.backgroundColor = backgroundColor;
                    }

                    if (backgroundPositionX) {
                        style.backgroundPositionX = backgroundPositionX;
                    }

                    if (backgroundPositionY) {
                        style.backgroundPositionY = backgroundPositionY;
                    }

                    if (backgroundSize) {
                        style.backgroundSize = backgroundSize;
                    }

                    if (backgroundRepeatX && backgroundRepeatY) {
                        style.backgroundRepeat = 'repeat';
                    }

                    if (backgroundRepeatX && !backgroundRepeatY) {
                        style.backgroundRepeat = 'repeat-x';
                    }

                    if (!backgroundRepeatX && backgroundRepeatY) {
                        style.backgroundRepeat = 'repeat-y';
                    }

                    if (!backgroundRepeatX && !backgroundRepeatY) {
                        style.backgroundRepeat = 'no-repeat';
                    }

                    return style;
                }
            },
            mainGroup(){
                return this.module.attributes.mainGroup.attributes;
            },
            mainStyle(){
                let {mainBackground} = this.mainGroup;
                let style = {};

                let {
                    backgroundImage, backgroundColor,
                    backgroundPositionX, backgroundPositionY, backgroundSize,
                    backgroundRepeatX, backgroundRepeatY
                } = mainBackground.value;

                if (backgroundImage) {
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if (backgroundColor) {
                    style.backgroundColor = backgroundColor;
                }

                if (backgroundPositionX) {
                    style.backgroundPositionX = backgroundPositionX;
                }

                if (backgroundPositionY) {
                    style.backgroundPositionY = backgroundPositionY;
                }

                if (backgroundSize) {
                    style.backgroundSize = backgroundSize;
                }

                if (backgroundRepeatX && backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat';
                }

                if (backgroundRepeatX && !backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat-x';
                }

                if (!backgroundRepeatX && backgroundRepeatY) {
                    style.backgroundRepeat = 'repeat-y';
                }

                if (!backgroundRepeatX && !backgroundRepeatY) {
                    style.backgroundRepeat = 'no-repeat';
                }

                return style;
            },
            advancedGroup(){
                return this.module.attributes.advancedGroup.attributes;
            },
            containerType(){
                return this.advancedGroup.containerType.value;
            },
            showHeader(){
                return (this.showIcon || this.showTitle) && this.containerType === 'normal';
            },
            isNormalContainer(){
                return this.containerType === 'normal';
            },
            isTabContainer(){
                return this.containerType === 'tab';
            },
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
            moduleStyle(){
                return {
                    flex: this.module.attributes.layoutGroup.attributes.width.value,
                    marginTop: this.module.attributes.layoutGroup.attributes.margin.value.top + 'px',
                    marginBottom: this.module.attributes.layoutGroup.attributes.margin.value.bottom + 'px',
                    marginLeft: this.module.attributes.layoutGroup.attributes.margin.value.left + 'px',
                    marginRight: this.module.attributes.layoutGroup.attributes.margin.value.right + 'px',
                }
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
            setActiveMenu(index){
                this.activeMenu = index;
            },
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
                if((this.isNormalContainer && (this.isEmptyContainer || this.isHasRow && this.styles.isRow || this.isHasCol && this.styles.isCol) && this.dropModule !== 'wsCellTabPane') ||
                    (this.isTabContainer && this.dropModule === 'wsCellTabPane') ){
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
        watch:{
            'module.modules':{
                deep: true,
                immediate: true,
                handler(val){
                    if(val.length > 0 && !this.activeMenu){
                        this.activeMenu = val[0].id;
                    }
                }
            }
        }
    }
</script>

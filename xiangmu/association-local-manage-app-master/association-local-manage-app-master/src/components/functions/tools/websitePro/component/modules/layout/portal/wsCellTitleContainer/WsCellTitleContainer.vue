<template>
    <el-container class="website-pro-absolute-fill-parent">
        <el-header height="auto" class="website-pro-flex" :style="titleStyle" v-if="showHeader">
            <div class="website-pro-flex column center">
                <img v-if="showIcon && icon" :src="icon" :style="iconStyle"/>
            </div>
            <span class="website-pro-flex column center">{{module.attributes.titleGroup.attributes.title.value}}</span>
        </el-header>
        <el-main v-if="isNormalContainer" :style="mainStyle" class="website-pro-position-relative website-pro-unset-padding website-pro-flex">
            <component v-for="child of module.modules" :is="child.name" :key="child.id" :module="child"/>
        </el-main>
        <el-main v-if="isTabContainer" :style="mainStyle" class="website-pro-position-relative website-pro-unset-padding website-pro-flex column">
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
                <component v-for="child of module.modules" v-show="activeMenu === child.id"
                           :is="child.name" :ref="child.id" :key="child.id" :module="child"/>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import WsPortalNotice from "../wsPortalNotice/WsPortalNotice";
    import WsPortalButton from "../wsPortalButton/WsPortalButton";
    import WsPortalChart from "../wsPortalChart/WsPortalChart";
    import WsPortalRichText from "../wsPortalRichText/WsPortalRichText";
    import TempVar from "../../../../../../../../util/TempVar";
    import WsCellTabPane from "../wsCellTabPane/WsCellTabPane";
    export default {
        name: "WsCellTitleContainer",
        components:{
            WsCellTabPane,
            TempVar,
            WsPortalRichText,
            WsPortalChart,
            WsPortalButton,
            WsPortalNotice,
            WsCol: ()=> import('../wsCol/WsCol'),
            WsRow: ()=> import('../wsRow/WsRow'),
        },
        props:{
            module: Object,
        },
        data(){
            return {
                activeMenu: ''
            }
        },
        computed:{
            isHasRow(){
                for(let module of this.module.modules){
                    let {name} = module;
                    if(name === 'wsRow'){
                        return true;
                    }
                }
                return false;
            },
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

                if(this.isHasRow){
                    style.flexDirection= 'column';
                }

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
        },
        methods:{
            totalChange(total){
                this.total = total;
            },
            pageChange(currentPage){
                this.currentPage = currentPage;
            },
            loadingChange(loading){
                this.loading = loading;
            },
            setActiveMenu(index){
                this.activeMenu = index;
            },
        },
        created() {
            if(this.isTabContainer && this.module.modules.length > 0){
                this.activeMenu = this.module.modules[0].id;
            }

        }
    }
</script>

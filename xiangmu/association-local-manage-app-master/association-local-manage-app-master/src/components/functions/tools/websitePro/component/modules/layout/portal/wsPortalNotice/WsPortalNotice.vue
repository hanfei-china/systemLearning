<template>
    <el-container class="website-pro-absolute-fill-parent" :style="containerStyle">
        <el-header height="auto" class="website-pro-flex" :style="titleStyle" v-if="showIcon || showTitle">
            <div class="website-pro-flex column center">
                <img v-if="showIcon && icon" :src="icon" :style="iconStyle"/>
            </div>
            <span class="website-pro-flex column center">{{module.attributes.titleGroup.attributes.title.value}}</span>
        </el-header>
        <el-main :style="mainStyle" v-loading="loading">
            <vue-scroll v-show="total>0" :ops="{scrollPanel:{scrollingX: false}}">
                <component :is="funcType" :module="module" :current-page="currentPage"
                    @total-change="totalChange" @loading-change="loadingChange"/>
            </vue-scroll>
            <no-data v-show="total<=0" width="150px"/>
        </el-main>
        <el-footer height="auto" class="text-align-right" v-if="pageable" :style="pageableStyle">
            <el-pagination :current-page="currentPage" :page-size="pageSize"
                           :total="total" small layout="total, prev, pager, next"
                           @current-change="pageChange">
            </el-pagination>
        </el-footer>
    </el-container>
</template>

<script>
    import PortalCellContentList from "./component/contentList/PortalCellContentList";
    import NoData from "../../../../../../../../util/noData/NoData";
    import PortalCellNoticeList from "./component/PortalCellNoticeList";
    export default {
        name: "WsPortalNotice",
        components: {PortalCellNoticeList, NoData, PortalCellContentList},
        props:{
            module: Object,
        },
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
            pageableGroup(){
                return this.module.attributes.pageableGroup.attributes;
            },
            pageable(){
                return this.pageableGroup.pageable.value;
            },
            pageableStyle(){
                if(!this.pageable){
                    return {};
                }else{
                    let {pageablePadding,pageableBorderRadius,pageableBorder,pageableBackground} = this.pageableGroup;

                    let style = {
                        borderTopLeftRadius: pageableBorderRadius.value.leftTop + 'px',
                        borderBottomLeftRadius: pageableBorderRadius.value.leftBottom + 'px',
                        borderTopRightRadius: pageableBorderRadius.value.rightTop + 'px',
                        borderBottomRightRadius: pageableBorderRadius.value.rightBottom + 'px',

                        borderTopColor: pageableBorder.value.top.borderColor,
                        borderTopStyle: pageableBorder.value.top.borderStyle,
                        borderTopWidth: pageableBorder.value.top.borderWidth + 'px',

                        borderBottomColor: pageableBorder.value.bottom.borderColor,
                        borderBottomStyle: pageableBorder.value.bottom.borderStyle,
                        borderBottomWidth: pageableBorder.value.bottom.borderWidth + 'px',

                        borderLeftColor: pageableBorder.value.left.borderColor,
                        borderLeftStyle: pageableBorder.value.left.borderStyle,
                        borderLeftWidth: pageableBorder.value.left.borderWidth + 'px',

                        borderRightColor: pageableBorder.value.right.borderColor,
                        borderRightStyle: pageableBorder.value.right.borderStyle,
                        borderRightWidth: pageableBorder.value.right.borderWidth + 'px',

                        paddingTop: pageablePadding.value.top + 'px',
                        paddingBottom: pageablePadding.value.bottom + 'px',
                        paddingLeft: pageablePadding.value.left + 'px',
                        paddingRight: pageablePadding.value.right + 'px',
                    };

                    let {
                        backgroundImage, backgroundColor,
                        backgroundPositionX, backgroundPositionY, backgroundSize,
                        backgroundRepeatX, backgroundRepeatY
                    } = pageableBackground.value;

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
                let {mainPadding,mainBorderRadius,mainBorder,mainBackground} = this.mainGroup;

                let style = {
                    borderTopLeftRadius: mainBorderRadius.value.leftTop + 'px',
                    borderBottomLeftRadius: mainBorderRadius.value.leftBottom + 'px',
                    borderTopRightRadius: mainBorderRadius.value.rightTop + 'px',
                    borderBottomRightRadius: mainBorderRadius.value.rightBottom + 'px',

                    borderTopColor: mainBorder.value.top.borderColor,
                    borderTopStyle: mainBorder.value.top.borderStyle,
                    borderTopWidth: mainBorder.value.top.borderWidth + 'px',

                    borderBottomColor: mainBorder.value.bottom.borderColor,
                    borderBottomStyle: mainBorder.value.bottom.borderStyle,
                    borderBottomWidth: mainBorder.value.bottom.borderWidth + 'px',

                    borderLeftColor: mainBorder.value.left.borderColor,
                    borderLeftStyle: mainBorder.value.left.borderStyle,
                    borderLeftWidth: mainBorder.value.left.borderWidth + 'px',

                    borderRightColor: mainBorder.value.right.borderColor,
                    borderRightStyle: mainBorder.value.right.borderStyle,
                    borderRightWidth: mainBorder.value.right.borderWidth + 'px',

                    paddingTop: mainPadding.value.top + 'px',
                    paddingBottom: mainPadding.value.bottom + 'px',
                    paddingLeft: mainPadding.value.left + 'px',
                    paddingRight: mainPadding.value.right + 'px',
                };

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
            funcGroup(){
                return this.module.attributes.funcGroup.attributes;
            },
            pageSize(){
                return this.funcGroup.pageSize.value;
            },
            funcType(){
                return this.funcGroup.funcType.value;
            },
            containerGroup(){
                return this.module.attributes.containerGroup.attributes;
            },
            containerStyle(){
                let {background,borderRadius,border,boxShadow} = this.containerGroup;

                boxShadow = boxShadow.value;


                let style = {
                    borderTopLeftRadius: borderRadius.value.leftTop + 'px',
                    borderBottomLeftRadius: borderRadius.value.leftBottom + 'px',
                    borderTopRightRadius: borderRadius.value.rightTop + 'px',
                    borderBottomRightRadius: borderRadius.value.rightBottom + 'px',

                    borderTopColor: border.value.top.borderColor,
                    borderTopStyle: border.value.top.borderStyle,
                    borderTopWidth: border.value.top.borderWidth + 'px',

                    borderBottomColor: border.value.bottom.borderColor,
                    borderBottomStyle: border.value.bottom.borderStyle,
                    borderBottomWidth: border.value.bottom.borderWidth + 'px',

                    borderLeftColor: border.value.left.borderColor,
                    borderLeftStyle: border.value.left.borderStyle,
                    borderLeftWidth: border.value.left.borderWidth + 'px',

                    borderRightColor: border.value.right.borderColor,
                    borderRightStyle: border.value.right.borderStyle,
                    borderRightWidth: border.value.right.borderWidth + 'px',

                    boxShadow: `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.insert ? 'inset' : ''}`
                };

                let {
                    backgroundImage, backgroundColor,
                    backgroundPositionX, backgroundPositionY, backgroundSize,
                    backgroundRepeatX, backgroundRepeatY
                } = background.value;

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
        data(){
            return {
                total: 0,
                currentPage: 1,
                loading: false
            }
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
            }
        }
    }
</script>

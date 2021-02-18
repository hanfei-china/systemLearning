<template>
    <el-container class="website-pro-absolute-fill-parent" :style="containerStyle">
        <el-header height="auto" class="website-pro-flex" :style="titleStyle" v-if="showIcon || showTitle || showLink">
            <div class="website-pro-flex flex-fill-in-the-remaining-space">
                <div class="website-pro-flex column center">
                    <img v-if="showIcon && icon" :src="icon" :style="iconStyle"/>
                </div>
                <span class="website-pro-flex column center">{{title}}</span>
            </div>
            <div v-show="showLink" class="website-pro-flex column center">
                <a class="lrd-a" :href="href" :target="linkTarget" :style="linkStyle">{{linkContent}}</a>
            </div>
        </el-header>
        <el-main :style="mainStyle" v-loading="loading" class="website-pro-flex column">
            <div class="flex-fill-in-the-remaining-space website-pro-position-relative">
                <component :is="funcType+'Chart'" :module="module"/>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import MemberInfoStatisticsChart from "./component/MemberInfoStatisticsChart";
    export default {
        name: "WsPortalChart",
        components: {MemberInfoStatisticsChart},
        props:{
            module: Object,
            design: {
                type: Boolean,
                default: false
            }
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
            title(){
                return this.titleGroup.title.value;
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
            linkGroup(){
                return this.module.attributes.linkGroup.attributes;
            },
            showLink(){
                return this.linkGroup.showLink.value;
            },
            linkContent(){
                return this.linkGroup.linkContent.value;
            },
            linkStyle(){
                let {linkFont:font} = this.linkGroup;
                return  {
                    color: font.value.color,
                    fontFamily: font.value.fontFamily,
                    fontSize:font.value.fontSize,
                    textDecoration:font.value.textDecoration ? 'underline' : 'none',
                    fontStyle:font.value.italic ? 'italic' : 'normal',
                    fontWeight:font.value.bold ? 'bold' : 'normal',
                }
            },
            linkTarget(){
                if(this.href === 'javascript:;'){
                    return '_self';
                }
                return this.linkGroup.linkTarget.value;

            },
            href(){
                if(this.design){
                    return 'javascript:;';
                }

                if(this.funcType === 'memberInfoStatistics' && this.queryId){
                    return this.$router.resolve(`/console/organization/member/memberInfoStatistics?queryId=${this.queryId}`).href;
                }


                return 'javascript:;';
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
            funcType(){
                return this.funcGroup.funcType.value;
            },
            queryId(){
                return this.funcGroup.memberInfoStatistics.value;
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
                loading: false
            }
        },
        methods:{
            loadingChange(loading){
                this.loading = loading;
            }
        }
    }
</script>

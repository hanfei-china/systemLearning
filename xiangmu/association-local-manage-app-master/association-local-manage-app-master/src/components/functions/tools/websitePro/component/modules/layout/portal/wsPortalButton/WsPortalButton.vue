<template>
    <a class="website-pro-absolute-fill-parent website-pro-flex column"
       :href="href" :target="target" :style="containerStyle">
        <div class="website-pro-flex center flex-fill-in-the-remaining-space" v-show="showIcon">
            <div class="website-pro-flex flex-fill-in-the-remaining-space center column text-align-center"
                 :style="iconContainerStyle" >
                <div style="height: 100%;width: 100%;">
                    <img style="max-height: 100%;max-width: 100%;" :src="icon"/>
                </div>
            </div>
        </div>
        <div :style="titleStyle" v-show="showTitle">{{title}}</div>
    </a>
</template>

<script>

    export default {
        name: "WsPortalButton",
        props:{
            module: Object,
            design: {
                type: Boolean,
                default: false
            }
        },
        computed:{
            attributes(){
                return this.module.attributes;
            },
            titleGroup(){
                return this.attributes.titleGroup.attributes;
            },
            showTitle(){
                return this.titleGroup.showTitle.value;
            },
            title(){
                return this.titleGroup.title.value;
            },
            titleStyle(){
                let {font,titlePadding} = this.titleGroup;
                return {
                    paddingTop: titlePadding.value.top + 'px',
                    paddingBottom: titlePadding.value.bottom + 'px',
                    paddingLeft: titlePadding.value.left + 'px',
                    paddingRight: titlePadding.value.right + 'px',

                    color: font.value.color,
                    fontFamily: font.value.fontFamily,
                    fontSize: font.value.fontSize,
                    textDecoration: font.value.textDecoration ? 'underline' : 'none',
                    fontStyle: font.value.italic ? 'italic' : 'normal',
                    fontWeight: font.value.bold ? 'bold' : 'normal',
                    textAlign: font.value.textAlign,
                    marginTop: '4px'
                }
            },
            iconGroup(){
                return this.attributes.iconGroup.attributes;
            },
            showIcon(){
                return this.iconGroup.showIcon.value;
            },
            icon(){
                return this.iconGroup.icon.value;
            },
            iconContainerStyle(){
                let iconPadding = this.iconGroup.iconPadding;
                return {
                    paddingTop: iconPadding.value.top + 'px',
                    paddingBottom: iconPadding.value.bottom + 'px',
                    paddingLeft: iconPadding.value.left + 'px',
                    paddingRight: iconPadding.value.right + 'px',
                }
            },
            containerGroup(){
                return this.attributes.containerGroup.attributes;
            },
            containerStyle(){
                let {background,padding,borderRadius,border,boxShadow} = this.containerGroup;

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

                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',

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
            },
            funcGroup(){
                return this.attributes.funcGroup.attributes;
            },
            allPrivileges(){
                return this.$store.state.allPrivileges;
            },
            funcType(){
                return this.funcGroup.funcType.value;
            },
            menuId(){
                return this.funcGroup.menuId.value;
            },
            menu(){
                for (let menu of this.allPrivileges){
                    if(menu.id === this.menuId){
                        return menu;
                    }
                }
                return null;
            },
            menuPath(){
                if(this.menu){
                    let {modulePath,moduleParam} = this.menu;

                    if(moduleParam){
                        return this.$router.resolve( modulePath + '/' + moduleParam).href;
                    }

                    return this.$router.resolve( modulePath).href;
                }
                return null;
            },
            linkAddress(){
                return this.funcGroup.linkAddress.value;
            },
            target(){
                if(this.href === 'javascript:;'){
                    return '_self';
                }
                return this.funcGroup.linkTarget.value;

            },
            href(){
                if(this.design){
                    return 'javascript:;';
                }

                if(this.funcType === 'link'){
                    return this.linkAddress;
                }

                if(this.funcType === 'menu'){
                    return this.menuPath;
                }

                return 'javascript:;';
            }
        }
    }
</script>

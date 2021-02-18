<template>
    <div class="website-pro-absolute-fill-parent website-pro-side-menu" :style="containerStyle" :class="customClasses">
        <div v-show="showTitle" :style="titleStyle">{{title}}</div>
        <div :style="innerContainerStyle">
            <div v-if="dataSrc === 1" class="website-pro-flex column">
                <ws-side-menu-item v-for="child of module.modules" :key="child.id" :design="design"
                                   :module="child" :item-style="itemStyle" :item-active-style="itemActiveStyle" :full-path="fullPath"
                                   :item-prefix-text="itemPrefixText" :item-prefix-text-style="itemPrefixTextStyle"
                                   :item-suffix-text="itemSuffixText" :item-suffix-text-style="itemSuffixTextStyle" :menu-id="menuId"/>
            </div>
            <div class="website-pro-flex column" v-else>
                <ws-side-route-menu-item v-for="menu of childMenus" :key="menu.id"
                                         :menu="menu" :item-style="itemStyle" :item-active-style="itemActiveStyle" :full-path="fullPath"
                                         :item-prefix-text="itemPrefixText" :item-prefix-text-style="itemPrefixTextStyle"
                                         :item-suffix-text="itemSuffixText" :item-suffix-text-style="itemSuffixTextStyle" :menu-id="menuId"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import PageHeader from "../../../../js/modules/page/pageHeader";
    import {commonLink} from "../../../../js/util/util";
    import WsSideMenuItem from "./WsSideMenuItem";
    import WsSideRouteMenuItem from "./WsSideRouteMenuItem";

    export default {
        name: "WsSideMenu",
        components: {WsSideRouteMenuItem, WsSideMenuItem},
        props:{
            module: Object,
            design: Boolean
        },
        computed:{
            customClasses(){
                return this.module.attributes.otherGroup.attributes.customClasses.value;
            },
            dataSrc(){
                return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.dataSrc;
            },
            pageHeader(){
                return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.pageHeader;
            },
            showTitle(){
                return this.module.attributes.titleGroup.attributes.showTitle.value;
            },
            title(){
                if(this.dataSrc === 1){
                    return this.module.attributes.titleGroup.attributes.title.value;
                }else{
                    return this.titleMenu ? this.titleMenu.title : '路由读取错误';
                }

            },
            containerStyle(){
                let boxShadow =  this.module.attributes.containerGroup.attributes.containerBoxShadow.value;
                let titleBorderRadius = this.module.attributes.containerGroup.attributes.containerBorderRadius.value;
                let titleBorder  = this.module.attributes.containerGroup.attributes.containerBorder.value;

                let style = {
                    borderTopLeftRadius: titleBorderRadius.leftTop + 'px',
                    borderBottomLeftRadius: titleBorderRadius.leftBottom + 'px',
                    borderTopRightRadius: titleBorderRadius.rightTop + 'px',
                    borderBottomRightRadius: titleBorderRadius.rightBottom + 'px',

                    borderTopColor: titleBorder.top.borderColor,
                    borderTopStyle: titleBorder.top.borderStyle,
                    borderTopWidth: titleBorder.top.borderWidth + 'px',

                    borderBottomColor: titleBorder.bottom.borderColor,
                    borderBottomStyle: titleBorder.bottom.borderStyle,
                    borderBottomWidth: titleBorder.bottom.borderWidth + 'px',

                    borderLeftColor: titleBorder.left.borderColor,
                    borderLeftStyle: titleBorder.left.borderStyle,
                    borderLeftWidth: titleBorder.left.borderWidth + 'px',

                    borderRightColor: titleBorder.right.borderColor,
                    borderRightStyle: titleBorder.right.borderStyle,
                    borderRightWidth: titleBorder.right.borderWidth + 'px',

                    boxShadow: `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.insert ? 'inset' : ''}`,
                };

                let {backgroundImage,backgroundColor,
                    backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = this.module.attributes.containerGroup.attributes.containerBackground.value;

                if(backgroundImage){
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if(backgroundColor){
                    style.backgroundColor = backgroundColor;
                }

                if(backgroundPositionX){
                    style.backgroundPositionX = backgroundPositionX;
                }

                if(backgroundPositionY){
                    style.backgroundPositionY = backgroundPositionY;
                }

                if(backgroundSize){
                    style.backgroundSize = backgroundSize;
                }

                if(backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat';
                }

                if(backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-x';
                }

                if(!backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-y';
                }

                if(!backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'no-repeat';
                }

                if(!this.design){
                    style.width = this.module.attributes.layoutGroup.attributes.layout.value.width + 'px';
                    style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                    style.left = this.module.attributes.layoutGroup.attributes.layout.value.left + 'px';
                    style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
                    style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
                    style.position = 'absolute';
                }

                return style;
            },
            innerContainerStyle(){
                let padding = this.module.attributes.innerContainerGroup.attributes.innerContainerPadding.value;
                let border  = this.module.attributes.innerContainerGroup.attributes.innerContainerBorder.value;

                let style = {

                    borderTopColor: border.top.borderColor,
                    borderTopStyle: border.top.borderStyle,
                    borderTopWidth: border.top.borderWidth + 'px',

                    borderBottomColor: border.bottom.borderColor,
                    borderBottomStyle: border.bottom.borderStyle,
                    borderBottomWidth: border.bottom.borderWidth + 'px',

                    borderLeftColor: border.left.borderColor,
                    borderLeftStyle: border.left.borderStyle,
                    borderLeftWidth: border.left.borderWidth + 'px',

                    borderRightColor: border.right.borderColor,
                    borderRightStyle: border.right.borderStyle,
                    borderRightWidth: border.right.borderWidth + 'px',

                    paddingTop: padding.top + 'px',
                    paddingBottom: padding.bottom + 'px',
                    paddingLeft: padding.left + 'px',
                    paddingRight: padding.right + 'px',

                };

                let {backgroundImage,backgroundColor,
                    backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = this.module.attributes.innerContainerGroup.attributes.innerContainerBackground.value;

                if(backgroundImage){
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if(backgroundColor){
                    style.backgroundColor = backgroundColor;
                }

                if(backgroundPositionX){
                    style.backgroundPositionX = backgroundPositionX;
                }

                if(backgroundPositionY){
                    style.backgroundPositionY = backgroundPositionY;
                }

                if(backgroundSize){
                    style.backgroundSize = backgroundSize;
                }

                if(backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat';
                }

                if(backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-x';
                }

                if(!backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-y';
                }

                if(!backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'no-repeat';
                }
                return style;
            },
            titleStyle() {
                let boxShadow =  this.module.attributes.titleGroup.attributes.titleBoxShadow.value;
                let titleBorderRadius = this.module.attributes.titleGroup.attributes.titleBorderRadius.value;
                let titleBorder  = this.module.attributes.titleGroup.attributes.titleBorder.value;
                let padding = this.module.attributes.titleGroup.attributes.titlePadding.value;

                let style = {
                    borderTopLeftRadius: titleBorderRadius.leftTop + 'px',
                    borderBottomLeftRadius: titleBorderRadius.leftBottom + 'px',
                    borderTopRightRadius: titleBorderRadius.rightTop + 'px',
                    borderBottomRightRadius: titleBorderRadius.rightBottom + 'px',

                    borderTopColor: titleBorder.top.borderColor,
                    borderTopStyle: titleBorder.top.borderStyle,
                    borderTopWidth: titleBorder.top.borderWidth + 'px',

                    borderBottomColor: titleBorder.bottom.borderColor,
                    borderBottomStyle: titleBorder.bottom.borderStyle,
                    borderBottomWidth: titleBorder.bottom.borderWidth + 'px',

                    borderLeftColor: titleBorder.left.borderColor,
                    borderLeftStyle: titleBorder.left.borderStyle,
                    borderLeftWidth: titleBorder.left.borderWidth + 'px',

                    borderRightColor: titleBorder.right.borderColor,
                    borderRightStyle: titleBorder.right.borderStyle,
                    borderRightWidth: titleBorder.right.borderWidth + 'px',

                    paddingTop: padding.top + 'px',
                    paddingBottom: padding.bottom + 'px',
                    paddingLeft: padding.left + 'px',
                    paddingRight: padding.right + 'px',

                    boxShadow: `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.insert ? 'inset' : ''}`,
                };

                let {backgroundImage,backgroundColor,
                    backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = this.module.attributes.titleGroup.attributes.titleBackground.value;

                if(backgroundImage){
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if(backgroundColor){
                    style.backgroundColor = backgroundColor;
                }

                if(backgroundPositionX){
                    style.backgroundPositionX = backgroundPositionX;
                }

                if(backgroundPositionY){
                    style.backgroundPositionY = backgroundPositionY;
                }

                if(backgroundSize){
                    style.backgroundSize = backgroundSize;
                }

                if(backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat';
                }

                if(backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-x';
                }

                if(!backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-y';
                }

                if(!backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'no-repeat';
                }

                let font = this.module.attributes.titleGroup.attributes.titleFont.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic  ? 'italic' : 'normal';
                style.fontWeight = font.bold  ? 'bold' : 'normal';
                style.textAlign = font.textAlign;

                return style;
            },
            itemStyle(){
                let boxShadow =  this.module.attributes.itemGroup.attributes.itemBoxShadow.value;
                let titleBorderRadius = this.module.attributes.itemGroup.attributes.itemBorderRadius.value;
                let titleBorder  = this.module.attributes.itemGroup.attributes.itemBorder.value;
                let padding = this.module.attributes.itemGroup.attributes.itemPadding.value;
                let itemTop = this.module.attributes.itemGroup.attributes.itemTop.value;

                let style = {
                    borderTopLeftRadius: titleBorderRadius.leftTop + 'px',
                    borderBottomLeftRadius: titleBorderRadius.leftBottom + 'px',
                    borderTopRightRadius: titleBorderRadius.rightTop + 'px',
                    borderBottomRightRadius: titleBorderRadius.rightBottom + 'px',

                    borderTopColor: titleBorder.top.borderColor,
                    borderTopStyle: titleBorder.top.borderStyle,
                    borderTopWidth: titleBorder.top.borderWidth + 'px',

                    borderBottomColor: titleBorder.bottom.borderColor,
                    borderBottomStyle: titleBorder.bottom.borderStyle,
                    borderBottomWidth: titleBorder.bottom.borderWidth + 'px',

                    borderLeftColor: titleBorder.left.borderColor,
                    borderLeftStyle: titleBorder.left.borderStyle,
                    borderLeftWidth: titleBorder.left.borderWidth + 'px',

                    borderRightColor: titleBorder.right.borderColor,
                    borderRightStyle: titleBorder.right.borderStyle,
                    borderRightWidth: titleBorder.right.borderWidth + 'px',

                    paddingTop: padding.top + 'px',
                    paddingBottom: padding.bottom + 'px',
                    paddingLeft: padding.left + 'px',
                    paddingRight: padding.right + 'px',

                    marginTop: itemTop + 'px',

                    boxShadow: `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.insert ? 'inset' : ''}`,
                };

                let {backgroundImage,backgroundColor,
                    backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = this.module.attributes.itemGroup.attributes.itemBackground.value;

                if(backgroundImage){
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if(backgroundColor){
                    style.backgroundColor = backgroundColor;
                }

                if(backgroundPositionX){
                    style.backgroundPositionX = backgroundPositionX;
                }

                if(backgroundPositionY){
                    style.backgroundPositionY = backgroundPositionY;
                }

                if(backgroundSize){
                    style.backgroundSize = backgroundSize;
                }

                if(backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat';
                }

                if(backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-x';
                }

                if(!backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-y';
                }

                if(!backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'no-repeat';
                }

                let font = this.module.attributes.itemGroup.attributes.itemFont.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic  ? 'italic' : 'normal';
                style.fontWeight = font.bold  ? 'bold' : 'normal';
                style.textAlign = font.textAlign;

                return style;
            },
            itemActiveStyle(){
                let boxShadow =  this.module.attributes.itemGroup.attributes.itemBoxShadow.value;
                let titleBorderRadius = this.module.attributes.itemGroup.attributes.itemBorderRadius.value;
                let titleBorder  = this.module.attributes.itemGroup.attributes.itemActiveBorder.value;
                let padding = this.module.attributes.itemGroup.attributes.itemPadding.value;
                let itemTop = this.module.attributes.itemGroup.attributes.itemTop.value;

                let style = {
                    borderTopLeftRadius: titleBorderRadius.leftTop + 'px',
                    borderBottomLeftRadius: titleBorderRadius.leftBottom + 'px',
                    borderTopRightRadius: titleBorderRadius.rightTop + 'px',
                    borderBottomRightRadius: titleBorderRadius.rightBottom + 'px',

                    borderTopColor: titleBorder.top.borderColor,
                    borderTopStyle: titleBorder.top.borderStyle,
                    borderTopWidth: titleBorder.top.borderWidth + 'px',

                    borderBottomColor: titleBorder.bottom.borderColor,
                    borderBottomStyle: titleBorder.bottom.borderStyle,
                    borderBottomWidth: titleBorder.bottom.borderWidth + 'px',

                    borderLeftColor: titleBorder.left.borderColor,
                    borderLeftStyle: titleBorder.left.borderStyle,
                    borderLeftWidth: titleBorder.left.borderWidth + 'px',

                    borderRightColor: titleBorder.right.borderColor,
                    borderRightStyle: titleBorder.right.borderStyle,
                    borderRightWidth: titleBorder.right.borderWidth + 'px',

                    paddingTop: padding.top + 'px',
                    paddingBottom: padding.bottom + 'px',
                    paddingLeft: padding.left + 'px',
                    paddingRight: padding.right + 'px',

                    marginTop: itemTop + 'px',

                    boxShadow: `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.insert ? 'inset' : ''}`,
                };

                let {backgroundImage,backgroundColor,
                    backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = this.module.attributes.itemGroup.attributes.itemActiveBackground.value;

                if(backgroundImage){
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if(backgroundColor){
                    style.backgroundColor = backgroundColor;
                }

                if(backgroundPositionX){
                    style.backgroundPositionX = backgroundPositionX;
                }

                if(backgroundPositionY){
                    style.backgroundPositionY = backgroundPositionY;
                }

                if(backgroundSize){
                    style.backgroundSize = backgroundSize;
                }

                if(backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat';
                }

                if(backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-x';
                }

                if(!backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-y';
                }

                if(!backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'no-repeat';
                }

                let font = this.module.attributes.itemGroup.attributes.itemActiveFont.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic  ? 'italic' : 'normal';
                style.fontWeight = font.bold  ? 'bold' : 'normal';
                style.textAlign = font.textAlign;

                return style;
            },
            itemPrefixText(){
                return this.module.attributes.itemGroup.attributes.itemPrefixText.value;
            },
            itemPrefixTextStyle(){
                if(this.itemPrefixText){
                    return {
                        paddingRight: this.module.attributes.itemGroup.attributes.itemPrefixTextPaddingRight.value + 'px'
                    }
                }else{
                    return {
                        display: 'none'
                    }
                }
            },
            itemSuffixText(){
                return this.module.attributes.itemGroup.attributes.itemSuffixText.value;
            },
            itemSuffixTextStyle(){
                if(this.itemSuffixText){
                    return {
                        paddingLeft: this.module.attributes.itemGroup.attributes.itemSuffixTextPaddingLeft.value + 'px'
                    }
                }else{
                    return {
                        display: 'none'
                    }
                }
            },
            fullPath(){
                return '#'+this.$route.fullPath;
            },
            menuId(){
                return this.$route.query.menuId;
            },
            titleMenu(){
                for(let menu of this.menus){
                    for(let menuItem of menu.modules){
                        let {index,modules} = menuItem;

                        if(index === this.fullPath){
                            return  menuItem;
                        }else{
                            for(let child of modules){
                                let {index:subIndex} = child;

                                if(subIndex === this.fullPath){
                                    return menuItem;
                                }
                            }
                        }
                    }
                }

                if(this.menuId){
                    for(let menu of this.menus){
                        for(let menuItem of menu.modules){
                            let {id,modules} = menuItem;

                            if(id === this.menuId){
                                return  menuItem;
                            }else{
                                for(let child of modules){
                                    let {id:subIndex} = child;

                                    if(subIndex === this.menuId){
                                        return menuItem;
                                    }
                                }
                            }
                        }
                    }
                }

                return null;
            },
            childMenus(){
                return this.titleMenu ? this.titleMenu.modules : [];
            }
        },
        data(){
            return {
                menus: [],
                pageHeaderInfo:{
                    modules: [],
                    title: '',
                    otherSetting:{
                        customCss: '',
                        pageHeaderId: '',
                        pageFooterId: ''
                    }
                },
            }
        },
        methods:{
            getPageModuleInfo(){
                if(this.pageHeader){
                    this.$request.get('/api/admin/website/anon/pageHeader',{
                        params:{
                            id: this.pageHeader
                        }
                    }).then(res=>{
                        let {data} = res;
                        let modules= JSON.parse(data.modules);
                        let obj = {
                            title: data.title,
                            id: data.id,
                            modules,
                            otherSetting: JSON.parse(data.otherSetting)
                        };

                        this.pageHeaderInfo = Vue.observable(new PageHeader(obj));

                        this.menus = this.getMenus([]);
                    })
                }
            },
            getLink(linkConfig){
                return commonLink(this.$router,linkConfig);
            },
            getTarget(href,target){
                if(href === 'javascript:;'){
                    return '_self';
                }
                return target;
            },
            getMenus(menus,modules){
                if(!modules){
                    modules = this.pageHeaderInfo.modules;
                }

                for(let module of modules){
                    let {name, modules: children} = module;
                    if(name === 'wsMenu'){
                        let temp = {...module};
                        for(let menu of temp.modules){
                            let linkConfig = menu.attributes.linkGroup.attributes.linkConfig.value;
                            let href = this.getLink(linkConfig);
                            menu.index = href;
                            menu.target = this.getTarget(href,linkConfig.target);
                            for(let child of menu.modules){
                                let childLinkConfig = child.attributes.linkGroup.attributes.linkConfig.value;
                                let childHref = this.getLink(childLinkConfig);
                                child.index = childHref;
                                child.target = this.getTarget(childHref,childLinkConfig.target);
                            }
                        }
                        menus.push(temp);
                    }

                    if(name === 'wsFillContainer' || name === 'wsFreeContainer'){
                        this.getMenus(menus,children);
                    }
                }

                return menus;
            },
        },
        created(){
            this.getPageModuleInfo();
        },
        watch:{
            pageHeader(){
                this.getPageModuleInfo();
            },
        }
    }
</script>

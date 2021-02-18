<template>
    <div class="website-pro-module" :class="[customClasses,alignClasses]" :style="style">
        <component v-for="child of module.modules" :is="child.name" :key="child.id" :module="child"/>
    </div>
</template>

<script>
    import WsButton from "../../frequently/wsButton/WsButton";
    import WsText from "../../frequently/wsText/WsText";
    import WsImage from "../../frequently/wsImage/WsImage";
    import WsFreeContainer from "../wsFreeContainer/WsFreeContainer";
    import WsArticleList from "../../base/wsArticleList/WsArticleList";
    import WsFormList from "../../base/wsFormList/WsFormList";
    import WsGivingTable from "../../base/wsGivingTable/WsGivingTable";
    import WsMap from "../../base/wsMap/WsMap";
    import WsScrollList from "../../base/wsScrollList/WsScrollList";
    import WsGreatEvents from "../../base/wsGreatEvents/WsGreatEvents";
    import WsMenu from "../../base/wsMenu/WsMenu";
    import WsRichText from "../../base/wsRichText/WsRichText";
    import WsWheelPlanting from "../../base/wsWheelPlanting/WsWheelPlanting";
    import WsBreadcrumb from "../../base/wsBreadcrumb/WsBreadcrumb";
    import WsSideMenu from "../../base/wsSideMenu/WsSideMenu";
    export default {
        name: "WsFreeContainer",
        components:{
            WsSideMenu,
            WsBreadcrumb,
            WsWheelPlanting,
            WsRichText,
            WsMenu,
            WsMap,
            WsGreatEvents,
            WsArticleList,
            WsFormList,
            WsGivingTable,
            WsScrollList,
            WsFreeContainer,
            WsImage, WsText, WsButton
        },
        props:{
            module: Object
        },
        computed:{
            customClasses(){
                return this.module.attributes.otherGroup.attributes.customClasses.value;
            },
            boxShadow(){
                let boxShadow = this.module.attributes.styleGroup.attributes.boxShadow.value;
                return `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.insert ? 'inset' : ''}`
            },
            style(){
                let style = {
                    borderTopLeftRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.leftTop + 'px',
                    borderBottomLeftRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.leftBottom + 'px',
                    borderTopRightRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.rightTop + 'px',
                    borderBottomRightRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.rightBottom + 'px',

                    borderTopColor: this.module.attributes.styleGroup.attributes.border.value.top.borderColor,
                    borderTopStyle: this.module.attributes.styleGroup.attributes.border.value.top.borderStyle,
                    borderTopWidth: this.module.attributes.styleGroup.attributes.border.value.top.borderWidth + 'px',

                    borderBottomColor: this.module.attributes.styleGroup.attributes.border.value.bottom.borderColor,
                    borderBottomStyle: this.module.attributes.styleGroup.attributes.border.value.bottom.borderStyle,
                    borderBottomWidth: this.module.attributes.styleGroup.attributes.border.value.bottom.borderWidth + 'px',

                    borderLeftColor: this.module.attributes.styleGroup.attributes.border.value.left.borderColor,
                    borderLeftStyle: this.module.attributes.styleGroup.attributes.border.value.left.borderStyle,
                    borderLeftWidth: this.module.attributes.styleGroup.attributes.border.value.left.borderWidth + 'px',

                    borderRightColor: this.module.attributes.styleGroup.attributes.border.value.right.borderColor,
                    borderRightStyle: this.module.attributes.styleGroup.attributes.border.value.right.borderStyle,
                    borderRightWidth: this.module.attributes.styleGroup.attributes.border.value.right.borderWidth + 'px',

                    boxShadow: this.boxShadow,
                    overflow: 'visible'
                };

                let {backgroundImage,backgroundColor,
                    backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = this.module.attributes.styleGroup.attributes.background.value;

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

                style.width = this.module.attributes.layoutGroup.attributes.layout.value.width + 'px';
                style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                style.left = this.module.attributes.layoutGroup.attributes.layout.value.left + 'px';
                style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
                style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;

                let position = this.module.attributes.layoutGroup.attributes.layout.value.position;

                style.position = 'absolute';
                if(position === 'relative'){
                    style.right = 0;
                }

                return style;
            },
            computeHeight(){
                let result = 0;
                for(let module of this.module.modules){
                    let layout = module.attributes.layoutGroup.attributes.layout.value;

                    let {top,height} = layout;

                    if(top+height > result){
                        result = top + height;
                    }

                }
                return result;
            },
            autoHeight(){
                return this.module.attributes.layoutGroup.attributes.autoHeight.value;
            },
            minHeight(){
                return this.module.attributes.layoutGroup.attributes.minHeight.value;
            },
            alignClasses(){

                let {position,align} = this.module.attributes.layoutGroup.attributes.layout.value;

                if(position === 'relative'){

                    if(align === 'left'){
                        return 'website-pro-container-align-left';
                    }

                    if(align === 'right'){
                        return 'website-pro-container-align-right';
                    }

                    if(align === 'center'){
                        return 'website-pro-container-align-center';
                    }
                }

                return '';
            },
            appendHeight(){
                return this.module.attributes.layoutGroup.attributes.appendHeight.value;
            },
        },
        watch:{
            computeHeight(val){
                if(this.autoHeight){
                    if(val > this.minHeight){
                        this.module.attributes.layoutGroup.attributes.layout.value.height = val + this.appendHeight;
                    }else{
                        this.module.attributes.layoutGroup.attributes.layout.value.height = this.minHeight + this.appendHeight;
                    }
                }
            },
        }
    }
</script>

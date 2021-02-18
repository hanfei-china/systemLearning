<template>
    <div class="website-pro-module" :class="customClasses" :style="style">
        <component v-for="child of module.modules" :is="child.name" :key="child.id" :module="child"/>
    </div>
</template>

<script>
    import WsButton from "../../frequently/wsButton/WsButton";
    import WsText from "../../frequently/wsText/WsText";
    import WsImage from "../../frequently/wsImage/WsImage";
    import WsFreeContainer from "../wsFreeContainer/WsFreeContainer";
    import WsArticleList from "../../base/wsArticleList/WsArticleList";
    import WsGreatEvents from "../../base/wsGreatEvents/WsGreatEvents";
    import WsMenu from "../../base/wsMenu/WsMenu";
    import WsRichText from "../../base/wsRichText/WsRichText";
    import WsWheelPlanting from "../../base/wsWheelPlanting/WsWheelPlanting";
    import WsBreadcrumb from "../../base/wsBreadcrumb/WsBreadcrumb";

    import {addEvent,removeEvent} from "../../../../js/util/dom";
    import WsSideMenu from "../../base/wsSideMenu/WsSideMenu";

    export default {
        name: "WsFillContainer",
        components:{
            WsSideMenu,
            WsBreadcrumb,
            WsWheelPlanting,
            WsRichText,
            WsMenu,
            WsGreatEvents,
            WsArticleList,
            WsFreeContainer,
            WsImage, WsText, WsButton
        },
        props:{
            module: Object,
            design: Boolean
        },
        computed:{
            customClasses(){
                return this.module.attributes.otherGroup.attributes.customClasses.value;
            },
            style(){
                let style = {};

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

                style.width = this.design ? this.module.attributes.layoutGroup.attributes.layout.value.width + 'px' : '100%';
                style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                style.left = this.module.attributes.layoutGroup.attributes.layout.value.left + 'px';
                style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
                style.right = 0;
                style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
                style.position = 'absolute';

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
            appendHeight(){
                return this.module.attributes.layoutGroup.attributes.appendHeight.value;
            },
        },
        methods:{
            setWidth(){
                this.module.attributes.layoutGroup.attributes.layout.value.width = window.innerWidth;
            }
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
        },
        created() {
            this.setWidth();
            addEvent(window,'resize',this.setWidth);
        },
        beforeDestroy() {
            removeEvent(window,'resize',this.setWidth);
        }
    }
</script>

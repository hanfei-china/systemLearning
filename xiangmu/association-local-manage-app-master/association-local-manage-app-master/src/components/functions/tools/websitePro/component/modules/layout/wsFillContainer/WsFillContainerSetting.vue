<template>
    <setting-container ref="setting" :width="module.attributes.layoutGroup.attributes.layout.value.width"
                       :height.sync="module.attributes.layoutGroup.attributes.layout.value.height"
                       :left="module.attributes.layoutGroup.attributes.layout.value.left"
                       :top.sync="module.attributes.layoutGroup.attributes.layout.value.top"
                       :z-index.sync="module.attributes.layoutGroup.attributes.layout.value.zIndex"
                       :handles="['bm','tm']" left-zero :title="module.title" :can-delete="canDelete"
                       @setting="settingModule(module)" @delete="$emit('delete')"
                       @setting-if-setting="settingIfSetting(module)" @refLineParams="getRefLineParams">
        <div :style="style" class="website-pro-absolute-fill-parent lrd-dom-drag" ref="drop">
            <div class="drop-tip website-pro-flex column center" style="background-color:rgba(245,108,108,.5);"
                 @drop="drop" v-show="dropTip">
                <div class="text-align-center" style="font-size: 14px;color: #333333;letter-spacing: 2px;">放在这里</div>
            </div>
            <div style="position: relative;">
                <component v-for="(child,index) of module.modules" :key="child.id"
                           :parent-width="module.attributes.layoutGroup.attributes.layout.value.width"
                           :ref="child.id" :is="child.name+'Setting'" :module="child"
                           @delete="deleteModule(index)" @setting="settingModule"
                           @setting-if-setting="settingIfSetting" @refLineParams="drawLine"/>
                <span class="ref-line v-line"
                      v-for="(item,index) in vLine" :key="`v-line${index}`"
                      v-show="item.display"
                      :style="{ left: item.position, top: item.origin, height: item.lineLength}"/>
                <span class="ref-line h-line"
                      v-for="(item,index) in hLine" :key="`h-line${index}`"
                      v-show="item.display"
                      :style="{ top: item.position, left: item.origin, width: item.lineLength}"/>
            </div>
        </div>
    </setting-container>
</template>

<script>
    import SettingContainer from "../../SettingContainer";

    import {addEvent,removeEvent} from "../../../../js/util/dom";
    import {moduleBuilder} from "../../../../js/modules/moduleBuilder";

    import WsButtonSetting from "../../frequently/wsButton/WsButtonSetting";
    import WsTextSetting from "../../frequently/wsText/WsTextSetting";
    import WsImageSetting from "../../frequently/wsImage/WsImageSetting";
    import WsFreeContainerSetting from "../../layout/wsFreeContainer/WsFreeContainerSetting";
    import WsArticleListSetting from "../../base/wsArticleList/WsArticleListSetting";
    import WsGreatEventsSetting from "../../base/wsGreatEvents/WsGreatEventsSetting";
    import WsMenuSetting from "../../base/wsMenu/WsMenuSetting";
    import WsRichTextSetting from "../../base/wsRichText/WsRichTextSetting";
    import WsWheelPlantingSetting from "../../base/wsWheelPlanting/WsWheelPlantingSetting";
    import WsBreadcrumbSetting from "../../base/wsBreadcrumb/WsBreadcrumbSetting";
    import WsSideMenuSetting from "../../base/wsSideMenu/WsSideMenuSetting";

    export default {
        name: "WsFillContainerSetting",
        components: {
            WsSideMenuSetting,
            SettingContainer,

            WsBreadcrumbSetting,
            WsWheelPlantingSetting,
            WsRichTextSetting,
            WsMenuSetting,
            WsGreatEventsSetting,
            WsArticleListSetting,
            WsFreeContainerSetting,
            WsImageSetting, WsTextSetting, WsButtonSetting
        },
        props:{
            module: Object,
            canDelete: {
                type: Boolean,
                default: true
            },
        },
        inject:['designProvide'],
        computed:{
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
                return style;
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
        data(){
            return {
                dropTip: false,

                vLine: [],
                hLine: []
            }
        },
        methods:{
            setWidth(){
                this.module.attributes.layoutGroup.attributes.layout.value.width = window.innerWidth;
            },
            initEvents() {
                addEvent(window,'resize',this.setWidth);
                addEvent(window, 'dragover', this.windowDragOver);
                addEvent(window, 'dragend', this.windowDragEnd);
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
                let scrollTop = this.scrollEl.$el.scrollTop;
                event.stopPropagation();
                let {pageX, pageY} = event;
                let {left, top} = this.getParentSize();

                pageY -= 60;

                if (left > pageX) {
                    left = 0;
                } else {
                    left = pageX - left;
                }

                top = pageY - (top-scrollTop) -60;

                if(top < 0){
                    top = 0;
                }

                if(left < 0){
                    left = 0;
                }
                let moduleName = this.dropModule;
                if(moduleName === 'wsFillContainer'){
                    this.$message.warning('该位置不能放置通栏排版');
                    return;
                }

                let module = moduleBuilder(moduleName, this.dropModuleConfig).setPosition({left,top});
                this.module.addModule(module);
            },
            getTop(element) {
                let offset = element.offsetTop;

                if(element === this.scrollEl.$el){
                    return offset;
                }

                if (element.offsetParent) {
                    offset += this.getTop(element.offsetParent);
                }
                return offset;
            },
            getLeft(element) {
                let offset = element.offsetLeft;

                if(element === this.scrollEl.$el){
                    return offset;
                }

                if (element.offsetParent != null) {
                    offset += this.getLeft(element.offsetParent);
                }
                return offset;
            },
            getParentSize() {
                return {
                    top: this.getTop(this.$refs.drop),
                    left: this.getLeft(this.$refs.drop),
                }
            },
            windowDragOver(event) {
                if (this.group === 'website-module' && this.dropModule !== 'wsFillContainer') {
                    event.preventDefault();
                    this.dropTip = true;
                }
            },
            windowDragEnd() {
                this.dropTip = false;
            },
            getRefLineParams (params) {
                this.$emit('refLineParams', params);
            },
            drawLine (params) {
                const { vLine, hLine } = params;
                this.vLine = vLine;
                this.hLine = hLine;
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
            autoHeight(val){
                if(val){
                    this.module.attributes.layoutGroup.attributes.layout.value.height = this.computeHeight <= 10 ? 10 : this.computeHeight;
                }
            },
            appendHeight(){
                if(this.autoHeight){
                    if(this.computeHeight > this.minHeight){
                        this.module.attributes.layoutGroup.attributes.layout.value.height = this.computeHeight + this.appendHeight;
                    }else{
                        this.module.attributes.layoutGroup.attributes.layout.value.height = this.minHeight + this.appendHeight;
                    }
                }
            },
            minHeight(){
                if(this.autoHeight){
                    if(this.computeHeight > this.minHeight){
                        this.module.attributes.layoutGroup.attributes.layout.value.height = this.computeHeight + this.appendHeight;
                    }else{
                        this.module.attributes.layoutGroup.attributes.layout.value.height = this.minHeight + this.appendHeight;
                    }
                }
            }
        },
        created() {
            this.setWidth();
            this.initEvents();
        },
        beforeDestroy() {
            removeEvent(window,'resize',this.setWidth);
            removeEvent(window, 'dragover', this.windowDragOver);
            removeEvent(window, 'dragend', this.windowDragEnd);
        },
        updated() {
            this.setWidth();
        }
    }
</script>

<template>
    <div class="website-pro-container website-pro-module website-pro-rich-text" ref="contentDetailContainer" :style="style" :class="customClasses">
        <div class="website-pro-rich-text-content" ref="contentDetail">
            <div class="website-pro-rich-text-title" style="padding-top:10px;" ref="title" v-show="showTitle" :style="titleStyle">{{title}}</div>
            <div class="website-pro-rich-text-time" ref="time" v-show="showTime" :style="timeStyle">{{time}}</div>
            <div class="website-pro-rich-text-diving-line" style="padding-bottom:10px;" ref="line" v-show="showDivingLine" :style="divingLineContainerStyle">
                <div :style="divingLineStyle"></div>
            </div>
            <div class="website-pro-rich-text-content">
                <rich-text-detail :other-height="otherHeight"  :module="module" :content="content" :design="design" v-if="content.id"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {addListener, removeListener} from 'resize-detector';
    import {formatDate} from "../../../../../../../../js/util/utilFunction";
    import RichTextDetail from "./RichTextDetail";
    export default {
        name: "WsRichText",
        components: {RichTextDetail},
        props:{
            module: Object,
            design: Boolean
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

                    paddingTop: this.module.attributes.styleGroup.attributes.padding.value.top + 'px',
                    paddingBottom: this.module.attributes.styleGroup.attributes.padding.value.bottom + 'px',
                    paddingLeft: this.module.attributes.styleGroup.attributes.padding.value.left + 'px',
                    paddingRight: this.module.attributes.styleGroup.attributes.padding.value.right + 'px',
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
            showTitle(){
                return this.module.attributes.titleGroup.attributes.showTitle.value;
            },
            titleStyle() {
                let style = {
                    paddingTop: this.module.attributes.titleGroup.attributes.titlePadding.value.top + 'px',
                    paddingBottom: this.module.attributes.titleGroup.attributes.titlePadding.value.bottom + 'px',
                    paddingLeft: this.module.attributes.titleGroup.attributes.titlePadding.value.left + 'px',
                    paddingRight: this.module.attributes.titleGroup.attributes.titlePadding.value.right + 'px',
                };

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
            title(){
                return this.content.title || '这里显示标题';
            },
            showTime(){
                return this.module.attributes.timeGroup.attributes.showTime.value;
            },
            timeStyle() {
                let style = {
                    paddingTop: this.module.attributes.timeGroup.attributes.timePadding.value.top + 'px',
                    paddingBottom: this.module.attributes.timeGroup.attributes.timePadding.value.bottom + 'px',
                    paddingLeft: this.module.attributes.timeGroup.attributes.timePadding.value.left + 'px',
                    paddingRight: this.module.attributes.timeGroup.attributes.timePadding.value.right + 'px',
                };

                let font = this.module.attributes.timeGroup.attributes.timeFont.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic  ? 'italic' : 'normal';
                style.fontWeight = font.bold  ? 'bold' : 'normal';
                style.textAlign = font.textAlign;

                return style;
            },
            time(){
                return this.content.publishTime ? formatDate(new Date(this.content.publishTime), 'yyyy-MM-dd HH:mm') : '这里显示时间';
            },
            showDivingLine(){
                return this.module.attributes.divingLineGroup.attributes.showDivingLine.value;
            },
            divingLineContainerStyle(){
                return  {
                    paddingTop: this.module.attributes.divingLineGroup.attributes.divingLinePadding.value.top + 'px',
                    paddingBottom: this.module.attributes.divingLineGroup.attributes.divingLinePadding.value.bottom + 'px',
                    paddingLeft: this.module.attributes.divingLineGroup.attributes.divingLinePadding.value.left + 'px',
                    paddingRight: this.module.attributes.divingLineGroup.attributes.divingLinePadding.value.right + 'px',
                };
            },
            divingLineStyle(){

                let border = this.module.attributes.divingLineGroup.attributes.divingLineStyle.value;

                return  {
                    borderTopColor: border.borderColor,
                    borderTopStyle: border.borderStyle,
                    borderTopWidth: border.borderWidth + 'px',
                };
            },
            contentId(){
                let {dataSrc,contentId} = this.module.attributes.dataSrcGroup.attributes.dataSrc.value;

                if(dataSrc === 1){
                    return contentId;
                }

                if(dataSrc === 2){
                    return this.$route.query.contentId;
                }

                return '';
            },
        },
        data() {
            return {
                content: {},
                otherHeight: 0
            }
        },
        methods:{
            getContent(){
                if(this.contentId){
                    this.$request.get('/api/common/content/anon/detail',{
                        params:{id:this.contentId}
                    }).then(res => {
                        this.content = res.data;
                    })
                }else{
                    this.content = {};
                }
            },
            setHeight(){
                let height = this.$refs.contentDetail.clientHeight
                    + this.module.attributes.styleGroup.attributes.border.value.top.borderWidth
                    + this.module.attributes.styleGroup.attributes.border.value.bottom.borderWidth
                    + this.module.attributes.styleGroup.attributes.padding.value.top
                    + this.module.attributes.styleGroup.attributes.padding.value.bottom;
                if(height<20){
                    height = 20;
                }

                if(this.content.contentType !== null && this.content.contentType !== undefined){
                    if(this.content.contentType === 4 ){
                        let settingHeight = this.module.attributes.layoutGroup.attributes.layout.value.height;
                        if(settingHeight < height){
                            this.module.setHeight(height);
                        }
                    }else{
                        this.module.setHeight(height);
                    }
                }

                this.otherHeight = this.$refs.title.clientHeight + this.$refs.time.clientHeight + this.$refs.line.clientHeight;
            }
        },
        watch:{
            contentId(){
                this.getContent();
            },
            content:{
                deep: true,
                handler(val,oloVal){
                    if(oloVal.contentType && val.contentType === 4 && this.design){
                        this.module.setHeight(400);
                    }
                    this.setHeight();
                }
            },
            'module.attributes.styleGroup.attributes.border.value':{
                deep:true,
                handler(){
                    this.setHeight();
                }
            },
            'module.attributes.styleGroup.attributes.padding.value':{
                deep:true,
                handler(){
                    this.setHeight();
                }
            }
        },
        mounted() {
            addListener(this.$refs.contentDetail,this.setHeight);
            this.getContent();
        },
        beforeDestroy() {
            removeListener(this.$refs.contentDetail,this.setHeight);
        }
    }
</script>

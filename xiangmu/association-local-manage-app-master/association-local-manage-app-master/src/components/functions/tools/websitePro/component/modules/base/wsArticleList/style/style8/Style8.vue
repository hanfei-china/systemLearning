<template>
    <div class="website-pro-article-list-style3-list-container">
        <style8-item v-for="(imageText,index) of data" :key="imageText.contentId"
                     :class="{'odd': index%2 === 1,'even' : index%2 === 0}"
                     :image-text="imageText" :item-click="itemClick" :design="design"
                     :container-style="containerStyle" :poster-style="posterStyle"
                     :title-style="titleStyle" :time-style="timeStyle"
                     :abstract-style="abstractStyle" :abstract-format="abstractFormat"
                     :carry-router-menu-id="carryRouterMenuId"/>
    </div>
</template>

<script>

    import Style8Item from "./Style8Item";

    export default {
        name: "Style8",
        components: {Style8Item},
        props: {
            data: {
                type: Array,
                default() {
                    return [];
                }
            },
            itemClick: Object,
            labelClick: Object,
            classId: String,
            design: Boolean,
            styleConfig: Object,
            carryRouterMenuId: String,
        },
        computed: {
            containerStyle() {
                let {border, padding} = this.styleConfig.container;
                return {
                    borderBottomColor: border.value.borderColor,
                    borderBottomStyle: border.value.borderStyle,
                    borderBottomWidth: border.value.borderWidth + 'px',

                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                }
            },
            posterConfig(){
                return this.styleConfig.poster;
            },
            posterStyle(){
                let {height, width, margin, layout} = this.posterConfig;

                let style = {
                    height: `${height.value}px`,
                    width: `${width.value}px`,
                    marginTop: margin.value.top + 'px',
                    marginBottom: margin.value.bottom + 'px',
                    marginLeft: margin.value.left + 'px',
                    marginRight: margin.value.right + 'px',
                };

                let {backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = layout.value;

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
            titleConfig() {
                return this.styleConfig.title;
            },
            titleStyle() {
                let {titleFont,padding} = this.titleConfig;

                let style = {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                };

                let font = titleFont.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic ? 'italic' : 'normal';
                style.fontWeight = font.bold ? 'bold' : 'normal';
                style.textAlign = font.textAlign;
                style.lineHeight = 1;

                return style;
            },
            timeConfig(){
                return this.styleConfig.date;
            },
            timeStyle() {
                let {timeFont, showTime,padding} = this.timeConfig;
                if (!showTime.value) {
                    return {
                        display: 'none'
                    }
                }

                let style = {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                };

                let font = timeFont.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic ? 'italic' : 'normal';
                style.fontWeight = font.bold ? 'bold' : 'normal';
                style.textAlign = font.textAlign;
                style.lineHeight = 1;

                return style;
            },
            abstractConfig() {
                return this.styleConfig.abstract;
            },
            abstractStyle() {
                let {font, padding, showAbstract} = this.abstractConfig;

                if (!showAbstract.value) {
                    return {
                        display: 'none'
                    }
                }

                let style = {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                };

                font = font.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic ? 'italic' : 'normal';
                style.fontWeight = font.bold ? 'bold' : 'normal';


                return style;
            },
            abstractFormat() {
                let maxLength = this.abstractConfig.maxLength.value;
                return (content) => {
                    if (content) {
                        content = content.trim();
                        let length = content.length;
                        if (length > maxLength) {
                            return content.substring(0, maxLength) + '...';
                        }else{
                            return content;
                        }
                    }
                    return '';
                }
            }
        }
    }
</script>

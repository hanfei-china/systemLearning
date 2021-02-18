<template>
    <div class="website-pro-article-list-style1-list-container">
        <style1-item v-for="(imageText,index) of data" :key="imageText.id"
                     :class="{'odd': index%2 === 1,'even' : index%2 === 0}"
                     :item-click="itemClick" :design="design" :image-text="imageText"
                     :container-style="containerStyle" :date-container-outer-style="dateContainerOuterStyle" :date-container-style="dateContainerStyle"
                     :year-style="yearStyle" :month-style="monthStyle"
                     :day-style="dayStyle" :day-dividing-line-style="dayDividingLineStyle" :date-style="dateStyle"
                     :title-style="titleStyle" :abstract-style="abstractStyle"
                     :title-format="titleFormat" :abstract-format="abstractFormat"
                     :carry-router-menu-id="carryRouterMenuId"/>
    </div>
</template>

<script>

    import Style1Item from "./Style1Item";
    import {deepObjectMerge} from "../../../../../../js/base/attribute";
    import {dateStyleConfig} from "../../../../../../js/modules/base/wsArticleList";

    export default {
        name: "Style1",
        components: {Style1Item},
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
            dateConfig() {
                return this.styleConfig.date;
            },
            dateStyle(){
                return this.styleConfig.date.style.value;
            },
            dateContainerOuterStyle(){
                let {outerPadding: padding,position} = this.dateConfig;
                return {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',

                    justifyContent: position.value
                }
            },
            dateContainerStyle() {
                let {width, backgroundColor, borderRadius, border, padding} = this.dateConfig;
                return {
                    width: width.value + 'px',
                    backgroundColor: backgroundColor.value,

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
                }
            },
            yearStyle() {
                let {yearFont,yearPadding: padding} = this.dateConfig;

                let style = {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                };

                let font = yearFont.value;
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
            monthStyle() {
                if(this.dateStyle !== 'style3'){
                    return {
                        display: 'none'
                    }
                }

                let {monthFont, monthPadding: padding} = this.dateConfig;

                let style = {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                };

                let font = monthFont.value;
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
            dayStyle() {
                let {dayFont, dayPadding: padding} = this.dateConfig;

                let style = {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                };

                let font = dayFont.value;
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
            dayDividingLineStyle(){
                let {dayDividingLine:border} = this.dateConfig;
                let style = {};
                if(this.dateStyle === 'style2'){
                    style.borderTopColor = border.value.borderColor;
                    style.borderTopStyle = border.value.borderStyle;
                    style.borderTopWidth = border.value.borderWidth + 'px';
                }else{
                    style.display = 'none';
                }

                return style;
            },
            titleConfig() {
                return this.styleConfig.title;
            },
            titleStyle() {
                let {font, padding} = this.titleConfig;

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
                // style.textAlign = font.textAlign;

                return style;
            },
            titleFormat() {
                let maxLength = this.titleConfig.maxLength.value;
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
            },
            abstractConfig() {
                return this.styleConfig.abstract;
            },
            abstractStyle() {
                let {font, padding} = this.abstractConfig;

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
        },
        watch:{
            dateStyle(val){
                if(val === 'style1'){
                    deepObjectMerge(this.dateConfig,dateStyleConfig.dateStyle1);
                }

                if(val === 'style2'){
                    deepObjectMerge(this.dateConfig,dateStyleConfig.dateStyle2);
                }

                if(val === 'style3'){
                    deepObjectMerge(this.dateConfig,dateStyleConfig.dateStyle3);
                }
            }
        }
    }
</script>

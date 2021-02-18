<template>
    <div class="website-pro-article-list-style7-list-container">
        <style7-item v-for="(imageText,index) of data" :key="imageText.id"
                     :class="{'odd': index%2 === 1,'even' : index%2 === 0}"
                     :item-click="itemClick" :design="design" :image-text="imageText" :index="index"
                     :container-style="containerStyle" :serial-number-container-style="serialNumberContainerStyle"
                     :serial-number-first-style="serialNumberFirstStyle" :serial-number-second-style="serialNumberSecondStyle"
                     :serial-number-third-style="serialNumberThirdStyle" :serial-number-other-style="serialNumberOtherStyle"
                     :content-container-style="contentContainerStyle" :title-style="titleStyle" :date-style="dateStyle"
                     :carry-router-menu-id="carryRouterMenuId"/>
    </div>
</template>

<script>
    import Style7Item from "./Style7Item";
    export default {
        name: "Style7",
        components: {Style7Item},
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
        computed:{
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
            serialNumberContainerStyle(){
                let {padding,position} = this.styleConfig.serialNumber;
                return {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',

                    justifyContent: position.value
                }
            },
            serialNumberFirstStyle(){
                let {firstFont: font, firstBackgroundColor:backgroundColor,firstBorder:border,borderRadius,width,height} = this.styleConfig.serialNumber;

                return {
                    width: width.value + 'px',
                    height: height.value + 'px',
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

                    color: font.value.color,
                    fontFamily: font.value.fontFamily,
                    fontSize: font.value.fontSize,
                    textDecoration: font.value.textDecoration  ? 'underline' : 'none',
                    fontStyle:  font.value.italic ? 'italic' : 'normal',
                    fontWeight: font.value.bold ? 'bold' : 'normal',
                    textAlign: 'center',
                    lineHeight: 1,
                }
            },
            serialNumberSecondStyle(){
                let {secondFont: font, secondBackgroundColor:backgroundColor,secondBorder:border,borderRadius,width,height} = this.styleConfig.serialNumber;

                return {
                    width: width.value + 'px',
                    height: height.value + 'px',
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

                    color: font.value.color,
                    fontFamily: font.value.fontFamily,
                    fontSize: font.value.fontSize,
                    textDecoration: font.value.textDecoration  ? 'underline' : 'none',
                    fontStyle:  font.value.italic ? 'italic' : 'normal',
                    fontWeight: font.value.bold ? 'bold' : 'normal',
                    textAlign: 'center',
                    lineHeight: 1,
                }
            },
            serialNumberThirdStyle(){
                let {thirdFont: font, thirdBackgroundColor:backgroundColor,thirdBorder:border,borderRadius,width,height} = this.styleConfig.serialNumber;

                return {
                    width: width.value + 'px',
                    height: height.value + 'px',
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

                    color: font.value.color,
                    fontFamily: font.value.fontFamily,
                    fontSize: font.value.fontSize,
                    textDecoration: font.value.textDecoration  ? 'underline' : 'none',
                    fontStyle:  font.value.italic ? 'italic' : 'normal',
                    fontWeight: font.value.bold ? 'bold' : 'normal',
                    textAlign: 'center',
                    lineHeight: 1,
                }
            },
            serialNumberOtherStyle(){
                let {otherFont: font, otherBackgroundColor:backgroundColor,otherBorder:border,borderRadius,width,height} = this.styleConfig.serialNumber;

                return {
                    width: width.value + 'px',
                    height: height.value + 'px',
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

                    color: font.value.color,
                    fontFamily: font.value.fontFamily,
                    fontSize: font.value.fontSize,
                    textDecoration: font.value.textDecoration  ? 'underline' : 'none',
                    fontStyle:  font.value.italic ? 'italic' : 'normal',
                    fontWeight: font.value.bold ? 'bold' : 'normal',
                    textAlign: 'center',
                    lineHeight: 1,
                }
            },
            contentContainerStyle(){
                let {containerPadding:padding} = this.styleConfig.content;
                return {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                };
            },
            titleStyle() {
                let {titleFont:font} = this.styleConfig.content;

                let style = {};

                font = font.value;
                style.color = font.color;
                style.fontFamily = font.fontFamily;
                style.fontSize = font.fontSize;
                style.textDecoration = font.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.italic ? 'italic' : 'normal';
                style.fontWeight = font.bold ? 'bold' : 'normal';

                return style;
            },
            dateStyle() {
                let {timeFont:font,timePaddingLeft} = this.styleConfig.content;

                let style = {
                    paddingLeft: timePaddingLeft.value + 'px'
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
        }
    }
</script>

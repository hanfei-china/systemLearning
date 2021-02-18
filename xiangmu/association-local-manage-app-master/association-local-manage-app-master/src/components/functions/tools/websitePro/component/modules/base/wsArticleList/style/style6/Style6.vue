<template>
    <div class="website-pro-article-list-style6-list-container">
        <style6-row v-for="(children,index) of data2d" :key="index"
                    :item-click="itemClick" :label-click="labelClick" :labels="labels"
                    :class-id="classId" :design="design" :children="children" :index="index"
                    :container-style="containerStyle" :text-container-style="textContainerStyle" :triangle-config="triangleConfig"
                    :label-container-style="labelContainerStyle" :label-style="labelStyle"
                    :title-style="titleStyle" :title-format="titleFormat"
                    :abstract-style="abstractStyle" :abstract-format="abstractFormat"
                    :carry-router-menu-id="carryRouterMenuId"/>
    </div>
</template>

<script>

    import Style6Row from "./Style6Row";

    export default {
        name: "Style6",
        components: {Style6Row},
        props: {
            data: {
                type: Array,
                default() {
                    return [];
                }
            },
            labels: {
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
            data2d() {
                let array_2d = [];
                let rowCount = this.styleConfig.container.rowCount.value;
                for (let index = 0; index < this.data.length; index += rowCount) {
                    let temp = this.data.slice(index, index + rowCount);
                    array_2d.push(temp);
                }
                return array_2d;
            },
            containerStyle() {
                let {height, width} = this.styleConfig.container;

                return {
                    width: width.value + 'px',
                    minWidth: width.value + 'px',
                    height: height.value + 'px',
                }
            },
            textContainerStyle(){
                let {padding} = this.styleConfig.textContainer;

                return {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                }
            },
            triangleConfig() {
                return this.styleConfig.triangle;
            },
            labelConfig() {
                return this.styleConfig.label;
            },
            labelContainerStyle() {
                let {padding} = this.labelConfig;

                return {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                }
            },
            labelStyle() {
                let {
                    itemBackgroundColor: backgroundColor, itemFont: font, itemPadding: padding,
                    itemOuterPadding: outerPadding, itemBorder: border, itemBorderRadius: borderRadius
                } = this.labelConfig;

                let style = {
                    backgroundColor: backgroundColor.value,

                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',

                    marginTop: outerPadding.value.top + 'px',
                    marginBottom: outerPadding.value.bottom + 'px',
                    marginLeft: outerPadding.value.left + 'px',
                    marginRight: outerPadding.value.right + 'px',

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

                    borderTopLeftRadius: borderRadius.value.leftTop + 'px',
                    borderBottomLeftRadius: borderRadius.value.leftBottom + 'px',
                    borderTopRightRadius: borderRadius.value.rightTop + 'px',
                    borderBottomRightRadius: borderRadius.value.rightBottom + 'px',
                };

                style.color = font.value.color;
                style.fontFamily = font.value.fontFamily;
                style.fontSize = font.value.fontSize;
                style.textDecoration = font.value.textDecoration ? 'underline' : 'none';
                style.fontStyle = font.value.italic ? 'italic' : 'normal';
                style.fontWeight = font.value.bold ? 'bold' : 'normal';
                style.textAlign = font.value.textAlign;
                style.lineHeight = 1;

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
                        } else {
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
                // style.textAlign = font.textAlign;

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
                        } else {
                            return content;
                        }
                    }
                    return '';
                }
            },
        },
    }
</script>

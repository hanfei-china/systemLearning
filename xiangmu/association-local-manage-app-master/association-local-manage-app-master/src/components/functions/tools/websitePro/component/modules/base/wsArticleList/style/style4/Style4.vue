<template>
    <div class="website-pro-article-list-style4-list-container">
        <style4-item v-for="(imageText,index) of data" :key="imageText.contentId"
                     :class="{'odd': index%2 === 1,'even' : index%2 === 0}"
                     :image-text="imageText" :labels="labels" :class-id="classId" :design="design"
                     :item-click="itemClick" :label-click="labelClick"
                     :container-style="containerStyle" :poster-style="posterStyle"
                     :label-container-style="labelContainerStyle" :label-style="labelStyle"
                     :title-style="titleStyle" :title-format="titleFormat"
                     :carry-router-menu-id="carryRouterMenuId"/>
    </div>
</template>

<script>
    import Style4Item from "./Style4Item";

    export default {
        name: "Style4",
        components: {Style4Item},
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
            containerStyle() {
                let {padding, outerPadding, border, shadow, height, width, backgroundColor} = this.styleConfig.container;
                let boxShadow = shadow.value;

                return {
                    width: width.value + 'px',
                    height: height.value + 'px',
                    backgroundColor: backgroundColor.value,

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

                    marginTop: outerPadding.value.top + 'px',
                    marginBottom: outerPadding.value.bottom + 'px',
                    marginLeft: outerPadding.value.left + 'px',
                    marginRight: outerPadding.value.right + 'px',

                    boxShadow: `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.insert ? 'inset' : ''}`
                }
            },
            posterStyle() {
                let {height} = this.styleConfig.poster;

                return {
                    height: height.value + 'px',
                }
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
        },
    }
</script>

<template>
    <div class="website-pro-article-list-style3-list-container">
        <style3-item v-for="(imageText,index) of data" :key="imageText.contentId"
                     :class="{'odd': index%2 === 1,'even' : index%2 === 0}"
                     :image-text="imageText" :item-click="itemClick" :design="design"
                     :container-style="containerStyle"
                     :title-container-style="titleContainerStyle" :title-style="titleStyle" :time-style="timeStyle"
                     :abstract-style="abstractStyle" :abstract-format="abstractFormat"
                     :carry-router-menu-id="carryRouterMenuId"/>
    </div>
</template>

<script>

    import Style3Item from "./Style3Item";

    export default {
        name: "Style3",
        components: {Style3Item},
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
            titleConfig() {
                return this.styleConfig.title;
            },
            titleContainerStyle() {
                let {padding} = this.titleConfig;
                return {
                    paddingTop: padding.value.top + 'px',
                    paddingBottom: padding.value.bottom + 'px',
                    paddingLeft: padding.value.left + 'px',
                    paddingRight: padding.value.right + 'px',
                }
            },
            titleStyle() {
                let {titleFont} = this.titleConfig;

                let style = {};

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
            timeStyle() {
                let {timeFont, showTime} = this.titleConfig;
                if (!showTime.value) {
                    return {
                        display: 'none'
                    }
                }

                let style = {};

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

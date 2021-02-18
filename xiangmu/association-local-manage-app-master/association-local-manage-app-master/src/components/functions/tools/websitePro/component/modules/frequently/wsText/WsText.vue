<template>
    <a draggable="false" class="website-pro-absolute-fill-parent" :href="href" :target="target"
       :style="style" :class="customClasses">
        <pre :style="{fontFamily: module.attributes.fontGroup.attributes.font.value.fontFamily}">{{value}}</pre>
    </a>
</template>

<script>
    import {commonLink} from "../../../../js/util/util";

    export default {
        name: "WsText",
        props:{
            module: Object,
            design: Boolean
        },
        computed:{
            value(){
                return this.module.attributes.contentGroup.attributes.content.value || '按钮';
            },
            customClasses(){
                return this.module.attributes.otherGroup.attributes.customClasses.value;
            },
            href(){
                return commonLink(this.$router,this.module.attributes.linkGroup.attributes.linkConfig.value,this.design);
            },
            target(){
                if(this.href === 'javascript:;'){
                    return '_self';
                }
                return this.module.attributes.linkGroup.attributes.linkConfig.value.target;
            },
            style(){
                let style = {
                    color: this.module.attributes.fontGroup.attributes.font.value.color,
                    fontFamily: this.module.attributes.fontGroup.attributes.font.value.fontFamily,
                    fontSize: this.module.attributes.fontGroup.attributes.font.value.fontSize,
                    textDecoration: this.module.attributes.fontGroup.attributes.font.value.textDecoration ? 'underline' : 'none',
                    fontStyle: this.module.attributes.fontGroup.attributes.font.value.italic ? 'italic' : 'normal',
                    fontWeight: this.module.attributes.fontGroup.attributes.font.value.bold ? 'bold' : 'normal',
                    textAlign: this.module.attributes.fontGroup.attributes.font.value.textAlign,
                    backgroundColor: this.module.attributes.styleGroup.attributes.backgroundColor.value,
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
                };

                if(!this.design){
                    style.width = this.module.attributes.layoutGroup.attributes.layout.value.width + 'px';
                    style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                    style.left = this.module.attributes.layoutGroup.attributes.layout.value.left + 'px';
                    style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
                    style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
                    style.position = 'absolute';
                }

                return style;
            }
        }
    }
</script>

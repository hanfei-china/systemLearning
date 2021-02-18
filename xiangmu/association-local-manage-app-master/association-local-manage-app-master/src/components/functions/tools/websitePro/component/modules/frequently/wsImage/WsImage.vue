<template>
    <a draggable="false" class="website-pro-absolute-fill-parent website-pro-flex column center website-pro-background-image-style" :href="href" :target="target"
       :style="style" :class="customClasses"></a>
</template>

<script>
    import {commonLink} from "../../../../js/util/util";

    export default {
        name: "WsImage",
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

                    backgroundImage: `url(${this.module.attributes.srcGroup.attributes.src.value})`,
                    boxShadow: this.boxShadow
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

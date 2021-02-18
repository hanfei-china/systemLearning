<template>
    <div class="position-relative button-module" :style="containerStyle">
        <div class="absolute-fill-parent flex flex-column flex-center">
            <div class="flex flex-center" v-show="showIcon">
                <div class="flex flex-center flex-column" :style="iconContainerStyle">
                    <div class="text-align-center"><img style="max-height: 24px;max-width: 24px;" :src="icon"/></div>
                </div>
            </div>
            <div :style="titleStyle" v-show="showTitle">{{title}}</div>
        </div>
        <div class="absolute-fill-parent button-module-hidden" :class="{hidden}">
            <div class="absolute-fill-parent flex flex-column flex-center">
                <div class="text-align-center" ><i style="font-size: 36px;color: white;" class="iconfont icon-hidden"/></div>
            </div>
        </div>
        <div class="absolute-fill-parent button-module-cover">
            <el-button-group class="fall-flow-module-cover-handler">
                <el-button size="mini" type="primary" icon="el-icon-rank" circle/>
                <el-button size="mini" type="primary" icon="el-icon-setting" circle @click="$emit('setting')"/>
                <el-button size="mini" type="primary" icon="el-icon-delete" circle @click="$emit('delete')"/>
            </el-button-group>
        </div>
    </div>
</template>

<script>
    import {moduleNames} from "../../js/common/moduleNames";
    export default {
        name: "ButtonModule",
        props:{
            module: Object,
            activityInfo: Object,
        },
        data(){
            return {
                moduleNames,
            }
        },
        computed:{
            attributes(){
                return this.module.attributes;
            },
            moduleGroup(){
                return this.attributes.moduleGroup.attributes;
            },
            hidden(){
                return this.moduleGroup.hidden.value;
            },
            titleGroup(){
                return this.attributes.titleGroup.attributes;
            },
            showTitle(){
                return this.titleGroup.showTitle.value;
            },
            title(){
                return this.titleGroup.title.value;
            },
            titleStyle(){
                let font = this.titleGroup.font;
                return {
                    color: font.value.color,
                    fontFamily: font.value.fontFamily,
                    fontSize: font.value.fontSize,
                    textDecoration: font.value.textDecoration ? 'underline' : 'none',
                    fontStyle: font.value.italic ? 'italic' : 'normal',
                    fontWeight: font.value.bold ? 'bold' : 'normal',
                    textAlign: font.value.textAlign,
                    marginTop: '4px'
                }
            },
            iconGroup(){
                return this.attributes.iconGroup.attributes;
            },
            showIcon(){
                return this.iconGroup.showIcon.value;
            },
            icon(){
                return this.iconGroup.icon.value;
            },
            iconContainerStyle(){
                let backgroundColor = this.iconGroup.iconBackgroundColor.value;
                let borderRadius = this.iconGroup.iconBorderRadius;
                let border = this.iconGroup.iconBorder;

                return {
                    backgroundColor,
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

                    width: '46px',
                    height: '46px',
                }
            },
            containerGroup(){
                return this.attributes.containerGroup.attributes;
            },
            boxShadow(){
                let boxShadow = this.containerGroup.containerBoxShadow.value;
                return `${boxShadow.hShadow}px ${boxShadow.vShadow}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color} ${boxShadow.insert ? 'inset' : ''}`
            },
            containerStyle(){
                let backgroundColor = this.containerGroup.containerBackgroundColor.value;
                let borderRadius = this.containerGroup.containerBorderRadius;
                let border = this.containerGroup.containerBorder;

                return {
                    backgroundColor,
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

                    boxShadow: this.boxShadow

                }
            }
        }
    }
</script>
<style lang="less">
    .button-module{
        display: inline-block;
        width: 108px;
        height: 108px;
        margin-right: 6px;
        margin-left: 6px;
        margin-bottom: 8px;
        cursor: pointer;
        box-sizing: border-box;

        &-cover{
            display: none;
            background-color: rgba(0,0,0,.6);
            padding: 10px;

            &-handler{
                position: absolute;
                right: 10px;
            }
        }

        &-hidden{
            background-color: rgba(0,0,0,.6);
            display: none;

            &.hidden{
                display: block;
            }
        }

        &:hover{
            .button-module-cover{
                display: block;
            }
        }
    }
</style>

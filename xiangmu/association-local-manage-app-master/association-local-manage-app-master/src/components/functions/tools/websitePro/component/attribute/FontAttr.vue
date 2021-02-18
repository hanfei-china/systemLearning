<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div class="website-pro-flex" style="margin-bottom: 10px;">
                <div class="website-flex column flex-fill-in-the-remaining-space">
                    <div class="website-pro-layout-attr-title">字体</div>
                    <el-select style="width: 100%;" ref="fontFamily" size="mini" v-model="attribute.value.fontFamily">
                        <el-option class="website-font-container" v-for="(font,index) of showFonts"
                                   :key="index" :value="font.name" :label="font.title" :style="{fontFamily: font.name}">
                            {{font.title}}
                        </el-option>
                    </el-select>
                </div>
                <div class="website-pro-flex  column flex-fill-in-the-remaining-space" style="margin-left: 10px;">
                    <div class="website-pro-layout-attr-title w39">大小</div>
                    <el-select style="width: 100%;" ref="fontSize" size="mini" v-model="attribute.value.fontSize">
                        <el-option class="website-font-container" v-for="font of fontSizes"
                                   :key="font.name" :value="font+'px'" :label="font+'px'"/>
                    </el-select>
                </div>
            </div>
            <div class="website-pro-flex">
                <el-tooltip class="item" effect="dark" content="字体颜色" placement="top">
                    <el-color-picker ref="color" :show-alpha="false" size="mini" v-model="attribute.value.color"/>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content=" 加粗 " placement="top">
                        <span class="website-pro-handler-btn"
                              @click="attribute.value.bold = !attribute.value.bold"
                              :class="{active: attribute.value.bold}" style="margin-left: 10px;"><i class="iconfont icon-website-pro-attr-icon-bold"></i></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content=" 斜体 " placement="top">
                        <span class="website-pro-handler-btn"
                              @click="attribute.value.italic = !attribute.value.italic"
                              :class="{active: attribute.value.italic}"><i class="iconfont icon-website-pro-attr-icon-italic"></i></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content=" 下划线 " placement="top">
                        <span class="website-pro-handler-btn"
                              @click="attribute.value.textDecoration = !attribute.value.textDecoration"
                              :class="{active: attribute.value.textDecoration}"><i class="iconfont icon-website-pro-attr-icon-underline"></i></span>
                </el-tooltip>
                <div v-show="showTextAlign">
                    <el-tooltip class="item" effect="dark" content=" 文字居左 " placement="top">
                        <span class="website-pro-handler-btn"
                              @click="attribute.value.textAlign = 'left'"
                              :class="{active: attribute.value.textAlign === 'left'}"><i class="iconfont icon-website-pro-attr-icon-text-left"></i></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content=" 文字居中 " placement="top">
                        <span class="website-pro-handler-btn"
                              @click="attribute.value.textAlign = 'center'"
                              :class="{active: attribute.value.textAlign === 'center'}"><i class="iconfont icon-website-pro-attr-icon-text-center"></i></span>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content=" 文字居右 " placement="top">
                        <span class="website-pro-handler-btn"
                              @click="attribute.value.textAlign = 'right'"
                              :class="{active: attribute.value.textAlign === 'right'}"><i class="iconfont icon-website-pro-attr-icon-text-right"></i></span>
                    </el-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {fonts,fontSizes} from "../../js/util/util";
    import AttributeTitle from "./AttributeTitle";

    export default {
        name: "FontAttr",
        components: {AttributeTitle},
        props:{
            attribute: Object
        },
        data(){
            return {
                fonts, fontSizes
            }
        },
        computed:{
            showTitle(){
                return this.attribute.showTitle;
            },
            title(){
                return this.attribute.title;
            },
            attributes(){
                return this.attribute.attributes || {};
            },
            showFonts(){
                let fonts = this.attributes.fonts;
                if(fonts && fonts.length > 0){
                    return fonts;
                }else{
                    return this.fonts;
                }
            },
            show(){
                if(this.attribute.show){
                    return this.attribute.show();
                }else{
                    return true;
                }
            },
            showTextAlign(){
                return this.attributes.textAlign ? this.attributes.textAlign.show : true;
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.fontFamily.$refs.popper.$el.contains(target)
                    || this.$refs.fontSize.$refs.popper.$el.contains(target)
                    || this.$refs.color.$refs.dropdown.$el.contains(target);
            }
        }
    }
</script>

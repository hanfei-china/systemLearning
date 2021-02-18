<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div class="website-pro-flex" style="margin-bottom: 10px;">
                <div class="website-flex column flex-fill-in-the-remaining-space">
                    <div class="website-pro-layout-attr-title">水平阴影</div>
                    <el-input-number class="website-pro-custom-el-input-number" controls-position="right" style="width: 100%;" size="mini" v-model="attribute.value.hShadow"/>
                </div>
                <div class="website-pro-flex  column flex-fill-in-the-remaining-space" style="margin-left: 10px;">
                    <div class="website-pro-layout-attr-title">垂直阴影</div>
                    <el-input-number class="website-pro-custom-el-input-number" controls-position="right" style="width: 100%;" size="mini" v-model="attribute.value.vShadow"/>
                </div>
                <div class="website-flex column flex-fill-in-the-remaining-space" style="margin-left: 10px;">
                    <div class="website-pro-layout-attr-title">模糊半径</div>
                    <el-input-number class="website-pro-custom-el-input-number" controls-position="right" style="width: 100%;" size="mini" v-model="attribute.value.blur"/>
                </div>
            </div>
            <div class="website-pro-flex">
                <div class="website-pro-flex  column flex-fill-in-the-remaining-space">
                    <div class="website-pro-layout-attr-title">扩散半径</div>
                    <el-input-number class="website-pro-custom-el-input-number" controls-position="right" style="width: 100%;" size="mini" v-model="attribute.value.spread"/>
                </div>
                <div class="website-pro-flex  column flex-fill-in-the-remaining-space" style="margin-left: 10px;">
                    <div class="website-pro-layout-attr-title">阴影颜色</div>
                    <el-color-picker ref="color" size="mini" show-alpha v-model="attribute.value.color"/>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="margin-left: 10px;">
<!--                    <div class="website-pro-layout-attr-title">内部阴影</div>-->
<!--                    <div class="website-pro-flex column center" style="height: 28px;">-->
<!--                        <el-switch v-model="attribute.value.inset"></el-switch>-->
<!--                    </div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    export default {
        name: "BoxShadowAttr",
        components: {AttributeTitle},
        props:{
            attribute: Object
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
            showAlpha(){
                return this.attributes.showAlpha || true
            },
            titleStyle(){
                return this.attributes.titleStyle || {};
            },
            show(){
                if(this.attribute.show){
                    return this.attribute.show();
                }else{
                    return true;
                }
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.color.$refs.dropdown.$el.contains(target);
            }
        }
    }
</script>

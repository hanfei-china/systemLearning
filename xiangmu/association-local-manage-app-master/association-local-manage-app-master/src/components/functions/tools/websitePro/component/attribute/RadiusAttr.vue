<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div class="website-pro-flex">
                <div class="website-pro-flex column flex-fill-in-the-remaining-space">
                    <div class="website-pro-layout-attr-title">左上圆角</div>
                    <el-input-number class="website-pro-custom-el-input-number" style="width: 100%;" controls-position="right" :min="0" v-model="attribute.value.leftTop" size="mini"/>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 5px;">
                    <div class="website-pro-layout-attr-title">右上圆角</div>
                    <el-input-number class="website-pro-custom-el-input-number" style="width: 100%;" controls-position="right" :min="0" v-model="attribute.value.rightTop" size="mini"/>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 5px;">
                    <div class="website-pro-layout-attr-title">左下圆角</div>
                    <el-input-number class="website-pro-custom-el-input-number" style="width: 100%;" controls-position="right" :min="0" v-model="attribute.value.leftBottom" size="mini"/>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 5px;">
                    <div class="website-pro-layout-attr-title">右下圆角</div>
                    <el-input-number class="website-pro-custom-el-input-number" style="width: 100%;" controls-position="right" :min="0" v-model="attribute.value.rightBottom" size="mini"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    export default {
        name: "RadiusAttr",
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
                return target === this.$el ||  this.$el.contains(target);
            }
        }
    }
</script>

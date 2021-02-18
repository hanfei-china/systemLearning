<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div class="website-pro-flex">
                <div class="website-pro-flex column flex-fill-in-the-remaining-space">
                    <div class="website-pro-layout-attr-title">边框宽度</div>
                    <el-input-number class="website-pro-custom-el-input-number" style="width: 100%;" controls-position="right" :min="0" v-model="attribute.value.borderWidth" size="mini"/>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 5px;">
                    <div class="website-pro-layout-attr-title">边框样式</div>
                    <el-select ref="borderStyle" size="mini" v-model="attribute.value.borderStyle">
                        <el-option value="dotted" label="点线"/>
                        <el-option value="solid" label="实线"/>
                        <el-option value="dashed" label="虚线"/>
                        <el-option value="double" label="双线"/>
                    </el-select>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 5px;">
                    <div class="website-pro-layout-attr-title">边框颜色</div>
                    <el-color-picker ref="borderColor" show-alpha size="mini" v-model="attribute.value.borderColor"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    export default {
        name: "UnifiedBorderAttr",
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
                return target === this.$el ||  this.$el.contains(target)
                        || this.$refs.borderStyle.$refs.popper.$el.contains(target)
                        || this.$refs.borderColor.$refs.dropdown.$el.contains(target);
            }
        }
    }
</script>

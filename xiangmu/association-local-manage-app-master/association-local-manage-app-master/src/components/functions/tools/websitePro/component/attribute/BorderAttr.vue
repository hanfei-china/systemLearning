<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div class="website-pro-flex">
                <div style="opacity: 0;padding-right: 4px;">上边框：</div>
                <div class="flex-fill-in-the-remaining-space website-pro-flex">
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space">
                        <div class="website-pro-layout-attr-title">边框宽度</div>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <div class="website-pro-layout-attr-title">边框样式</div>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <div class="website-pro-layout-attr-title">边框颜色</div>
                    </div>
                </div>
            </div>
            <div class="website-pro-flex" style="padding-top: 10px;">
                <div style="padding-right: 4px;">上边框：</div>
                <div class="flex-fill-in-the-remaining-space website-pro-flex">
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space">
                        <el-input-number class="website-pro-custom-el-input-number" style="width: 100%;" controls-position="right" :min="0" v-model="attribute.value.top.borderWidth" size="mini"/>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <el-select ref="borderStyle" :disabled="borderStyleHidden" size="mini" v-model="attribute.value.top.borderStyle">
                            <el-option value="dotted" label="点线"/>
                            <el-option value="solid" label="实线"/>
                            <el-option value="dashed" label="虚线"/>
                            <el-option value="double" label="双线"/>
                        </el-select>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <el-color-picker ref="borderColor" :show-alpha="showAlpha" size="mini" v-model="attribute.value.top.borderColor"/>
                    </div>
                </div>
            </div>
            <div class="website-pro-flex" style="padding-top: 10px;">
                <div style="padding-right: 4px;">下边框：</div>
                <div class="flex-fill-in-the-remaining-space website-pro-flex">
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space">
                        <el-input-number class="website-pro-custom-el-input-number" style="width: 100%;" controls-position="right" :min="0" v-model="attribute.value.bottom.borderWidth" size="mini"/>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <el-select ref="borderStyle" :disabled="borderStyleHidden" size="mini" v-model="attribute.value.bottom.borderStyle">
                            <el-option value="dotted" label="点线"/>
                            <el-option value="solid" label="实线"/>
                            <el-option value="dashed" label="虚线"/>
                            <el-option value="double" label="双线"/>
                        </el-select>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <el-color-picker ref="borderColor" :show-alpha="showAlpha" size="mini" v-model="attribute.value.bottom.borderColor"/>
                    </div>
                </div>
            </div>
            <div class="website-pro-flex" style="padding-top: 10px;">
                <div style="padding-right: 4px;">左边框：</div>
                <div class="flex-fill-in-the-remaining-space website-pro-flex">
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space">
                        <el-input-number class="website-pro-custom-el-input-number" style="width: 100%;" controls-position="right" :min="0" v-model="attribute.value.left.borderWidth" size="mini"/>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <el-select ref="borderStyle" :disabled="borderStyleHidden" size="mini" v-model="attribute.value.left.borderStyle">
                            <el-option value="dotted" label="点线"/>
                            <el-option value="solid" label="实线"/>
                            <el-option value="dashed" label="虚线"/>
                            <el-option value="double" label="双线"/>
                        </el-select>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <el-color-picker ref="borderColor" :show-alpha="showAlpha" size="mini" v-model="attribute.value.left.borderColor"/>
                    </div>
                </div>
            </div>
            <div class="website-pro-flex" style="padding-top: 10px;">
                <div style="padding-right: 4px;">右边框：</div>
                <div class="flex-fill-in-the-remaining-space website-pro-flex">
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space">
                        <el-input-number class="website-pro-custom-el-input-number" style="width: 100%;" controls-position="right" :min="0" v-model="attribute.value.right.borderWidth" size="mini"/>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <el-select ref="borderStyle" :disabled="borderStyleHidden" size="mini" v-model="attribute.value.right.borderStyle">
                            <el-option value="dotted" label="点线"/>
                            <el-option value="solid" label="实线"/>
                            <el-option value="dashed" label="虚线"/>
                            <el-option value="double" label="双线"/>
                        </el-select>
                    </div>
                    <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="padding-left: 10px;">
                        <el-color-picker ref="borderColor" :show-alpha="showAlpha" size="mini" v-model="attribute.value.right.borderColor"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    export default {
        name: "BorderAttr",
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
                return this.attributes.showAlpha !== false;
            },
            show(){
                if(this.attribute.show){
                    return this.attribute.show();
                }else{
                    return true;
                }
            },
            borderStyleHidden(){
                return this.attributes.borderStyleHidden === true;
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

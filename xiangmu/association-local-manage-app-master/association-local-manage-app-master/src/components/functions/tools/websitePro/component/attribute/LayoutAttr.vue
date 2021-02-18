<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div v-show="showPosition" class="website-pro-flex" style="margin-bottom: 10px;">
                <div class="website-flex column flex-fill-in-the-remaining-space">
                    <div class="website-pro-layout-attr-title">定位</div>
                    <el-select size="mini" ref="position" style="width: 100%;" v-model="attribute.value.position">
                        <el-option value="absolute" label="绝对定位" ></el-option>
                        <el-option value="relative" label="相对定位" ></el-option>
                    </el-select>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="margin-left: 10px;">
                    <div class="website-pro-layout-attr-title">布局</div>
                    <el-select size="mini" ref="layout" style="width: 100%;" :disabled="attribute.value.position === 'absolute'" v-model="attribute.value.align">
                        <el-option value="left" label="居左"/>
                        <el-option value="center" label="居中"/>
                        <el-option value="right" label="居右"/>
                    </el-select>
                </div>
            </div>
            <div class="website-pro-flex" style="margin-bottom: 10px;" v-show="showSecondSetting">
                <div class="website-pro-flex column flex-fill-in-the-remaining-space">
                    <div class="website-pro-flex column center website-pro-layout-attr-title">距左</div>
                    <div><el-input-number style="width: 100%;" :disabled="!showLeft"  size="mini" controls-position="right" v-model="attribute.value.left"/></div>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="margin-left: 10px;">
                    <div class="website-pro-flex column center website-pro-layout-attr-title">距上</div>
                    <div><el-input-number style="width: 100%;" size="mini" controls-position="right" v-model="attribute.value.top"/></div>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="margin-left: 10px;">
                    <div class="website-pro-flex column center website-pro-layout-attr-title">层级</div>
                    <div><el-input-number style="width: 100%;" size="mini" controls-position="right" v-model="attribute.value.zIndex"/></div>
                </div>
            </div>
            <div class="website-pro-flex">
                <div class="website-pro-flex column flex-fill-in-the-remaining-space">
                    <div class="website-pro-flex column center website-pro-layout-attr-title">高度</div>
                    <div><el-input-number style="width: 100%;" :step="10" :disabled="!showHeight" size="mini" controls-position="right" v-model="attribute.value.height"/></div>
                </div>
                <div class="website-pro-flex column flex-fill-in-the-remaining-space" style="margin-left: 10px;">
                    <div class="website-pro-flex column center website-pro-layout-attr-title">宽度</div>
                    <div><el-input-number style="width: 100%;" :step="10" :disabled="!showWidth"  size="mini" controls-position="right" v-model="attribute.value.width"/></div>
                </div>
                <div class="flex-fill-in-the-remaining-space" style="margin-left: 10px;"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    export default {
        name: "LayoutAttr",
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
            position(){
                return this.attributes.position;
            },
            showPosition(){
                return this.position ? (this.position && this.position.show) : true;
            },
            left(){
                return this.attributes.left;
            },
            showLeft(){
                if(this.left){
                    return this.left.show;
                }else{
                    if(this.showPosition){
                        return this.attribute.value.position === 'absolute';
                    }
                }
                return true;
            },
            top(){
                return this.attributes.top;
            },
            showTop(){
                if(this.top){
                    return this.top.show;
                }
                return true;
            },
            zIndex(){
                return this.attributes.zIndex;
            },
            showZIndex(){
                if(this.zIndex){
                    return this.zIndex.show;
                }
                return true;
            },
            showSecondSetting(){
                return this.showLeft || this.showTop || this.showZIndex;
            },
            width(){
                return this.attributes.width;
            },
            showWidth(){
                return this.width ? (this.width && this.width.show) : true;
            },
            height(){
                return this.attributes.height;
            },
            showHeight(){
                return this.height ? this.height.show : true;
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
                    || this.$refs.position.$refs.popper.$el.contains(target)
                    || this.$refs.layout.$refs.popper.$el.contains(target);
            }
        },
        watch:{
            'attribute.value.position'(val){
                if(val === 'relative'){
                    this.attribute.value.left = 0;
                }
            }
        }
    }
</script>

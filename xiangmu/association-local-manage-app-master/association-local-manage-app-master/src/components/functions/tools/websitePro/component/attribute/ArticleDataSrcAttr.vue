<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div class="website-pro-flex">
                <div class="website-pro-layout-attr-title horizontal">链接类型</div>
                <div class="flex-fill-in-the-remaining-space">
                    <el-select style="width: 100%;" ref="dataSrc" size="mini" v-model="attribute.value.dataSrc" placeholder="请选择">
                        <el-option label="模块设置" :value="1"></el-option>
                        <el-option label="页面参数" :value="2"></el-option>
                    </el-select>
                </div>
            </div>
            <div v-show="attribute.value.dataSrc === 1" style="margin-top: 10px;">
                <div class="website-pro-flex" style="margin-bottom: 10px;">
                    <div class="website-pro-layout-attr-title horizontal">内容选择</div>
                    <div class="flex-fill-in-the-remaining-space">
                        <content-setting ref="contentId" :attributes="{showClear:true}" style="width: 100%;" v-model="attribute.value.contentId"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    import ContentSetting from "../common/ContentSetting";
    export default {
        name: "ArticleDataSrcAttr",
        components: {ContentSetting, AttributeTitle},
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
                    || this.$refs.dataSrc.$refs.popper.$el.contains(target)
                    || this.$refs.contentId.$refs.container.$refs.popper.$el.contains(target);
            }
        }
    }
</script>

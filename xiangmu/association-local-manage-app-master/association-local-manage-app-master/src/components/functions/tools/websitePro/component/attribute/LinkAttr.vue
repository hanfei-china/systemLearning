<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div class="website-pro-flex" style="margin-bottom: 10px;">
                <div class="website-pro-layout-attr-title horizontal">打开方式</div>
                <div class="flex-fill-in-the-remaining-space">
                    <el-select style="width: 100%;" ref="target" size="mini" v-model="attribute.value.target" placeholder="请选择">
                        <el-option label="当前窗口" value="_self"></el-option>
                        <el-option label="新窗口" value="_blank"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="website-pro-flex" style="margin-bottom: 10px;" v-show="!hiddenLinkType">
                <div class="website-pro-layout-attr-title horizontal">链接类型</div>
                <div class="flex-fill-in-the-remaining-space">
                    <el-select style="width: 100%;" ref="linkType" size="mini" v-model="attribute.value.linkType" placeholder="请选择">
                        <el-option label="外部链接" :value="1"></el-option>
                        <el-option label="其它页面" :value="2"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="website-pro-flex" v-show="attribute.value.linkType === 1" style="margin-bottom: 10px;">
                <div class="website-pro-layout-attr-title horizontal">链接地址</div>
                <div class="flex-fill-in-the-remaining-space">
                    <el-input placeholder="请输入网址" type="textarea" :rows="4" resize="none" size="mini" v-model="attribute.value.linkUrl" />
                </div>
            </div>
            <div v-show="attribute.value.linkType === 2">
                <div class="website-pro-flex" style="margin-bottom: 10px;">
                    <div class="website-pro-layout-attr-title horizontal">页面选择</div>
                    <div class="flex-fill-in-the-remaining-space">
                        <page-choose ref="pagePath" style="width: 100%;" v-model="attribute.value.pagePath"/>
                    </div>
                </div>
                <div v-show="!hiddenParam">
                    <div class="website-pro-flex" style="margin-bottom: 10px;">
                        <div class="website-pro-layout-attr-title horizontal">参数类型</div>
                        <div class="flex-fill-in-the-remaining-space">
                            <el-select style="width: 100%;" size="mini" ref="pageParamType" v-model="attribute.value.pageParamType" placeholder="请选择页面参数类型">
                                <el-option label="无参数" :value="0"></el-option>
                                <el-option label="单个内容" :value="1"></el-option>
                                <el-option label="内容分类" :value="2"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="website-pro-flex" style="margin-bottom: 10px;" v-show="attribute.value.pageParamType === 1">
                        <div class="website-pro-layout-attr-title horizontal">内容选择</div>
                        <div class="flex-fill-in-the-remaining-space">
                            <content-setting ref="contentId" style="width: 100%;" :attributes="{showClear:true}" v-model="attribute.value.contentId"/>
                        </div>
                    </div>
                    <div v-show="attribute.value.pageParamType === 2">
                        <div class="website-pro-flex" style="margin-bottom: 10px;">
                            <div class="website-pro-layout-attr-title horizontal">分类选择</div>
                            <div class="flex-fill-in-the-remaining-space">
                                <content-class-setting ref="classId" :attributes="{showClear:true}" style="width: 100%;" v-model="attribute.value.classId"/>
                            </div>
                        </div>
                        <div class="website-pro-flex" style="margin-bottom: 10px;">
                            <div class="website-pro-layout-attr-title horizontal">标签选择</div>
                            <div class="flex-fill-in-the-remaining-space">
                                <content-label-setting ref="labelId" :attributes="{showClear:true}" :class-id="attribute.value.classId" style="width: 100%;" v-model="attribute.value.labelId"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PageChoose from "../common/PageChoose";
    import ContentSetting from "../common/ContentSetting";
    import ContentClassSetting from "../common/ContentClassSetting";
    import ContentLabelSetting from "../common/ContentLabelSetting";
    import AttributeTitle from "./AttributeTitle";
    export default {
        name: "LinkAttr",
        components: {AttributeTitle, ContentLabelSetting, ContentClassSetting, ContentSetting, PageChoose},
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
            },
            hiddenParam(){
                return this.attributes.hiddenParam;
            },
            hiddenLinkType(){
                return this.attributes.hiddenLinkType;
            },
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.target.$refs.popper.$el.contains(target)
                    || this.$refs.linkType.$refs.popper.$el.contains(target)
                    || this.$refs.pagePath.$refs.container.$refs.popper.$el.contains(target)

                    || this.$refs.pageParamType.$refs.popper.$el.contains(target)

                    || this.$refs.contentId.$refs.container.$refs.popper.$el.contains(target)
                    || this.$refs.classId.$refs.container.$refs.popper.$el.contains(target)
                    || this.$refs.labelId.$refs.container.$refs.popper.$el.contains(target);
            }
        }
    }
</script>


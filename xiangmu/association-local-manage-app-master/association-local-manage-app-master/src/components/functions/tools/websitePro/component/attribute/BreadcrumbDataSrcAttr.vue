<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div class="website-pro-flex">
                <div class="website-pro-layout-attr-title horizontal">数据来源</div>
                <div class="flex-fill-in-the-remaining-space">
                    <el-select style="width: 100%;" ref="dataSrc" size="mini" v-model="attribute.value.dataSrc" placeholder="请选择">
                        <el-option label="模块设置" :value="1"></el-option>
                        <el-option label="路由读取" :value="2"></el-option>
                    </el-select>
                </div>
            </div>
            <div v-show="attribute.value.dataSrc === 2" style="margin-top: 10px;">
                <div class="website-pro-flex" style="margin-bottom: 10px;">
                    <div class="website-pro-layout-attr-title horizontal">页头选择</div>
                    <div class="flex-fill-in-the-remaining-space">
                        <page-header-attr ref="header" style="width: 100%;" v-model="attribute.value.pageHeader"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    import PageHeaderAttr from "./PageHeaderAttr";
    export default {
        name: "BreadcrumbDataSrcAttr",
        components: {PageHeaderAttr, AttributeTitle},
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
                    || this.$refs.header.$refs.select.$refs.popper.$el.contains(target);
            }
        }
    }
</script>

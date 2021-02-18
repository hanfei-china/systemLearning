<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div class="website-flex">
            <div style="flex: 0 0 100px;" class="website-pro-flex column center" v-show="!hiddenPageable">
                <el-checkbox v-model="attribute.value.pageable">开启分页</el-checkbox>
            </div>
            <div class="website-pro-flex flex-fill-in-the-remaining-space">
                <div class="website-pro-layout-attr-title" style="padding-right: 2px;">每页查询数量：</div>
                <el-input-number style="width: 125px;" class="website-pro-custom-el-input-number" controls-position="right" :min="1" size="mini" v-model="attribute.value.pageSize"/>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    export default {
        name: "PageAttr",
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
            },
            hiddenPageable(){
                return this.attributes.hiddenPageable;
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

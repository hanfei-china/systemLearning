<template>
    <div class="website-pro-flex" v-show="show">
        <div class="website-pro-layout-attr-title" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <el-input class="flex-fill-in-the-remaining-space" style="border-radius: 0;" size="mini" v-model="attribute.value" :type="type" :resize="resize" :rows="rows" :placeholder="placeholder"/>
    </div>
</template>

<script>
    export default {
        name: "TextAttr",
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
            type(){
                return this.attributes.type;
            },
            placeholder(){
                return this.attributes.placeholder || '请输入';
            },
            resize(){
                return this.attributes.resize || 'none';
            },
            rows(){
                return this.attributes.rows || 6;
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
                return target === this.$el ||  this.$el.contains(target);
            }
        },
        watch:{
            'attribute.value'(val){
                if(this.attribute.syncChange){
                    this.attribute.syncChange(val);
                }
            }
        }
    }
</script>

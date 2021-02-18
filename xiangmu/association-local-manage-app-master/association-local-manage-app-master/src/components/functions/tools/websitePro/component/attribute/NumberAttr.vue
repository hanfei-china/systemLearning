<template>
    <div class="website-pro-flex" v-show="show">
        <div class="website-pro-layout-attr-title" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <el-input-number size="mini" controls-position="right" :max="max" :min="min" v-model="attribute.value"/>
    </div>
</template>

<script>
    export default {
        name: "NumberAttr",
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
            max(){
                return this.attributes.max || Infinity;
            },
            min(){
                return this.attributes.min === null || this.attributes.min === undefined ?  -Infinity : this.attributes.min;
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

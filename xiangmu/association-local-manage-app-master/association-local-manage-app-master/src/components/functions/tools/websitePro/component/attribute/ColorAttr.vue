<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;">
            <el-color-picker ref="color" :show-alpha="showAlpha" size="mini" v-model="attribute.value"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ColorAttr",
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
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.color.$refs.dropdown.$el.contains(target);
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

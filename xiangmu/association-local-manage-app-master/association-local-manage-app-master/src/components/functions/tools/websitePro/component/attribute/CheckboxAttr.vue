<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <el-checkbox v-model="attribute.value" size="mini">{{content}}</el-checkbox>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    export default {
        name: "CheckboxAttr",
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
            content(){
                return this.attributes.content || '请输入';
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

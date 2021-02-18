<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <editor v-model="attribute.value"/>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    import Editor from "../../../../../util/editor/Editor";
    export default {
        name: "RichTextAttr",
        components: {Editor, AttributeTitle},
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
                return target === this.$el ||  this.$el.contains(target);
            }
        }
    }
</script>

<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
            <group-tree v-model="attribute.value" :is-multiple="false" size="mini"
                        :group-type="groupType" :placeholder="`请选择上级${typeName}`" :max-level="maxLevel"/>
        </div>
    </div>
</template>

<script>
    import GroupTree from "../../../../../util/group/GroupTree";
    export default {
        name: "MpCommonGroupAttr",
        components: {GroupTree},
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
            titleStyle(){
                return this.attributes.titleStyle || {};
            },
            show(){
                if(this.attribute.show){
                    return this.attribute.show();
                }else{
                    return true;
                }
            },
            maxLevel(){
                return this.attributes.maxLevel;
            },
            groupType(){
                return this.attributes.groupType;
            },
            typeName(){
                return this.attributes.typeName;
            }
        },
        data(){
            return {
                list: []
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.select.$refs.popper.$el.contains(target);
            }
        },
    }
</script>

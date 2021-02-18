<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
            <el-select style="width: 100%;" ref="select" size="mini" v-model="attribute.value">
                <el-option v-for="option of options" :value="option.id" :key="option.id" :label="option.label"/>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SelectAttr",
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
            options(){
                return this.attributes.options || [];
            },
            titleStyle(){
                return this.attributes.titleStyle || {};
            },
            clearable(){
                return this.attributes.clearable !== false;
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
                    || this.$refs.select.$refs.popper.$el.contains(target);
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

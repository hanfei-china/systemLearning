<template>
    <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
        <el-collapse v-model="active" :accordion="accordion" :class="{transparent:accordion}">
            <el-collapse-item v-show="!hiddenModuleTitle" name="moduleTitle" v-if="module">
                <template v-slot:title>
                    <div style="padding: 0 16px;">模块通用设置</div>
                </template>
                <div style="padding: 0 16px;" class="website-pro-flex">
                    <div class="website-pro-flex center column" style="padding-right: 6px;width: 52px;text-align: right;">模块名称</div>
                    <div class="flex-fill-in-the-remaining-space"><el-input size="mini" v-model="module.title" placeholder="请输入模块名称"/></div>
                </div>
                <div style="padding: 0 16px;height: 28px;margin-top: 8px;" class="website-pro-flex">
                    <div class="website-pro-flex center column" style="padding-right: 6px;width: 52px;text-align: right;">模块id</div>
                    <div class="flex-fill-in-the-remaining-space text-overflow">
                        <el-input size="mini" v-model="module.id" readonly placeholder="请输入模块名称">
                            <template v-slot:append>
                                <el-tooltip content="复制模块id" placement="top">
                                    <el-button icon="iconfont icon-website-copy" v-clipboard:copy="module.id"
                                               v-clipboard:success="copyId" v-clipboard:error="copyError"
                                               style="padding-left: 10px !important;" class="custom-el-button" type="text"/>
                                </el-tooltip>
                            </template>
                        </el-input>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item v-for="attribute of attributes" v-show="groupShow(attribute)"
                              :key="attribute.id+module.id" :name="attribute.id">
                <template v-slot:title>
                    <div style="padding: 0 16px;">{{attribute.title}}</div>
                </template>
                <attribute-group :ref="attribute.id" :attribute-group="attribute"/>
            </el-collapse-item>
        </el-collapse>
    </vue-scroll>
</template>

<script>
    import AttributeGroup from "./AttributeGroup";
    export default {
        name: "AttributeSetting",
        components: {AttributeGroup},
        props:{
            module: Object,
            hiddenModuleTitle: Boolean,
            accordion: Boolean
        },
        computed:{
            attributes(){
                return this.module ? this.module.attributes : {};
            },
        },
        data(){
            return {
                active: [],
            }
        },
        watch:{
            attributes(){
                this.setActive();
            },
        },
        created() {
            this.setActive();
        },
        methods:{
            groupShow(attributeGroup){
                if(attributeGroup.show){
                    return attributeGroup.show();
                }else{
                    return true;
                }
            },
            isChildren(e){
                for(let key in this.attributes){
                    if(this.$refs.hasOwnProperty(key)){
                        let attributeGroup = this.$refs[key][0];
                        if(attributeGroup.isChildren(e)){
                            return true;
                        }
                    }
                }

                return false;
            },
            copyId(){
                this.$message.success('已复制模块id');
            },
            copyError(){
                this.$message.error('复制失败');
            },
            setActive(){
                this.active = this.hiddenModuleTitle ? [] : ['moduleTitle'];
                for(let key in this.attributes){
                    this.active.push(key);
                    if(this.active.length > 2){
                        return;
                    }
                }
            }
        },

    }
</script>
<style lang="less">
    .el-collapse.transparent{
        background-color: rgba(250, 240, 210,.2);
        border: 1px solid #dcc896;
        border-radius: 4px;
        border-bottom-width: 2px;

        .el-collapse-item__header,
        .el-collapse-item__wrap{
            background-color: transparent;
        }


        .el-divider__text{
            background-color: rgba(254, 251, 244,1);
        }
    }
</style>

<template>
    <div class="member-group-condition-container">
        <member-simple-condition class="member-condition" :hidden-comparison-object="hiddenComparisonObject" v-if="item.name==='simple'" :fields="fields" :field-config="item" @delete-item="$emit('delete-item')"/>
        <div class="member-group-condition member-condition" :class="{children: isChildren}" v-if="item.name==='group'">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space">
                    <el-radio-group size="mini" v-model="item.logicalRelationship">
                        <el-radio-button label="and" key="and">与</el-radio-button>
                        <el-radio-button label="or" key="or">或</el-radio-button>
                    </el-radio-group>
                </div>
                <div>
                    <el-button-group>
                        <el-button type="primary" size="mini" @click="addCondition('simple')">新增规则</el-button>
                        <el-button type="primary" size="mini" @click="addCondition('group')">新增分组</el-button>
                        <el-button v-if="isChildren" type="danger" size="mini" @click="$emit('delete-item')">删除</el-button>
                    </el-button-group>
                </div>
            </div>
            <div style="padding-left: 20px;">
                <member-group-condition v-for="(condition,index) of item.children" is-children
                                        :key="condition.id" :fields="fields" :item="condition" :hidden-comparison-object="hiddenComparisonObject"
                                        @delete-item="deleteItem(index)"/>
            </div>
        </div>
    </div>
</template>

<script>
    import MemberSimpleCondition from "./MemberSimpleCondition";
    export default {
        name: "MemberGroupCondition",
        components: {MemberSimpleCondition},
        props:{
            fields: Array,
            item: Object,
            isChildren: Boolean,
            hiddenComparisonObject:{
                type: Boolean,
                default: false
            }
        },
        methods:{
            addCondition(type){
                this.item.addItem(type);
            },
            deleteItem(index){
                this.item.deleteItem(index);
            }
        }
    }
</script>
<style lang="less">

    .member-group-condition-container{
        margin-top: 10px;
    }

    .member-group-condition-container{
        position: relative;

        &:not(:last-child)::after {
            content: '';
            position: absolute;
            left: -10px;
            width: 9px;
            border-color: #ccc;
            border-style: solid;
            top: 50%;
            border-width: 0 0 0 1px;
            height: calc(50% + 4px);
        }

        &::before{
            content: '';
            position: absolute;
            left: -10px;
            width: 9px;
            border-color: #ccc;
            border-style: solid;
            top: -10px;
            height: calc(50% + 14px);
            border-width: 0 0 1px 1px;
        }

        &:last-child::before{
            border-radius: 0 0 0 4px;
        }
    }


    .member-group-condition{
        padding: 10px;
        border: 1px solid #dcc896;
        background: rgba(250,240,210,.5);
        border-radius: 4px;
    }
</style>


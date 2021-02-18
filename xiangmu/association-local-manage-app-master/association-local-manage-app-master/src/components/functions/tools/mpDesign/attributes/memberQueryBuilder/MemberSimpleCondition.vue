<template>
    <div class="member-field-attr-item-setting-panel flex">
        <div class="flex flex-fill-in-the-remaining-space">
            <div class="flex flex-fill-in-the-remaining-space" style="margin-right: 10px;">
                <div class="flex-fill-in-the-remaining-space">
                    <el-select style="width: 100%;" size="mini" filterable v-model="fieldConfig.code" placeholder="请选择查询字段" >
                        <el-option v-for="field of fields" :key="field.code" :value="field.code" :label="field.name"/>
                    </el-select>
                </div>
            </div>
            <div class="flex flex-fill-in-the-remaining-space" style="margin-right: 10px;">
                <div class="flex-fill-in-the-remaining-space">
                    <el-select style="width: 100%;" size="mini"  v-model="fieldConfig.expression" placeholder="请选择查询条件" >
                        <el-option v-for="option of expressionOptions" :key="option.value" :value="option.value" :label="option.label"/>
                    </el-select>
                </div>
            </div>
            <div class="flex flex-fill-in-the-remaining-space" style="margin-right: 10px;" v-show="!hiddenComparisonObject">
                <div class="flex-fill-in-the-remaining-space">
                    <el-select style="width: 100%;" size="mini"  v-model="fieldConfig.comparisonObject" placeholder="请选择比较对象" >
                        <el-option value="me" label="当前登录用户"/>
                        <el-option value="certainValue" label="特定值"/>
                    </el-select>
                </div>
            </div>
            <div class="flex flex-fill-in-the-remaining-space" style="margin-right: 10px;" v-show="fieldConfig.comparisonObject === 'certainValue'">
                <div class="flex-fill-in-the-remaining-space">
                    <el-input v-show="topicType === 0" v-model="fieldConfig.comparisonStringValue" size="mini" placeholder="请输入特定值"/>
                    <city-choose size="mini" check-strictly :show-city="showCity" v-if="topicType === 6" v-model="fieldConfig.comparisonArrayValue"/>
                    <el-select size="mini" v-show="topicType === 2" v-model="fieldConfig.comparisonStringValue" placeholder="请选择特定值">
                        <el-option v-for="option of fieldOptions" :key="option.key" :value="option.key" :label="option.title"/>
                    </el-select>
                    <el-date-picker :type="dateType" v-model="fieldConfig.comparisonStringValue" :value-format="dateValueFormat" size="mini" placeholder="请选择特定值" v-show="topicType === 5"/>
                </div>
            </div>
        </div>
        <div>
            <el-button type="danger" size="mini" @click="$emit('delete-item')">删除</el-button>
        </div>
    </div>
</template>

<script>
    import CityChoose from "../../../../util/city/CityChoose";
    export default {
        name: "MemberSimpleCondition",
        components: {CityChoose},
        props:{
            fieldConfig:{
                type: Object,
                default(){
                    return {
                        id: '',
                        title: '',
                        code: '',
                        expression: '=',
                        comparisonObject: 'me',
                        comparisonStringValue: null,
                        comparisonArrayValue: null,
                        topicType: null,
                        dateType: null
                    }
                }
            },
            fields: {
                type: Array,
                default(){
                    return []
                }
            },
            hiddenComparisonObject:{
                type: Boolean,
                default: false
            }
        },
        computed:{
            code(){
                return this.fieldConfig.code;
            },
            chosenField(){
                if(this.code){
                    for(let field of this.fields){
                        if(field.code === this.code){
                            return field;
                        }
                    }
                }
                return null;
            },
            parameter(){
                if(this.chosenField && this.chosenField.parameter){
                    return JSON.parse(this.chosenField.parameter);
                }else{
                    return {};
                }
            },
            showCity(){
                return this.parameter.cityType === 'city';
            },
            dateType(){
                return this.parameter.dateType || 'date';
            },
            dateValueFormat(){
                return this.dateType === 'date' ? 'yyyy-MM-dd' : 'yyyy';
            },
            topicType(){
                if(this.chosenField){
                    return this.chosenField.topicType;
                }
                return -1;
            },
            fieldOptions(){
                return this.parameter.options || [];
            },
            expressionOptions(){
                if(this.topicType === 5){
                    return [
                        {value: '=', label: '等于'},
                        {value: '<>', label: '不等于'},
                        {value: '<=', label: '小于等于'},
                        {value: '<', label: '小于'},
                        {value: '>=', label: '大于等于'},
                        {value: '>', label: '大于'}
                    ]
                } else{
                    return [
                        {value: '=', label: '等于'},
                        {value: '<>', label: '不等于'}
                    ]
                }
            }
        },
        watch:{
            topicType(val){
                this.fieldConfig.comparisonStringValue = null;
                this.fieldConfig.comparisonArrayValue = null;
                this.fieldConfig.expression = '=';
                this.fieldConfig.topicType = val;
            },
            dateType(val){
                this.fieldConfig.dateType = val;
            }
        },
        created() {
            this.fieldConfig.topicType = this.topicType;
            this.fieldConfig.dateType = this.dateType;
        }
    }
</script>
<style lang="less">
    .member-field-attr-item-setting-panel{
        will-change: height;
        transition: all 1s;
        height: auto;
        background-color: white;
        padding: 4px;
        border-radius: 4px;
    }
</style>

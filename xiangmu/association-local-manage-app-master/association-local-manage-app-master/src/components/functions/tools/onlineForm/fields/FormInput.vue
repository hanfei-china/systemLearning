<template>
    <form-field ref="container" v-model="field.title" @delete="$emit('delete')" :field="field">
        <template>
            <el-form class="custom-el-form set-item-small-margin" size="mini" label-width="110px">
                <el-form-item label="字段必填：">
                    <el-checkbox v-model="field.isRequire">字段必填</el-checkbox>
                </el-form-item>
                <el-form-item label="输入提示：">
                    <el-input v-model="field.typeConfig.placeholder"></el-input>
                </el-form-item>
                <el-form-item label="正则校验：">
                    <el-checkbox v-model="field.typeConfig.isOpenMatch">开启正则校验</el-checkbox>
                </el-form-item>
                <el-form-item label="正则表达式：" v-if="field.typeConfig.isOpenMatch">
                    <el-select v-model="field.typeConfig.matchType">
                        <el-option :value="1" label="中国手机号"></el-option>
                        <el-option :value="2" label="正整数"></el-option>
                        <el-option :value="3" label="邮箱"></el-option>
                        <el-option :value="4" label="金额（小数点后两位）"></el-option>
                        <el-option :value="5" label="自定义"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ID规则：" v-if="field.type === 9">
                    <el-input v-model="field.typeConfig.IDRule" />
                </el-form-item>
                <el-form-item label="自定义表达式：" v-if="field.typeConfig.matchType === 5">
                    <el-input v-model="field.typeConfig.matchString"/>
                </el-form-item>
            </el-form>
        </template>
    </form-field>
</template>

<script>
    import {getMatchString} from "../js/fieldType";
    import FormField from "./FormField";
    export default {
        name: "FormInput",
        components: {FormField},
        props:{
            field:{
                type: Object,
                required: true
            }
        },
        watch:{
            'field.typeConfig.matchType'(val){
                this.field.typeConfig.matchString = getMatchString(val,this.field.typeConfig.matchString);
            }
        }
    }
</script>

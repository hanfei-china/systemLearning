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
                <el-form-item label="时间格式选择：">
                    <el-select v-model="field.typeConfig.type">
                        <el-option value="date" label="日期"></el-option>
                        <el-option value="datetime" label="日期时间"></el-option>
                        <el-option value="time" label="时间"></el-option>
                        <el-option value="year" label="年份"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </template>
    </form-field>
</template>

<script>
    import FormField from "./FormField";
    export default {
        name: "FormDatePicker",
        components: {FormField},
        props:{
            field:{
                type: Object,
                required: true
            }
        }
    }
</script>

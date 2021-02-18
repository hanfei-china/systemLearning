<template>
    <form-field ref="container" v-model="field.title" @delete="$emit('delete')" :field="field">
        <template>
            <el-form class="custom-el-form set-item-small-margin" size="mini" label-width="110px">
                <el-form-item label="字段必填：">
                    <el-checkbox v-model="field.isRequire">字段必填</el-checkbox>
                </el-form-item>
                <el-form-item label="多图上传：">
                    <el-checkbox v-model="field.typeConfig.multiple">开启多图上传</el-checkbox>
                </el-form-item>
                <el-form-item label="上传图片上限：" v-show="field.typeConfig.multiple">
                    <el-input-number v-model="field.typeConfig.max" :max="Infinity" :min="1"/>
                </el-form-item>
            </el-form>
        </template>
    </form-field>
</template>

<script>
    import FormField from "./FormField";
    export default {
        name: "FormImageUpload",
        components: {FormField},
        props:{
            field:{
                type: Object,
                required: true
            }
        }
    }
</script>

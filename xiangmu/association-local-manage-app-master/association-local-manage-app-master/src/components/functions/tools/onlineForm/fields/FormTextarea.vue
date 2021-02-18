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
            </el-form>
        </template>
    </form-field>
</template>

<script>
    import FormField from "./FormField";
    export default {
        name: "FormTextarea",
        components: {FormField},
        props:{
            field:{
                type: Object,
                required: true
            }
        }
    }
</script>

<template>
    <form-field ref="container" v-model="field.title" @delete="$emit('delete')" :field="field">
        <template>
            <el-form class="custom-el-form set-item-small-margin" size="mini" label-width="90px">
                <el-form-item label="展示内容：">
                    <editor v-model="field.typeConfig.content"/>
                </el-form-item>
            </el-form>
        </template>
    </form-field>
</template>

<script>
    import FormField from "./FormField";
    import Editor from "../../../../util/editor/Editor";
    export default {
        name: "FormRichText",
        components: {Editor, FormField},
        props:{
            field:{
                type: Object,
                required: true
            }
        }
    }
</script>

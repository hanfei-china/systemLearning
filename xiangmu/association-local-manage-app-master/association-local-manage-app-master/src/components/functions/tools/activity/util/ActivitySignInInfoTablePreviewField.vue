<template>
    <span @click.stop>
        <span @click.stop v-if="field.topicType === 4 && value" class="flex flex-column flex-center">
            <el-image  class="custom-el-image" :preview-src-list="[value]" ref="preview">
                <template v-slot:error>
                    <el-button size="small" @click.stop="preview" class="unset-padding" type="text">点击查看图片</el-button>
                </template>
            </el-image>
        </span>
        <span v-if="field.topicType !== 4">{{transferData(field, value)}}</span>
    </span>
</template>

<script>
    import {transferData} from "../../../../../js/util/utilFunction";

    export default {
        name: "ActivitySignInInfoTablePreviewField",
        props:{
            field: Object,
            value: [Object,String,Array,Boolean,Number]
        },
        methods:{
            transferData(field, value) {
                return transferData(field, value);
            },
            preview(){
                this.$refs.preview.showViewer = true;
            }
        }
    }
</script>

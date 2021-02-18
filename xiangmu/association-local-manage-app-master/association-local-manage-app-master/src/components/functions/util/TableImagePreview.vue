<template>
    <span v-show="previewList && previewList.length > 0" class="flex flex-column flex-center">
        <el-image class="custom-el-image" :preview-src-list="previewList" :src="previewList[0]" ref="preview">
            <template v-slot:error>
                <el-button size="small" @click.stop="preview" class="unset-padding" type="text">点击查看图片</el-button>
            </template>
        </el-image>
    </span>
</template>

<script>
    export default {
        name: "TableImagePreview",
        props: {
            previewList: {
                type: Array
            }
        },
        mounted() {
            this.$refs.preview.error = true;
        },
        methods:{
            preview(){
                this.$refs.preview.showViewer = true;
            },
        }
    }
</script>

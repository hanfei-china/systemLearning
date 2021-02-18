<template>
    <div class="flex">
        <div class="flex-fill-in-the-remaining-space text-align-center" style="padding-left: 16px;">
            <el-input placeholder="请输入字段名称" size="small" clearable v-model="field.name"/>
        </div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-upload style="margin-left: 6px;" :action="action" :show-file-list="false"
                       :on-success="uploadSuccess">
                <el-button size="small" type="primary">修改课件</el-button>
            </el-upload>
        </div>
        <div class="flex-fill-in-the-remaining-space text-align-center">
            <el-switch v-model="field.free" active-color="#13ce66"></el-switch>
        </div>
        <div style="width: 200px;" class="flex">
            <div>
                <el-tooltip effect="dark" content="删除字段" placement="top">
                    <el-button type="text" class="custom-el-button danger" icon="iconfont icon-delete"
                               @click="deleteField"/>
                </el-tooltip>
            </div>
            <div class="body-sort flex-fill-in-the-remaining-space text-align-center" style="margin-left: 32px">
                <span class="iconfont icon-Icon_drag item-sort"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {requestBaseUrl} from "../../../../../../../js/config/serviceConfig";

    export default {
        name: "SingleChapter",
        props: {
            field: Object,
        },
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
            }
        },
        methods: {
            uploadSuccess(res) {
                this.$emit('change-field', {
                    name: res.data,
                    resource: res.data,
                    free: this.field.free,
                    seq: this.field.seq
                })
            },
            deleteField() {
                this.$emit('delete-field');
            }
        }
    }
</script>

<style scoped>
    .iconfont {
        font-size: 20px;
        color: #65717f;
    }

    .body-sort {
        width: 50px;
    }
</style>

<template>
    <div class="flex activity-sign-info-item" :key="field.code">
        <div class="activity-sign-info-item-title">{{field.name+'：'}}</div>
        <div class="activity-sign-info-item-content flex-fill-in-the-remaining-space">
            <temp-var :value="memberInfo[field.code]" :topicType="field.topicType">
                <template slot-scope="{value,topicType}">
                    <el-image v-if="topicType === 4 && value" class="custom-el-image" :src="value" :preview-src-list="[value]" ref="preview">
                        <template v-slot:error>
                            <el-button size="small" @click="preview" class="unset-padding" type="text">点击查看图片</el-button>
                        </template>
                    </el-image>
                    <span v-if="topicType !== 4">{{transferData(field, value)}}</span>
                </template>
            </temp-var>
        </div>
    </div>
</template>

<script>
    import TempVar from "../../../../util/TempVar";
    import {transferData} from "../../../../../js/util/utilFunction";

    export default {
        name: "ActivitySignInInfoPreviewFiled",
        components: {TempVar},
        props:{
            field: Object,
            memberInfo: Object
        },
        mounted() {
            if(this.$refs.preview){
                this.$refs.preview.error = true;
            }
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
<style lang="less">
    .activity-sign-info-item {
        font-size: 14px;
        color: #333333;
        margin-bottom: 6px;

        .activity-sign-info-item-title {
            width: 100px;
            text-align: right;
            padding-right: 8px;
            color: black;
        }
    }
</style>

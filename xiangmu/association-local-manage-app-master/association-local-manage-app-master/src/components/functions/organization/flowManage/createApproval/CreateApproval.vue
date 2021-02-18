<template>
    <el-container class="absolute-fill-parent">
        <vue-scroll>
            <el-header style="padding-top: 14px;">
                <div style="width: 240px;">
                    <el-input size="small" placeholder="请搜索要发起的审批单"></el-input>
                </div>
            </el-header>
            <el-main style="padding: 0 20px 20px;">
                <div style="line-height: 40px;">审批项目选择({{list.length}})</div>
                <div class="flex flex-wrap">
                    <div style="width: 190px;margin-right: 10px;margin-bottom: 10px;" class="cursor-pointer"
                         v-for="item in list" :key="item.defId" @click="startApprove(item.name)">
                        <el-card shadow="never" :body-style="{ padding: '16px' }" class="btnCard">
                            <div class="flex">
                                <div class="iconWrap" :style="{backgroundColor: item.backgroundColor}">
                                    <span class="iconfont" :class="item.icon"></span>
                                </div>
                                <div style="margin-left: 12px;line-height: 38px;color: #777777;">
                                    {{item.name}}
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
            </el-main>
            <el-dialog title="发起审批" :close-on-click-modal="false" append-to-body width="800px" :visible.sync="approveVisible">
                <approve-form @pushData="pushData" @close="approveVisible = false"></approve-form>
            </el-dialog>
        </vue-scroll>
    </el-container>
</template>

<script>
    import {flowConfig} from "../../../../../js/config/flowConfig";
    import ApproveForm from "./ApproveForm";

    export default {
        name: "CreateApproval",
        components: {ApproveForm},
        data() {
            return {
                list: flowConfig.entities,
                approveVisible: false,
                name: ''
            }
        },
        methods: {
            startApprove(name){
                this.approveVisible = true;
                this.name = name;
            },
            pushData(form){
                let dataObj = {
                    title: form.title,
                    name: this.name,
                    fileUrl: form.fileUrl
                };
                this.$emit("pushData",dataObj);
            }
        }
    }
</script>

<style scoped>
    .btnCard:hover {
        border-color: #409EFF;
    }

    .iconWrap {
        width: 38px;
        height: 38px;
        border-radius: 2px;
        line-height: 34px;
        text-align: center;
        color: #FFFFFF;
        font-size: 24px;
    }
</style>

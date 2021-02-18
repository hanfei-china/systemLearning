<template>
    <div style="height: 100%;" class="position-relative">
        <el-container class="absolute-fill-parent">
            <el-header class="unset-horizontal-padding border-top position-relative">
                <el-menu mode="horizontal" :default-active="panel" @select="panelChange">
                    <el-menu-item index="content">反馈内容</el-menu-item>
                    <el-menu-item index="attachment" v-show="attachment && attachment.length>0">附件</el-menu-item>
                    <el-menu-item index="reply" v-show="feedbackInfo.hasReply">
                        <i :class="{'el-icon-lock':feedbackInfo.opinionReplyInfo.isOpen,'el-icon-unlock':!feedbackInfo.opinionReplyInfo.isOpen}"></i>
                        <span>回复内容</span>
                    </el-menu-item>
                </el-menu>
                <div v-show="!feedbackInfo.hasReply" class="border-top flex flex-column flex-center position-absolute"
                     style="top: 0;right: 16px;bottom: 0;">
                    <div class="text-align-right">
                        <el-button icon="el-icon-s-promotion" type="primary" @click="formVisible = true" size="small" >回复</el-button>
                    </div>
                </div>
            </el-header>
            <el-main class="unset-padding position-relative">
                <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                    <div style="padding: 16px;" v-show="panel==='content'">{{feedbackInfo.opinionInfo.content}} </div>
                    <div style="padding: 16px;" v-if="attachment && attachment.length>0" v-show="panel==='attachment'">
                        <el-image class="feedback-attachment" fit="cover" style="width: 100px; height: 100px" :preview-src-list="attachment" v-for="url in attachment" :key="url" :src="url"/>
                    </div>
                    <div style="padding: 16px;" v-show="panel==='reply'">{{feedbackInfo.opinionReplyInfo.content}} </div>
                </vue-scroll>
            </el-main>
        </el-container>
        <el-dialog title="回复意见反馈" append-to-body width="800px" :visible.sync="formVisible">
            <el-form label-width="120px">
                <el-form-item label="公开设置：" required>
                    <el-checkbox v-model="formInfo.isOpen">公开此反馈及回复</el-checkbox>
                </el-form-item>
                <el-form-item label="回复内容：" required>
                    <el-input type="textarea" resize="none" placeholder="请输入回复内容" :rows="8" v-model="formInfo.content"/>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <el-button icon="el-icon-error" type="danger" size="small" @click="formVisible=false">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="reply">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "FeedbackInfo",
        props:{
            feedbackInfo: Object
        },
        computed:{
            attachment(){
                return this.feedbackInfo.opinionInfo.attachUrl ? JSON.parse(this.feedbackInfo.opinionInfo.attachUrl) : [];
            }
        },
        data(){
            return {
                panel: 'content',

                formVisible: false,
                formInfo:{
                    isOpen: false,
                    content: '',
                    opinionId: this.feedbackInfo.opinionInfo.id
                }
            }
        },
        methods:{
            panelChange(panel){
                this.panel = panel;
            },
            reply(){
                if(!this.formInfo.content){
                    this.$message.warning('请输入回复内容');
                    return;
                }

                this.$request.post('/api/admin/opinion/reply/replyOpinion',this.formInfo).then(()=>{
                    this.$emit('refresh');
                    this.$emit('close');
                    this.$message.success('回复成功');
                })
            }
        }
    }
</script>
<style lang="less">
    .feedback-attachment{
        margin-left: 4px;
        margin-bottom: 4px;
    }
</style>

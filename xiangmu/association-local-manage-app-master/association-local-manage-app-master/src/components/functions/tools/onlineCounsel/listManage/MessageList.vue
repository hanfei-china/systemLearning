<template>
    <div class="absolute-fill-parent">
        <div class="chatRecords">
            <vue-scroll @handle-scroll="loadHistory" ref="vsScrollBottom">
                <div class="flex flex-column-reverse" ref="msgContainer">
                    <div v-for="item in msgList" :key="item.id">
                        <!--右边-->
                        <div v-if="item.messageType === '1'"
                             class="record flex flex-end">
                            <div class="contInfo text-align-right" style="margin-right: 17px;">
                                <p>{{item.name | formatNull}}</p>
                                <p>{{item.createTime | yyyyMMddHHmm}}</p>
                                <pre class="cont rightCont">{{item.content | formatNull}}</pre>
                            </div>
                            <div>
                                <el-avatar v-if="item.headImg" :src="item.headImg"></el-avatar>
                                <el-avatar v-else :src="defaultImg"></el-avatar>
                            </div>
                        </div>
                        <!--左边-->
                        <div v-else class="record flex">
                            <div>
                                <el-avatar v-if="item.headImg" :src="item.headImg"></el-avatar>
                                <el-avatar v-else :src="defaultImg"></el-avatar>
                            </div>
                            <div class="contInfo" style="margin-left: 17px;">
                                <p>{{item.name | formatNull}}</p>
                                <p>{{item.createTime | yyyyMMddHHmm}}</p>
                                <pre class="cont leftCont">{{item.content | formatNull}}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </vue-scroll>
        </div>
        <div class="chatInput position-absolute">
                        <textarea rows="3" class="chatMsg" placeholder="请在这里输入咨询内容(500字以内)" v-model="content"
                                  maxlength="500" @keydown.ctrl.enter="sendMsg"></textarea>
            <el-button size="small" type="primary" @click="sendMsg" class="send-btn" :disabled="ifSend">发送 | Ctrl+Enter
            </el-button>
        </div>
    </div>
</template>

<script>
    import {addListener, removeListener} from 'resize-detector';
    export default {
        name: "MessageList",
        props: ["checkedUserInfo"],
        data(){
            return {
                defaultImg: require('../../../../../assets/default.jpg'),
                msgLimit: 20,//查询条数
                msgOffset: 0,//偏移量
                msgTotal: 0,
                msgList: [],//信息列表
                userInfo: {},//用户信息
                msgContainerHeight: 0,
                content: '',//发送的消息
                ifSend: false,//发送按钮是否禁用
            }
        },
        watch: {
            checkedUserInfo(val){
                this.userInfo = val;
                this.getQuestionsById(true);
            },
            content(val) {
                if (val === '') {
                    this.ifSend = true;
                } else {
                    this.ifSend = false;
                }
            },
        },
        created() {
            if (this.content === '') {
                this.ifSend = true;
            }
        },
        mounted(){
            addListener(this.$refs.msgContainer,this.msgContainerResize);
        },
        beforeDestroy(){
            removeListener(this.$refs.msgContainer,this.msgContainerResize);
        },
        filters: {
            formatNull(val) {
                if (val) {
                    return val;
                } else {
                    return '-'
                }
            }
        },
        methods: {
            msgContainerResize(){
                let height = this.$refs.msgContainer.clientHeight;
                if(this.msgContainerHeight > 0){
                    this.$refs.vsScrollBottom.scrollTo({
                        y: height - this.msgContainerHeight
                    },0);
                }
            },
            //聊天记录--滚动条处于最底部
            scrollToBottom() {
                this.$nextTick(() => {
                    this.$refs.vsScrollBottom.scrollTo(
                        {
                            y: '100%'
                        },
                        0
                    );
                })
            },
            //获取消息列表
            getQuestionsById(scrollToBottomVal) {
                this.msgTotal = 0;
                this.msgList = [];
                this.msgLimit = 20;
                this.msgOffset = 0;
                this.$request.get('/api/admin/counsel/message/getCounselMessages', {
                    params: {
                        firstMessageId: this.userInfo.firstMessageId,
                        limit: this.msgLimit,
                        offset: this.msgOffset
                    }
                }).then(res => {
                    if (res.success) {
                        this.msgList = this.msgList.concat(res.data.list);
                        this.msgTotal = res.data.total;
                        if(scrollToBottomVal){
                            this.msgContainerHeight = 0;
                            this.scrollToBottom();
                        }
                    }
                })
            },
            //消息回复
            sendMsg() {
                this.$request.post('/api/admin/counsel/message/addCounselMessage', {
                    content: this.content,
                    firstMessageId: this.userInfo.firstMessageId
                }).then(res => {
                    if (res.success) {
                        this.content = '';
                        this.getQuestionsById(true);
                    }
                })
            },
            //加载消息记录
            loadHistory(vertical) {
                let {scrollTop} = vertical;
                if (this.msgLimit + this.msgOffset < this.msgTotal && scrollTop < 10) {
                    this.msgOffset += this.msgLimit;
                    this.msgContainerHeight = this.$refs.msgContainer.clientHeight;

                    this.$request.get('/api/admin/counsel/message/getCounselMessages', {
                        params: {
                            firstMessageId: this.userInfo.firstMessageId,
                            limit: this.msgLimit,
                            offset: this.msgOffset
                        }
                    }).then(res => {
                        if (res.success) {
                            this.msgList = this.msgList.concat(res.data.list);
                            this.msgTotal = res.data.total;
                        }
                    })
                }
            }

        }
    }
</script>
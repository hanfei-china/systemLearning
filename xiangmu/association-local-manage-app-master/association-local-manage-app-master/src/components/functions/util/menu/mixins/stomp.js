import { stompURL } from '../../../../../js/config/serviceConfig'
export default {
    data() {
        return {
            sendUrl: ''
        }
    },
    mounted() {
        if (window.stomp) {
            window.stomp.disconnect()
        }
    },
    methods: {
        stompInit() {
            // const stompURL = 'https://apidebug.huiyixing.com/association-api-yunchuan';
            let self = this;
            //   let stomp = new Socket(stompURL + '/stomp', '10000', '10000', this.user.userId);
            let stomp = new Socket(stompURL + '/stomp', '10000', '10000');
            window.stomp = stomp;
            //   stomp.on('/topic/' + this.user.userId, function(message) {
            // console.log(this.cookieID.userId)
            stomp.on('/topic/messageNumNotice', function(message) {
                self.getChatNum(message);
            });
            stomp.onClose(function(e) {
                console.log('断线了');
                self.closeSocket(); //关闭连接，打开遮罩层
            });
            stomp.onOpen(function(e) {
                console.log('建立连接');
                self.connectSocket();
            });
        },
        getChat(data) {},
        closeSocket() {},
        connectSocket() {}
    },
    beforeDestroy() {
        //组件销毁前把webSocket连接断开
        window.stomp.disconnect();
        this.$request.put("/api/message/updateUserOnlineStatus", { status: 0 }).then(res => {
            console.log(res);
        });
    },

};
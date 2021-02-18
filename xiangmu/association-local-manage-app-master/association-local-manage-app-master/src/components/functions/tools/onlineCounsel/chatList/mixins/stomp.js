import { stompURL } from "../../../../../../js/config/serviceConfig";
export default {
    data() {
        return {
            cookieID: '',
            stomp: null
        }
    },
    mounted() {
        if (window.stompO) {
            console.log('清楚之前的连接')
            window.stompO.disconnect()
        }
        this.stompInit();
    },
    methods: {
        stompInit() {
            let self = this;
            let stomp = new Socket(stompURL + '/stomp', '10000', '10000');
            window.stompO = stomp;
            //   stomp.on('/topic/' + this.user.userId, function(message) {
            stomp.on('/topic/messageNotice', function(message) {
                self.updateInfo(message);
            });

            //对于聊天列表来说，直接建立webSocket连接即可，不需要其他的动作，所以下面的api可以直接省去不使用

            stomp.onClose(function(e) {
                console.log("断线了");
                // self.closeSocket();
            });
            stomp.onOpen(function(e) {
                self.connectSocket();
            });
        },
        updateInfo(data) {},
        closeSocket() {},
        connectSocket() {}
    },
    beforeDestroy() {
        //组件销毁前把webSocket连接断开
        if (window.stompO) {
            console.log("断开连接");
            window.stompO.disconnect();
        }
    }
};
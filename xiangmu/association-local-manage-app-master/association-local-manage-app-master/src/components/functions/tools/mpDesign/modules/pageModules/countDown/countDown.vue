<template>
    <div style="background-color: #FFFFFF;">
        <function-title :title="title" :color="titleColor" :icon="titleIcon" style="padding: 8px 16px;"
                        :icon-position="titleIconPosition" v-if="isShowTitle"/>
        <div class="container" style="text-align: center;font-size: 30px;box-sizing: border-box;width: 375px;" :style=backgroundStyle>
            <p v-if="Date.parse(endDay) < Date.parse(new Date())">
                已结束
            </p>
            <p v-else>
                <span v-if="timingStyle === 'day'">{{day}}天</span>
                <span v-if="timingStyle === 'hour'">{{day}}天 {{hr}}:00:00</span>
                <span v-if="timingStyle === 'minute'">{{day}}天 {{hr}}:{{min}}:00</span>
                <span v-if="timingStyle === 'second'">{{day}}天 {{hr}}:{{min}}:{{sec}}</span>
            </p>
        </div>
    </div>
</template>

<script>
    import FunctionTitle from "../../../common/FunctionTitle";

    export default {
        name: "countDown",
        components: {FunctionTitle},
        props: {
            module: Object
        },
        data() {
            return {
                day: 0,//天
                hr: 0,//时
                min: 0,//分
                sec: 0,//秒
            }
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
            isShowTitle() {
                return this.attributes.isShowTitle.value;
            },
            title() {
                return this.attributes.title.value;
            },
            titleColor() {
                return this.attributes.titleColor.value;
            },
            titleIcon() {
                return this.attributes.titleIcon.value;
            },
            titleIconPosition() {
                return this.attributes.titleIconPosition.value;
            },
            endDay() {
                return this.attributes.endDay.value;
                // var newData = Date.parse(new Date());
                // var endData = Date.parse();
                // let diffTime = null;
                // if (endData > newData) {
                //     diffTime = Math.abs(endData - newData);
                // }
                // if (diffTime && this.timingStyle === 'day') {      //按天显示
                //     let dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000));
                //     return "倒计时" + dayNum + "天";
                // } else if (diffTime && this.timingStyle === 'hour') {      //按小时显示
                //     let hourNum = Math.floor(diffTime / (60 * 60 * 1000));
                //     return "倒计时" + hourNum + "小时";
                // } else if (diffTime && this.timingStyle === 'minute') {      //按分钟显示
                //     let minuteNum = Math.floor(diffTime / (60 * 1000));
                //     return "倒计时" + minuteNum + "分钟";
                // } else if (diffTime && this.timingStyle === 'second') {      //按秒显示
                //     let secondNum = Math.floor(diffTime / 1000);
                //     return "倒计时" + secondNum + "秒";
                // }else {
                //     return '倒计时已结束'
                // }
            },
            timingStyle() {
                return this.attributes.timingStyle.value;
            },
            timeColor(){
                return this.attributes.timeColor.value;
            },
            timeFont(){
                return this.attributes.timeFont.value;
            },
            backgroundSrc(){
                return this.attributes.backgroundSrc.value;
            },
            height(){
                return this.attributes.height.value;
            },
            paddingTop(){
                return this.attributes.paddingTop.value;
            },
            backgroundStyle(){
                let style = {};
                style.backgroundImage = `url(${this.backgroundSrc})`;
                style.height = `${this.height}px`;
                style.paddingTop = `${this.paddingTop}px`;
                style.color = this.timeColor;
                style.fontSize = `${this.timeFont}px`;
                return style;
            }
        },
        mounted(){
            this.countdown()
        },
        methods: {
            //倒计时
            countdown() {
                const end = Date.parse(new Date(this.endDay));
                const now = Date.parse(new Date());
                const msec = end - now;
                let day = parseInt(msec / 1000 / 60 / 60 / 24);
                let hr = parseInt(msec / 1000 / 60 / 60 % 24);
                let min = parseInt(msec / 1000 / 60 % 60);
                let sec = parseInt(msec / 1000 % 60);
                this.day = day;
                if(this.timingStyle == "day"){
                    this.day = Math.ceil(msec / 1000 / 60 / 60 / 24)
                }
                this.hr = hr > 9 ? hr : '0' + hr;
                this.min = min > 9 ? min : '0' + min;
                this.sec = sec > 9 ? sec : '0' + sec;
                const that = this;
                this._interval = setTimeout(function () {
                    that.countdown()
                }, 1000)
            },
        },
        beforeDestroy() {
            clearInterval(this._interval)
        },
    }
</script>

<style scoped lang="less">
    .container{
        background-position: left center;
        background-size: cover;
        background-repeat: no-repeat;
    }
</style>

<template>
    <div :style="style" class="website-pro-container website-pro-module-container website-pro-great-events" :class="customClasses" style="overflow: hidden;">
        <div class="website-pro-great-events-content-list" :class="dragClass" ref="contentList" :style="{marginLeft:marginLeft+'px'}">
            <a draggable="false" v-for="content of contentList" :class="dragClass" class="website-pro-great-events-content-container" :key="content.contentId" :href="itemHref(content)" :target="itemTarget">
                <div class="website-pro-great-events-content-time" :class="dragClass">{{content.publishTime | yyyyMMdd}}</div>
                <div class="website-pro-great-events-content-poster" :class="dragClass">
                    <img draggable="false" :src="content.poster" :class="dragClass">
                </div>
                <div class="website-pro-great-events-content-abstract" :class="dragClass">{{content.contentAbstract}}</div>
            </a>
        </div>
        <div class="website-pro-great-events-time-list" :class="dragClass">
            <div ref="timeLine" class="website-pro-great-events-time-list-background" :class="dragClass">
                <div class="website-pro-great-events-time-list-item" v-for="(time,index) of times" :key="index" :class="dragClass">
                    <div class="website-pro-great-events-time-list-title" :class="dragClass">
                        {{time.time}}
                    </div>
                    <div class="website-pro-great-events-time-list-title right" v-show="time.lastTime" :class="dragClass">
                        {{time.lastTime}}
                    </div>
                </div>
                <div :style="{left:left+'px'}" class="website-pro-great-events-time-list-slider" :class="dragClass" @mousedown.stop="elementDown"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {formatDate} from "../../../../../../../../js/util/utilFunction";
    import {addEvent,removeEvent} from "../../../../js/util/dom";
    import {articleClick} from "../../../../js/util/util";

    export default {
        name: "WsGreatEvents",
        props: {
            module: Object,
            design: Boolean
        },
        data() {
            return {
                marginLeft: 0,
                left: 0,
                mouseClickPosition : { mouseX: 0,left:0},
                timeLineWidth: 0,
                containerWidth: 0,
                contentList:[]
            }
        },
        computed:{
            dragClass(){
                if(this.design){
                    return 'lrd-dom-drag';
                }

                return '';
            },
            customClasses(){
                return this.module.attributes.otherGroup.attributes.customClasses.value;
            },
            times(){
                if(this.contentList.length < 1){
                    return [];
                }

                let array = [];
                this.contentList.map(content=>{
                    let time = this.getFormatYear(content.publishTime);
                    array.push({
                        time,
                        id:time
                    });
                });
                let length = array.length;
                let minWidth = 60;
                let maxCount = this.timeLineWidth / minWidth;

                let result = [];
                let firstYear = array[0].time;
                let lastYear = array[length-1].time;
                if(maxCount >= length){
                    for(let index=0;index < length-2;index ++){
                        result.push(array[index]);
                    }
                    result = array;
                }else{
                    if(maxCount * 5 >= length){
                        let count = Math.ceil(length /5);
                        //按五年为一个分割进行显示
                        let lastChar = firstYear.charAt(firstYear.length - 1);
                        let lastCharNumber = parseInt(lastChar);
                        if(lastCharNumber >= 0 && lastCharNumber < 5){
                            //从***0-***4年开始的
                            let firstStart = firstYear.substring(0,firstYear.length-1);
                            let first = firstStart + 0;
                            let firstNumber = parseInt(first);

                            result.push({
                                time: firstYear,
                                id: firstYear,
                            });

                            for(let index=1;index < count-2;index ++){
                                let time = firstNumber + (index * 5);
                                result.push({
                                    time: time+'',
                                    id: time,
                                });
                            }
                        }else{
                            let firstStart = firstYear.substring(0,firstYear.length-1);
                            let first = firstStart + 5;
                            let firstNumber = parseInt(first);

                            result.push({
                                time: firstYear,
                                id: firstYear,
                            });

                            for(let index=1;index < count-2;index ++){
                                let time = firstNumber + (index * 5);
                                result.push({
                                    time: time+'',
                                    id: time,
                                });
                            }
                        }
                    }else{
                        let count = Math.ceil(length /10);
                        //按十年为一个分割进行显示
                        let lastChar = firstYear.charAt(firstYear.length - 1);
                        let lastCharNumber = parseInt(lastChar);
                        if(lastCharNumber > 0){
                            //从***0-***4年开始的
                            let firstStart = firstYear.substring(0,firstYear.length-1);
                            let first = firstStart + 0;
                            let firstNumber = parseInt(first);

                            result.push({
                                time: firstYear,
                                id: firstYear,
                            })

                            for(let index=1;index < count-2;index ++){
                                let time = firstNumber + (index * 10);
                                result.push({
                                    time: time+'',
                                    id: time,
                                })
                            }
                        }else{
                            let firstNumber = parseInt(firstYear);
                            for(let index=0;index < count-2;index ++){
                                let time = firstNumber + (index * 10);
                                result.push({
                                    time: time+'',
                                    id: time,
                                })
                            }
                        }
                    }
                }

                result[result.length - 1].lastTime = lastYear;

                return result;
            },
            contentWidth(){
                return (this.contentList.length + 1) *210;
            },
            style(){
                let style = {
                    borderTopLeftRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.leftTop + 'px',
                    borderBottomLeftRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.leftBottom + 'px',
                    borderTopRightRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.rightTop + 'px',
                    borderBottomRightRadius: this.module.attributes.styleGroup.attributes.borderRadius.value.rightBottom + 'px',

                    borderTopColor: this.module.attributes.styleGroup.attributes.border.value.top.borderColor,
                    borderTopStyle: this.module.attributes.styleGroup.attributes.border.value.top.borderStyle,
                    borderTopWidth: this.module.attributes.styleGroup.attributes.border.value.top.borderWidth + 'px',

                    borderBottomColor: this.module.attributes.styleGroup.attributes.border.value.bottom.borderColor,
                    borderBottomStyle: this.module.attributes.styleGroup.attributes.border.value.bottom.borderStyle,
                    borderBottomWidth: this.module.attributes.styleGroup.attributes.border.value.bottom.borderWidth + 'px',

                    borderLeftColor: this.module.attributes.styleGroup.attributes.border.value.left.borderColor,
                    borderLeftStyle: this.module.attributes.styleGroup.attributes.border.value.left.borderStyle,
                    borderLeftWidth: this.module.attributes.styleGroup.attributes.border.value.left.borderWidth + 'px',

                    borderRightColor: this.module.attributes.styleGroup.attributes.border.value.right.borderColor,
                    borderRightStyle: this.module.attributes.styleGroup.attributes.border.value.right.borderStyle,
                    borderRightWidth: this.module.attributes.styleGroup.attributes.border.value.right.borderWidth + 'px',

                    boxShadow: this.boxShadow
                };

                let {backgroundImage,backgroundColor,
                    backgroundPositionX,backgroundPositionY,backgroundSize,
                    backgroundRepeatX,backgroundRepeatY} = this.module.attributes.styleGroup.attributes.background.value;

                if(backgroundImage){
                    style.backgroundImage = `url(${backgroundImage})`;
                }

                if(backgroundColor){
                    style.backgroundColor = backgroundColor;
                }

                if(backgroundPositionX){
                    style.backgroundPositionX = backgroundPositionX;
                }

                if(backgroundPositionY){
                    style.backgroundPositionY = backgroundPositionY;
                }

                if(backgroundSize){
                    style.backgroundSize = backgroundSize;
                }

                if(backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat';
                }

                if(backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-x';
                }

                if(!backgroundRepeatX && backgroundRepeatY){
                    style.backgroundRepeat = 'repeat-y';
                }

                if(!backgroundRepeatX && !backgroundRepeatY){
                    style.backgroundRepeat = 'no-repeat';
                }

                if(!this.design){
                    style.height = this.module.attributes.layoutGroup.attributes.layout.value.height + 'px';
                    style.left = 0;
                    style.right = 0;
                    style.top = this.module.attributes.layoutGroup.attributes.layout.value.top + 'px';
                    style.zIndex = this.module.attributes.layoutGroup.attributes.layout.value.zIndex;
                    style.position = 'absolute';
                }

                return style;
            },
            classId(){
                return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.classId;
            },
            labelId(){
                return this.module.attributes.dataSrcGroup.attributes.dataSrc.value.labelId;
            },
            pageSize(){
                return this.module.attributes.viewGroup.attributes.page.value.pageSize;
            },
            itemTarget(){
                if(this.design){
                    return '_self';
                }
                return this.module.attributes.linkGroup.attributes.itemClickConfig.value.target;
            },
        },
        methods:{
            itemHref(content){
                return articleClick(this.$router,this.module.attributes.linkGroup.attributes.itemClickConfig.value,content,this.design);
            },
            endWith(srcStr, checkStr){
                if(!srcStr || !checkStr){
                    return false;
                }

                let d= srcStr.length-checkStr.length;
                return ( d>=0 && this.lastIndexOf(checkStr)===d);
            },
            getFormatYear(date) {
                return formatDate(new Date(date), 'yyyy');
            },
            elementDown(e){
                this.mouseClickPosition.mouseX = e.pageX;
                this.mouseClickPosition.left = this.left;
                addEvent(document.documentElement, 'mousemove', this.move);
                addEvent(document.documentElement, 'mouseup', this.handleUp)
            },
            move(e){
                let mouseClickPosition = this.mouseClickPosition;
                let tmpDeltaX = e.pageX - mouseClickPosition.mouseX;
                this.mouseClickPosition.mouseX = e.pageX;
                if(this.left + tmpDeltaX < 0){
                    this.left = 0;
                } else if(this.left + tmpDeltaX > this.timeLineWidth - 18){
                    this.left = this.timeLineWidth - 18;
                }  else{
                    this.left += tmpDeltaX;
                }

            },
            handleUp () {
                removeEvent(document.documentElement, 'mousemove', this.move);
            },
            setWidth(){
                if(this.$refs.timeLine){
                    this.timeLineWidth = this.$refs.timeLine.clientWidth;
                }

                if(this.$refs.contentList){
                    this.containerWidth = this.$refs.contentList.clientWidth;
                }
            },
            getData() {
                if (this.classId) {
                    let params = {
                        classId: this.classId,
                        labelId: this.labelId,
                        limit: this.pageSize,
                        offset: 0,
                        asc: true
                    };
                    this.$request.get('/api/common/content/anon/list',{params}).then((resp)=>{
                        let {data} = resp;
                        this.contentList = data.list;
                    });
                }
            },
        },
        mounted() {
            this.timeLineWidth = this.$refs.timeLine.clientWidth;
            this.containerWidth = this.$refs.contentList.clientWidth;
            addEvent(window,'resize',this.setWidth);
            this.getData();
        },
        watch:{
            left(val){
                let per = val/this.timeLineWidth;

                let marginLeft = per * (this.contentWidth-this.containerWidth);
                if(marginLeft <= 6){
                    marginLeft = 0;
                }

                this.marginLeft = -marginLeft;
            },
            classId() {
                this.getData();
            },
            labelId() {
                this.getData();
            },
            pageSize() {
                this.getData();
            }
        }
    }
</script>

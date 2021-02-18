<template>
    <div class="flex scroll-container" ref="container">
        <div>
            <slot name="prefixArea"/>
        </div>
        <div class="scroll-container-arrow right-arrow" :style="arrowStyle" v-show="showArrow" @click="arrow('left')">
            <slot name="leftArrow">
                <i class="el-icon-arrow-left scroll-container-arrow-default-icon"/>
            </slot>
        </div>
        <div class="flex-fill-in-the-remaining-space scroll-container-content position-relative" style="overflow: hidden;" ref="content">
            <div class="flex position-relative scroll-container-content-real-content" ref="realContent">
                <slot/>
            </div>
        </div>
        <div class="scroll-container-arrow right-arrow" :style="arrowStyle"  v-show="showArrow" @click="arrow('right')">
            <slot name="rightArrow">
                <i class="el-icon-arrow-right scroll-container-arrow-default-icon"/>
            </slot>
        </div>
        <div>
            <slot name="suffixArea"/>
        </div>
    </div>
</template>

<script>
    import {addListener, removeListener} from 'resize-detector';
    export default {
        name: "ScrollContainer",
        data(){
            return {
                contentClientWidth: 100,
                realContentClientWidth: 100
            }
        },
        props:{
            arrowBackground: String,
            arrowColor: String
        },
        computed:{
            showArrow(){
                return this.realContentClientWidth > this.contentClientWidth;
            },
            arrowStyle(){
                let style = {};
                if(this.arrowBackground){
                    style.backgroundColor = this.arrowBackground;
                }
                if(this.arrowColor){
                    style.color = this.arrowColor;
                }
                return style;
            }
        },
        mounted() {
            addListener(this.$refs.content,this.resize);
        },
        updated(){
            this.resize();
        },
        beforeDestroy(){
            removeListener(this.$refs.content,this.resize);
        },
        methods:{
            resize(){
                this.contentClientWidth = this.$refs.content.clientWidth;
                this.realContentClientWidth = this.$refs.realContent.scrollWidth;
            },
            arrow(direction){
                let children = this.$refs.realContent.querySelectorAll('.scroll-container-item');
                let left = this.$refs.realContent.style.left.replace('px','') || 0;
                left = parseInt(left);
                let absLeft = Math.abs(left);

                let contentClientWidth = this.$refs.content.clientWidth;
                let realContentClientWidth = this.$refs.realContent.scrollWidth;
                let nowContentWidth = absLeft + contentClientWidth ;

                if(direction === 'left'){
                    if(left === 0){
                        return;
                    }

                    let length = children.length;

                    for(let index = length-1; index >= 0; index--){
                        let child = children[index];
                        let elemWidth = child.clientWidth;
                        let elemLeft =  child.offsetLeft;
                        let elemRight = elemWidth + elemLeft;

                        if(absLeft> elemLeft && absLeft < elemRight || elemRight <= absLeft){
                            //元素部分在左侧被遮挡 或者 全部在左侧被遮挡
                            left = -elemLeft;
                            break;
                        }
                    }
                }

                if(direction === 'right'){
                    if(contentClientWidth + absLeft === realContentClientWidth){
                        return;
                    }

                    for(let child of children){
                        let elemWidth = child.clientWidth;
                        let elemLeft =  child.offsetLeft;
                        let elemRight = elemWidth + elemLeft;

                        if(elemRight > nowContentWidth){
                            // 元素在右侧 右侧被遮挡
                            left += (nowContentWidth - elemRight);
                            break;
                        }

                    }
                }

                if(left > 0){
                    left = 0;
                }
                this.$refs.realContent.style.left = left + 'px';


            },
            childScroll(elem){
                let left = this.$refs.realContent.style.left.replace('px','') || 0;
                left = parseInt(left);
                let contentClientWidth = this.$refs.content.clientWidth;

                let elemWidth = elem.clientWidth;
                let elemLeft =  elem.offsetLeft;
                let elemRight = elemWidth + elemLeft;

                let absLeft = Math.abs(left);
                let nowContentWidth = absLeft + contentClientWidth ;


                if(absLeft> elemLeft && absLeft < elemRight || elemRight <= absLeft){
                    //元素部分在左侧被遮挡 或者 全部在左侧被遮挡
                    left = -elemLeft;
                }

                if(elemLeft > absLeft && elemRight < contentClientWidth){
                    //元素刚好在可显示区域 不做修改
                    return;
                }

                if(elemRight > nowContentWidth){
                    // 元素在右侧 右侧被遮挡
                    left += (nowContentWidth - elemRight);
                }

                if(left>0){
                    left = 0;
                }


                this.$refs.realContent.style.left = left + 'px';
            }
        },
        watch:{
            showArrow(val){
                if(!val){
                    this.$refs.realContent.style.left = 0;
                }
            }
        }
    }
</script>

<template>
    <div class="flex scroll-tab-container" :class="{bold}" ref="container">
        <div class="scroll-tab-arrow right-arrow" v-show="showArrow" @click="arrow('left')">
            <slot name="leftArrow">
                <i class="el-icon-arrow-left scroll-tab-arrow-default-icon"></i>
            </slot>
        </div>
        <div class="flex-fill-in-the-remaining-space scroll-tab-content position-relative" style="overflow: hidden;" ref="content">
            <div class="flex position-relative scroll-tab-content-real-content" ref="realContent">
                <slot></slot>
            </div>
        </div>
        <div class="scroll-tab-arrow right-arrow" v-show="showArrow" @click="arrow('right')">
            <slot name="rightArrow">
                <i class="el-icon-arrow-right scroll-tab-arrow-default-icon"></i>
            </slot>
        </div>
        <div>
            <slot name="handle"></slot>
        </div>
    </div>
</template>

<script>
    import {addListener, removeListener} from 'resize-detector';
    export default {
        name: "ScrollTab",
        props:{
            bold:{
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                contentClientWidth: 100,
                realContentClientWidth: 100
            }
        },
        computed:{
            showArrow(){
                return this.realContentClientWidth > this.contentClientWidth;
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
                let left = this.$refs.realContent.style.left.replace('px','') || 0;
                left = parseInt(left);
                if(direction === 'left'){
                    let scroll = left + 60;
                    let maxScroll = 0;
                    if(scroll > maxScroll){
                        scroll = maxScroll;
                    }
                    this.$refs.realContent.style.left = scroll + 'px';
                }
                if(direction === 'right'){
                    let scroll = left - 60;
                    let minScroll = this.contentClientWidth - this.realContentClientWidth;
                    if(scroll < minScroll){
                        scroll = minScroll;
                    }
                    this.$refs.realContent.style.left = scroll + 'px';
                }
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

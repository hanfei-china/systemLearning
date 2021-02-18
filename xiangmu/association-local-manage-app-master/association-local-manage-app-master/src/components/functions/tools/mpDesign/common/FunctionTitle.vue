<template>
    <div class="function-title">
        <span class="function-title-icon left" style="padding-right: 5px;" v-if="icon && icon != '' && iconPosition == 'left'">
            <img :src="icon"/>
        </span>
        <span :style="titleColor" class="function-title-label">{{title}}</span>
        <span class="function-title-icon right"  style="padding-left: 5px;" v-if="icon && icon != '' && iconPosition == 'right'">
            <img :src="icon"/>
        </span>
        <span class="function-more" v-if="hasMore">更多&nbsp;></span>
    </div>
</template>

<script>

    export default {
        name: "FunctionTitle",
        props: {
            title: {
                type: String,
                default() {
                    return '功能标题';
                }
            },
            color: {
                type: String,
                default() {
                    return '#FE4B6F';
                }
            },
            hasMore: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            icon: {
                type: String,
                default: ''
            },
            iconPosition: {
                type: String,
                default: 'left'
            }
        },
        computed: {
            titleColor() {
                return {
                    color: this.color
                }
            },
        }
    }
</script>

<style scoped>
    .function-title {
        display: flex;
        padding-bottom: 10px;
    }

    .function-title-label {
        font-size: 16px;
        align-self: flex-end;
    }

    .function-title-icon img {
        height: 22px;
        display: block;
    }

    .function-more {
        flex: 1;
        text-align: right;
        font-size: 14px;
        align-self: flex-end;
        padding-bottom: 4px;
    }
</style>

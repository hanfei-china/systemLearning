<template>
    <div class="trend-wrapper">
        <div class="trend-avatar-nickname-time">
            <div class="trend-avatar" :style="trendAvatarStyle"></div>
            <div class="trend-nickname-time">
                <div class="trend-nickname">{{trend.nickname}}</div>
                <div class="trend-time">{{trend.createTime}}</div>
            </div>
        </div>
        <div class="trend-content" v-if="trend.content && trend.content !== ''">
            {{trend.content}}
        </div>
        <div class="other-content" v-if="otherContent">
            <image-list-content v-if="otherContent.type === 1" :config="otherContent.config"></image-list-content>
        </div>
        <div class="trend-address" v-if="trend.address && trend.address !== ''">
            {{trend.address}}
        </div>
    </div>
</template>

<script>
    import imageListContent from './imageListContent';

    export default {
        name: "alumniClubsTrend",
        components: {
            imageListContent
        },
        props: {
            trend: {
                type: Object,
                default() {
                    return null;
                }
            }
        },
        computed: {
            trendAvatarStyle() {
                return {
                    backgroundImage: 'url("' + this.trend.avatar + '")'
                }
            },
            otherContent() {
                if (this.trend.otherContent) {
                    return JSON.parse(this.trend.otherContent);
                } else {
                    return null;
                }
            }
        }
    }
</script>

<style scoped>
    .trend-wrapper {
        padding: 16px;
        background-color: #FFFFFF;
    }

    .trend-avatar-nickname-time {
        display: flex;
    }

    .trend-avatar {
        width: 46px;
        height: 46px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 50%;
    }

    .trend-nickname-time {
        flex: 1;
        padding-left: 8px;
    }

    .trend-nickname {
        font-size: 18px;
        color: #333333;
        letter-spacing: 0;
    }

    .trend-time {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
    }

    .trend-content {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        padding: 16px 0;
    }

    .trend-address {
        padding-top: 16px;
        font-size: 12px;
        color: #565A9F;
        letter-spacing: 0;
    }

</style>

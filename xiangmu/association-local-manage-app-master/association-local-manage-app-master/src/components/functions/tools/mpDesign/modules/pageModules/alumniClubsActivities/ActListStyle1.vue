<template>
    <div class="activities-wrapper background-color-white">
        <div style="height:239px;overflow: hidden;">
            <div :style="scrollStyle">
                <div class="scroll-area" :style="containerStyle">
                    <div class="activity-wrapper" v-for="activity in activities" :key="activity.id">
                        <div class="activity-poster" :style="posterStyle(activity.poster)"></div>
                        <div class="active-title-time">
                            <div class="active-title">{{activity.title}}</div>
                            <div class="active-time">{{activity.startTime}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ActListStyle1",
        props: {
            activities: Array
        },
        methods: {
            posterStyle(poster) {
                return {
                    backgroundImage: 'url("' + poster + '")'
                }
            },
        },
        computed: {
            containerStyle() {
                return {
                    width: (this.activities.length * (167 + 8) - 8) + 'px'
                }
            },
            scrollStyle() {
                return {
                    height: '259px',
                    overflow: 'auto'
                }
            }
        },
    }
</script>

<style scoped>
    .activities-wrapper {
        padding: 0 17px 10px 17px;
    }

    .scroll-area {
        height: 239px;
        position: relative;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .activity-wrapper {
        background: #FFFFFF;
        box-shadow: 0 3px 4px 0 rgba(130, 130, 130, 0.38);
        border-radius: 8px;
        width: 167px;
        overflow: hidden;
        display: inline-block;
    }

    .activity-wrapper:not(:last-child) {
        margin-right: 8px;
    }

    .activity-poster {
        width: 167px;
        height: 146px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

    .active-title-time {
        padding: 16px 8px 10px 8px;
    }

    .active-title {
        font-size: 14px;
        color: #505050;
        letter-spacing: 0;
        height: 40px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .active-time {
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
        padding-top: 7px;
    }

</style>

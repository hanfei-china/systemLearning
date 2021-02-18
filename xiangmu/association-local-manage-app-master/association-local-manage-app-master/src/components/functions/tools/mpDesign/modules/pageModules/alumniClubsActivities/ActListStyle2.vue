<template>
    <div class="activities-wrapper background-color-white">
        <div style="background-color: #ffffff;">
            <div v-for="activity of activities" class="act-list-style-item" :key="activity.id">
                <div class="act-list-style-item-poster" style="height: 146px;"
                     :style="posterStyle(activity.poster)"></div>
                <div class="flex" style="font-size: 14px;padding-top: 12px;">
                    <div class="flex-fill-in-the-remaining-space">{{activity.title}}</div>
                    <div class="act-list-style-item-status" style="font-size: 12px;">未开始</div>
                </div>
                <div class="flex" style="font-size: 12px;padding-top: 6px;">
                    <div class="flex-fill-in-the-remaining-space"><i class="el-icon-time"></i>{{activity.startTime}}
                    </div>
                    <div class="flex-fill-in-the-remaining-space"><i class="el-icon-location"></i>{{activity.address}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ActListStyle2",
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
    }
</script>
<style scoped>
    .activities-wrapper {
        padding: 15px 17px 0 17px;
    }

    .act-list-style-item-poster {
        height: 146px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 8px;
    }

    .act-list-style-item-status {
        background-color: rgb(201, 201, 201);
        color: #FFFFFF;
        padding: 2px 6px;
        border-radius: 10px;
        line-height: 17px;
    }

    .act-list-style-item:not(:last-child) {
        margin-bottom: 16px;
    }
</style>

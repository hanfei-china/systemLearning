<template>
    <div>
        <div v-for="activity of activities" class="act-list-style-item flex" :key="activity.id">
            <div class="act-list-style-item-poster" :style="posterStyle(activity.poster)"></div>
            <div class="act-main position-relative flex-fill-in-the-remaining-space flex flex-column flex-center">
                <div class="act-title">{{activity.title}}</div>
                <div>{{activity.startTime}}</div>
                <div class="text-overflow">{{activity.address}}</div>
                <div class="act-status position-absolute">进行中</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ActListStyle3",
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
    .act-list-style-item {
        width: 100%;
        height: 110px;
        background-color: #ffffff;
        border-bottom: 1px solid #f3f3f3;
        box-sizing: border-box;
        padding: 10px 15px;
    }

    .act-list-style-item-poster {
        width: 120px;
        height: 90px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 3px;
    }
    
    .act-main{
        height: 90px;
        padding: 0 10px;
        line-height: 30px;
        color: #666666;
        font-size: 10px;
    }

    .act-title{
        font-size: 13px;
    }

    .act-status{
        right: 0;
        top: 40px;
        width: 60px;
        height: 24px;
        color: white;
        font-size: 10px;
        line-height: 24px;
        border-radius: 12px;
        text-align: center;
        background-image: linear-gradient(to right, #FF856F, #FD3D6E);
    }

    .grey{
        background-color: lightgray;
        background-image: none;
    }

</style>
<template>
    <div class="activities-container">
        <div class="title-container background-color-white">
            <div class="title">{{attributes.title.value}}</div>
            <div class="more">更多 ></div>
        </div>
        <component :is="attributes.listStyle.value" :activities="activities"/>
    </div>
</template>

<script>
    import ActListStyle1 from "./ActListStyle1";
    import ActListStyle2 from "./ActListStyle2";
    import ActListStyle3 from "./ActListStyle3";
    export default {
        name: "alumniClubsActivities",
        components: {ActListStyle1, ActListStyle2, ActListStyle3},
        props: {
            module: Object
        },
        data() {
            return {
                activities: []
            }
        },
        computed: {
            attributes() {
                return this.module.attributes;
            },
        },
        mounted() {
            this.activities = [
                {
                    id: 154673,
                    title: '2017达芙妮新品会',
                    startTime: '2019-06-22 10:30:34',
                    endTime: '2019-06-22 18:30:34',
                    poster: 'https://wxstore.blob.core.chinacloudapi.cn/huiyixing-event-container/071efa68c338436a926630f9d2c506ed.jpg',
                    address: '北京市东城区'
                },
                {
                    id: 154674,
                    title: '2019春季新品全新发布',
                    startTime: '2019-06-22 10:30:34',
                    endTime: '2019-06-22 18:30:34',
                    poster: 'https://wxstore.blob.core.chinacloudapi.cn/huiyixing-event-container/e742d2290f154e3bb615b4714886c101.jpg',
                    address: '北京市东城区'
                }
            ];
        }
    }
</script>

<style scoped>
    .title-container {
        display: flex;
        padding:10px 14px 10px 20px;
    }

    .title {
        flex: 1;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
    }

    .more {
        width: 80px;
        text-align: right;
        font-size: 14px;
        color: #0A0A0A;
        letter-spacing: 0;
        line-height: 22px;
        height: 22px;
        cursor: pointer;
    }




</style>

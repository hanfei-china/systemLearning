<template>
    <div class="module-container" style="background-color: #FFFFFF;">
        <function-title style="padding: 8px 16px;" :title="title" :color="titleColor" :icon="titleIcon" :icon-position="titleIconPosition"
                        has-more></function-title>
        <div class="image-container">
            <div v-for="project of list" :key="project.id" style="display: flex;padding: 10px;">
                <div :style="{backgroundImage: `url(${project.poster})`}"
                     style="width: 124px; height: 95px;background-size: cover;background-position: center center;border-radius: 4px;"></div>
                <div style="flex: 1;padding-left: 10px;">
                    <div style="font-size: 17px;padding-top:10px;text-overflow: ellipsis;overflow:hidden;white-space:nowrap">
                        {{project.title}}
                    </div>
                    <div style="font-size: 14px;padding-top: 10px;">开始时间：{{project.startTime}}</div>
                    <div style="font-size: 14px;padding-top: 10px;">目标金额：<span style="color: #f34a42;">{{project.targetAmount}}</span>元
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import FunctionTitle from '../../../common/FunctionTitle';

    export default {
        name: "onlineDonationList",
        components: {FunctionTitle},
        props: {
            module: Object
        },
        data() {
            return {

                list:  [{
                    "id": "6A550E069D884DE9976D04573C5C3612",
                    "title": "“我爱母校”校友年度捐赠",
                    "targetAmount": "10000.00",
                    "targetTime": "2019-12-27",
                    "introduction": "“我爱母校”校友年度捐赠jieshao",
                    "createTime": "2019-03-13 18:03",
                    "status": null,
                    "poster": "https://wdx.blob.core.chinacloudapi.cn/huiyixing-event-container/c51ea21b118347e78c819a8b46022a42.jpg",
                    "shareNum": 0,
                    "viewNum": 76,
                    "startTime": "2019-03-13",
                    "headName": "王老师",
                    "phone": "18512341234",
                    "email": "1031702319@qq.com",
                    "acceptDonationStatus": 0
                }, {
                    "id": "E763CF991FD245E0AAD6037C9B1B287B",
                    "title": "人才培养创业基金",
                    "targetAmount": "100000000.00",
                    "targetTime": "2019-12-31",
                    "createTime": "2019-03-14 15:09",
                    "status": null,
                    "poster": "https://wdx.blob.core.chinacloudapi.cn/huiyixing-event-container/8bf9bdf4a98c43fcbcbb41a8b90cedbb.jpg",
                    "shareNum": 0,
                    "viewNum": 38,
                    "startTime": "2019-03-01",
                    "headName": "李宏",
                    "phone": "15001333728",
                    "email": "lihong@jiuqi.com.cn",
                    "acceptDonationStatus": 0
                }]
            }
        },
        computed: {
            attributes() {
                return this.module.attributes;
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
            dataMaxCount() {
                return this.attributes.dataMaxCount.value;
            },
            containerStyle() {
                return {
                    width: (this.contentList.length * (167 + 9) - 9) + 'px'
                }
            },
            scrollStyle() {
                return {
                    height: '172px',
                    overflow: 'auto'
                }
            }
        }
    }
</script>

<style scoped>
    .module-container {
        position: relative;
    }

    .image-container {
        position: relative;
    }

    .image-wrapper {
        width: 167px;
        height: 152px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 8px;
        overflow: hidden;
    }

    .content-title {
        margin-top: 10px;
        width: 167px;
        font-size: 12px;
        line-height: 18px;
        height: 36px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .image-wrapper-container:nth-child(odd) {
        margin-right: 9px;
    }

    .image-wrapper-container {
        margin-bottom: 9px;
        display: inline-block;
    }
</style>

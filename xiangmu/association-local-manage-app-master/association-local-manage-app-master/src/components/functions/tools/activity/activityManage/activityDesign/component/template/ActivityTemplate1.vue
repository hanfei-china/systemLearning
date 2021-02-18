<template>
    <div class="absolute-fill-parent activity-template1">
        <vue-scroll :ops="{scrollPanel : {scrollingX : false}}">
            <div class="activity-template1-poster" :style="{backgroundImage: `url(${activityInfo.posterUrl})`}"></div>
            <div style="padding: 0 10px;background-color: white;">
                <div class="activity-template1-theme">{{activityInfo.theme}}</div>
                <div class="activity-template1-theme-other"><i class="el-icon-time"></i>{{activityInfo.beginTime | yyyyMMddHHmm}} 至 {{activityInfo.endTime | yyyyMMddHHmm}}</div>
                <div class="activity-template1-theme-other"><i class="el-icon-location"></i>{{activityInfo.address}}</div>
                <div class="activity-template1-theme-other"><i class="el-icon-time"></i>{{activityInfo.signUpEndTime | yyyyMMddHHmm}} 截止报名</div>
            </div>
            <draggable style="min-height: 440px;" v-model="template.modules" @change="log"  group="newActivityModule">
                <fall-flow-module v-for="(module,index) of template.modules" :module="module"
                                  :key="module.id" :activity-info="activityInfo" @setting="$emit('setting',module)" @delete="template.deleteModule(index)"/>
            </draggable>
        </vue-scroll>
    </div>
</template>

<script>
    import FallFlowModule from "../module/FallFlowModule";
    export default {
        name: "ActivityTemplate1",
        components: {FallFlowModule},
        props:{
            template: Object,
            activityInfo: Object,
        },
        methods:{
            log(evt) {
                let added = evt.added;
                if(added){
                    let {element} = added;
                    this.$emit('module-setting', element);
                }
            }
        }
    }
</script>

<style lang="less">
    .activity-template1{

        &-poster{
            height: 210px;
            background-size: cover;
            background-position: center;
        }

        &-theme{
            font-size: 16px;
            padding: 10px 0;

            &-other{
                font-size: 12px;
                color: #666;
                padding-bottom: 10px;

                &>i{
                    margin-right: 4px;
                }
            }
        }
    }
</style>

<template>
    <div class="absolute-fill-parent">
        <vue-scroll :ops="{scrollPanel : {scrollingX : false}}">
            <div class="activity-template2-poster position-relative" :style="{backgroundImage: `url(${activityInfo.posterUrl})`}">
                <div class="absolute-fill-parent flex flex-column flex-center" :style="textStyle" v-show="showText">
                    <div style="padding: 0 10px;" >
                        <div class="activity-template2-theme text-align-center">{{activityInfo.theme}}</div>
                        <div class="activity-template2-theme-other text-align-center"><i class="el-icon-time"></i>{{activityInfo.beginTime | yyyyMMddHHmm}} 至 {{activityInfo.endTime | yyyyMMddHHmm}}</div>
                        <div class="activity-template2-theme-other text-align-center"><i class="el-icon-location"></i>{{activityInfo.address}}</div>
                        <div class="activity-template2-theme-other text-align-center"><i class="el-icon-time"></i>{{activityInfo.signUpEndTime | yyyyMMddHHmm}} 截止报名</div>
                    </div>
                </div>
                <div class="absolute-fill-parent activity-template2-poster-cover">
                    <div class="activity-template2-poster-cover-handler">
                        <el-button size="mini" type="primary" icon="el-icon-setting" circle @click="$emit('setting',template)"/>
                    </div>
                </div>
            </div>
            <draggable style="min-height: 424px;padding: 8px 7px;" v-model="template.modules" @change="log"  group="newActivityModule">
                <button-module v-for="(module,index) of template.modules" :module="module"
                           :key="module.id" :activity-info="activityInfo" @setting="$emit('setting',module)" @delete="template.deleteModule(index)"/>
            </draggable>
        </vue-scroll>
    </div>
</template>

<script>
    import ButtonModule from "../module/ButtonModule";
    export default {
        name: "ActivityTemplate2",
        components: {ButtonModule},
        props:{
            template: Object,
            activityInfo: Object,
        },
        computed:{
            attributes(){
                return this.template.attributes;
            },
            templateGroup(){
                return this.attributes.templateGroup.attributes;
            },
            showText(){
                return this.templateGroup.showText.value;
            },
            textStyle(){
                return {
                    color: this.templateGroup.textColor.value,
                    backgroundColor: this.templateGroup.maskBackgroundColor.value,
                }
            }
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
    .activity-template2{

        &-poster{
            height: 210px;
            background-size: cover;
            background-position: center;

            &-cover{
                display: none;
                background-color: rgba(0,0,0,.6);
                padding: 10px;

                &-handler{
                    position: absolute;
                    right: 10px;
                }
            }

            &:hover{
                .activity-template2-poster-cover{
                    display: block;
                }
            }
        }

        &-theme{
            font-size: 16px;
            padding: 10px 0;
            color: inherit;

            &-other{
                font-size: 12px;
                padding-bottom: 10px;
                color: inherit;
                &>i{
                    color: inherit;
                    margin-right: 4px;
                }
            }
        }
    }
</style>

<template>
    <div class="position-relative fall-flow-module" style="background-color: #FFFFFF;">
        <div>
            <div class="flex fall-flow-module-header">
                <div class="flex flex-center flex-column flex-fill-in-the-remaining-space">
                    <div class="flex">
                        <div class="fall-flow-module-icon" v-show="showIcon"><img :src="icon"/></div>
                        <div v-show="showTitle" style="font-size: 12px;">{{title}}</div>
                    </div>
                </div>
                <div class="flex flex-center flex-column">
                    <div v-show="name === moduleNames.signUpUsers" style="font-size: 12px;">查看所有(0)>></div>
                    <div v-show="name === moduleNames.activityAlbum" style="font-size: 12px;">查看更多 >></div>
                    <div v-show="name === moduleNames.activityComment" style="font-size: 12px;color: #00a0e9;">留言</div>
                </div>
            </div>
            <div class="fall-flow-module-diving-line" :style="divingLineStyle" v-show="showDivingLine"></div>
            <div v-show="name === moduleNames.activityDetail" class="activity-template-detail"
                 v-html="activityInfo.details" style="padding: 10px 6px;"></div>
            <div v-show="name === moduleNames.signUpUsers || name === moduleNames.activityAlbum
                        || name === moduleNames.activityComment || name === moduleNames.guests"
                 class="flex flex-center flex-column" style="padding: 6px;height: 100px;">
                <div class="text-align-center"><img style="height: 30px;" :src="nodata"/></div>
                <div class="text-align-center" style="font-size: 12px;color: #666666;">暂无{{title}}</div>
            </div>
        </div>
        <div class="absolute-fill-parent fall-flow-module-hidden" :class="{hidden}">
            <div class="absolute-fill-parent flex flex-column flex-center">
                <div class="text-align-center" ><i style="font-size: 36px;color: white;" class="iconfont icon-hidden"/></div>
            </div>
        </div>
        <div class="absolute-fill-parent fall-flow-module-cover">
            <el-button-group class="fall-flow-module-cover-handler">
                <el-button size="mini" type="primary" icon="el-icon-rank" circle/>
                <el-button size="mini" type="primary" icon="el-icon-setting" circle @click="$emit('setting')"/>
                <el-button size="mini" type="primary" icon="el-icon-delete" circle @click="$emit('delete')"/>
            </el-button-group>
        </div>
    </div>
</template>

<script>
    import {moduleNames} from "../../js/common/moduleNames";
    import nodata from '../../../../../../../../assets/nodata.png';
    export default {
        name: "FallFlowModule",
        props:{
            module: Object,
            activityInfo: Object,
        },
        data(){
            return {
                moduleNames,
                nodata
            }
        },
        computed:{
            attributes(){
                return this.module.attributes;
            },
            name(){
                return this.module.name;
            },
            moduleGroup(){
                return this.attributes.moduleGroup.attributes;
            },
            hidden(){
                return this.moduleGroup.hidden.value;
            },
            titleGroup(){
                return this.attributes.titleGroup.attributes;
            },
            showTitle(){
                return this.titleGroup.showTitle.value;
            },
            title(){
                return this.titleGroup.title.value;
            },
            iconGroup(){
                return this.attributes.iconGroup.attributes;
            },
            showIcon(){
                return this.iconGroup.showIcon.value;
            },
            icon(){
                return this.iconGroup.icon.value;
            },
            divingLineGroup(){
                return this.attributes.divingLineGroup.attributes;
            },
            showDivingLine(){
                return this.divingLineGroup.showDivingLine.value;
            },
            divingLineStyle(){
                let border = this.divingLineGroup.divingLineStyle.value;

                return  {
                    borderTopColor: border.borderColor,
                    borderTopStyle: border.borderStyle,
                    borderTopWidth: border.borderWidth + 'px',
                };
            },
        }
    }
</script>
<style lang="less">
    .fall-flow-module{

        .activity-template-detail{
            img{
                max-width: 100%;
            }
        }

        &-header{
            padding: 6px;
        }

        &-cover{
            display: none;
            background-color: rgba(0,0,0,.6);
            padding: 10px;

            &-handler{
                position: absolute;
                right: 10px;
            }
        }

        &-hidden{
            background-color: rgba(0,0,0,.6);
            display: none;

            &.hidden{
                display: block;
            }
        }

        &:hover{
            .fall-flow-module-cover{
                display: block;
            }
        }

        &-icon{
            width: 14px;
            height: 14px;
            margin-right: 6px;

            &>img{
                max-height: 100%;
                max-width: 100%;
            }
        }

        margin-top: 10px;
    }
</style>

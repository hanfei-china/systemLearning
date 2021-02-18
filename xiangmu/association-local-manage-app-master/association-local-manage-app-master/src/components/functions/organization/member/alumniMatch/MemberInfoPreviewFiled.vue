<template>
    <div class="flex member-info-item" :class="field.topicType==13?'composebox':''" :key="field.code">
        <template v-if="field.topicType!=13">
            <div class="member-info-item-title">{{field.name+'：'}}</div>
            <div class="member-info-item-content flex-fill-in-the-remaining-space">
                <temp-var :value="memberInfo[field.code]" :topicType="field.topicType">
                    <template slot-scope="{value,topicType}">
                        <el-image v-if="topicType === 4 && value && isDetail" class="custom-el-image" :src="value" :preview-src-list="[value]" ref="preview"/>
                        <el-image v-if="topicType === 4 && value && !isDetail" class="custom-el-image" :preview-src-list="[value]" ref="preview">
                            <template v-slot:error>
                                <el-button size="small" @click="preview" class="unset-padding" type="text">点击查看图片</el-button>
                            </template>
                        </el-image>
                        <span v-if="topicType !== 4">{{transferData(field, value)}}</span>
                        <div v-if="topicType === 9" >
                            <!--明细表字段-->
                            <div class="member-info-details-item flex-fill-in-the-remaining-space" v-for="(detail,index) of value" :key="index">
                                <member-info-preview-filed :is-detail="isDetail" class="child" v-for="childField of field.detailList"
                                                        :field="childField" :key="childField.code" :member-info="detail"/>
                            </div>
                        </div>
                        <el-rate v-if="topicType === 11" disabled :value="numberValue(value)"/>
                    </template>
                </temp-var>
            </div>
        </template>
        <template v-else>
            <!-- <div class="composetitle">{{field.name+'：'}}</div> -->
            <div class="flex member-info-item" v-for="(field,index) in field.detailList" :key="index">
                <div class="member-info-item-title">{{field.name+'：'}}</div>
                <div class="member-info-item-content flex-fill-in-the-remaining-space">
                    <temp-var :value="memberInfo[field.code]" :topicType="field.topicType">
                        <template slot-scope="{value,topicType}">
                            <el-image v-if="topicType === 4 && value && isDetail" class="custom-el-image" :src="value" :preview-src-list="[value]" ref="preview"/>
                            <el-image v-if="topicType === 4 && value && !isDetail" class="custom-el-image" :preview-src-list="[value]" ref="preview">
                                <template v-slot:error>
                                    <el-button size="small" @click="preview" class="unset-padding" type="text">点击查看图片</el-button>
                                </template>
                            </el-image>
                            <span v-if="topicType !== 4">{{transferData(field, value)}}</span>
                            <div v-if="topicType === 9" >
                                <!--明细表字段-->
                                <div class="member-info-details-item flex-fill-in-the-remaining-space" v-for="(detail,index) of value" :key="index">
                                    <member-info-preview-filed :is-detail="isDetail" class="child" v-for="childField of field.detailList"
                                                            :field="childField" :key="childField.code" :member-info="detail"/>
                                </div>
                            </div>
                            <el-rate v-if="topicType === 11" disabled :value="numberValue(value)"/>
                        </template>
                    </temp-var>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import TempVar from "../../../../util/TempVar";
    import {transferData} from "../../../../../js/util/utilFunction";

    export default {
        name: "MemberInfoPreviewFiled",
        components: {TempVar},
        data(){
            return {
                branchList:[]
            }
        },
        props:{
            field: Object,
            memberInfo: Object,
            isDetail: Boolean,
            memberInfoId:String
        },
        watch:{
            field: {
                deep: true,
                handler(value) {
                    if(value.topicType==14){
                        // this.$request.get('api/common/branch/branchList',{params:{needMemberCount:false,sort: "seq asc"}}).then(r=>{
                        //     this.branchList = r.data.list
                        // })
                        if(this.memberInfo.id){
                            this.$request.get('/api/admin/member/getMemberJoinBranches', {params: {memberId: this.memberInfo.id}}).then(res => {
                                this.branchList = res.data;
                            })
                        }
                    }
                },
                immediate: true
            },
            memberInfoId: {
                deep: true,
                handler(val) {
                    if(val&&this.field.topicType==14){
                        this.$request.get('/api/admin/member/getMemberJoinBranches', {params: {memberId: val}}).then(res => {
                            console.log(res)
                            this.branchList = res.data;
                        })
                    }
                },
                immediate: true
            },
        },
        methods:{
            transferData(field, value) {
                return transferData(field, value,this.branchList);
            },
            preview(){
                this.$refs.preview.showViewer = true;
            },
            numberValue(value){
                return parseInt(value)
            }
        },
    }
</script>
<style lang="less" scoped>
.composebox{
    border: 1px solid rgb(242, 242, 242);
    padding: 5px 0 16px;
    background-color: rgb(250, 250, 250);
    border-radius: 4px;
    display: block;
    .composetitle{
        margin-left: 20px;
        line-height: 40px;
        font-size: 15px;
    }
    margin-bottom: 15px;
}
</style>
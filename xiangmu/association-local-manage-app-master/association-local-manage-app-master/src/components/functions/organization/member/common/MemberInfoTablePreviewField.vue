<template>
    <span @click.stop>
        <span v-if="field.topicType === 4 && value" class="flex flex-column flex-center">
            <el-image  class="custom-el-image" :preview-src-list="[value]" :src="value" ref="preview">
                <template v-slot:error>
                    <el-button size="small" @click.stop="preview" class="unset-padding" type="text">点击查看图片</el-button>
                </template>
            </el-image>
        </span>
        <el-rate v-if="field.topicType === 11 && value" v-model="rateValue" disabled score-template="{value}"/>
        <span v-if="field.topicType === 12 && value">
            <member-label-info :labelList="labelList" :showLabels="value"></member-label-info>
        </span>
        <span v-if="field.topicType === 14">
            <el-popover placement="top" width="160" v-model="visible">
                <p>{{transferData(field, value)?transferData(field, value):"尚未加入任何分会"}}</p>
                <el-button slot="reference" type="text">点击查看</el-button>
            </el-popover>
        </span>
        <span v-if="field.topicType != 14 && (field.topicType !== 4 || field.topicType !== 11 || field.topicType !== 12)">{{transferData(field, value)}}</span>
    </span>
</template>

<script>
    import {transferData} from "../../../../../js/util/utilFunction";
    import MemberLabelInfo from "./MemberLabelInfo";

    export default {
        name: "MemberInfoTablePreviewField",
        components: {MemberLabelInfo},
        props:{
            field: Object,
            value: [Object,String,Array,Boolean,Number],
            labelList: Array,
            memberInfo:Object
        },
        data(){
            return {
                rateValue: 0,
                branchList:[],
                visible:false
            }
        },
        watch:{
            visible(val){
                if(val){
                    this.$request.get('/api/admin/member/getMemberJoinBranches', {params: {memberId: this.memberInfo.id}}).then(res => {
                        this.branchList = res.data;
                    })
                }
            },
            field: {
                deep: true,
                handler(value) {
                    if(value.topicType==14){
                        // this.$request.get('api/common/branch/branchList',{params:{needMemberCount:false,sort: "seq asc"}}).then(r=>{
                        //     this.branchList = r.data.list
                        // })
                    }
                },
                immediate: true
            },
        },
        created(){
            if(this.field.topicType === 11){
                this.rateValue = JSON.parse(this.value);
            }
        },
        mounted() {
            if(this.$refs.preview){
                this.$refs.preview.error = true;
            }
        },
        methods:{
            showbranch(){
                this.visible = !this.visible;
            },
            transferData(field, value) {
                return transferData(field, value,this.branchList);
            },
            preview(){
                this.$refs.preview.showViewer = true;
            },
        },
        updated() {
            if(this.$refs.preview){
                this.$refs.preview.error = true;
            }
        }
    }
</script>

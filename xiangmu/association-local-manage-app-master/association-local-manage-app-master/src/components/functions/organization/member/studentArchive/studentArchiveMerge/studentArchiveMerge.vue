<template>
    <div class="memberMerge">
        <student-merge-list ref="mergeList" @selectOneList="selectOnelist" class="memberMergeList"></student-merge-list>
        <student-merge-manage @updata="updataList" :mergeInfo="mergeInfo" class="memberMergeManage"></student-merge-manage>
    </div>
</template>

<script>
import studentMergeList from './studentMergeList'
import studentMergeManage from './studentMergeManage'
export default {
    name:'studentArchiveMerge',
    components:{studentMergeList,studentMergeManage},
    data(){
        return {
            mergeInfo:{}
        }
    },
    methods:{
        selectOnelist(info){
            this.mergeInfo=JSON.parse(JSON.stringify(info));
        },
        updataList(){
            this.$refs.mergeList.getList();
        }
    }
}
</script>

<style lang="less" scoped>
.memberMerge{
    width: 100%;
    box-sizing: border-box;
    display: flex;
    height: 100%;
    // padding: 15px;
    .memberMergeList{
        width: 375px;
        height: 100%;
        background-color: #fff;
        margin-right: 5px;
        box-sizing: border-box;
    }
    .memberMergeManage{
        height: 100%;
        box-sizing: border-box;
        width: calc(100% - 380px);
        background-color: #fff;
    }
}
</style>
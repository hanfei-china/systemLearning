<template>
    <div class="memberMerge">
        <member-merge-list ref="mergeList" @selectOneList="selectOnelist" class="memberMergeList"></member-merge-list>
        <member-merge-manage @updata="updataList" :mergeInfo="mergeInfo" class="memberMergeManage"></member-merge-manage>
    </div>
</template>

<script>
import memberMergeList from './memberMergeList'
import memberMergeManage from './memberMergeManage'
export default {
    name:'memberMerge',
    components:{memberMergeList,memberMergeManage},
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
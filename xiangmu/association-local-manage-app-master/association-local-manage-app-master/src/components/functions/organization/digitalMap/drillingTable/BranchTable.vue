<template>
    <el-container style="height: 500px;">
        <el-main class="unset-padding">
            <el-table height="100%" :data="list" border stripe size="small">
                <el-table-column label="序号" width="50" class-name="item-un-sort">
                    <template v-slot="{$index}">
                        <div class="text-align-center">
                            {{$index+1}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="item-un-sort" label="分会名称" prop="name" show-tooltip-when-overflow/>
                <el-table-column class-name="item-un-sort" label="分会联系人" prop="contactPerson" show-tooltip-when-overflow/>
                <el-table-column class-name="item-un-sort" label="分会联系电话" prop="contactPhone" show-tooltip-when-overflow/>
                <el-table-column class-name="item-un-sort" label="会员数" prop="memberCount" width="100" show-tooltip-when-overflow/>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "BranchTable",
        props: ["condition"],
        data(){
            return {
                list: [],
            }
        },
        methods:{
            getList(){
                let params = {
                    needMemberCount: true,
                    needMain: true,
                    sort: 'seq asc',
                    province: this.condition.value
                }

                this.$request.get('/api/common/branch/branchList',{params}).then((resp)=>{
                    let {data} = resp;
                    let list = data.list;
                    list.map(branch=>{
                        branch.memberCount = 0;
                        let branchId = branch.id;
                        for(let memberCount of data.memberCounts){
                            let _branchId = memberCount.branchId;
                            if(_branchId === branchId){
                                branch.memberCount = memberCount.memberCount;
                                break;
                            }
                        }
                    })

                    this.list = list;
                })
            },
        },
        mounted() {
            this.getList();
        }
    }
</script>

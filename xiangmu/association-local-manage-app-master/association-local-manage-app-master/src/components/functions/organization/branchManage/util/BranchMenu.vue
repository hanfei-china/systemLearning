<template>
    <el-container class="absolute-fill-parent">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">所有分会</div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <div class="absolute-fill-parent">
                <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                    <el-menu @select="setChosen" class="border-right-unset custom-el-menu" :default-active="chosen">
                        <el-menu-item v-for="branch of list" :index="branch.id" :key="branch.id">
                            <div class="text-overflow" style="width: 160px;">{{branch.name}}</div>
                        </el-menu-item>
                    </el-menu>
                </vue-scroll>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "BranchMenu",
        props:{
            needMain: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                list: [],
                chosen:'',
            }
        },
        computed:{
            chosenBranch(){
                let chosen = this.chosen;
                if(chosen){
                    for(let branch of this.list){
                        if(chosen === branch.id){
                            return branch;
                        }
                    }
                }

                return null;
            }
        },
        methods:{
            getList(){
                let params = {
                    limit: 10000,
                    offset: 0,
                    needMain: this.needMain,
                    sort: 'seq asc'
                };

                this.$request.get('/api/common/branch/branchList',{params}).then((resp)=>{
                    let {data} = resp;
                    let list = data.list;
                    if(list.length>0){
                        this.chosen = list[0].id;
                    }
                    this.list = data.list;
                })
            },
            setChosen(id){
                this.chosen = id;
            }
        },
        created() {
            this.getList();
        },
        watch:{
            chosen(val){
                this.$emit('select',val);
            },
            chosenBranch(val){
                this.$emit('branch',val);
            }
        }
    }
</script>

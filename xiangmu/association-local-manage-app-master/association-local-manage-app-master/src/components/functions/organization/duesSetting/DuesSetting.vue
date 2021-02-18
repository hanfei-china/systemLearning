<template>
    <el-container class="unset-padding">
        <el-main class="unset-padding">
            <el-form size="small" :label-width="labelWidth">
                <el-form-item v-for="duesType of duesTypeList" :key="duesType.id" :label="`${duesType.name}:`" required>
                    <el-input v-if="loading" :placeholder="`请输入${duesType.name}会费金额`"/>
                    <el-input v-else :placeholder="`请输入${duesType.name}会费金额`" clearable
                              v-model="duesStandard.branchStandards[duesType.id].price">
                        <template v-slot:append>
                            <span style="font-size: 12px;" class="info-tip" v-if="branchId">
                                <i class="el-icon-info"></i>
                                <span style="padding-left: 4px;">总会标准{{duesStandard.standards[duesType.id].price}}元</span>
                            </span>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding flex flex-column flex-center" height="auto">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定变更</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import {currency} from "../../../../js/util/utilFunction";

    export default {
        name: "DuesSetting",
        props:{
            duesTypeList: Array
        },
        computed:{
            labelWidth(){
                let charLength = 0;

                this.duesTypeList.forEach(duesType=>{
                    let {name} = duesType;
                    if(name.length > charLength){
                        charLength = name.length;
                    }
                });

                return `${charLength*20 + 10}px`;
            },
            branchId(){
                return this.$store.state.branchId;
            },
            formatPostList(){
                let _result = {};
                this.duesTypeList.forEach(duesType=>{
                    _result[duesType.id] = duesType;
                });

                return _result;
            }
        },
        data(){
            return {
                duesStandard:{
                    branchStandards: {},
                    standards:{}
                },
                loading:true
            }
        },
        methods:{
            currency(val){
                return currency(val);
            },
            getDuesStandard(){
                this.$request.get('/api/admin/dues/standard/branchStandards').then(res=>{
                    this.duesStandard = {...res.data};
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            submitData(){
               let duesStandards = [];

               let branchStandards = this.duesStandard.branchStandards;
               let temp = /((^[1-9]\d*)|^0)(\.\d{0,2})?$/;

               for(let duesType of this.duesTypeList){
                   let {id,name} = duesType;
                   let standard = branchStandards[id];
                   let {price} = standard;

                   if(!temp.test(price)){
                       this.$message.error(`请输入正确的【${name}】会费金额`);
                       return;
                   }else{
                       duesStandards.push(standard);
                   }
               }

                this.$request.post('/api/admin/dues/standard/branchStandards',{duesStandards}).then(()=>{
                    this.$message.success(`会费变更成功`);
                    this.$emit('close');
                })
            },
        },
        created() {
            this.getDuesStandard();
        }
    }
</script>


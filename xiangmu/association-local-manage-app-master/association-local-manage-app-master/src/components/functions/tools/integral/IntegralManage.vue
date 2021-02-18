<template>
    <el-container class="absolute-fill-parent background-color-white" v-loading="loading">
        <el-header class="flex flex-column flex-center border-bottom">
            <div class="text-align-right">
                <el-button size="small" :type="integralRules.isOpen ? 'danger': 'primary'" @click="changeRulesStatus">{{integralRules.isOpen ? '关闭积分体系' : '开启积分体系'}}</el-button>
                <el-button :disabled="!integralRules.isOpen" size="small" type="primary" @click="saveRules">保存配置</el-button>
            </div>
        </el-header>
        <el-main class="position-relative unset-padding">
            <el-container class="absolute-fill-parent" style="padding-bottom: 20px;">
                <el-main class="position-relative unset-padding border-right">
                    <vue-scroll>
                        <div style="padding:1px 20px;">
                            <el-alert style="margin-top: 19px;" show-icon :closable="false" type="info">
                                <template v-slot:title>
                                    <div>
                                        <span>以下设置在<span style="color:#F56C6C;">开启积分体系后才生效</span></span>
                                        <span>，变更规则后请点击右上角<span style="color:#F56C6C;">【保存配置】</span>按钮</span>
                                    </div>
                                </template>
                            </el-alert>
                            <el-divider content-position="left">积分抵现规则：</el-divider>
                            <div class="flex">
                                <div style="color: rgb(153, 153, 153);" class="flex flex-center flex-column">1元人民币&nbsp;=&nbsp;</div>
                                <el-input-number placeholder="请输入整数" :min="1" :max="Infinity" style="width: 200px;" size="small" v-model="integralRules.integralPerRMB"/>
                                <div style="color: rgb(153, 153, 153);padding-left: 6px;" class="flex flex-center flex-column">积分</div>
                            </div>
                            <el-divider content-position="left">积分获取规则：</el-divider>
                            <div style="color: rgb(153, 153, 153);padding-top: 4px;">各规则顺序可拖拽排序</div>
                            <div v-show="integralRules.integralRules.length > 0" style="padding-top: 10px;">
                                <draggable v-model="integralRules.integralRules" class="box-shadow-plain"
                                           v-bind="{animation: 500,handle:'.item-sort'}">
                                    <rule-item v-for="(rule,index) in integralRules.integralRules" :rule="rule" :key="rule.rulesItemType" @delete-rule="deleteRule(index)"/>
                                </draggable>
                            </div>
                        </div>
                    </vue-scroll>
                </el-main>
                <el-aside class="position-relative unset-padding" width="400px">
                    <vue-scroll>
                        <div style="padding: 21px 20px;">
                            <gain-rules-choose @new-rule="newRule" :used-rules="integralRules.integralRules"/>
                        </div>
                    </vue-scroll>
                </el-aside>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import IntegralGainRules from './js/entity/integralGainRules';
    import GainRulesChoose from "./GainRulesChoose";
    import draggable from 'vuedraggable';
    import RuleItem from "./RuleItem";
    import {deepCopy2} from '../../../../js/util/objectUtil'
    export default {
        name: "IntegralManage",
        components: {RuleItem, GainRulesChoose,draggable},
        data(){
            return {
                integralRules:{
                    isOpen: false,
                    integralRules: [],
                    integralPerRMB: 100
                },
                loading: true
            }
        },
        methods:{
            getIntegralRules(){
                this.$request.get('/api/admin/integral/rules').then(res => {
                    this.integralRules = new IntegralGainRules(res.data);
                    this.$nextTick(()=>{ this.loading = false; })
                })
            },
            changeRulesStatus(){
                this.$request.put('/api/admin/integral/rules',{isOpen:!this.integralRules.isOpen}).then(() => {
                    this.integralRules.isOpen = !this.integralRules.isOpen
                    this.$message.success('积分体系开启状态已变更');
                })
            },
            newRule(type){
                this.integralRules.newRule(type);
            },
            deleteRule(index){
                this.integralRules.deleteRule(index);
            },
            saveRules(){
                let integralRules = this.integralRules.getEntity();
                var arr=JSON.parse(integralRules.integralRules);
                for(var i=0;i<arr.length;i++){
                    if(arr[i].rulesItemType==14){
                        arr[i].attributes.oneDayTimes=1
                    }
                }
                this.$request.put('/api/admin/integral/rules',{
                    integralPerRMB: integralRules.integralPerRMB,
                    // integralRules: integralRules.integralRules
                    integralRules: JSON.stringify(arr)
                }).then(() => {
                    this.getIntegralRules();
                    this.$message.success('积分规则已更新');
                })
            }
        },
        created() {
            this.getIntegralRules();
        }
    }
</script>

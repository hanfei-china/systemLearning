<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside class="unset-padding position-relative border-right" width="200px">
            <el-container class="absolute-fill-parent">
                <el-header class="flex flex-column flex-center border-bottom">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space" style="line-height: 25px;font-size: 16px;">所有流程</div>
                    </div>
                </el-header>
                <el-main class="unset-padding position-relative">
                    <div class="absolute-fill-parent">
                        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                            <el-menu @select="setChosen" class="border-right-unset custom-el-menu" :default-active="chosen">
                                <el-menu-item v-for="item of flows" :index="item.defId" :key="item.defId">
                                    <div class="text-overflow" style="width: 160px;">{{item.name}}</div>
                                </el-menu-item>
                            </el-menu>
                        </vue-scroll>
                    </div>
                </el-main>
            </el-container>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <div v-loading="loading" element-loading-text="节点加载中..." element-loading-spinner="el-icon-loading" ref="flowHtml" v-html='flowHtml' style="overflow: hidden;height: 100%;"></div>
        </el-main>
    </el-container>
</template>

<script>
    import {flowConfig} from "../../../../js/config/flowConfig";

    export default {
        name: "FlowDesign",
        data() {
            return {
                flowHtml: '',
                flows:[],
                flow: {},
                chosen: '',
                loading: false
            }
        },
        created() {
            window.entityStatus = flowConfig.entityStatus;
            window.actionList = flowConfig.actionList;
            this.flows = flowConfig.entities;
            this.chosen = flowConfig.entities[0].defId;
        },
        methods:{
            setChosen(index){
                this.chosen = index;
            },
            method1(){
                this.loading= true;
                let me = this;

                window.flowConfigs = {};
                window.flowConfigs.definitionId = this.flow.defId;
                window.flowConfigs.showProjectManager = this.flow.showProjectManager || false;
                window.flowConfigs.designData = this.flow.designData;

                this.flowHtml = '';

                setTimeout(()=>{
                    this.flowHtml = '<iframe src="flowchart/flowchart.html" style="height:100%; width: 100%; border-width: 0" id="dn-flow-designer"></iframe>';
                    this.$nextTick(()=>{ this.loading = false; })
                },1000);


                window.saveDesignData = function (designData) {
                    me.$message.success('流程已更新');
                    me.flow.designData = JSON.stringify(designData);
                }
            }
        },
        watch:{
            chosen(val){
                if(val){
                    for (let flow of this.flows){
                        if(flow.defId === val){
                            this.flow = flow;
                            return;
                        }
                    }
                }
                this.flow = {};
            },
            flow:{
                deep: true,
                handler(val){
                   if(val && val.defId){
                       this.method1();
                   }
                }
            }
        }
    }
</script>

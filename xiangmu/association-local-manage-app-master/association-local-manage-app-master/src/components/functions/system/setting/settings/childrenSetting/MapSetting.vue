<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-main class="position-relative unset-padding">
            <vue-scroll class="absolute-fill-parent">
                <div style="height: 380px;padding: 20px;" v-if="isOk">
                    <el-form label-width="150px" size="small">
                        <el-form-item label="指定认养树项目：" required>
                            <el-select v-model="setting.donationId" :loading="selectLoading" filterable remote :remote-method="getList" @focus="getList" placeholder="请选择项目">
                                <template>
                                    <el-option v-for="item in donationList"	:key="item.id" :value="item.id" :label="item.title"></el-option>
                                </template>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否开启学号校验：">
                            <el-switch v-model="setting.checkStudentNo" active-text="开启" inactive-text="关闭"></el-switch>
                        </el-form-item>
          
                        <el-form-item>
                            <el-button type="primary" @click="saveSetting">&nbsp;&nbsp;&nbsp;保存配置&nbsp;&nbsp;&nbsp;</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        data(){
            return {
                isOk:false,
                setting:{
                    checkStudentNo:true,
                    donationId:""
                },
                donationList:[],
                selectLoading:false
            }
        },
        methods:{
            saveSetting(){
                if(!this.setting.donationId){
                    this.$message.warning("请指定认养树项目");
                    return
                }
                let setting = {...this.setting};
                this.$request.post('/api/admin/settings/manage/updateTreeMapSettings',setting).then(()=>{
                    this.$message.success('认养地图设置已更新');
                })
            },
            getSetting(){
                this.$request.get('/api/admin/settings/manage/getCommonSetting',{
                    params:{type:16}
                }).then(res=>{
                    this.isOk = true;
                    if(res.data){
                        this.setting = res.data;
                    }
                })
            },
            getList(keyword){
                this.selectLoading = true
                this.$request.get('/api/admin/onlineDonation/list',{
                    params:{limit:20,title:keyword,offset:0}
                }).then(res=>{
                    this.selectLoading = false;
                    if (res.success) {
                        this.donationList = res.data.list
                    }
                })
            }
        },
        created() {
            this.getList()
            this.getSetting();
        }
    }
</script>

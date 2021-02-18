<template>
    <mp-manage-container :left-width="leftWidth">
        <template v-slot:header>
            <div class="flex flex-column flex-center absolute-fill-parent">
                <div class="flex">
                    <div class="flex-fill-in-the-remaining-space flex flex-end" style="padding: 0 20px;">
                        <el-button size="small" style="padding-left: 25px;padding-right: 25px;" type="primary" @click="save">
                            <iconfont style="padding-right: 1px;" icon="icon-save"></iconfont>
                            保存
                        </el-button>
                    </div>
                </div>
            </div>
        </template>
        <template>
            <mp-design ref="design"/>
        </template>
    </mp-manage-container>
</template>

<script>

    import MpManageContainer from '../../common/MpManageContainer';
    import MpDesign from './MpDesign';
    import Iconfont from '../../util/Iconfont';
    import MiniProgram from '../../../../../../js/miniProgram/MiniProgram';

    export default {
        name: "MpDesignContainer",
        components: {Iconfont, MpManageContainer, MpDesign},
        metaInfo: {
            title: '小程序设计',
        },
        data() {
            return {
                max: false,
                leftWidth: '0',
                mpId: this.$route.params.mpId,
                mpInfo: null,
                mpUserConfig: new MiniProgram(),
            }
        },
        provide() {
            return {
                mpUserConfig: this.mpUserConfig
            }
        },
        methods: {
            getMpInfo() {
                this.$request.get('/api/common/anon/mp',{
                    params:{id:this.mpId}
                }).then(res=>{
                    this.mpUserConfig.copyObject(new MiniProgram(res.data.mpConfig));
                });
            },
            save() {
                this.$request.put('/api/admin/mp',{mpConfig:this.mpUserConfig.toJsonString(), id: this.mpId}).then(()=>{
                    this.$refs.design.clearAttributes();
                    this.getMpInfo();
                    this.$message.success('小程序修改成功');
                });
            },
        },
        created() {
            this.getMpInfo();
        }
    }
</script>

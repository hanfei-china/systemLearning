<template>
    <el-dialog :title="title" :visible.sync="setting" width="600px" append-to-body :close-on-click-modal="false">
        <el-form label-width="85px" size="small">
            <el-form-item label="菜单名称：">
                <el-input placeholder="请输入菜单名称" v-model="settingMenu.menuTitle"/>
            </el-form-item>
            <el-form-item label="菜单图标：">
                <console-icon-choose v-model="settingMenu.menuIcon"/>
            </el-form-item>
            <el-form-item label="菜单类型：">
                <el-select placeholder="请选择菜单类型" style="width: 100%;" v-model="settingMenu.isSystemModule">
                    <el-option :value="true" label="系统功能"/>
                    <el-option :value="false" label="自定义链接"/>
                </el-select>
            </el-form-item>
            <el-form-item label="系统功能：" v-show="settingMenu.isSystemModule">
                <func-module-choose style="width: 100%;" v-model="settingMenu.moduleId"/>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '401310'">
                <content-class-choose style="width: 100%;" v-model="settingMenu.moduleParam"/>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '401211'">
                <online-form-choose style="width: 100%;" v-model="settingMenu.moduleParam"/>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '401510'">
                <online-donation-class-choose style="width: 100%;" v-model="settingMenu.moduleParam"/>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '401210'">
                <online-form-class-choose style="width: 100%;" v-model="settingMenu.moduleParam"/>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '402610'">
                <online-counsel-class-choose style="width: 100%;" v-model="settingMenu.moduleParam"/>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '402300'">
                <el-select placeholder="请选择首页类型" style="width: 100%;" v-model="settingMenu.moduleParam">
                    <el-option value="main" label="总会首页"/>
                    <el-option value="branch" label="分会首页"/>
                </el-select>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '501112'">
                <el-select placeholder="请选择首页类型" style="width: 100%;" v-model="settingMenu.moduleParam">
                    <el-option value="personal" label="个人会员菜单管理"/>
                    <el-option value="group" label="团体会员菜单管理"/>
                </el-select>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '501900'">
                <label-class-choose style="width: 100%;" v-model="settingMenu.moduleParam"/>
            </el-form-item>
            <el-form-item label="链接地址：" v-show="!settingMenu.isSystemModule">
                <el-input type="textarea" :rows="5" resize="none"  v-model="settingMenu.menuPath" :maxlength="500" placeholder="自定义链接地址，300字以内"/>
            </el-form-item>
            <el-form-item label="打开方式：">
                <el-select placeholder="请选择菜单类型" style="width: 100%;" v-model="settingMenu.isSelf">
                    <el-option :value="true" label="在当前窗口打开"/>
                    <el-option :value="false" label="在新窗口打开"/>
                </el-select>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <el-button icon="el-icon-error" type="danger" size="small" @click="setting=false">取消返回</el-button>
            <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">确定</el-button>
        </template>
    </el-dialog>
</template>

<script>
    import ConsoleIconChoose from "../../../../icons/ConsoleIconChoose";
    import FuncModuleChoose from "./funcModuleChoose/FuncModuleChoose";
    import ContentClassChoose from "../../../util/content/ContentClassChoose";
    import OnlineFormChoose from "../../../util/onlineForm/OnlineFormChoose";
    import OnlineDonationClassChoose
        from "../../../tools/onlineDonation/onlineDonationClassManage/OnlineDonationClassChoose";
    import OnlineFormClassChoose from "../../../tools/onlineForm/onlineFormClassManage/OnlineFormClassChoose";
    import OnlineCounselClassChoose from "../../../tools/onlineCounsel/typeManage/OnlineCounselClassChoose";
    import LabelClassChoose from "../../labelManage/util/LabelClassChoose";
    export default {
        name: "MenuSettingForm",
        components: {
            LabelClassChoose,
            OnlineFormClassChoose,
            OnlineDonationClassChoose,
            OnlineFormChoose, ContentClassChoose, FuncModuleChoose, ConsoleIconChoose, OnlineCounselClassChoose},
        props:{
            menu:{
                type: Object,
                required: true
            },
            visible:{
                type: Boolean,
                default: false
            }
        },
        computed:{
            title(){
                if(!this.menu.id){
                    return '新增菜单';
                }
                return '菜单设置';
            }
        },
        data(){
            return {
                setting: this.visible,
                settingMenu: {...this.menu}
            }
        },
        methods:{
            menuSetting(){
                this.settingMenu = {...this.menu};
                this.setting = true;
            },
            submitData(){
                if((this.settingMenu.moduleId === '402300' || this.settingMenu.moduleId === '501112') && !this.settingMenu.moduleParam){
                    this.$message.warning('请设置模块参数');
                    return;
                }
                if(this.menu.id){
                    let settingMenu = {...this.settingMenu};
                    this.$request.put('/api/admin/menuSetting',settingMenu).then(()=>{
                        this.$message.success('菜单信息已更新，刷新页面可查看效果');
                        this.setting =false;
                        this.menu = {settingMenu};
                        this.$emit('refresh');
                    })
                }else{
                    let settingMenu = {...this.settingMenu};
                    this.$request.post('/api/admin/menuSetting',settingMenu).then(()=>{
                        this.$emit('refresh');
                        this.$message.success('菜单添加成功');
                        this.setting =false;
                        this.$emit('refresh');
                    })
                }
            }
        },
        watch:{
            setting(val){
                this.$emit('update:visible',val);
            },
            'settingMenu.moduleId'(){
                this.settingMenu.moduleParam = '';
            }
        }
    }
</script>

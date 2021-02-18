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
                <member-func-module-choose style="width: 100%;" v-model="settingMenu.moduleId"/>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '301100'">
                <content-class-choose style="width: 100%;" v-model="settingMenu.moduleParam"/>
            </el-form-item>
            <el-form-item label="模块参数：" v-show="settingMenu.moduleId === '301000'">
                <online-form-choose style="width: 100%;" v-model="settingMenu.moduleParam"/>
            </el-form-item>
            <el-form-item label="链接地址：" v-show="!settingMenu.isSystemModule">
                <el-input type="textarea" :rows="5" resize="none" v-model="settingMenu.menuPath" :maxlength="500" placeholder="自定义链接地址，300字以内"/>
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
    import ConsoleIconChoose from "../../../../../../icons/ConsoleIconChoose";
    import ContentClassChoose from "../../../../../util/content/ContentClassChoose";
    import OnlineFormChoose from "../../../../../util/onlineForm/OnlineFormChoose";
    import MemberFuncModuleChoose from "./funcModuleChoose/MemberFuncModuleChoose";
    export default {
        name: "MemberMenuSettingForm",
        components: {
            MemberFuncModuleChoose,
            OnlineFormChoose, ContentClassChoose, ConsoleIconChoose},
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
            },
            memberType(){
                return this.$route.params.memberType
            },
            isPersonalMember(){
                return this.memberType === 'personal';
            },
            isGroupMember(){
                return this.memberType === 'group';
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
                if((this.settingMenu.moduleId === '301000' || this.settingMenu.moduleId === '301100') && !this.settingMenu.moduleParam){
                    this.$message.warning('请设置模块参数');
                    return;
                }
                if(this.menu.id){
                    let settingMenu = {...this.settingMenu,isPersonalMember: this.isPersonalMember,isGroupMember: this.isGroupMember};
                    this.$request.put('/api/admin/memberMenuSetting',settingMenu).then(()=>{
                        this.$message.success('菜单信息已更新');
                        this.setting =false;
                        this.menu = {settingMenu};
                        this.$emit('refresh');
                    })
                }else{
                    let settingMenu = {...this.settingMenu,isPersonalMember: this.isPersonalMember,isGroupMember: this.isGroupMember};
                    this.$request.post('/api/admin/memberMenuSetting',settingMenu).then(()=>{
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

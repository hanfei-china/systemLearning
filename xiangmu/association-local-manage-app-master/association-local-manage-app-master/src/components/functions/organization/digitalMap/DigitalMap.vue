<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside class="position-relative unset-padding" width="200px">
            <el-container class="absolute-fill-parent border-right">
                <el-header class="flex flex-column flex-center border-bottom">
                    <div class="flex">
                        <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                            {{nowPrivilege ? nowPrivilege.menuTitle :''}}
                        </div>
                    </div>
                </el-header>
                <el-main class="unset-padding position-relative">
                    <div class="absolute-fill-parent">
                        <vue-scroll :ops="{scrollPanel:{scrollingX: false}}">
                            <el-menu @select="setField" class="border-right-unset custom-el-menu" :default-active="fieldName">
                                <template v-for="field of fields">
                                    <el-menu-item  v-if="!field.children" :index="field.index" :key="field.index">
                                        <div class="text-overflow" style="width: 160px;">{{field.name}}</div>
                                    </el-menu-item>
                                    <el-submenu v-else :index="field.index" :key="field.index">
                                        <template slot="title">{{field.name}}</template>
                                        <el-menu-item  v-for="child of field.children" :index="child.index" :key="child.index">
                                            <div class="text-overflow" style="width: 160px;">{{child.name}}</div>
                                        </el-menu-item>
                                    </el-submenu>
                                </template>
                            </el-menu>
                        </vue-scroll>
                    </div>
                </el-main>
            </el-container>
        </el-aside>
        <el-main class="position-relative unset-padding">
            <map-chart :field="fieldConfig" @drilling-down="drillingDown"/>
        </el-main>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="760px" append-to-body :close-on-click-modal="false">
            <component v-if="dialogVisible" :is="tableName" :condition="condition"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import MapChart from "./MapChart";
    import BranchTable from "./drillingTable/BranchTable";
    import UnitTable from "./drillingTable/UnitTable";
    import MemberTable from "./drillingTable/MemberTable";
    import DonationTable from "./drillingTable/DonationTable";
    export default {
        name: "DigitalMap",
        components: {DonationTable, MemberTable, UnitTable, BranchTable, MapChart},
        data(){
            return {
                fields:[],
                branches:[],
                fieldName:'branch',

                tableName: '',
                dialogTitle: '',
                dialogVisible: false,
                condition: null
            }
        },
        computed:{
            fieldConfig(){
                for(let field of this.fields){
                    let {children,index:code} = field;
                    if(code === this.fieldName){
                        return field;
                    }else{
                        if(children && children.length > 0){
                            for(let child of children){
                                if(child.index === this.fieldName){
                                    return child;
                                }
                            }
                        }
                    }
                }
                return null;
            },
            privileges(){
                return this.$store.state.privileges;
            },
            nowPrivilege(){
                return this.$store.getters.getPrivilegeByMenuPath(this.$route.path,this.privileges);
            },
        },
        methods:{
            initData(){
                Promise.all([this.$request.get('/api/admin/associator/getFieldsInfo',{params:{topicTypes:[6]}})]).then(([cityFields])=>{
                    let otherFields =[{
                        code: 'branch',
                        name: '分会分布',
                        title: '分会分布情况',
                        table: 'branch',
                        columnName: 'address',
                        index: 'branch'
                    },{
                        code: 'unit',
                        name: '单位分布',
                        title: '单位分布情况',
                        table: 'unit',
                        columnName: 'organizationAddress',
                        index: 'unit'
                    }];

                    let members = {
                        code: 'member',
                        name: '校友分布',
                        title: '校友分布',
                        table: 'member',
                        index: 'member'

                    };

                    let children = [];

                    cityFields.data.map(field=>{
                        let _filed = {...field};
                        _filed.table = 'member';
                        _filed.columnName = field.code;
                        _filed.title = `会员【${field.name}】分布情况`;
                        _filed.index = 'member_'+field.code;
                        children.push(_filed);
                    });

                    members.children = children;

                    let _children = [];

                    cityFields.data.map(field=>{
                        let _filed = {...field};
                        _filed.table = 'donation';
                        _filed.columnName = field.code;
                        _filed.title = `捐赠【${field.name}】分布情况`;
                        _filed.index = 'donation_'+field.code;
                        _children.push(_filed);
                    });

                    let donations = {
                        code: 'donation',
                        name: '捐赠分布',
                        title: '捐赠分布情况',
                        table: 'donation',
                        index: 'donation'
                    };

                    donations.children = _children;

                    this.fields = otherFields.concat([members,donations]);
                });
            },
            setField(fieldName){
                this.fieldName = fieldName;
            },
            drillingDown(data){
                let field = {...data.field};
                field.value = data.name;
                this.condition = field;
                this.tableName = field.table+'Table';
                this.dialogTitle = "【"+data.name+"】"+field.title;
                this.dialogVisible = true;
            }
        },
        created() {
            this.initData();
        }
    }
</script>

<template>
    <div class="memberTypeManage">
        <el-header class="flex border-bottom" style="line-height: 60px;">
            <div class="flex-fill-in-the-remaining-space">
                <div style="font-size: 16px;">所有类型</div>
            </div>
            <div>
                <el-button icon="el-icon-s-grid" type="text" @click="memberTypeManage = true">管理</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding memberTypeMenu">
            <el-menu @select="setChosenType" class="border-right-unset custom-el-menu" :default-active="chosenType">
                <el-menu-item v-for="memberType of memberTypeList" :index="memberType.id" :key="memberType.id">
                    <div class="text-overflow" style="width: 160px;">{{memberType.typeName}}</div>
                </el-menu-item>
            </el-menu>
        </el-main>
        <el-dialog :visible.sync="memberTypeManage" :close-on-click-modal="false" append-to-body title="类型管理" width="800px">
            <div class="text-align-right">
                <el-button icon="el-icon-plus" size="small" type="primary" plain @click="newMemberType"
                           style="margin-bottom: 20px;">
                    添加类型
                </el-button>
            </div>
            <el-table size="small" :data="memberTypeList" class="custom-el-table header-gray" border stripe height="400px">
                <el-table-column label="会员类型名称" width="200px" prop="typeName" show-tooltip-when-overflow/>
                <el-table-column label="类型属性" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <div>{{row.nature ? '团体会员' : '个人会员'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="会员类型描述" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.typeDescription}" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="{row}">
                        <el-button size="small" type="text" class="custom-el-button unset-padding" @click="modMemberType(row.id)">编辑</el-button>
                        <el-button size="small" type="text" class="custom-el-button unset-padding danger" @click="deleteMemberType(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :title="formTitle" :visible.sync="formVisible" append-to-body :close-on-click-modal="false" width="800px">
            <member-type-form v-if="formVisible" :type-id="formId"  @close="formVisible =false" @refresh="getMemberTypes"/>
        </el-dialog>
    </div>
</template>

<script>
    import MemberTypeForm from "./MemberTypeForm";
    export default {
        name: "MemberTypeManage",
        components: {MemberTypeForm},
        data() {
            return {
                memberTypeManage: false,//列表弹窗
                addMemberType: false,//添加会员类型
                updateMemberType: false,//编辑会员类型
                memberTypeList: [],

                chosenType: '',

                formId: null,
                formVisible: false,
                formTitle: '新增申请表',
            }
        },
        methods:{
            newMemberType(){
                this.formId = null;
                this.formTitle = '新增会员类型';
                this.formVisible = true;
            },
            modMemberType(id){
                this.formId = id;
                this.formTitle = '修改会员类型';
                this.formVisible = true;
            },
            deleteMemberType(memberTypeId){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/memberType/deleteMemberType',{
                        params:{memberTypeId}
                    }).then(()=>{
                        this.getMemberTypes();
                        this.$message.success('会员类型已删除');
                    })

                }).catch(()=>{});
            },
            getMemberTypes(){
                this.$request.get('/api/admin/memberType/getMemberTypes').then(res=>{
                    this.memberTypeList = res.data;
                    if(!this.chosenType && res.data.length > 0){
                        this.chosenType = res.data[0].id;
                    }

                    if(this.chosenType){
                        let isExistType = false;
                        for(let type of res.data){
                            if(type.id === this.chosenType){
                                isExistType = true;
                                break;
                            }
                        }

                        if(!isExistType && res.data.length > 0){
                            this.chosenType = res.data[0].id;
                        }
                    }


                })
            },
            setChosenType(index){
                this.chosenType = index;
            }
        },
        created() {
            this.getMemberTypes();
        },
        watch:{
            chosenType(val){
                if(val){
                    let chosenType = {};
                    for(let type of this.memberTypeList){
                        if(type.id === val){
                            chosenType = {...type};
                        }
                    }
                    this.$emit('chosen-type',chosenType);
                }
            }
        }
    }
</script>

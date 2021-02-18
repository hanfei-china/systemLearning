<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 0 16px 16px;" v-loading="loading">
        <el-header class="unset-padding" height="auto">
            <div class="text-align-right" style="padding: 16px 0;">
                <el-button size="small" type="primary" @click="addDictionary">添加枚举字典</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative">
            <el-table class="custom-el-table header-gray" :data="dictionaryList" height="100%" size="small" tooltip-effect="dark" border>
                <el-table-column label="序号" width="50">
                    <template v-slot="{$index}">
                        <div class="text-align-center">
                            {{$index+1}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="title"/>
                <el-table-column label="层级">
                    <template slot-scope="{row}">
                        {{row.layerCount + '级'}}
                    </template>
                </el-table-column>
                <el-table-column label="最近修改时间" show-overflow-tooltip>
                    <template v-slot="{row}">
                        {{row.updateTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" show-overflow-tooltip>
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="描述" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.description}" />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200">
                    <template slot-scope="{row}">
                        <el-button type="text" class="unset-padding" size="small" @click="manageDictionary(row)">枚举项管理</el-button>
                        <el-button type="text" size="small" class="unset-padding" @click="editDictionary(row)">编辑</el-button>
                        <el-button @click="deleteDictionary(row)" class="unset-padding custom-el-button danger" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialogShow" :title="dialogTitle"
                   width="800px">
            <dictionary-form v-if="dialogShow" :data="dictionary"
                             @close="dialogShow = false" @refresh-list="getDictionaryList"/>
        </el-dialog>
        <enum-item-manage v-if="enumItemManageVisible" :visible.sync="enumItemManageVisible" :dictionary="dictionary"/>
    </el-container>
</template>

<script>
    import DictionaryForm from './DictionaryForm';
    import EnumItemManage from './EnumItemManage';

    export default {
        name: "EnumDictionaryManage",
        components: {EnumItemManage, DictionaryForm},
        data(){
            return {
                dictionaryList:[],
                dialogShow: false,
                enumItemManageVisible:false,
                loading: false,
                dictionary: null,
                dialogTitle: ''
            }
        },
        methods:{
            getDictionaryList(){
                this.loading=true;
                this.$request.get('/api/admin/associator/getEnumInfos').then(data=>{
                    if(data.success){
                        this.dictionaryList=data.data;
                        this.loading=false;
                    }
                })
            },
            addDictionary(){
                this.dialogTitle = '添加枚举字典';
                this.dictionary = Object.assign({},{
                    id: '',
                    title: '',
                    layerCount: 3,
                    description: '',
                    enabled: true
                });
                this.dialogShow = true;
            },
            editDictionary(row){
                this.dialogTitle = '编辑枚举字典';
                this.dictionary = {...row};
                this.dialogShow = true;
            },
            manageDictionary(row){
                this.dictionary = JSON.parse(JSON.stringify(row));
                this.enumItemManageVisible = true;
            },
            deleteDictionary(row){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('/api/admin/associator/deleteEnumInfo',{
                        params:{enumId:row.enumId}
                    }).then(()=>{
                        this.getDictionaryList();
                        this.$message.success(`字典【${row.title}】已成功删除`);
                    })
                }).catch(()=>{});
            }
        },
        created() {
            this.getDictionaryList();
        }
    }
</script>

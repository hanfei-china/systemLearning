<template>
    <el-container style="height: 500px;">
        <el-main class="unset-padding position-relative">
            <el-table :data="list" height="100%" class="custom-el-table header-gray" size="small" border stripe>
                <el-table-column label="序号" width="50" fixed>
                    <template v-slot="{$index}">
                        <div class="text-align-center">
                            {{$index+1}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="单位名称" min-width="150" prop="organizationName" show-tooltip-when-overflow/>
                <el-table-column label="校友企业" width="80">
                    <template v-slot="{row}">
                        {{row.isSchoolFellow ? '是' : '否'}}
                    </template>
                </el-table-column>
                <el-table-column label="校友数量(人)" align="right" width="100" prop="personsInOrganization">
                    <template v-slot="{row}">
                        <el-button @click="setOrganizationId(row)" type="text" size="small" class="unset-padding">{{row.personsInOrganization}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column type="expand" width="100" label="更多信息">
                    <template slot-scope="{row}">
                        <div>
                            <div>
                                <el-divider content-position="left">单位信息</el-divider>
                                <div>
                                    <div class="flex expand-field">
                                        <div class="expand-field-title">所属行业：</div>
                                        <div class="expand-field-content">{{transferIndustry(row.categories)}}</div>
                                    </div>
                                    <div class="flex expand-field">
                                        <div class="expand-field-title">所在城市：</div>
                                        <div class="expand-field-content">{{ transferCity(row.organizationAddress) }}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <el-divider content-position="left">联系人信息</el-divider>
                                <div>
                                    <div class="flex expand-field">
                                        <div class="expand-field-title">联系人姓名：</div>
                                        <div class="expand-field-content">{{ row.contactPerson }}</div>
                                    </div>
                                    <div class="flex expand-field">
                                        <div class="expand-field-title">联系方式：</div>
                                        <div class="expand-field-content">{{ row.contactPhone }}</div>
                                    </div>
                                    <div class="flex expand-field">
                                        <div class="expand-field-title">联系地址：</div>
                                        <div class="expand-field-content">{{ row.contactAddress }}</div>
                                    </div>
                                </div>
                            </div>

                            <div v-show="row.isSchoolFellow">
                                <el-divider content-position="left">校友信息</el-divider>
                                <div>
                                    <div class="flex expand-field">
                                        <div class="expand-field-title">校友姓名：</div>
                                        <div class="expand-field-content">{{ row.schoolFellowName }}</div>
                                    </div>
                                    <div class="flex expand-field">
                                        <div class="expand-field-title">联系方式：</div>
                                        <div class="expand-field-content">{{ row.schoolFellowPhone }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer height="auto" class="unset-padding">
            <div style="padding-bottom: 16px;padding-top: 16px;" class="flex">
                <div class="flex-fill-in-the-remaining-space"></div>
                <div>
                    <el-pagination background :total="total" :page-size="page.pageSize" :current-page="page.pageNum"
                                   layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10,20,50]"
                                   @size-change="sizeChange" @current-change="currentChange"/>
                </div>
            </div>
        </el-footer>
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="760px" append-to-body :close-on-click-modal="false">
            <member-table v-if="dialogVisible" :condition="memberCondition"/>
        </el-dialog>
    </el-container>
</template>

<script>
    import {cascadeArrayToString,objectArrayToString} from "../../../../../js/util/utilFunction";
    import MemberTable from "./MemberTable";
    export default {
        name: "UnitTable",
        components: {MemberTable},
        props: ["condition"],
        data(){
            return {
                page:{
                    pageSize: 20,
                    pageNum: 1,
                },
                total: 0,
                list:[],

                dialogTitle: '',
                dialogVisible: false,
                dialogId: ''
            }
        },
        computed:{
            memberCondition(){
                return {
                    code: 'organization',
                    topicType: 2,
                    value: this.dialogId
                }
            }
        },
        methods:{
            getList(){
                let params = {
                    orderWay: 1,
                    limit: this.page.pageSize,
                    offset: (this.page.pageNum - 1) * this.page.pageSize,
                    province: this.condition.value
                };
                this.$request.get('/api/admin/organization/listOrganizationByCondition',{params}).then((resp)=>{
                    let {data} = resp;
                    this.list = data.list;
                    this.total = data.total;
                })
            },
            sizeChange(size){
                this.page.pageSize =size;
                this.refresh();
            },
            currentChange(current){
                this.page.pageNum = current;
                this.getList();
            },
            transferCity(cities){
                return cascadeArrayToString(cities);

            },
            transferIndustry(industries){
                return objectArrayToString(industries,'title');
            },
            setOrganizationId(row){
                this.dialogId = row.id;
                this.dialogTitle = row.organizationName;
                this.dialogVisible = true;
            }
        },
        mounted() {
            this.getList();
        }
    }
</script>
<style>
    .expand-field{
        font-size: 14px;
        padding-bottom: 6px;
    }
    .expand-field-title{
        flex: 0 0 90px;
        text-align: right;
        color: #303133;
        margin-right: 6px;
    }
</style>

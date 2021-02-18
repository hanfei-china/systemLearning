<template>
    <el-container class="absolute-fill-parent" style="padding: 16px;">
        <el-main class="unset-padding">
            <el-table :data="list" height="100%" width="100%"
                      class="custom-el-table header-gray" size="small" border stripe
                      @row-click="viewMemberInfo">
                <el-table-column label="头像" width="55" align="center">
                    <template v-slot="{row}">
                        <el-avatar size="small" :src="row.headImg"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="手机号" prop="phone"></el-table-column>
                <el-table-column label="所在城市">
                    <template v-slot="{row}">
                        {{transferCity(row.currentCity)}}
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer height="auto" style="padding: 16px 0 0;">
            <div class="text-align-right">
                <el-pagination
                        size="small" background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-sizes="[20, 50, 100, 200]"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total">
                </el-pagination>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import {cascadeArrayToString, objectArrayToString} from "../../../../../../../js/util/utilFunction";
    export default {
        name: "UnitSchoolmate",
        props: ['unitInfo'],
        data(){
            return {
                list: [],
                page: {
                    pageSize: 20,
                    currentPage: 1,
                    total: 0
                },
            }
        },
        created() {
            this.getSchoolmateList();
        },
        methods: {
            transferIndustry(industries) {
                return objectArrayToString(industries, 'title');
            },
            transferCity(cities) {
                return cascadeArrayToString(cities);
            },
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.getSchoolmateList();
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getSchoolmateList();
            },
            getSchoolmateList() {
                this.$request.get('/api/common/organization/anon/getSchoolFellowList', {
                    params: {
                        id: this.unitInfo.id,
                        limit: this.page.pageSize,
                        offset: this.page.pageSize * (this.page.currentPage - 1)
                    }
                }).then(res => {
                    this.list = res.data.list;
                    this.page.total = res.data.total;
                })
            },
            viewMemberInfo(row){
                this.$emit('viewMemberInfo',row)
            }
        }
    }
</script>

<style scoped>

</style>
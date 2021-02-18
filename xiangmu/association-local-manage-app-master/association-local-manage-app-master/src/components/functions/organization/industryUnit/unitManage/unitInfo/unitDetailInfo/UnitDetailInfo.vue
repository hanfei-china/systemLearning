<template>
    <el-container class="absolute-fill-parent">
        <el-main>
            <vue-scroll>
                <el-form size="small" label-width="120px">
                    <el-form-item label="单位名称">{{unitInfo.organizationName}}</el-form-item>
                    <el-form-item label="单位logo">
                        <div style="width: 80px;height: 80px;background-color: #f5f7fa;">
                            <el-image :src="unitInfo.logoUrl" fit="cover" style="width: 80px;height: 80px;">
                                <div slot="error" style="font-size: 18px;color: #909399;line-height: 80px;text-align: center;">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </div>
                    </el-form-item>
                    <el-form-item label="所属行业">{{unitInfo.organizationNature}}</el-form-item>
                    <el-form-item label="所在城市">{{transferCity(unitInfo.organizationAddress)}}</el-form-item>
                    <el-form-item label="详细地址">{{unitInfo.contactAddress}}</el-form-item>
                    <el-form-item label="联系人姓名">{{unitInfo.contactPerson}}</el-form-item>
                    <el-form-item label="联系方式">{{unitInfo.contactPhone}}</el-form-item>
                    <template v-if="unitInfo.isSchoolFellow">
                        <el-form-item label="校友姓名">{{unitInfo.schoolFellowName || '-'}}</el-form-item>
                        <el-form-item label="校友联系方式">{{unitInfo.schoolFellowPhone || '-'}}</el-form-item>
                    </template>
                    <el-form-item label="单位描述">
                        <div v-if="unitInfo.descriptions" class="border" style="padding: 10px;">
                            <div v-html="unitInfo.descriptions"></div>
                        </div>
                        <div v-else>-</div>
                    </el-form-item>
                </el-form>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    import {cascadeArrayToString, objectArrayToString} from "../../../../../../../js/util/utilFunction";

    export default {
        name: "UnitDetailInfo",
        props: ['unitInfo'],
        methods: {
            transferIndustry(industries) {
                return objectArrayToString(industries, 'title');
            },
            transferCity(cities) {
                return cascadeArrayToString(cities);
            },
        }
    }
</script>

<style scoped>

</style>

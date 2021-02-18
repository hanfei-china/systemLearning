<template>
    <el-container class="absolute-fill-parent">
        <el-header class="border-bottom" height="auto" style="padding: 16px;">单位信息</el-header>
        <el-main class="unset-padding position-relative">
            <el-container class="absolute-fill-parent">
                <el-header height="auto" class="unset-padding">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                             @select="handleSelect">
                        <el-menu-item index="unitDetailInfo">企业详细信息</el-menu-item>
                        <el-menu-item index="unitProduct">产品与服务</el-menu-item>
                        <el-menu-item index="unitCoupon">优惠券</el-menu-item>
                        <el-menu-item index="unitExpenseRecords">消费记录</el-menu-item>
                        <el-menu-item index="unitSchoolmate">企业校友</el-menu-item>
                    </el-menu>
                </el-header>
                <el-main class="position-relative unset-padding">
                    <unit-detail-info v-if="activeIndex === 'unitDetailInfo'" :unitInfo="unitInfo"></unit-detail-info>
                    <unit-product v-if="activeIndex === 'unitProduct'" :unitInfo="unitInfo"></unit-product>
                    <unit-coupon v-if="activeIndex === 'unitCoupon'" :unitInfo="unitInfo"></unit-coupon>
                    <unit-expense-records v-if="activeIndex === 'unitExpenseRecords'" :unitInfo="unitInfo"></unit-expense-records>
                    <unit-schoolmate v-if="activeIndex === 'unitSchoolmate'" :unitInfo="unitInfo" @viewMemberInfo="viewMemberInfo"></unit-schoolmate>
                </el-main>
                <member-info-by-id title="会员信息" v-if="memberInfoVisible" show-account-info
                                   :visible.sync="memberInfoVisible" :member-id="memberInfoId"></member-info-by-id>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
    import MemberInfoById from "../../../member/common/MemberInfoById";
    import UnitDetailInfo from "./unitDetailInfo/UnitDetailInfo";
    import UnitSchoolmate from "./unitSchoolmate/UnitSchoolmate";
    import UnitExpenseRecords from "./unitExpenseRecords/UnitExpenseRecords";
    import UnitProduct from "./unitProduct/UnitProduct";
    import UnitCoupon from "./unitCoupon/UnitCoupon";

    export default {
        name: "UnitInfo",
        components: {UnitCoupon, UnitProduct, UnitExpenseRecords, UnitSchoolmate, UnitDetailInfo, MemberInfoById},
        props: ['unitInfo'],
        data() {
            return {
                activeIndex: 'unitDetailInfo',

                memberInfoVisible: false,
                memberInfoId: ''
            }
        },

        methods: {
            handleSelect(key) {
                this.activeIndex = key;
            },
            viewMemberInfo(row) {
                this.memberInfoVisible = true;
                this.memberInfoId = row.id;
            },
        }
    }
</script>


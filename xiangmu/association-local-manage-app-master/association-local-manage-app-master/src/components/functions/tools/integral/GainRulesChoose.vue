<template>
    <div style="padding: 10px;border: 1px dashed rgb(228, 228, 228);">
        <div style="padding-bottom: 10px;">可添加规则（点击添加）</div>
        <div v-for="rule of computedRules" @click="newRule(rule)" :key="rule.value"
             class="rule-choose-item" :class="{'item-used':rule.isUsed}">
            <div>{{rule.name}}</div>
        </div>
    </div>
</template>

<script>
    import {AllRules} from './js/entity/ruleItem';

    export default {
        name: "GainRulesChoose",
        props: {
            usedRules: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data() {
            return {
                allRules: AllRules
            }
        },
        computed: {
            computedRules() {
                return this.allRules.map(item => {
                    let isUsed = false;
                    for (let rule of this.usedRules) {
                        if (rule.rulesItemType === item.value) {
                            isUsed = true;
                        }
                    }
                    item.isUsed = isUsed;
                    return item;
                });
            }
        },
        methods: {
            newRule(rule) {
                if (!rule.isUsed) {
                    this.$emit('new-rule', rule.value);
                }
            }
        }
    }
</script>
<style scoped lang="less">
    .rule-choose-item {
        padding: 10px;
        border-radius: 4px;
        background-color: rgb(242, 248, 252);
        cursor: pointer;

        &:not(:last-child) {
            margin-bottom: 10px;
        }

        &.item-used {
            background-color: rgb(228, 228, 228);
            cursor: not-allowed;
        }
    }
</style>

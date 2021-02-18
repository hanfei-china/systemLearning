<template>
    <div class="form-field flex flex-column border-bottom">
        <div class="flex">
            <div class="cursor-move flex flex-column flex-center item-sort">
                <i class="iconfont icon-Icon_drag"></i>
            </div>
            <div class="flex-fill-in-the-remaining-space" style="padding-left: 20px;">
                {{rule.attributes.title.value}}
            </div>
            <div style="width: 100px;padding-left: 20px;" class="flex flex-column flex-center">
                <div class="text-align-right">
                    <el-tooltip class="item" effect="dark" content="设置规则" placement="top">
                        <el-button type="text" size="small" @click="settingsIn=!settingsIn" class="custom-el-button unset-padding">
                            <i class="el-icon-setting" style="font-size: 16px;"></i>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除规则" placement="top">
                        <el-button type="text" size="small" @click="$emit('delete-rule')" class="custom-el-button danger unset-padding">
                            <i class="el-icon-delete" style="font-size: 16px;"></i>
                        </el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <div class="form-field-setting-panel" :class="{show:settingsIn}">
            <el-form label-width="210px" size="small">
                <setting v-for="(attribute,index) of rule.attributes" :key="index" :setting="attribute"/>
                <div v-if="rule.rulesArrayAttr" class="rules-array-container">
                    <div class="rules-array-group" v-for="(ruleItem, rindex) in rule.rulesArray" :key="ruleItem.id.value">
                        <div class="rules-array-btns">
                            <el-tooltip class="item" effect="dark" content="删除规则" placement="top">
                                <el-button type="text" size="small" @click="delRule(rindex)" class="custom-el-button danger unset-padding">
                                    <i class="el-icon-remove" style="font-size: 16px;"></i>
                                </el-button>
                            </el-tooltip>
                        </div>
                        <setting v-for="(ruleAttr,index) of ruleItem" :key="rindex + '_' + index" :setting="ruleAttr"/>
                    </div>
                    <div class="rules-add-container">
                        <el-button type="primary" @click="addRule" icon="el-icon-plus">添加规则</el-button>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Setting from "./settings/Setting";
    export default {
        name: "RuleItem",
        components: {Setting},
        props:{
            rule:Object
        },
        data(){
            return {
                settingsIn: false
            }
        },
        methods: {
            addRule () {
                this.rule.rulesArray.push(this.rule.addRule());
            },
            delRule (index) {
                this.rule.rulesArray.splice(index, 1);
            },
        }
    }
</script>
<style scoped>
.rules-array-container {
    margin: 20px 30px;
    padding: 30px;
    border: 1px solid #aaa;
    border-radius: 20px;
}
.rules-array-group {
    position: relative;
    border-bottom: 1px dashed #aaa;
}
.rules-array-group + .rules-array-group {
    margin-top: 30px;
}
.rules-array-btns {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 5;
}
.rules-add-container {
    text-align: center;
}
.rules-array-group + .rules-add-container {
    margin-top: 30px;
}

</style>

<template>
    <div>
        <div>
            <el-tag v-for="(item, index) of showLabels" :key="index" :color="item.color"
                    style="border: none;margin: 0 5px 5px 0;color: #ffffff;">{{item.title}}
            </el-tag>
            <el-button size="small" @click="labelVisible = true">选择标签</el-button>
        </div>
        <el-dialog title="标签" :visible.sync="labelVisible" append-to-body
                   :close-on-click-modal="false" width="600px">
            <label-setting v-model="copyValue" @showLabels="getShowLabels"></label-setting>
        </el-dialog>
    </div>
</template>

<script>
    import LabelSetting from "./LabelSetting";
    export default {
        name: "LabelChoose",
        components: {LabelSetting},
        props: {
            value: Array
        },
        data() {
            return {
                labelVisible: false,
                copyValue: this.value,
                showLabels: [],//展示的标签列表
            }
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        watch: {
            copyValue(val) {
                this.$emit('change', val);
            },
        },
        methods: {
            getShowLabels(val){
                this.showLabels = val;
            }
        },
    }
</script>

<style scoped>

</style>

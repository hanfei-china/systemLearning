<template>
    <el-select placeholder="下拉选择标签" size="small" collapse-tags v-model="copyValue" filterable clearable multiple>
        <el-option-group v-for="group in list" :key="group.groupTitle" :label="group.groupTitle">
            <el-option v-for="item of group.labels" :key="item.id" :value="item.id" :label="item.title"/>
        </el-option-group>
    </el-select>
</template>

<script>
    export default {
        name: "AdvancedLabelChoose",
        props: {
            value: Array
        },
        data() {
            return {
                copyValue: this.value,
                list: [],
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
            value(val) {
                this.copyValue = val;
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                let params = {
                    type: 0
                };
                this.$request.get('/api/admin/label/manage/getLabelGroupsAndLabelsByType', {params: params}).then((resp) => {
                    for (let item of resp.data) {
                        this.list.push({
                            groupTitle: item.title,
                            labels: item.labels
                        });
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>

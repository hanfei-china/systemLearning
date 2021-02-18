<template>
    <div>
        <el-select v-model="copyValue" placeholder="请选择" style="width: 100%;" clearable>
            <el-option v-for="(item,index) in repeatForm[code]" :key="index" :label="item.value"
                       :value="item.key" :style="config.topicType === 4?{'height': 'auto'}:''">
                <div v-if="config.topicType === 4" style="width: 80px;height: 80px;padding: 5px 0;">
                    <el-image style="width: 100%;height: 100%;" fit="cover" :src="item.value"/>
                </div>
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "EditField",
        props: ['value', 'config', 'code', 'repeatForm'],
        model: {
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                copyValue: null,
                options: [],
            }
        },
        created() {
            if (this.value) {
                this.copyValue = this.value;
            }
        },
        watch: {
            copyValue(value) {
                this.$emit('change', value);
            }
        },

    }
</script>

<style scoped>

</style>

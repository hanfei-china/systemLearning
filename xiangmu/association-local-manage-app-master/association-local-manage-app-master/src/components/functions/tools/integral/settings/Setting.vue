<template>
    <el-form-item v-if="!setting.hideInSetting">
        <template v-slot:label>
            <div class="custom-el-form-item-label" :class="{required: setting.required}">
                {{setting.attribute.title}}：
            </div>
        </template>
        <component :style="{'max-width':setting.type==='persetSetting'?'800px': '500px'}" :is="setting.type" :attribute="setting.attribute" v-model="setting.value"/>
    </el-form-item>
</template>

<script>
    import InputSetting from './InputSetting';
    import TextareaSetting from './TextareaSetting';
    import NumberSetting from './NumberSetting';
    import CheckboxSetting from './CheckboxSetting';
    import persetSetting from './persetSetting'
    export default {
        name: "Setting",
        components:{
            InputSetting,TextareaSetting,NumberSetting,CheckboxSetting,persetSetting
        },
        props:{
            setting: Object
        }
    }
</script>

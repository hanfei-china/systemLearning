<template>
    <div>
        <el-input v-if="field.topicType === 0" v-model="fieldCode" placeholder="请输入"></el-input>
        <el-input v-if="field.topicType === 1" v-model="fieldCode" type="textarea" :rows="5" resize="none"
                  placeholder="请输入"></el-input>
        <div v-if="field.topicType === 2">
            <el-select v-model="fieldCode" placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in JSON.parse(field.parameter).options" :key="item.key" :value="item.key"
                           :label="item.title"></el-option>
            </el-select>
        </div>
        <div v-if="field.topicType === 3">
            <el-select v-model="fieldCode" multiple placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in JSON.parse(field.parameter).options" :key="item.key" :value="item.key"
                           :label="item.title"></el-option>
            </el-select>
        </div>
        <div v-if="field.topicType === 4" class="flex" style="height: 100px;">
            <div style="width: 200px;height: 100px;background-color: #cccccc;">
                <el-image v-if="fieldCode" :src="fieldCode" style="width: 100%;height: 100%;" fit="cover"></el-image>
            </div>
            <div class="flex-fill-in-the-remaining-space flex flex-column flex-end" style="padding-left: 16px;">
                <el-upload :action="action" :show-file-list="false" :on-success="uploadImageSuccess">
                    <el-button size="small" type="primary">上传图片</el-button>
                </el-upload>
            </div>
        </div>
    </div>
</template>

<script>
    import {requestBaseUrl} from '../../../../../../../js/config/serviceConfig';
    export default {
        name: "FieldItem",
        props: {
            field: Object,
            value: [String,Number,Object,Array]
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        data() {
            return {
                action: requestBaseUrl + '/api/common/anon/uploadFile',
                fieldCode: this.value
            }
        },
        watch: {
            fieldCode(val){
                this.$emit('change',val);
            },
            value(val){
               if(!this.fieldCode){
                   this.fieldCode = val;
               }
            }
        },
        methods: {
            uploadImageSuccess(res){
                this.fieldCode = res.data;
            }
        }
    }
</script>

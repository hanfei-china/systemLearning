<template>
    <span v-if="field.type !== 8 && field.type !== 6 && field.type !== 7">
       {{transferData}}
    </span>
    <div v-else-if="field.type === 6 && list.length>0" class="flex flex-center flex-column">
        <el-image class="custom-el-image" :src="list[0]" :preview-src-list="list" ref="preview">
            <template v-slot:error>
                <el-button size="small" @click="preview" class="unset-padding" type="text">点击查看图片</el-button>
            </template>
        </el-image>
    </div>
    <div v-else-if="field.type === 7 && list.length>0" class="flex flex-center flex-column">
        <temp-var v-if="list.length === 1" :file="list[0]">
            <template v-slot="{file}" >
                <a class="lrd-a" target="_blank" :href="`${requestBaseUrl}/api/common/onlineForm/download/${formId}/${row.id}/${field.code}/${file.uid}`">{{file.name}}</a>
            </template>
        </temp-var>
        <el-popover placement="right-start" title="文件列表" v-else>
            <el-button slot="reference" size="small" class="unset-padding" type="text">点击查看文件列表</el-button>
            <div>
                <div v-for="file of list" :key="file.uid" class="text-overflow" style="padding-bottom: 8px;">
                    <a class="lrd-a" title="点击下载" target="_blank" :href="`${requestBaseUrl}/api/common/onlineForm/download/${formId}/${row.id}/${field.code}/${file.uid}`">{{file.name}}</a>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<script>
    import {formatDate} from "../../../../../../js/util/utilFunction";
    import TempVar from "../../../../../util/TempVar";
    import {requestBaseUrl} from "../../../../../../js/config/serviceConfig";

    export default {
        name: "OnlineFormPreviewField",
        components: {TempVar},
        props:{
            field:{
                type: Object,
                required: true
            },
            value: [String,Number,Array,Object],
            formInfo:{
                type: Object,
                required: true
            },
            row: Object
        },
        data(){
            return {
                requestBaseUrl
            };
        },
        computed:{
            formId() {
                return this.$route.params.formId;
            },
            list(){
                if(typeof this.value === 'string'){
                    try {
                        return JSON.parse(this.value);
                    }catch (e) {
                        return [this.value];
                    }
                }

                return [];
            },
            transferData() {
                let value = this.value;
                let field = this.field;

                if (value === null || value === undefined) {
                    return '';
                }
                let {type, typeConfig,code} = field;

                if(code === 'createTime' || code === 'handleTime'){
                    return formatDate(new Date(value),'yyyy-MM-dd HH:mm');
                }

                if(code === 'handleStatus'){
                    switch (value) {
                        case 0:
                            return '待处理';
                        case 1:
                            return this.formInfo.resolveText;
                        case 2:
                            return this.formInfo.rejectText;
                        case 3:
                            return '已回复';
                    }
                }


                if (type === 1 || type === 2||type === 9||type===10) {
                    //多行文本或单行文本
                    return value;
                }

                if (type === 3) {
                    let {type: dateType} = typeConfig;

                    if(dateType === 'date'){
                        return formatDate(new Date(value),'yyyy-MM-dd');
                    }

                    if(dateType === 'datetime'){
                        return formatDate(new Date(value),'yyyy-MM-dd HH:mm');
                    }

                    if(dateType === 'time'){
                        return formatDate(new Date(value),'HH:mm');
                    }

                    if(dateType === 'year'){
                        return formatDate(new Date(value),'yyyy');
                    }

                }

                if (type === 4) {
                    let {list} = typeConfig;
                    for (let option of list) {
                        if (option.code === value) {
                            return option.content;
                        }
                    }
                }

                if (type === 5) {
                    let {list} = typeConfig;

                    let str = '';
                    for (let option of list) {
                        if (value.includes(option.code)) {
                            str += option.content + "；";
                        }
                    }
                    return str.slice(0, -1);

                }

                return '';
            }
        },
        methods:{
            preview(){
                if(this.$refs.preview){
                    this.$refs.preview.showViewer = true;
                }
            },
        },
        mounted() {
            if(this.$refs.preview){
                this.$refs.preview.error = true;
            }
        },
    }
</script>

<template>
    <el-upload :action="action" :accept="accept" :show-file-list="false"
               :before-upload="beforeUpload" :on-success="onSuccess">
        <slot><el-button size="small" type="primary">{{buttonTitle}}</el-button></slot>
    </el-upload>
</template>

<script>
    export default {
        name: "CustomUpload",
        props:{
            action:{
                type:String,
                required: true
            },
            buttonTitle:{
                type: String,
                default: '点击上传'
            },
            accept:String,
            beforeUpload: Function,
            onSuccess: Function
        },
    }
</script>

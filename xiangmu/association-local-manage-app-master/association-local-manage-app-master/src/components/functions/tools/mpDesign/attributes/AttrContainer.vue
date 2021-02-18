<template>
    <div class="lrd-attr-container">
        <div class="lrd-attr-title">
            <el-divider content-position="left">
                <span>{{title}}</span>
                <span class="lrd-attr-required" v-if="required">*</span>
            </el-divider>
        </div>
        <div class="lrd-attr-cell">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AttrContainer",
        props:{
            title: {
                type: String,
                default: 'title'
            },
            required: {
                type: Boolean,
                default: false
            }
        }

    }
</script>

<template>
    <div class="block-breadcrumb-sub-item position-relative">
        <slot></slot>
        <i class="block-breadcrumb-sub-item-separator" :class="[separator]"></i>
    </div>
</template>

<script>
    export default {
        name: "BlockBreadcrumbSubItem",
        props: {
            separator: {
                type: String,
                default: 'el-icon-arrow-right'
            }
        }
    }
</script>

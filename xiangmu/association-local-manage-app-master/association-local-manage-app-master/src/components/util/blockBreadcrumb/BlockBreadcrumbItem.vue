<template>
    <div class="block-breadcrumb-item position-relative flex flex-column flex-center scroll-container-item" :class="[theme,{'active':active}]" @click="$emit('click')">
        <div class="block-breadcrumb-item-arrow left-arrow" v-if="theme === 'default'"></div>
        <div v-if="custom">
            <slot name="custom"></slot>
        </div>
        <div class="text-align-center text-nowrap" v-else>
            <slot></slot>
        </div>
        <div class="block-breadcrumb-item-arrow right-arrow" v-if="theme === 'default'"></div>
    </div>
</template>

<script>
    export default {
        name: "BlockBreadcrumbItem",
        props:{
            theme: {
                type: String,
                default: 'default'
            },
            active:{
                type: Boolean,
                default: false
            }
        },
        computed:{
            custom(){
                return this.$slots.custom;
            }
        }
    }
</script>

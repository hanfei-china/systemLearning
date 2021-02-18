<template>
    <div class="scroll-tab-item cursor-pointer position-relative flex flex-column flex-center" @click="$emit('click')">
        <div class="text-align-center text-nowrap">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ScrollTabItem"
    }
</script>

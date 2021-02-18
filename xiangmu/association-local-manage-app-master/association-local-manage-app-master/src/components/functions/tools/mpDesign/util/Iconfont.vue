<template>
    <span>
        <i class="icon iconfont" style="color: inherit !important;font-size: inherit;" :class="icon"></i>
    </span>
</template>

<script>
    export default {
        name: "Iconfont",
        props:{
            icon: String
        }
    }
</script>
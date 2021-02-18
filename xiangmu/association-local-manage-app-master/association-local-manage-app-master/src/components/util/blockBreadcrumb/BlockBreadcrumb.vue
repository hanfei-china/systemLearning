<template>
    <scroll-container class="block-breadcrumb">
        <template v-slot:prefixArea>
            <slot name="prefixArea"></slot>
        </template>
        <template v-slot:leftArrow>
            <slot name="leftArrow"></slot>
        </template>
        <template v-slot:rightArrow>
            <slot name="rightArrow"></slot>
        </template>
        <template v-slot:suffixArea>
            <slot name="suffixArea"></slot>
        </template>
        <slot></slot>
    </scroll-container>
</template>

<script>
    import ScrollContainer from "../scrollContainer/ScrollContainer";
    export default {
        name: "BlockBreadcrumb",
        components: {ScrollContainer}
    }
</script>

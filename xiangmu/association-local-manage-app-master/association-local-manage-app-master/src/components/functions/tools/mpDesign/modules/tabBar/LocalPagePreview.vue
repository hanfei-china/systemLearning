<template>
    <el-container class="absolute-fill-parent">
        <el-header height="50px" class="unset-padding page-title" style="text-align: center;line-height: 50px;"
                   :style="titleStyle"
                   v-show="hasTitle">
            {{attributes.title.value}}
        </el-header>
        <el-main class="unset-padding position-relative">
            <vue-scroll>
                <img style="width: 100%;" :src="image">
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "LocalPagePreview",
        props:{
            attributes: Object,
            image: String
        },
        computed: {
            hasTitle() {
                return true;
            },
            titleStyle() {
                return {
                    color: this.attributes.titleColor.value,
                    backgroundColor: this.attributes.titleBackgroundColor.value
                }
            }
        },
    }
</script>

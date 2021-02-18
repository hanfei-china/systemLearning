<template>
    <div class="absolute-fill-parent flex flex-column flex-center">
        <div class="flex flex-center">
            <div>
                <div class="text-align-center">
                    <img src="../../../assets/nodata.png" :style="{width}">
                </div>
                <div><slot></slot></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NoData",
        props:{
            width:{
                type: String,
                default: '250px'
            }
        }
    }
</script>

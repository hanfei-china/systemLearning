<template>
    <a v-if="href" class="new-mp-click-div" :href="href" target="_blank">
        <div class="new-mp-click-div-cover absolute-fill-parent flex flex-center flex-column">
            <div class="flex flex-center">
                <div style="width: 70px;height: 66px;">
                    <i style="font-size: 60px;" class="iconfont" :class="icon"></i>
                </div>
                <div class="flex flex-column flex-center" style="font-size: 14px;">
                    <div><a class="lrd-a">点击这里</a>{{tip}}</div>
                </div>
            </div>
        </div>
    </a>
    <div v-else class="new-mp-click-div" @click="$emit('click')">
        <div class="new-mp-click-div-cover absolute-fill-parent flex flex-center flex-column">
            <div class="flex flex-center">
                <div style="width: 70px;height: 66px;">
                    <i style="font-size: 60px;" class="iconfont" :class="icon"></i>
                </div>
                <div class="flex flex-column flex-center" style="font-size: 14px;">
                    <div><a class="lrd-a">点击这里</a>{{tip}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NewMpHover",
        props:{
            icon: String,
            tip: String,
            href: String
        },
    }
</script>

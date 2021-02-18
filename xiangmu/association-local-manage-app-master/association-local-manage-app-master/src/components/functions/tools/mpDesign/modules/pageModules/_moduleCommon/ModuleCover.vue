<template>
    <div class="module-cover-container" @mouseenter.stop="show" @mouseover.stop="show" @mousemove="show" @mouseleave.stop="hide" @mouseout.stop="hide">
        <div class="module-cover-content" >
            <slot></slot>
        </div>
        <div class="module-cover-cover" v-show="hover">
            <slot name="cover"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ModuleCover",
        data(){
            return {
                hover: false
            }
        },
        methods:{
            show(){
                this.hover = true;
            },
            hide(){
                this.hover = false;
            }
        }
    }
</script>
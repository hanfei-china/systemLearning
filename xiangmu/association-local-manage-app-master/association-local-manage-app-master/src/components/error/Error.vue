<template>
    <div class="flex flex-column flex-center fixed-fill-parent">
        <div class="error-background-image" style="width: 800px;">
            <img :src="errorBgi">
        </div>
    </div>
</template>

<script>
    import errorBgi from '../../assets/404.png';

    export default {
        name: "Error",
        data(){
            return {
                errorBgi,
            }
        },
    }
</script>


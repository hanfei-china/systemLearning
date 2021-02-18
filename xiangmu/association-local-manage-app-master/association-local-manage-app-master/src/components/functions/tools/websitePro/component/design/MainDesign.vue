<template>
    <design-container :module-id="moduleId" type="main"/>
</template>

<script>
    import DesignContainer from "./DesignContainer";
    export default {
        name: "MainDesign",
        components: {DesignContainer},
        computed:{
            moduleId(){
                return this.$route.params.moduleId;
            },
        }
    }
</script>

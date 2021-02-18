<template>
    <design-container :module-id="moduleId" type="header"/>
</template>

<script>
    import DesignContainer from "./DesignContainer";
    export default {
        name: "HeaderDesign",
        components: {DesignContainer},
        computed:{
            moduleId(){
                return this.$route.params.moduleId;
            },
        }
    }
</script>

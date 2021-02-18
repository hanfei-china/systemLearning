<template>
    <design-container :module-id="moduleId" type="footer"/>
</template>

<script>
    import DesignContainer from "./DesignContainer";
    export default {
        name: "FooterDesign",
        components: {DesignContainer},
        computed:{
            moduleId(){
                return this.$route.params.moduleId;
            },
        }
    }
</script>

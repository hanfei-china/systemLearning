<template>
    <div class="absolute-fill-parent">
        <vue-scroll>
            <div class="flex flex-wrap template-sample-container">
                <div class="template-sample" v-for="(template,index) of moduleConfig.templates"
                     :class="{choose: index === moduleConfig.index}" :key="template.name"
                     @click="changeTemplate(index)">
                    <div class="template-sample-cover flex flex-column flex-center">
                        <div class="text-align-center">
                            <i class="iconfont icon-checked"/>
                        </div>
                    </div>
                    <img :src="template.templateSample"/>
                </div>
            </div>
        </vue-scroll>
    </div>
</template>

<script>
    export default {
        name: "ActivityTemplates",
        props:{
            moduleConfig: Object
        },
        methods:{
            changeTemplate(index){
                this.moduleConfig.index = index;
            }
        }
    }
</script>


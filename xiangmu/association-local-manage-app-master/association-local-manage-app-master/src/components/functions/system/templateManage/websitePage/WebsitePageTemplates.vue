<template>
    <el-container class="absolute-fill-parent">
        <el-aside width="200px" class="border-right background-color-white position-relative">
            <vue-scroll>
                <el-menu class="border-right-unset custom-el-menu" @select="select"  :default-active="moduleId">
                    <el-menu-item v-for="module of modules" :index="module.name" :key="module.name">
                        {{module.title}}
                    </el-menu-item>
                </el-menu>
            </vue-scroll>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <template-list :template-config="templateConfigStr" :template-type="0" :module-id="moduleId"/>
        </el-main>
    </el-container>
</template>

<script>
    import TemplateList from "../common/TemplateList";
    export default {
        name: "WebsitePageTemplates",
        components: {TemplateList},
        data(){
            return {
                templateConfig:{
                    otherSetting:{
                        customCss: '',
                    },
                    modules:[]
                },
                moduleId: 'main',
                modules: [
                    {name:'main',title:'页面模版'},
                    {name:'header',title:'页头模版'},
                    {name:'footer',title:'页尾模版'},
                ]
            }
        },
        computed:{
            templateConfigStr(){
                return JSON.stringify(this.templateConfig);
            }
        },
        methods:{
            select(index){
                this.moduleId = index;
            }
        }
    }
</script>

<template>
    <el-container class="absolute-fill-parent">
        <el-aside width="200px" class="border-right background-color-white position-relative">
            <vue-scroll>
                <el-menu class="border-right-unset custom-el-menu" @select="select" :default-openeds="defaultOpens" :default-active="moduleId">
                    <el-submenu v-for="moduleGroup of moduleGroups" :index="moduleGroup.name" :key="moduleGroup.name">
                        <span slot="title">{{moduleGroup.title}}</span>
                        <el-menu-item v-for="module of moduleGroup.modules" :index="module.name" :key="module.name">
                            <i :class="module.icon" style="color: #0A0A0A;padding-right: 6px;"/>{{module.title}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </vue-scroll>
        </el-aside>
        <el-main class="unset-padding position-relative">
            <template-list :template-config="templateConfig" :template-type="1" :module-id="moduleId"/>
        </el-main>
    </el-container>
</template>

<script>
    import TemplateList from "../common/TemplateList";
    import {moduleBuilder, moduleGroups} from "../../../tools/websitePro/js/modules/moduleBuilder";

    export default {
        name: "WebsiteModuleTemplates",
        components: {TemplateList},
        data(){
            return {
                moduleGroups,
                moduleId: 'wsText'
            }
        },
        computed:{
            defaultOpens(){
                let opens = [];
                for(let moduleGroup of this.moduleGroups){
                    opens.push(moduleGroup.name);
                }
                return opens;
            },
            templateConfig(){
                let module = moduleBuilder(this.moduleId, {version:'1.0'}).setPosition({left:0,right:0});
                return JSON.stringify(module.toJsonWithoutId());
            }
        },
        methods:{
            select(index){
                this.moduleId = index;
            }
        }
    }
</script>

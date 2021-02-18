<template>
    <el-container class="absolute-fill-parent background-color-white">
        <el-aside width="200px" class="border-right background-color-white position-relative">
            <vue-scroll>
                <el-menu class="border-right-unset custom-el-menu" @select="select"  :default-active="moduleId">
                    <el-menu-item v-for="module of modules" :index="module.name" :key="module.name">
                        {{module.title}}
                    </el-menu-item>
                </el-menu>
            </vue-scroll>
        </el-aside>
        <el-main class="position-relative flex flex-column flex-center background-color-white">
            <a class="website-pro-to-design website-pro-position-relative" :href="href" target="_blank">
                <div class="website-pro-flex">
                    <div style="width: 70px;">
                        <i style="font-size: 60px;" class="el-icon-s-promotion"/>
                    </div>
                    <div class="flex-fill-in-the-remaining-space" style="font-size: 14px;padding-top: 14px;">
                        {{moduleName}}设计需打开新的窗口，<a>点击这里</a>去设计{{moduleName}}吧
                    </div>
                </div>
            </a>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "CertificateDesign",
        data(){
            return {
                modules: [
                    {name:'memberCertificate',title:'会员证书'},
                    {name:'donationCertificate',title:'捐赠证书'},
                ],
                moduleId: 'memberCertificate'
            }
        },
        computed:{
            moduleName(){
                for (let module of this.modules){
                    let {name,title} = module;
                    if(name === this.moduleId){
                        return title;
                    }
                }

                return '';
            },
            href(){
                return this.$router.resolve(`/pdfTemplate/design/${this.moduleId}`).href;
            }
        },
        methods:{
            select(index){
                this.moduleId = index;
            }
        },
    }
</script>

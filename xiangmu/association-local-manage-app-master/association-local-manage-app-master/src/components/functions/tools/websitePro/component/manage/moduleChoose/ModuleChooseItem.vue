<template>
    <div class="website-pro-module-group-module-item" :class="{'un-used':unUsed,active}"
         data-group="web-site-module" :draggable="!unUsed" @click="showTemplates"
         @dragstart.stop="dragStart($event)" @dragend.stop="dragEnd">
        <div v-show="templates.length>0" @click="click" class="website-pro-module-group-module-item-module">
            <i class="iconfont icon-template"/>
        </div>
        <div class="website-pro-module-group-module-item-icon">
            <i :class="module.icon"/>
        </div>
        <div class="website-pro-module-group-module-item-title">
            <span>{{module.title}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ModuleChooseItem",
        props: {
            module: Object,
            templateGroup: Object,
            unUsedModules: Array,
            chooseModule: String
        },
        computed: {
            active(){
                return this.module.name === this.chooseModule;
            },
            templates() {
                if (this.templateGroup && this.module) {
                    return this.templateGroup[this.module.name] || [];
                }

                return [];
            },
            unUsed(){
                if(this.unUsedModules && this.unUsedModules.length > 0 && this.module){
                    return this.unUsedModules.indexOf(this.module.name) > -1;
                }

                return false;
            }
        },
        methods: {
            dragStart(event) {
                if(this.unUsed){
                    return;
                }
                this.$emit('dragstart', event, this.module.name, {version: 1.0});
            },
            dragEnd() {
                this.$emit('dragend');
            },
            click(event){
                if(this.unUsed){
                    event.stopPropagation();
                }
            },
            showTemplates(){
                if(!this.unUsed){
                    if(this.templates.length>0){
                        if(!this.active){
                            this.$emit('show-templates', this.templates, this.module.name, this.module.title);
                        }
                    }else{
                        this.$emit('show-templates', [], '', '');
                    }
                }

            }
        }
    }
</script>

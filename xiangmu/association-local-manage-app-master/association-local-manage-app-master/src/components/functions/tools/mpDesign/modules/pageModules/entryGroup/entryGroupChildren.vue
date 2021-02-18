<template>
    <el-container class="absolute-fill-parent" style="">
        <el-header class="unset-padding" height="auto">
            <div style="padding: 8px 10px 0;" >
                <el-button style="width: 100%;" type="primary" @click="addButton" size="medium" plain>+添加按钮</el-button>
            </div>
        </el-header>
        <el-main class="unset-padding">
            <vue-scroll>
                <div style="padding: 7px 10px;">
                    <draggable v-model="module.list">
                        <module-cover class="button-setting-container-cover" v-for="(module, index) of module.list"
                                      :key="index">
                            <div class="button-setting-container">
                                <div class="btn-icon">
                                    <img class="btn-icon-img" :src="module.attributes.icon.value">
                                </div>
                                <div class="btn-title">{{module.attributes.title.value}}</div>
                            </div>
                            <template v-slot:cover>
                                <div class="absolute-fill-parent" style="background-color: rgba(0,0,0,0.3)">
                                    <div class="handler-btn-container">
                                        <el-button-group class="cover-button-group position-relative"
                                                         style="padding-top: 12px;padding-right: 10px;">
                                            <el-button type="primary" icon="el-icon-setting" circle
                                                       @click="settingModule(module)" size="mini"></el-button>
                                            <el-button type="primary" icon="el-icon-rank" circle
                                                       size="mini"></el-button>
                                            <el-button type="primary" icon="el-icon-delete" circle
                                                       @click="deleteModule(index)" size="mini"></el-button>
                                        </el-button-group>
                                    </div>
                                </div>
                            </template>
                        </module-cover>
                    </draggable>
                </div>
            </vue-scroll>
        </el-main>
    </el-container>
</template>

<script>
    import draggable from 'vuedraggable';
    import ModuleCover from '../_moduleCommon/ModuleCover';

    export default {
        name: "entryGroupChildren",
        components: {
            draggable,
            ModuleCover
        },
        props: {
            module: Object,
        },
        methods: {
            addButton() {
                this.module.addEntry();
            },
            deleteModule(index){
                this.module.deleteEntry(index);
            },
            settingModule(module){
                this.$emit('child-module-setting', module);
            }
        }
    }
</script>
<style lang="less" scoped>
    .button-setting-container-cover {
        &:not(:last-child) {
            margin-bottom: 10px;
        }

        .button-setting-container {
            display: flex;
            border: 1px solid #f4f6fc;
            background-color: #f4f6fc;
            padding: 4px;


            .btn-icon {
                width: 50px;
                text-align: center;
            }

            .btn-icon-img {
                width: 46px;
                height: 46px;
                display: block;
            }

            .btn-title {
                flex: 1;
                line-height: 46px;
                font-size: 14px;
            }
        }
    }

</style>

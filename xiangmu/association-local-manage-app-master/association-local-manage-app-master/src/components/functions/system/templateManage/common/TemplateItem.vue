<template>
    <div class="template-item" @mouseenter="scrollStart" @mouseleave="scrollEnd">
        <div class="template-item-example">
            <img ref="sample" @load="loaded" :style="imgStyle" v-if="templateInfo.templateExample" :src="templateInfo.templateExample"/>
            <div v-else class="template-item-example-error flex flex-center flex-column text-align-center">
                暂无预览图
            </div>
        </div>
        <div class="template-item-info">
            <div class="template-item-name">{{templateInfo.templateName}}</div>
            <div>创建时间：{{templateInfo.createTime | yyyyMMddHHmm}}</div>
        </div>
        <div class="template-item-handler flex">
            <div class="flex-fill-in-the-remaining-space">
                <el-button size="small" type="text" icon="el-icon-edit" @click="$emit('edit',templateInfo.id)">编辑</el-button>
                <el-button size="small" type="text" class="custom-el-button" icon="iconfont icon-design-2" @click="design">设计模版</el-button>
                <el-button size="small" class="custom-el-button danger" icon="el-icon-delete" @click="$emit('delete',templateInfo.id)" type="text">删除</el-button>
            </div>
            <div class="flex flex-center flex-column">
                <div>
                    <el-checkbox v-model="templateInfo.isOpen" @change="changeIsOpen">开放模版</el-checkbox>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TemplateItem",
        props:{
            templateInfo: Object
        },
        data(){
            return {
                imgHeight: 0,
                imgTop: 0
            }
        },
        computed:{
            transitionTime(){
                return  this.imgHeight / 200;
            },
            imgStyle(){
                return {
                    marginTop: `${-this.imgTop}px`,
                    transition: `all ${this.transitionTime}s`
                }
            }
        },
        methods:{
            design(){
                window.open(this.$router.resolve(`/template/design/${this.templateInfo.id}`).href,'_blank');
            },
            loaded(){
                this.imgHeight = Math.ceil(this.$refs.sample.height * ( 300 / this.$refs.sample.width));
            },
            scrollStart(){
                let max =  this.imgHeight-150;
                if(max > 0){
                    this.imgTop = this.imgHeight-150;
                }
            },
            scrollEnd(){
                this.imgTop = 0;
            },
            changeIsOpen(val){
                let data = {
                    ...this.templateInfo,
                    isOpen: val,
                };
                this.$request.put('/api/admin/designTemplate',data).then(()=>{
                    this.$message.success(val ? '模版已开放' : '模版已停用');
                }).catch(()=>{
                    this.templateInfo.isOpen = !val;
                })
            }
        }
    }
</script>

<style lang="less">
.template-item{
    margin-right: 16px;
    margin-bottom: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;

    &:hover{
        .template-item-example:after{
            background-color: rgba(0,0,0,.5);
        }
    }

    &-example{
        width: 300px;
        height: 150px;
        overflow: hidden;
        cursor: pointer;
        position: relative;

        &-error{
            height: 100%;
            width: 100%;
            transition: all .3s;
            background-color: rgba(0,0,0,.5);
            color: #ffffff;
        }

        &:after{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            transition: all .3s;
        }

        img{
            width: 100%;
        }
    }

    &-info{
        padding: 8px 16px;
        border-bottom: 1px solid #E0E3E6;
    }

    &-name{
        padding-bottom: 4px;
    }

    &-handler{
        padding: 0 16px;
    }
}
</style>

<template>
    <div class="page-template-item" @mouseenter="scrollStart" @mouseleave="scrollEnd">
        <div class="page-template-item-example" ref="sampleContainer">
            <img ref="sample" :style="imgStyle" @load="loaded" v-if="templateInfo.templateExample" :src="templateInfo.templateExample" alt="示例图"/>
            <div v-else class="template-item-example-error flex flex-center flex-column text-align-center">
                暂无预览图
            </div>
        </div>
        <div class="page-template-item-info website-pro-flex center column">
            <span>{{templateInfo.templateName}}</span>
        </div>
        <div class="page-template-item-handle website-pro-flex center column">
            <div>
                <el-button size="small" type="primary" @click="use">使用</el-button>
                <el-button size="small" type="danger" style="position: relative;">
                    <span style="opacity: 0;">预览</span>
                    <a :href="preview" target="_blank" class="absolute-fill-parent" style="color: #ffffff;line-height: 28px;">预览</a>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageTemplateItem",
        props:{
            templateInfo: Object,
            imgWidth: {
                type: Number,
                default: 316
            }
        },
        data(){
            return {
                imgHeight: 0,
                imgTop: 0
            }
        },
        computed:{
            preview(){
                return this.$router.resolve(`/template/preview/${this.templateInfo.id}`).href;
            },
            transitionTime(){
                return  this.imgHeight / 200;
            },
            imgStyle(){
                return {
                    marginTop: `${-this.imgTop}px`,
                    transition: `all ${this.transitionTime}s`
                }
            },
        },
        methods:{
            loaded(){
                this.imgHeight = Math.ceil(this.$refs.sample.height * ( this.imgWidth / this.$refs.sample.width));
            },
            scrollStart(){
                let max =  this.imgHeight-180;
                if(max > 0){
                    this.imgTop = this.imgHeight-180;
                }
            },
            scrollEnd(){
                this.imgTop = 0;
            },
            use(){
                this.$msgbox.confirm('模版将覆盖页面当前设置，是否继续使用模版？','提示',{type: 'warning',confirmButtonText:'继续使用'}).then(()=>{
                    this.$emit('use',JSON.parse(this.templateInfo.templateConfig));
                }).catch(()=>{});
            }
        },
    }
</script>

<style lang="less">
    .page-template-item{
        margin-bottom: 12px;
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        border-radius: 4px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        color: #303133;
        position: relative;
        cursor: pointer;

        &:hover{
            .page-template-item-example:after{
                background-color: rgba(0,0,0,.5);
            }

            .page-template-item-info{
                height: 0;
            }

            .page-template-item-handle{
                height: 58px;
            }
        }

        &-example{
            width: 100%;
            height: 180px;
            overflow: hidden;
            cursor: pointer;
            position: relative;

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
            height: 58px;
            text-align: center;
            font-size: 15px;
            overflow: hidden;
            transition: all .3s;
        }

        &-handle{
            height: 0;
            text-align: center;
            overflow: hidden;
            transition: all .3s;
        }

    }
</style>


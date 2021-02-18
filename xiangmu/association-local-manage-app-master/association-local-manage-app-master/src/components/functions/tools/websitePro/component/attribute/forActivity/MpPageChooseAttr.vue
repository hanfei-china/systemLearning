<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
            <el-select v-model="attribute.value" size="mini" style="width: 100%;" :clearable="clearable" ref="select"
                       placeholder="请选择小程序自定义页面" filterable>
                <el-option v-for="(page,index) in pages" :key="page.pageId" :value="page.pageId"
                           :label="page.attributes.title.value ? page.attributes.title.value : `页面${index+1}` " />
            </el-select>
        </div>
    </div>
</template>

<script>
    import MiniProgram from "../../../../../../../js/miniProgram/MiniProgram";

    export default {
        name: "MpPageChooseAttr",
        props:{
            attribute: Object
        },
        computed:{
            showTitle(){
                return this.attribute.showTitle;
            },
            title(){
                return this.attribute.title;
            },
            attributes(){
                return this.attribute.attributes || {};
            },
            titleStyle(){
                return this.attributes.titleStyle || {};
            },
            show(){
                if(this.attribute.show){
                    return this.attribute.show();
                }else{
                    return true;
                }
            },
            clearable(){
                return this.attributes.clearable !== false;
            },
            pages(){
                return this.mpUserConfig.getPages();
            }
        },
        data(){
            return {
                mpUserConfig: new MiniProgram(),
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.select.$refs.popper.$el.contains(target);
            },
            getMpInfo() {
                this.$request.get('/api/admin/mp/list').then(res=>{
                    if(!res.data || res.data.length < 1){
                        this.$message.warning('尚未创建主会小程序，无法选择页面');
                    }else{
                        for(let mp of res.data){
                            if(!mp.isBranchMP){
                                this.mpUserConfig.copyObject(new MiniProgram(mp.mpConfig));
                                return;
                            }
                        }
                        this.$message.warning('尚未创建主会小程序，无法选择页面');
                    }
                });
            },
        },
        created() {
            this.getMpInfo();
        },
    }
</script>

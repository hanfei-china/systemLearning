<template>
    <div v-show="show">
        <attribute-title v-show="showTitle">{{title}}</attribute-title>
        <div>
            <div style="margin-top: 10px;">
                <div class="website-pro-flex">
                    <div style="width: 100px;text-align: right;">背景重复：</div>
                    <div>
                        <el-checkbox v-model="attribute.value.backgroundRepeatX">横向重复</el-checkbox>
                        <el-checkbox v-model="attribute.value.backgroundRepeatY">纵向重复</el-checkbox>
                    </div>
                </div>
                <div class="website-pro-flex" style="padding-top: 10px;">
                    <div style="width: 100px;text-align: right;">背景显示方式：</div>
                    <div>
                        <el-radio-group v-model="attribute.value.backgroundSize">
                            <el-radio label="auto" style="margin-right: 15px;">自动</el-radio>
                            <el-radio label="contain" style="margin-right: 15px;">包含</el-radio>
                            <el-radio label="cover">覆盖</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="website-pro-flex" style="padding-top: 10px;">
                    <div style="width: 100px;text-align: right;">背景横向显示：</div>
                    <div>
                        <el-radio-group v-model="attribute.value.backgroundPositionX">
                            <el-radio label="left" style="margin-right: 15px;">居左</el-radio>
                            <el-radio label="center" style="margin-right: 15px;">居中</el-radio>
                            <el-radio label="right">居右</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="website-pro-flex" style="padding-top: 10px;">
                    <div style="width: 100px;text-align: right;">背景纵向显示：</div>
                    <div>
                        <el-radio-group v-model="attribute.value.backgroundPositionY">
                            <el-radio label="top" style="margin-right: 15px;">居上</el-radio>
                            <el-radio label="center" style="margin-right: 15px;">居中</el-radio>
                            <el-radio label="bottom">居下</el-radio>
                        </el-radio-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import AttributeTitle from "./AttributeTitle";
    export default {
        name: "BackgroundLayoutAttr",
        components: {AttributeTitle},
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
            show(){
                if(this.attribute.show){
                    return this.attribute.show();
                }else{
                    return true;
                }
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target);
            }
        }
    }
</script>

<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" style="height: 28px;" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div class="flex-fill-in-the-remaining-space">
            <div>
                <el-checkbox v-model="attribute.value.open">开启权限控制</el-checkbox>
            </div>
            <div v-show="attribute.value.open" style="margin-top: 10px;">
                <div>
                    <el-checkbox v-model="attribute.value.onlyForMember">仅对会员开放</el-checkbox>
                </div>
                <div v-show="attribute.value.onlyForMember" style="padding: 10px;border: 1px dashed #cccccc;border-radius: 4px;margin-top: 10px;">
                    <div class="flex">
                        <div class="flex flex-column flex-center" style="width: 70px;">会员范围：</div>
                        <div class="flex-fill-in-the-remaining-space">
                            <el-select style="width: 100%;" ref="memberType" v-model="attribute.value.memberType.memberRange" placeholder="会员范围选择" size="small">
                                <el-option label="所有会员" value="all"/>
                                <el-option label="部分会员" value="part"/>
                            </el-select>
                        </div>
                    </div>
                    <div class="flex" style="margin-top: 10px;" v-show="attribute.value.memberType.memberRange === 'part'">
                        <div class="flex flex-column flex-center text-align-right" style="width: 70px;">会员类型：</div>
                        <div class="flex-fill-in-the-remaining-space">
                            <el-select style="width: 100%;" ref="whiteList" v-model="attribute.value.memberType.memberTypes" placeholder="会员类型选择" size="small" multiple clearable>
                                <el-option v-for="type of list" :key="type.id" :label="type.typeName" :value="type.id"/>
                            </el-select>
                        </div>
                    </div>
                    <div class="flex" style="margin-top: 10px;" v-show="attribute.value.memberType.memberRange === 'all'">
                        <div class="flex flex-column flex-center text-align-right" style="width: 70px;">黑名单：</div>
                        <div class="flex-fill-in-the-remaining-space">
                            <el-select style="width: 100%;" ref="blackList" v-model="attribute.value.memberType.blacklist" placeholder="会员类型黑名单" size="small" multiple clearable>
                                <el-option v-for="type of list" :key="type.id" :label="type.typeName" :value="type.id"/>
                            </el-select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MpPrivilegeAttr",
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
            options(){
                return this.attributes.options || [];
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
        },

        data() {
            return {
                list: []
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.memberType.$refs.popper.$el.contains(target)
                    || this.$refs.whiteList.$refs.popper.$el.contains(target)
                    || this.$refs.blackList.$refs.popper.$el.contains(target);
            },
            getMemberTypes(){
                this.$request.get('/api/admin/memberType/getMemberTypes').then(res=>{
                    this.list = res.data;
                })
            },
        },
        created() {
            this.getMemberTypes();
        }
    }
</script>

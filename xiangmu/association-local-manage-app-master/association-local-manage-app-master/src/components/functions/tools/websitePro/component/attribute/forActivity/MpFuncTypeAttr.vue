<template>
    <div v-show="show" class="website-pro-flex">
        <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">{{title}}</div>
        <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
            <el-select style="width: 100%;" v-model="attribute.value" ref="select" size="mini" :placeholder="placeholder" filterable>
                <el-option v-for="item in supportFuncType" :key="item.id" :value="item.id" :label="item.name"/>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MpFuncTypeAttr",
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
            placeholder(){
                return this.attribute.placeholder || '请选择模块功能';
            },
            supportFuncType() {
                let types = [
                    {id: 0, name: '图文列表'}, {id: 1, name: '活动大厅'}, {id: 2, name: '单个图文'}, {id: 3, name: '单个活动'},
                    {id: 4, name: '自定义链接'}, {id: 5, name: '社群'}, {id: 6, name: '发布动态'}, {id: 7, name: '信息对接'},
                    {id: 8, name: '通讯录'}, {id: 9, name: '商城'}, {id: 11, name: '我参与的活动'}, {id: 12, name: '我管理的活动'},
                    {id: 13, name: '我的名片夹'}, {id: 14, name: '我的信息对接'}, {id: 15, name: '邀请校友'},
                    {id: 16, name: '待处理审批(该功能仅管理员可见)'}, {id: 17, name: '在线表单填写'},
                    {id: 18, name: '用户单个表单提交记录'}, {id: 19, name: '用户所有表单提交记录'}, {id: 20, name: '在线捐赠'},
                    {id: 21, name: '我的捐赠'}, {id: 22, name: '教育培训'}, {id: 23, name: '积分签到'}, {id: 24, name: '捐赠项目列表'},
                    {id: 25, name: '在线咨询'}, {id: 26, name: '小程序自定义页面'}, {id: 27, name: '校友卡'}, {id: 28, name: '相册'},
                    {id: 29, name: '发布活动'}, {id: 30, name: '校友企业'}, {id: 31, name: '我加入的分会'}, {id: 32, name: '社群创建'},
                    {id: 33, name: '我创建的社群'}, {id: 34, name: '打开另一个小程序'}, {id: 35, name: '我的优惠券'}
                ];

                let supportFuncType = [], results = [];

                if (this.attributes && this.attributes.supportFuncType) {
                    supportFuncType = this.attributes.supportFuncType;
                }

                for (let type of types) {
                    let index = supportFuncType.indexOf(type.id);
                    if (index > -1) {
                        results[index] = type;
                    }
                }

                return results;
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.select.$refs.popper.$el.contains(target);
            }
        }
    }
</script>

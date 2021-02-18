<template>
    <attr-container :title="title" :required="required">
        <el-select v-model="copyValue" size="small" :placeholder="placeholder" filterable>
            <el-option v-for="item in supportFuncType" :key="item.id" :value="item.id" :label="item.name"/>
        </el-select>
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';

    export default {
        name: "FuncTypeAttr",
        components: {
            AttrContainer
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            attributes: {
                type: Object,
                default() {
                    return {
                        title: '模块支持功能选择',
                        placeholder: '请选择模块功能',
                        supportFuncType: []
                    }
                }
            },
            value: {
                type: Number,
                default: -1
            },
            required: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            title() {
                if (this.attributes && this.attributes.title && this.attributes.title !== '') {
                    return this.attributes.title;
                }

                return '模块支持功能选择';
            },
            placeholder() {
                if (this.attributes && this.attributes.placeholder && this.attributes.placeholder !== '') {
                    return this.attributes.placeholder;
                }

                return '请选择模块功能';
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
                    {id: 25, name: '在线咨询'}, {id: 26, name: '自定义页面'}, {id: 27, name: '校友卡'}, {id: 28, name: '相册'},
                    {id: 29, name: '发布活动'}, {id: 30, name: '校友企业'}, {id: 31, name: '我加入的分会'}, {id: 32, name: '社群创建'},
                    {id: 33, name: '我创建的社群'}, {id: 34, name: '打开另一个小程序'}, {id: 35, name: '我的优惠券'}, {id: 36, name: '认养地图'},
                    {id: 37, name: '回家吧'}, {id: 38, name: '新版首页'}, {id: 39, name: '账号设置'}, {id: 40, name: '我的相册'},
                    {id: 41, name: '我的消息'}, {id: 42, name: '完善资料'}, {id: 43, name: '通知公告'}, {id: 44, name: '点亮全球'},
                    {id: 45, name: '校庆头像'}
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
        data() {
            return {
                copyValue: this.value
            }
        },
        watch: {
            copyValue(value) {
                this.$emit('change', value);
            }
        }
    }
</script>

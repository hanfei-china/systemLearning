<template>
    <attr-container :title="title" :required="required">
        <div>
            <el-checkbox v-model="value.open">开启权限控制</el-checkbox>
        </div>
        <div v-show="value.open" style="margin-top: 10px;">
            <div>
                <el-checkbox v-model="value.onlyForMember">仅对会员开放</el-checkbox>
            </div>
            <div v-show="value.onlyForMember" style="padding: 10px;border: 1px dashed #cccccc;border-radius: 4px;margin-top: 10px;">
                <div class="flex">
                    <div class="flex flex-column flex-center">会员范围：</div>
                    <div class="flex-fill-in-the-remaining-space">
                        <el-select style="width: 100%;" v-model="value.memberType.memberRange" placeholder="会员范围选择" size="small">
                            <el-option label="所有会员" value="all"/>
                            <el-option label="部分会员" value="part"/>
                        </el-select>
                    </div>
                </div>
                <div class="flex" style="margin-top: 10px;" v-show="value.memberType.memberRange === 'part'">
                    <div class="flex flex-column flex-center text-align-right" style="width: 70px;">会员类型：</div>
                    <div class="flex-fill-in-the-remaining-space">
                        <el-select style="width: 100%;" v-model="value.memberType.memberTypes" placeholder="会员类型选择" size="small" multiple clearable>
                            <el-option v-for="type of list" :key="type.id" :label="type.typeName" :value="type.id"/>
                        </el-select>
                    </div>
                </div>
                <div class="flex" style="margin-top: 10px;" v-show="value.memberType.memberRange === 'all'">
                    <div class="flex flex-column flex-center text-align-right" style="width: 70px;">黑名单：</div>
                    <div class="flex-fill-in-the-remaining-space">
                        <el-select style="width: 100%;" v-model="value.memberType.blacklist" placeholder="会员类型黑名单" size="small" multiple clearable>
                            <el-option v-for="type of list" :key="type.id" :label="type.typeName" :value="type.id"/>
                        </el-select>
                    </div>
                </div>
            </div>
        </div>
    </attr-container>
</template>

<script>
    import AttrContainer from './AttrContainer';

    export default {
        name: "PrivilegeAttr",
        components: {AttrContainer},
        model:{
            prop: 'value',
            event: 'change'
        },
        props: {
            attributes: {
                type: Object,
                default() {
                    return {
                        title: '权限控制',
                    }
                }
            },
            value: {
                type: Object,
                default(){
                    return {
                        open: false,
                        onlyForMember: false,
                        memberType:{
                            memberRange: 'all',
                            memberTypes: [],
                            blacklist: []
                        }
                    }
                }
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

                return '权限控制';
            },
        },
        data() {
            return {
                list: []
            }
        },
        methods: {
            getMemberTypes(){
                this.$request.get('/api/admin/memberType/getMemberTypes').then(res=>{
                    this.list = res.data;
                })
            },
        },
        created(){
            this.getMemberTypes();
        },
    }
</script>

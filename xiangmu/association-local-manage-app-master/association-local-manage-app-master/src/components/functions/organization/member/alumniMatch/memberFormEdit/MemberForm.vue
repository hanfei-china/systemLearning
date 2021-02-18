<template>
    <el-container class="absolute-fill-parent border-top" v-loading="loading">
        <el-main class="unset-padding position-relative">
            <vue-scroll @handle-scroll="click">
                <el-form style="padding: 0 16px;" ref="form" size="small" class="custom-el-form column">
                    <!-- <el-form-item v-if="!userId">
                        <template v-slot:label>
                            <span class="custom-el-form-item-label required">唯一项：</span>
                        </template>
                        <all-member-field-choose :account-field="memberAccountRules.accountField" style="width: 100%;" v-model="uniqueCode"/>
                    </el-form-item> -->
                    <el-form-item v-for="(field,index) in memberFields" :key="field.id" v-if="field.topicType!=14">
                        <template v-slot:label v-if="field.topicType!=13">
                            <span class="custom-el-form-item-label" :class="{required: field.necessary}">
                                {{field.name}}：
                            </span>
                        </template>

                        <member-edit-field v-if="field.topicType!=13" :ref="field.code" :scoolInfo="scoohList" :disabled="userId && field.code === 'telphone' " :code="field.code" :config="field" v-model="field.value" @getSchool="getScoolByTime"/>

                        <div class="composebox" v-else>
                            <div v-for="(itemfield,itemindex) in field.detailList" :key="itemindex">
                                <span  class="custom-el-form-item-label">{{itemfield.name}}：</span>
                                <member-edit-field class="composeitem"  :scoolInfo="scoohList" :disabled="userId && itemfield.code === 'telphone' " :code="itemfield.code" :config="itemfield" v-model="itemfield.value" @getSchool="getScoolByTime" isComposeField="true" :parentIndex="index" :memberFields="memberFields" :itemindex="itemindex" @changeMemberFieldsDetail="changeMemberFieldsDetail" />
                            </div>
                        </div>

                    </el-form-item>
                    <!-- <el-form-item>
                        <template v-slot:label>
                            <span class="custom-el-form-item-label">分组：</span>
                        </template>
                        <member-group-multi-tree style="width: 100%;"  v-model="groupIds" only-static :group-nodes="originalGroups"/>
                    </el-form-item> -->
                </el-form>
            </vue-scroll>
        </el-main>
        <el-footer style="padding: 0 16px;" class="flex flex-center flex-column border-top">
            <div class="text-align-right">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="save">{{userId ? '确认修改':'确定添加'}}</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import MemberEditField from "./MemberEditField";
    import AllMemberFieldChoose from "../../memberField/AllMemberFieldChoose";
    import MemberGroupMultiTree from "../../../../util/group/memberGroup/MemberGroupMultiTree";

    export default {
        name: "MemberForm",
        components: {MemberGroupMultiTree, AllMemberFieldChoose, MemberEditField},
        props: {
            userId: {
                type: String,
                default: ''
            },
            originalGroups: Array,
            educationList:Array,
            collegeList:Array,
            majorList:Array,
        },
        computed:{
            memberAccountRules(){
                return this.$store.state.memberAccountRules;
            }
        },
        data() {
            return {
                originalInfo: null,
                memberFields: [],
                copyMemberType: 0,
                loading: false,
                uniqueCode: 'idCard',
                groupIds: [],
                scoohList:[]      //组合字段中，通过时间获取到的学院的列表
            }
        },
        methods: {
            changeMemberFieldsDetail(parentIndex,childIndex,val){
                this.$set(this.memberFields[parentIndex].detailList[childIndex],"value",val)
            },
            //子组件改变入学时间，获取对应的学院列表，返回给父组件（本组件）
            getScoolByTime(data){
                this.scoohList=JSON.parse(JSON.stringify(data));
            },
            click(){
                for(let ref in this.$refs){
                    let item = this.$refs[ref];
                    if(Array.isArray(item)){
                        if(item[0]){
                            item[0].hidden();
                        }
                    }
                }
            },
            save() {

                if(!this.uniqueCode && !this.userId){
                    this.$message.warning('请选择唯一项');
                    return;
                }

                let fieldRelation = {};
                for(let field of this.memberFields){
                    let {value,code,topicType,detailList} = field;
                    if(topicType === 9){
                        let array = [];
                        for(let detail of detailList){
                            let temp = {};
                            for(let child of detail){
                                let {value:childValue,code:key,topicType: childTopicType} = child;


                                if(childTopicType === 3 || childTopicType === 6 || childTopicType === 8){
                                    if(childValue){
                                        childValue = JSON.stringify(childValue);
                                    }
                                }


                                if(childTopicType === 5){
                                    if(childValue){
                                        childValue = new Date(childValue);
                                    }
                                }

                                temp[key] = {
                                    value: childValue,
                                    topicType: childTopicType,
                                    details:[],
                                }
                            }

                            array.push(temp);
                        }

                        fieldRelation[code] = {
                            value: value,
                            topicType: topicType,
                            details: array
                        }
                    }else{

                        // if(necessary && !value){
                        //     this.$message.warning(`请完善必填字段【${name}】`);
                        //     return;
                        // }

                        if(topicType === 3 || topicType === 6 || topicType === 8){
                            if(value){
                                value = JSON.stringify(value);
                            }
                        }

                        if(topicType === 5){
                            if(value){
                                value = new Date(value);
                            }
                        }

                        if(topicType === 11){
                            if(value === 0){
                                value = null;
                            }else {
                                value = JSON.stringify(value);
                            }
                        }

                        if(topicType === 12){
                            if(value){
                                value = JSON.stringify(value);
                            }
                        }

                        if(topicType === 13){
                            for (const item of detailList) {
                                let {value,code,topicType } = item;
                                fieldRelation[code] = {
                                    topicType,
                                    value: value,
                                    details:[]
                                }
                            }
                        }

                        if(code){
                            fieldRelation[code] = {
                                topicType,
                                value: value,
                                details:[]
                            }
                        }

                    }
                }
                if(this.userId){
                    this.$request.post('/api/admin/member/updateMemberByAdmin',{fieldRelation,memberId:this.userId,groupIds: this.groupIds}).then(()=>{
                        this.$message.success("编辑成功");
                        this.$emit('refresh-members');
                        this.$emit('close');
                    });
                }else{
                    this.$request.post('/api/admin/member/addMemberByAdmin',{fieldRelation,uniqueCode:this.uniqueCode,groupIds: this.groupIds}).then(()=>{
                        this.$message.success("添加成功");
                        this.$emit('refresh-members');
                        this.$emit('close');
                    });
                }
            },
            getMemberFields() {
                this.loading = true;
                if(this.userId){
                    //这是会员信息修改的情况
                    Promise.all([this.$request.get('/api/admin/associator/getFieldsInfo'),
                        this.$request.get('/api/admin/member/getUserInfoAndMemberInfo',{params:{memberId: this.userId}})]).then(([fields,memberInfo])=>{
                            if(fields.success && memberInfo.success){
                                //对数据进行了处理---将字段信息和用于填写的信息结合
                                this.memberFields = fields.data.filter(field => {
                                    let {parameter, topicType, code, detailList} = field;
                                    let value = memberInfo.data.memberInfo[code];

                                    detailList.map(_field=>{
                                        let { topicType, code } = _field;
                                        let _parameter = _field.parameter;
                                        if(_parameter){
                                            _field.parameter = JSON.parse(_parameter);
                                        }


                                        if(code=="education"){
                                            _field.parameter = {options:this.educationList}
                                        }
                                        if(code=="college"){
                                            _field.parameter = {options:this.collegeList}
                                        }
                                        if(code=="major"){
                                            _field.parameter = {options:this.majorList}
                                        }
                                        if(topicType==5){
                                            if(memberInfo.data.memberInfo[code]){
                                                _field.value = new Date(memberInfo.data.memberInfo[code]);
                                            }else{
                                                _field.value = '';
                                            }
                                        }else{
                                            _field.value = memberInfo.data.memberInfo[code];
                                        }
                                    });

                                    if (topicType === 9 && (!detailList || detailList.length < 1)) {
                                        return false;
                                    }

                                    if([0,1,2,3,4,5].indexOf(topicType) !== -1){
                                        field.value =value;
                                    }else if (topicType !== 9&&topicType !== 15) {
                                        try {
                                            field.value = JSON.parse(value);
                                        } catch (e) {
                                            field.value =value;
                                        }
                                    } else {
                                        if(topicType === 15){
                                           field.value =memberInfo.data.memberInfo.memberTypeId;
                                        }
                                        if(value && value.length>0){
                                            let tempValue = [];
                                            for(let item of value){
                                                let temp = JSON.parse(JSON.stringify(detailList)).map(detail => {
                                                    detail.value = item[detail.code];
                                                    return detail;
                                                });
                                                tempValue.push(temp);
                                            }
                                            field.detailList = tempValue;
                                        }else{
                                            field.detailList = [detailList];
                                        }
                                    }

                                    if (parameter && typeof parameter == 'string') {
                                        parameter = JSON.parse(parameter);
                                    } else {
                                        parameter = {};
                                    }

                                    field.parameter = parameter;

                                    return true;
                                });

                                this.groupIds =  memberInfo.data.groupInfo;
                                console.log(this.memberFields)
                                // console.log(this.groupIds)
                                this.$nextTick(()=>{ this.loading = false; })
                            }
                    })

                }else{
                    //这是添加会员的情况
                    this.$request.get('/api/admin/associator/getFieldsInfo').then(fields=>{
                        this.memberFields = fields.data.filter(field => {
                            let {parameter, topicType, detailList} = field;

                            detailList.map(_field=>{
                                let _parameter = _field.parameter;
                                if(_parameter){
                                    _field.parameter = JSON.parse(_parameter);
                                }

                            });

                            if (topicType === 9 && (!detailList || detailList.length < 1)) {
                                return false;
                            }

                            if (topicType !== 9) {
                                field.value = null;
                            } else {
                                field.detailList = [detailList]
                            }

                            if (parameter && typeof parameter == 'string') {
                                parameter = JSON.parse(parameter);
                            } else {
                                parameter = {};
                            }

                            field.parameter = parameter;

                            return true;
                        });
                        this.$nextTick(()=>{ this.loading = false; })
                    })
                }
            }
        },
        created() {
            this.getMemberFields();
            if(this.memberAccountRules && !this.uniqueCode){
                this.uniqueCode = this.memberAccountRules.accountField;
            }
        },
    }
</script>
<style lang="less" scoped>
.composebox{
    border: 1px solid rgb(242, 242, 242);
    background-color: rgb(250, 250, 250);
    border-radius: 4px;
    padding: 0 10px;
    .composeitem{
        margin-bottom: 10px;
    }
}
</style>

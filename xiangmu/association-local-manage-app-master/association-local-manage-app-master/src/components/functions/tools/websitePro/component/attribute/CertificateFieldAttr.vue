<template>
    <div v-show="show">
        <div class="website-pro-flex">
            <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">字段选择</div>
            <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
                <el-select size="mini" ref="fields" style="width: 100%;" v-model="attribute.value.fieldId">
                    <el-option v-for="option of options" :key="option.code" :value="option.code" :label="option.label"/>
                </el-select>
            </div>
        </div>
        <div style="margin-top: 10px;" class="website-pro-flex" v-show="attribute.value.fieldType === 'date'">
            <div class="website-pro-flex column center website-pro-text-right" :style="titleStyle" v-show="showTitle">日期格式</div>
            <div style="height: 28px;" class="flex-fill-in-the-remaining-space">
                <el-select size="mini" ref="dateFormats" style="width: 100%;" v-model="attribute.value.dateFormat">
                    <el-option v-for="option of dateOptions" :key="option.code" :value="option.code" :label="option.label"/>
                </el-select>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CertificateFieldAttr",
        props:{
            attribute: Object
        },
        computed:{
            showTitle(){
                return this.attribute.showTitle;
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
        },
        data(){
            return {
                list: [],
                options:[],
                memberOptions:[
                    {
                        code: 'name',
                        fieldType: 'text',
                        label: '姓名/单位名称'
                    },
                    {
                        code: 'memberId',
                        fieldType: 'text',
                        label: '会员编号'
                    },
                    {
                        code: 'startTime',
                        fieldType: 'date',
                        label: '证书开始日期'
                    },
                    {
                        code: 'endTime',
                        fieldType: 'date',
                        label: '证书结束日期'
                    },
                ],
                donateOptions:[
                    {
                        code: 'userName',
                        fieldType: 'text',
                        label: '捐赠姓名'
                    },
                    {
                        code: 'certificateNo',
                        fieldType: 'text',
                        label: '捐赠编号'
                    },
                    {
                        code: 'amount',
                        fieldType: 'text',
                        label: '捐赠金额'
                    },
                    {
                        code: 'year',
                        fieldType: 'text',
                        label: '年'
                    },
                    {
                        code: 'month',
                        fieldType: 'text',
                        label: '月'
                    },
                    {
                        code: 'day',
                        fieldType: 'text',
                        label: '日'
                    },
                ],
                dateOptions:[
                    {
                        code: 'yyyy年MM月dd日',
                        label: 'yyyy年MM月dd日'
                    },
                    {
                        code: 'yyyy-MM-dd',
                        label: 'yyyy-MM-dd'
                    },
                ],
            }
        },
        methods:{
            isChildren(e){
                let target = e.target || e.srcElement;
                return target === this.$el ||  this.$el.contains(target)
                    || this.$refs.fields.$refs.popper.$el.contains(target)
                    || this.$refs.dateFormats.$refs.popper.$el.contains(target);
            },
            getData() {
                this.loading = true;
                this.$request.get('/api/admin/contentClass/list').then(res=>{
                    this.list = res.data;
                })
            }
        },
        created() {
            var moduleId = this.$route.params.moduleId
            if(moduleId == 'donationCertificate'){
                this.options = this.donateOptions;
            }else if(moduleId == 'memberCertificate'){
                this.options = this.memberOptions;
            }
            this.getData();
        },
        watch:{
            'attribute.value.fieldId'(val){
                for(let option of this.options){
                    let {code,fieldType,label} = option;
                    if(code === val){
                        this.attribute.value.fieldType = fieldType;
                        this.attribute.value.label = label;
                    }
                }
            }
        }
    }
</script>

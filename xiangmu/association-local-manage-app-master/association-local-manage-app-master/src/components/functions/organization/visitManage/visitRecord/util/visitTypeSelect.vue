<template>
    <el-select style="width: 100%;" v-model="copyValue" :placeholder="placeholder" clearable size="small">
        <el-option v-for="item in typeList" :key="item.id" :value="item.id"
                   :label="(item.isOnline ? '（线上）' : '（线下）') + item.name"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "visitTypeSelect",
        props: {
            value: [Number,String],
            placeholder: String,
            entity: Object
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        data(){
            return {
                typeList: [],
                copyValue: this.value
            }
        },
        created(){
            this.getTypeList()
        },
        watch: {
            value(val){
                if(!this.copyValue){
                    this.copyValue = val;
                }
            },
            copyValue(val) {
                let obj = null;
                if(val){
                    for(let entity of this.typeList){
                        if(entity.id === val){
                            obj = entity;
                            break;
                        }
                    }
                }
                if(!obj){
                    obj = {};
                }
                this.$emit("update:entity",obj);
                this.$emit("change",val);
            }
        },
        methods: {
            getTypeList() {
                this.$request.get('/api/admin/visit/visitType/getVisitTypeIdAndName').then(res => {
                    if (res.success) {
                        this.typeList = res.data;

                        if(this.value){
                            let obj = null;
                            for(let entity of this.typeList){
                                if(entity.id === this.value){
                                    obj = entity;
                                    break;
                                }
                            }
                            this.$emit("update:entity",obj);
                        }
                    }
                })
            },
        }
    }
</script>

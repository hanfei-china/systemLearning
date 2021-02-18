<template>
    <el-popover placement="bottom" width="300" trigger="hover">
        <el-button size="small" style="margin-left: 10px;" icon="el-icon-s-grid" slot="reference">显示字段</el-button>
        <el-container style="height: 400px;position: relative;">
            <el-header class="unset-padding" height="auto" style="margin-bottom: 8px;">
                <div class="flex">
                    <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">显示字段</div>
                    <div>
                        <el-button type="text" class="custom-el-button unset-padding" size="small" @click="saveConfiguration">保存配置</el-button>
                    </div>
                </div>
            </el-header>
            <el-main class="unset-padding">
                <vue-scroll>
                    <el-tree :draggable="true" :allow-drop="allowDrop" :allow-drag="allowDrag" check-on-click-node
                             :data="copyFields" node-key="code" :props="props"
                             ref="tree" show-checkbox
                             @check-change="setChosen" @node-drop="nodeDrop"/>
                </vue-scroll>
            </el-main>
        </el-container>
    </el-popover>
</template>

<script>
    export default {
        name: "MemberFieldTree",
        props:{
            allField:{
                type: Array,
                default(){
                    return [];
                }
            },
            value:{
                type: Array,
                default(){
                    return [];
                }
            },
        },
        model:{
            event: 'change',
            prop: 'value',
        },
        computed:{
            formatFields(){
                if(!this.allField || this.allField.length<1){
                    return null;
                }
                let obj = {};
                for(let field of this.allField){
                    let {code} = field;
                    obj[code] = field;
                }

                return obj;
            }
        },
        data(){
            return {
                copyFields: JSON.parse(JSON.stringify(this.allField)),
                props: {
                    label: 'name'
                },
                firstLoaded: false,
                checkedKeys:[],
                configuration: null,
                resultField: [],
            }
        },
        methods:{
            setChosen(){
                let val = this.$refs.tree.getCheckedNodes();
                this.checkedKeys = this.$refs.tree.getCheckedKeys();
                this.setResultField();
                this.$emit('change',val);
            },
            allowDrop(draggingNode, dropNode, type){
                return type !== 'inner';
            },
            allowDrag(){
                return true;
            },
            loadConfiguration(){
                if(this.configuration && this.formatFields){
                    let checkedKeys = [];
                    let allCodes = [];
                    let fields = [];
                    let showFields = [];
                    for(let item of this.configuration){
                        let {code, checked} = item;
                        let field = this.formatFields[code];
                        if(field){
                            fields.push(field);
                            allCodes.push(code);

                            if(checked){
                                checkedKeys.push(code);
                                showFields.push(field);
                            }
                        }

                    }

                    for(let key in this.formatFields){
                        if(allCodes.indexOf(key) < 0){
                            fields.push(this.formatFields[key]);
                        }
                    }
                    this.checkedKeys = checkedKeys;
                    this.$refs.tree.setCheckedKeys(checkedKeys);
                    this.copyFields = fields;
                    this.$emit("setShowField",true)
                    this.$emit('change',showFields);
                    this.setResultField();
                }
            },
            setResultField(){
                let result = [];
                for(let field of this.copyFields){
                    let {code} = field;

                    let _temp = {code,checked: false};

                    if(this.checkedKeys.indexOf(code) > -1){
                        _temp.checked = true;
                    }

                    result.push(_temp)
                }

                this.resultField = result;
            },
            nodeDrop(node){
                if(node.checked){
                    this.$refs.tree.setCheckedKeys(this.checkedKeys);
                }
                this.checkedKeys = this.$refs.tree.getCheckedKeys();

                let val = this.$refs.tree.getCheckedNodes();
                this.$emit('change',val);
                this.setResultField();
            },
            saveConfiguration(){
                if(this.checkedKeys.length==0){
                  this.$message.warning('请至少保留一个现实字段~')   
                }else{
                    this.$request.put('/api/admin/common/configuration/memberFields',{
                        configurationContent: JSON.stringify(this.resultField)
                    }).then(()=>{
                        this.$message.success('配置保存成功');
                    })
                }
            },
            getConfiguration(){
                this.$request.get('/api/admin/common/configuration/memberFields').then(res=>{
                    let data = res.data;
                    if(data){
                        let {configurationContent} = data;
                        this.configuration = JSON.parse(configurationContent);
                    }
                })
            }
        },
        created() {
            this.getConfiguration();
        },
        watch:{
            value(val){
                if(!this.firstLoaded){
                    let codes = [];
                    val.forEach(field=>{
                        codes.push(field.code);
                    });

                    this.checkedKeys = codes;
                    this.$refs.tree.setCheckedKeys(codes);
                    this.firstLoaded = true;
                }
            },
            allField(val){
                if(!this.copyFields || this.copyFields.length < 1){
                    this.copyFields = JSON.parse(JSON.stringify(val));
                }
            },
            configuration(){
                this.loadConfiguration();
            },
            formatFields(){
                this.loadConfiguration();
            }
        }
    }
</script>


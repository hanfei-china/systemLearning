<template>
    <el-container>
        <el-main class="unset-padding">
            <el-form size="small" label-width="120px">
                <el-form-item :label="typeName+'代码：'" required>
                    <el-input v-model="deptInfo.deptCode"/>
                </el-form-item>
                <el-form-item :label="typeName+'名称：'" required>
                    <el-input v-model="deptInfo.deptName"  :placeholder="`请输入${typeName}名称，20字以内`" :maxlength="20"/>
                </el-form-item>
                <el-form-item label="联系人：" required>
                    <el-input v-model="deptInfo.contact"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：">
                    <el-input v-model="deptInfo.contactWay"></el-input>
                </el-form-item>
                <el-form-item label="负责人：">
                    <el-select placeholder="请选择负责人" style="width: 440px;" v-model="deptInfo.chosenAdmins" filterable remote :remote-method="getRelevantAdminUserList">
                        <el-option v-for="admin of adminList" :key="admin.id" :label="admin.name" :value="admin.id"></el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            {{typeName}}名称：
                        </div>
                    </template>
                    <el-input v-model="deptInfo.deptName" :placeholder="`请输入${typeName}名称，20字以内`" :maxlength="20"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            上级{{typeName}}：
                        </div>
                    </template>
                    <dept-tree v-model="deptInfo.parentId" :disabled-nodes="disabledNodes" :placeholder="`请选择上级${typeName}`"/>
                </el-form-item> -->
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">{{id ? '确认修改' : '确认添加'}}</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import DeptTree from "./DeptTree";
    export default {
        name: "DeptForm",
        components: {DeptTree},
        props: {
            id: {
                type: String,
                default: null
            },
            parentId:{
                type: String,
                default: null
            },
            typeName:{
                type: String,
                required: true
            },
            seq:{
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                deptInfo:{
                    deptName: '',
                    parentId: this.parentId,
                    seq: this.seq,
                },
                adminList: [],
            }
        },
        methods: {
            getRelevantAdminUserList(keyword){
                this.$request.get('/api/admin/privilege/relevantAdminUserList',{
                    params:{
                        keyword,
                        roleId: this.roleId
                    }
                }).then(res=>{
                    this.adminList = res.data;
                });
            },
            disabledNodes(nodes){
                this.filterNodes(nodes,this.id,false);
            },
            filterNodes(nodes,deleteId,disabled){
                for(let node of nodes){
                    let {children,id, personsNum} = node;
                    if(disabled){
                        node.disabled = true;
                    }else{
                        if(deleteId === id || personsNum > 0){
                            node.disabled = true;
                            this.filterNodes(children,deleteId,true);
                        }else{
                            this.filterNodes(children,deleteId,false);
                        }
                    }

                }
            },
            getDeptInfo() {
                if (this.id) {
                    this.$request.get('/api/admin/dept/manage/getDeptInfo', {
                        params: {id: this.id,operate:0}
                    }).then(resp => {
                        let data = resp.data[0];
                        this.deptInfo.deptName = data.deptName;
                        this.deptInfo.parentId = data.parentId;
                        this.deptInfo.seq = data.seq;
                    })
                }
            },
            checkData() {
                return new Promise((resolve, reject) => {

                    if (!this.deptInfo.deptName) {
                        reject(new Error(`请输入${this.typeName}名称`));
                        return;
                    }

                    resolve({...this.deptInfo});

                })
            },
            submitData() {
                this.checkData().then(params => {
                    if (this.id) {
                        params.id = this.id;
                        this.$request.put('/api/admin/dept/manage/updateDept', params).then(() => {
                            this.emitParent();
                            this.$message.success(`${this.typeName}信息修改成功`);
                        })
                    } else {
                        this.$request.post('/api/admin/dept/manage/addDept', params).then(() => {
                            this.emitParent();
                            this.$message.success(`${this.typeName}添加成功`);
                        })

                    }
                }).catch(e => {
                    this.$message.warning(e.message);
                });
            },
            emitParent() {
                this.$emit('refresh');
                this.$emit('close');
            },
        },
        created() {
            this.getDeptInfo();
        }
    }
</script>

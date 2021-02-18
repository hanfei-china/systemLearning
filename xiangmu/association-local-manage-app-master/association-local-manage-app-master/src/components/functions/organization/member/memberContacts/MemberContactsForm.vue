<template>
    <el-container>
        <el-main class="unset-padding" style="overflow: hidden;">
            <el-form size="small" label-width="120px">
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            姓名：
                        </div>
                    </template>
                    <el-input v-model="contactsInfo.name" :placeholder="`请输入联系人姓名，20字以内`" :maxlength="20"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            手机号：
                        </div>
                    </template>
                    <el-input v-model="contactsInfo.phone" :placeholder="`请输入联系人手机号，11字以内`" :maxlength="11"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            座机号码：
                        </div>
                    </template>
                    <el-input v-model="contactsInfo.landline" :placeholder="`请输入联系人座机号码，50字以内`" :maxlength="50"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            电子邮箱：
                        </div>
                    </template>
                    <el-input v-model="contactsInfo.email" :placeholder="`请输入联系人电子邮箱地址，50字以内`" :maxlength="50"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            传真号码：
                        </div>
                    </template>
                    <el-input v-model="contactsInfo.fax" :placeholder="`请输入联系人传真号码，50字以内`" :maxlength="50"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label required">
                            所属单位：
                        </div>
                    </template>
                    <member-choose  v-model="contactsInfo.memberId" style="width: 100%;" placeholder="请选择联系人所属单位"/>
                </el-form-item>
                <el-form-item>
                    <template v-slot:label>
                        <div class="custom-el-form-item-label">
                            联系人职位：
                        </div>
                    </template>
                    <el-input v-model="contactsInfo.post" :placeholder="`请输入联系人职位，50字以内`" :maxlength="50"/>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="unset-padding" height="auto">
            <div class="text-align-right" style="padding-top: 16px;">
                <el-button icon="el-icon-error" type="danger" size="small" @click="$emit('close')">取消返回</el-button>
                <el-button icon="el-icon-success" type="primary" size="small" @click="submitData">{{contacts ? '确认修改' :'确认添加'}}</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>

    import MemberChoose from "../../../util/member/MemberChoose";
    export default {
        name: "MemberContactsForm",
        components: {MemberChoose},
        props: {
            contacts: Object,
            groupId: String
        },
        data() {
            return {
                contactsInfo: Object.assign({
                    name: null,
                    phone: null,
                    landline: null,
                    email: null,
                    fax: null,
                    post: null,
                    memberId: null
                },this.contacts)
            }
        },
        methods: {
            checkData() {
                return new Promise((resolve, reject) => {
                    if (!this.contactsInfo.name) {
                        reject(new Error(`请输入联系人姓名`));
                        return;
                    }

                    if (!this.contactsInfo.memberId) {
                        reject(new Error(`请选择联系人所属单位`));
                        return;
                    }

                    let groupIds = [];
                    if(this.groupId){
                        groupIds.push(this.groupId);
                    }



                    resolve({...this.contactsInfo,groupIds});
                })
            },
            submitData() {
                this.checkData().then(params => {
                    if (this.contacts) {
                        params.id = this.contacts.id;
                        this.$request.put('/api/admin/member/contacts', params).then(() => {
                            this.emitParent();
                            this.$message.success(`联系人信息修改成功`);
                        })
                    } else {
                        this.$request.post('/api/admin/member/contacts', params).then(() => {
                            this.emitParent();
                            this.$message.success(`联系人添加成功`);
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
    }
</script>

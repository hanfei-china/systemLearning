<template>
    <el-container class="absolute-fill-parent">
        <el-header class="flex border-bottom" style="line-height: 60px">
            <div class="flex-fill-in-the-remaining-space">
                {{ templateTitle }}
            </div>
            <div class="text-align-right">
                <el-button
                    size="small"
                    icon="el-icon-error"
                    type="danger"
                    @click="$emit('close')"
                    >取消返回</el-button
                >
                <el-button
                    size="small"
                    icon="el-icon-success"
                    type="primary"
                    @click="saveData"
                    >确 定</el-button
                >
            </div>
        </el-header>
        <el-main class="flex">
            <div class="flex-fill-in-the-remaining-space">
                <vue-scroll>
                    <el-form size="small" label-width="100px">
                        <el-form-item label="模板名称：" required>
                            <el-input v-model="title" />
                        </el-form-item>
                        <el-form-item label="邮件主题：" required>
                            <el-input v-model="subject" />
                        </el-form-item>
                        <el-form-item label="邮件内容：" required>
                            <div>
                                <div
                                    style="
                                        line-height: 32px;
                                        background-color: #e4e4e4;
                                        padding: 5px;
                                        border: 1px solid #dcdfe6;
                                        border-bottom: none;
                                    "
                                >
                                    <span>添加字段：</span>
                                    <el-select
                                        style="width: 160px"
                                        v-model="fieldSelect"
                                        @change="selectFields"
                                    >
                                        <el-option
                                            v-for="item in fieldList"
                                            :key="item.id"
                                            :value="item.id"
                                            :label="item.name"
                                        />
                                    </el-select>
                                </div>
                                <div>
                                    <editor v-model="content" ref="editor" />
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="上传附件：">
                            <multiple-upload
                                :before-upload="beforeUpload"
                                v-model="attachPaths"
                                tip="单个文件应小于100M"
                            />
                        </el-form-item>
                    </el-form>
                </vue-scroll>
            </div>
            <div
                class="border flex flex-column"
                style="width: 500px; margin-left: 20px"
            >
                <div class="flex" style="line-height: 32px; padding: 10px">
                    <span>主题</span>
                    <div
                        class="flex-fill-in-the-remaining-space"
                        style="padding: 0 0 0 10px"
                    >
                        <div
                            class="border"
                            style="
                                width: 100%;
                                height: 100%;
                                box-sizing: border-box;
                            "
                        >
                            {{ subject }}
                        </div>
                    </div>
                </div>
                <div
                    class="flex-fill-in-the-remaining-space flex"
                    style="line-height: 32px; padding: 10px"
                >
                    <span>正文</span>
                    <div
                        class="flex-fill-in-the-remaining-space"
                        style="padding: 0 0 0 10px"
                    >
                        <div
                            class="border"
                            style="
                                width: 100%;
                                height: 100%;
                                box-sizing: border-box;
                            "
                        >
                            <vue-scroll>
                                <div v-html="content"></div>
                            </vue-scroll>
                        </div>
                    </div>
                </div>
                <div class="flex" style="line-height: 32px; padding: 10px">
                    <span>附件</span>
                    <div
                        class="flex-fill-in-the-remaining-space"
                        style="padding: 0 0 0 10px"
                    >
                        <p v-for="item in attachPaths" :key="item.uid">
                            {{ item.name }}
                        </p>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import Editor from "../../../../util/editor/Editor";
import MultipleUpload from "../../../util/upload/MultipleUpload";

export default {
    name: "TemplateForm",
    components: { MultipleUpload, Editor },
    props: ["templateId"],
    data() {
        return {
            fieldList: [], //活动字段
            fieldSelect: "",

            attachPaths: [], //附件
            title: "", //模板名称
            subject: "", //邮件主题
            content: "", //模板内容
            editor: null,
        };
    },
    computed: {
        templateTitle() {
            return this.templateId ? "编辑模板" : "新增模板";
        },
    },
    created() {
        this.getFieldList();
        this.getData();
    },
    methods: {
        getData() {
            if (this.templateId) {
                this.$request
                    .get("/admin/communication/template/getTemplate", {
                        params: {
                            id: this.templateId,
                        },
                    })
                    .then((res) => {
                        let data = res.data[0];

                        this.attachPaths = JSON.parse(
                            data.template.attachPaths
                        );
                        this.title = data.template.title;
                        this.subject = data.template.subject;
                        this.content = data.showContent;
                    });
            }
        },
        getFieldList() {
            let list = [];
            this.$request
                .get("/api/common/associator/getFieldsInfo")
                .then((res) => {
                    if (res.success) {
                        list = res.data;
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].topicType === 9) {
                                list.splice(i, 1);
                            }
                        }
                        this.fieldList = list.filter((item) => {
                            return [0, 1, 2].includes(item.groupId);
                        });
                    }
                });
        },
        selectFields(id) {
            if (!this.editor) {
                this.editor = this.$refs.editor.ue;
            }

            for (let item of this.fieldList) {
                if (item.id === id) {
                    let temp = `&nbsp;<span style="background-color: #eff2f7;padding: 2px 5px;height: 23px;" contenteditable="false">[#${item.name}#]</span>&nbsp;`;
                    this.editor.execCommand("insertHtml", temp);
                }
            }
        },
        beforeUpload(file) {
            if (file.size > 100 * 1024 * 1024) {
                this.$message.warning(
                    `【${file.name}】上传失败，文件大小应不大于100M`
                );
                return false;
            }
            return true;
        },
        saveData() {
            if (!this.title) {
                this.$message.warning("请输入模版名称");
                return;
            }
            if (!this.subject) {
                this.$message.warning("请输入邮件主题");
                return;
            }
            if (!this.content) {
                this.$message.warning("请输入邮件内容");
                return;
            }
            let data = {
                attachPaths: JSON.stringify(this.attachPaths),
                content: this.content,
                objectType: 0,
                templateType: 0,
                subject: this.subject,
                title: this.title,
            };
            if (this.templateId) {
                data.id = this.templateId;
                this.$request
                    .put("/admin/communication/template/updateTemplate", data)
                    .then(() => {
                        this.$message.success("模版修改成功");
                        this.$emit("refresh");
                        this.$emit("close");
                    });
            } else {
                this.$request
                    .post("/admin/communication/template/addTemplate", data)
                    .then(() => {
                        this.$message.success("模版新增成功");
                        this.$emit("refresh");
                        this.$emit("close");
                    });
            }
        },
    },
};
</script>

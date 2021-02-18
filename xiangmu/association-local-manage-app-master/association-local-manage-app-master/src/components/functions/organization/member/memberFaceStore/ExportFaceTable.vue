<template>
    <el-container>
        <el-main class="unset-padding">
            <el-table :data="list" height="400px" class="custom-el-table header-gray" size="small" border stripe>
                <el-table-column type="index" label="序号" width="55" align="center"/>
                <el-table-column label="照片" width="100" align="center">
                    <template v-slot="{row}">
                        <table-image-preview :preview-list="[row.fileUrl]"/>
                    </template>
                </el-table-column>
                <el-table-column label="图片名称" prop="fileName" show-overflow-tooltip/>
                <el-table-column label="错误标签">
                    <template v-slot="{row}">
                        <span v-if="row.flag === 0">上传失败</span>
                        <span v-else-if="row.flag === 2">唯一项为空，跳过不导入</span>
                        <span v-else-if="row.flag === 3">匹配到多条重复数据</span>
                    </template>
                </el-table-column>
                <el-table-column label="错误原因" show-overflow-tooltip>
                    <template v-slot="{row}">
                        <div v-if="row.flag === 0 || row.flag === 2">{{row.error_msg}}</div>
                        <div v-else-if="row.flag === 3">
                            <el-button type="text" size="small" class="unset-padding" @click="viewErrorMsg(row.error_msg)">点击查看</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-dialog title="重复数据" :visible.sync="repeatDataVisible" append-to-body width="800px"
                   :close-on-click-modal="false">
            <repeat-data-table :list="repeatData"></repeat-data-table>
        </el-dialog>
    </el-container>
</template>

<script>
    import TableImagePreview from "../../../util/TableImagePreview";
    import RepeatDataTable from "./RepeatDataTable";
    export default {
        name: "ExportFaceTable",
        components: {RepeatDataTable, TableImagePreview},
        props: {list: Array},
        data(){
            return {
                repeatDataVisible: false,
                repeatData: [],//重复数据
            }
        },
        methods: {
            viewErrorMsg(errorMsg){
                this.repeatDataVisible = true;
                this.repeatData = JSON.parse(errorMsg)
            }
        }
    }
</script>

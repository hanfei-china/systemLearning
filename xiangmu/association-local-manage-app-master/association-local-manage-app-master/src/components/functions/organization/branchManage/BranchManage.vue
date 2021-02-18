<template>
    <el-container class="absolute-fill-parent background-color-white" style="padding: 0 16px;">
        <el-header class="flex flex-column flex-center unset-padding">
            <div class="flex">
                <div class="flex-fill-in-the-remaining-space flex flex-column flex-center">
                    <div class="flex">
                        <el-input style="max-width: 250px;" v-model="page.name" placeholder="请输入分会名称进行搜索" size="small"/>
                        <div style="margin-left: 16px;">
                            分会类型：<branch-type-choose v-model="branchClass"/>
                        </div>
                    </div>
                </div>
                <div>
                    <el-button size="small" @click="typeDialogShow=true">分会类型管理</el-button>
                    <el-button type="primary" size="small" @click="newBranch">新增分会</el-button>
                </div>
            </div>
        </el-header>
        <el-main class="unset-padding position-relative" style="padding-bottom: 16px !important;">
            <el-draggable-table :list="list" :el-table-props="elTableProps" class="custom-el-table header-gray"
                                :options="dragOptions" dragSelector="tbody" @end='sort'>
                <el-table-column label="序号" width="50" class-name="item-un-sort">
                    <template v-slot="{$index}">
                        <div class="text-align-center">
                            {{$index+1}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="item-un-sort" label="分会名称" prop="name" show-tooltip-when-overflow/>
                <el-table-column class-name="item-un-sort" label="分会类型" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <i class="el-icon-lock" v-show="!row.branchClassIsUesd"/>{{row.branchClassName}}
                    </template>
                </el-table-column>
                <el-table-column class-name="item-un-sort" label="分会所在地" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.address | cascadeArray }}
                    </template>
                </el-table-column>

                <el-table-column class-name="item-un-sort" label="分会联系人" prop="contactPerson" show-tooltip-when-overflow/>
                <el-table-column class-name="item-un-sort" label="分会联系电话" prop="contactPhone" show-tooltip-when-overflow/>

                <el-table-column class-name="item-un-sort" label="会员数" prop="memberCount" width="100" show-tooltip-when-overflow/>
                <el-table-column class-name="item-un-sort" label="分会介绍" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        <span v-hyperlink="{innerHtml:row.introduce}" />
                    </template>
                </el-table-column>
                <el-table-column class-name="item-un-sort" label="创建时间" width="180" show-tooltip-when-overflow>
                    <template v-slot="{row}">
                        {{row.createTime | yyyyMMddHHmm}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template v-slot="{row}">
                        <el-button class="custom-el-button primary unset-padding item-sort" type="text">排序</el-button>
                        <el-button class="custom-el-button primary unset-padding item-un-sort" type="text" @click="editBranch(row.id)">编辑</el-button>
                        <el-button class="custom-el-button danger unset-padding item-un-sort" v-if="row.branchType === 2" type="text" @click="deleteBranch(row)">删除</el-button>
                        <el-button class="custom-el-button unset-padding item-un-sort" type="text" @click="branchCode(row)">二维码</el-button>
                    </template>
                </el-table-column>
            </el-draggable-table>
        </el-main>
        <branch-form v-if="formVisible" :visible.sync="formVisible" :seq="total" :id="formId" @refresh="refresh"/>
        <el-dialog title="分会类型管理" :close-on-click-modal="false" append-to-body width="800px"
                   :visible.sync="typeDialogShow">
            <branch-type-manage v-if="typeDialogShow"></branch-type-manage>
        </el-dialog>
        <el-dialog :visible.sync="branchInvitationCodeFormVisible" title="分会二维码" append-to-body :close-on-click-modal="false" width="600px">
            <div class="flex">
                <div v-loading="branchInvitationCodeLoading"
                     element-loading-text="拼命加载中"
                     element-loading-background="rgba(150, 150, 150, 0.1)" style="width: 180px;height: 180px;">
                    <canvas v-if="branchInvitationCode" ref="canvas" style="width: 180px;height: 180px;"></canvas>
                </div>
                <img @load="drawCanvas" ref="image" crossorigin="anonymous" :src="branchInvitationCode" v-if="branchInvitationCode" style="width: 180px; height: 180px;display: none;"/>
                <div style="font-size: 16px;line-height: 30px;margin-left: 16px;" class="flex flex-center flex-column flex-fill-in-the-remaining-space">
                    <div>点击<a @click.stop="downloadCode" class="lrd-a">这里</a>下载保存此二维码，微信扫描二维码可以申请加入该分会</div>
                </div>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import BranchForm from "./BranchForm";
    import BranchTypeManage from "./branchType/BranchTypeManage";
    import BranchTypeChoose from "./branchType/BranchTypeChoose";

    import {download} from "../../../../js/util/download";
    import ElDraggableTable from "../../../util/elTableDraggable/ElDraggableTable";

    export default {
        name: "BranchManage",
        components: {ElDraggableTable, BranchTypeChoose, BranchTypeManage, BranchForm},
        props:{
            visible: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                formVisible: false,
                formId: null,

                page:{
                    pageSize: 0,
                    pageNum: 1,
                    name: ''
                },

                list: [],
                total: 0,

                typeDialogShow: false,
                branchFormDialogShow: false,
                branchClass:'',

                branchInvitationCodeFormVisible: false,
                branchInvitationCode: '',
                branchInvitationName: '',
                branchInvitationCodeLoading: true,

                dragOptions: {
                    filter: '.item-un-sort',
                    draggable: '.el-table__row',
                    animation: 150
                },
                elTableProps:{
                    height: "100%",
                    size: "small",
                    border: true,
                    stripe: true
                }
            }
        },
        methods:{
            newBranch(){
                this.formId = null;
                this.formVisible = true;
            },
            editBranch(id){
                this.formId = id;
                this.formVisible = true;
            },
            deleteBranch(row){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    this.$request.delete('api/admin/branch',{
                        params:{id:row.id}
                    }).then(()=>{
                        this.refresh();
                        this.$message.success(`分会【${row.name}】已删除成功`);
                    })
                }).catch(()=>{});
            },
            getList(){
                let params = {
                    name: this.page.name,
                    limit: this.page.pageSize,
                    offset: (this.page.pageNum - 1) * this.page.pageSize,
                    branchClass: this.branchClass,
                    needMemberCount: true,
                    needMain: true,
                    sort: 'seq asc'
                }

                this.$request.get('/api/common/branch/branchList',{params}).then((resp)=>{
                    let {data} = resp;
                    let list = data.list;
                    list.map(branch=>{
                        branch.memberCount = 0;
                        let branchId = branch.id;
                        for(let memberCount of data.memberCounts){
                            let _branchId = memberCount.branchId;
                            if(_branchId === branchId){
                                branch.memberCount = memberCount.memberCount;
                                break;
                            }
                        }
                    })

                    this.list = list;
                    this.total = data.total;
                })
            },
            refresh(){
                this.page.pageNum = 1;
                this.getList();
            },
            sizeChange(size){
                this.page.pageSize =size;
                this.refresh();
            },
            currentChange(current){
                this.page.pageNum = current;
                this.getList();
            },
            branchCode(row){
                this.branchInvitationCodeLoading = true;
                this.branchInvitationCodeFormVisible = true;
                this.branchInvitationCode = '';
                this.$request.get('/api/admin/branch/invitationCode',{
                    params:{
                        branchId: row.id
                    }
                }).then(res=>{
                    this.branchInvitationCode = res.data+'?time=' + new Date().valueOf();
                    this.branchInvitationName = row.name;
                })
            },
            downloadCode(){
                if(this.branchInvitationCodeLoading){
                    this.$message.warning({message:'请等待二维码加载完成',duration:1000});
                    return;
                }
                let data = this.$refs.canvas.toDataURL( 'image/png', 1 );
                download(data, `${this.branchInvitationName}.png`, "image/png");
            },
            drawCanvas(){
                let canvas = this.$refs.canvas;
                let image = this.$refs.image;
                canvas.width= image.width;
                canvas.height= image.height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(image,0,0);
                this.branchInvitationCodeLoading = false;
            },
            sort(){
                let ids = [];
                for(let item of this.list){
                    ids.push(item.id);
                }

                this.$request.put('/api/admin/branch/sort',{ids}).then(()=>{
                    this.$message.success("分类排序成功");
                })
            },
        },
        created() {
            this.refresh();
        },
        watch:{
            'page.name'(){
                this.refresh();
            },
            branchClass(){
                this.refresh();
            }
        }
    }
</script>

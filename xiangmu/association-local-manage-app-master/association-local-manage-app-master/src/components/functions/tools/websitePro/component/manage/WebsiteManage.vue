<template>
    <el-container class="website-pro-absolute-fill-parent" v-loading="loading">
        <el-header class="website-pro-unset-padding website-pro-flex column center" height="40px">
            <div class="website-pro-flex">
                <div style="font-size: 15px;line-height: 28px;" class="flex-fill-in-the-remaining-space">网站管理</div>
                <div style="font-size: 20px;" class="website-pro-cursor-pointer" @click="$emit('close')"><i class="el-icon-close"/></div>
            </div>
        </el-header>
        <el-main class="website-pro-position-relative website-pro-unset-padding">
            <vue-scroll>
                <div style="padding: 4px 4px 4px 0;">
                    <el-tree class="website-pro-manage-tree" ref="tree" :data="treeData" highlight-current
                             node-key="id" default-expand-all :expand-on-click-node="false"
                             draggable :allow-drag="allowDrag" :allow-drop="allowDrop" @node-drop="handleDrop"
                             :props="{label:'title'}">
                        <div class="website-pro-manage-tree-custom-tree-node" @click="designModule(data)" slot-scope="{ data }">
                            <div class="website-pro-manage-tree-custom-tree-node-title max-width" style="user-select: none;">
                                <el-tooltip placement="top" :content="data.title">
                                    <span style="outline:none;">{{ data.title }}</span>
                                </el-tooltip>
                            </div>
                            <div class="website-pro-flex end flex-fill-in-the-remaining-space">
                                <div v-if="data.type === 'pageHeaderGroup'">
                                    <el-tooltip placement="top" content="新增页头">
                                        <el-button type="text" icon="el-icon-plus" size="mini" @click.stop="openNewModule('pageHeader')"/>
                                    </el-tooltip>
                                </div>
                                <div v-if="data.type === 'pageHeader'">
                                    <el-button type="text" size="mini" @click.stop="designModule(data)">设计页头</el-button>
                                    <el-tooltip placement="top" content="页头设置">
                                        <el-button type="text" icon="el-icon-setting" size="mini" @click.stop="openUpdateModule(data)"/>
                                    </el-tooltip>
                                    <el-tooltip placement="top" content="复制页头">
                                        <el-button type="text" icon="iconfont icon-website-copy" size="mini" @click.stop="openCopyModule(data)"/>
                                    </el-tooltip>
                                    <el-tooltip placement="top" content="删除页头">
                                        <el-button type="text" icon="el-icon-delete" size="mini" @click.stop="deleteModule(data)"/>
                                    </el-tooltip>
                                </div>
                                <div v-if="data.type === 'pageFooterGroup'">
                                    <el-tooltip placement="top" content="新增页尾">
                                        <el-button type="text" icon="el-icon-plus" size="mini" @click.stop="openNewModule('pageFooter')"/>
                                    </el-tooltip>
                                </div>
                                <div v-if="data.type === 'pageFooter'">
                                    <el-button type="text" size="mini" @click.stop="designModule(data)">设计页尾</el-button>
                                    <el-tooltip placement="top" content="页尾设置">
                                        <el-button type="text" icon="el-icon-setting" size="mini" @click.stop="openUpdateModule(data)"/>
                                    </el-tooltip>
                                    <el-tooltip placement="top" content="复制页尾">
                                        <el-button type="text" icon="iconfont icon-website-copy" size="mini" @click.stop="openCopyModule(data)"/>
                                    </el-tooltip>
                                    <el-tooltip placement="top" content="删除页尾">
                                        <el-button type="text" icon="el-icon-delete" size="mini" @click.stop="deleteModule(data)"/>
                                    </el-tooltip>
                                </div>
                                <div v-if="data.type === 'pageMainGroup'">
                                    <el-tooltip placement="top" content="新增页面">
                                        <el-button type="text" icon="el-icon-plus" size="mini" @click.stop="openNewModule('pageMain')"/>
                                    </el-tooltip>
                                </div>
                                <div v-if="data.type === 'pageMain'">
                                    <el-button type="text" size="mini" @click.stop="designModule(data)">设计页面</el-button>
                                    <el-tooltip placement="top" content="页面设置">
                                        <el-button type="text" icon="el-icon-setting" size="mini" @click.stop="openUpdateModule(data)"/>
                                    </el-tooltip>
                                    <el-tooltip placement="top" content="复制页面">
                                        <el-button type="text" icon="iconfont icon-website-copy" size="mini" @click.stop="openCopyModule(data)"/>
                                    </el-tooltip>
                                    <el-tooltip placement="top" content="删除页面">
                                        <el-button type="text" icon="el-icon-delete" size="mini" @click.stop="deleteModule(data)"/>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </el-tree>
                </div>
            </vue-scroll>
        </el-main>
        <el-dialog :visible.sync="titleInputDialogVisible" width="560px" :title="titleInputDialogTitle" append-to-body :close-on-click-modal="false">
            <el-form label-width="100px" size="mini">
                <el-form-item :label="titleTitle+'：'" required>
                    <el-input v-model="moduleTitle" :maxlength="100" :placeholder="`请输入${titleTitle}`"/>
                </el-form-item>
                <div v-show="moduleType === 'pageMain'">
                    <el-form-item label="页面短id：" required>
                        <el-input v-model="moduleShortId" :maxlength="32" :placeholder="`请输入页面短id，32字英文或数字`"/>
                        <el-alert v-show="!isNew && !isCopy" style="line-height: 1;margin-top: 6px;" title="短id修改后，使用了该页面的所有组件需要重新进行页面绑定" type="warning" show-icon :closable="false"/>
                    </el-form-item>
                    <el-form-item label="页面标题：">
                        <el-input v-model="otherSetting.pageTitle" placeholder="请输入页面标题"/>
                    </el-form-item>
                    <el-form-item label="页面关键字：">
                        <el-input v-model="otherSetting.keywords" placeholder="请输入页面关键字"/>
                    </el-form-item>
                    <el-form-item label="页头选择：">
                        <page-header-attr style="width: 100%;" :attributes="{showClear:true}" v-model="otherSetting.pageHeaderId"/>
                    </el-form-item>
                    <el-form-item label="固定页头：" v-show="otherSetting.pageHeaderId">
                        <el-checkbox v-model="otherSetting.fixedHeader">固定页头</el-checkbox>
                    </el-form-item>
                    <el-form-item label="页尾选择：">
                        <page-footer-attr style="width: 100%;" :attributes="{showClear:true}" v-model="otherSetting.pageFooterId"/>
                    </el-form-item>
                </div>
            </el-form>
            <div style="text-align: right;">
                <el-button size="small" @click="titleInputDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="submitModuleData">确定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {deepCopy} from "../../js/util/util";
    import PageHeaderAttr from "../attribute/PageHeaderAttr";
    import PageFooterAttr from "../attribute/PageFooterAttr";

    export default {
        name: "WebsiteManage",
        components: {PageFooterAttr, PageHeaderAttr},
        data() {
            return {
                websiteInfo: {
                    id: '',
                    pageHeaders: [],
                    pageFooters: [],
                    pageMains: []
                },


                titleInputDialogVisible: false,
                titleInputDialogTitle: '模块标题',
                titleTitle: '',
                moduleTitle: '',
                moduleShortId: '',
                otherSetting: {
                    pageTitle: '',
                    keywords: '',
                    pageHeaderId: '',
                    fixedHeader: false,
                    pageFooterId: ''
                },
                moduleType: '',
                isNew:true,
                editModule: null,
                loading: true,

                isCopy: false,
                copyModule: null
            }
        },
        computed: {
            moduleId(){
                return this.$route.params.moduleId;
            },
            treeData() {
                let tree = [];
                tree.push({
                    title: '页头',
                    type: 'pageHeaderGroup',
                    id: 'pageHeaderGroup',
                    children: this.websiteInfo.pageHeaders
                });

                tree.push({
                    title: '页尾',
                    type: 'pageFooterGroup',
                    id: 'pageFooterGroup',
                    children: this.websiteInfo.pageFooters
                });

                tree.push({
                    title: '页面',
                    type: 'pageMainGroup',
                    id: 'pageMainGroup',
                    children: this.websiteInfo.pageMains
                });

                return tree;
            },
        },
        methods: {
            allowDrag(node){
                return node.data.type === 'pageMain';
            },
            allowDrop(draggingNode, dropNode, type) {
                return draggingNode.data.type === 'pageMain' && dropNode.data.type === 'pageMain' && (type !== 'inner');
            },
            handleDrop(draggingNode, dropNode) {
                let ids = [];

                for(let menu of dropNode.parent.data.children){
                    ids.push(menu.id);
                }

                this.$request.put('/api/admin/website/pageMain/sort',ids).then(()=>{
                    this.getWebsiteInfo();
                    this.$message.success({message:'排序成功',duration:1500});
                })

            },
            getWebsiteInfo() {
                this.titleInputDialogVisible = false;
                this.moduleType = '';
                this.moduleTitle ='';
                this.editModule = null;
                this.loading = true;
                this.$request.get('/api/admin/website').then(res=>{
                    let {data} = res;
                    this.websiteInfo.id = data.id;
                    data.pageHeaders.map(item => {
                        item.type = 'pageHeader'
                    });

                    this.websiteInfo.pageHeaders = data.pageHeaders;

                    data.pageFooters.map(item => {
                        item.type = 'pageFooter'
                    });

                    this.websiteInfo.pageFooters =  data.pageFooters;

                    data.pageMains.map(item => {
                        item.type = 'pageMain'
                    });

                    this.websiteInfo.pageMains = data.pageMains;

                    setTimeout(()=>{this.$nextTick(()=>{ this.loading = false; })},500);
                });
            },
            translator(parents, children) {
                //遍历父节点数据
                parents.forEach(parent => {
                    //遍历子节点数据
                    children.forEach((current, index) => {
                        //若该节点是对应的父级节点的子节点
                        if (current.groupId === parent.id) {
                            //深拷贝一份子节点数组
                            let temp = deepCopy(children);
                            //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
                            temp.splice(index, 1);
                            //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
                            this.translator([current], temp);
                            //把找到子节点放入父节点的children属性中
                            parent.children ? parent.children.push(current) : parent.children = [current];
                        }
                    });
                });

            },
            openNewModule(type){
                this.isNew = true;
                this.isCopy = false;
                switch (type) {
                    case 'pageHeader':
                        this.moduleType = type;
                        this.titleInputDialogVisible = true;
                        this.titleInputDialogTitle ='新增页头';
                        this.titleTitle = '页头名称';
                        this.moduleTitle ='';
                        break;
                    case 'pageFooter':
                        this.moduleType = type;
                        this.titleInputDialogVisible = true;
                        this.titleInputDialogTitle ='新增页尾';
                        this.titleTitle = '页尾名称';
                        this.moduleTitle ='';
                        break;
                    case 'pageMain':
                        this.moduleType = type;
                        this.titleInputDialogVisible = true;
                        this.titleInputDialogTitle ='新增页面';
                        this.titleTitle = '页面名称';
                        this.moduleTitle ='';
                        this.moduleShortId = '';
                        this.otherSetting.pageTitle = '';
                        this.otherSetting.keywords = '';
                        this.otherSetting.pageHeaderId = '';
                        this.otherSetting.fixedHeader = false;
                        this.otherSetting.pageFooterId = '';
                        break;
                    default:
                        this.$message.warning(`不支持的操作：${type}`);
                }

            },
            submitModuleData(){
                if(this.isNew && !this.isCopy){
                    this.newModule();
                } else if(!this.isNew && !this.isCopy){
                    this.updateModule();
                } else if(!this.isNew && this.isCopy){
                    this.copy();
                }

            },
            newModule(){
                if(!this.moduleTitle){
                    this.$message.warning(`请输入${this.titleInputDialogTitle}`);
                    return;
                }

                switch (this.moduleType) {
                    case 'pageHeader':
                        this.$request.post('/api/admin/website/pageHeader',{
                            title:this.moduleTitle,modules:'[]',otherSetting:'{}'
                        }).then(()=>{
                            this.getWebsiteInfo();
                        });
                        break;
                    case 'pageFooter':
                        this.$request.post('/api/admin/website/pageFooter',{
                            title:this.moduleTitle,modules:'[]',otherSetting:'{}'
                        }).then(()=>{
                            this.getWebsiteInfo();
                        });
                        break;
                    case 'pageMain':
                        this.$request.post('/api/admin/website/pageMain',{
                            title:this.moduleTitle,modules:'[]',
                            otherSetting: JSON.stringify({...this.otherSetting,customCss:''}),
                            shortId: this.moduleShortId,
                            seq: this.websiteInfo.pageMains.length
                        }).then(()=>{
                            this.getWebsiteInfo();
                        });
                        break;
                    default:
                        return;
                }
            },
            deleteModule(data){
                this.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
                    switch (data.type) {
                        case 'pageHeader':
                            this.$request.delete('/api/admin/website/pageHeader',{
                                params:{id:data.id}
                            }).then(()=>{
                                this.getWebsiteInfo();
                                this.$message.success('页头删除成功');
                            });
                            break;
                        case 'pageFooter':
                            this.$request.delete('/api/admin/website/pageFooter',{
                                params:{id:data.id}
                            }).then(()=>{
                                this.getWebsiteInfo();
                                this.$message.success('页尾删除成功');
                            });
                            break;
                        case 'pageMain':
                            if(this.websiteInfo.pageMains.length < 2){
                                this.$message.warning("需保留至少一个页面");
                                return;
                            }

                            this.$request.delete('/api/admin/website/pageMain',{
                                params:{id:data.id}
                            }).then(()=>{
                                this.getWebsiteInfo();
                                this.$message.success('页面删除成功');
                            });
                            break;
                        default:
                            return;
                    }


                }).catch(()=>{});
            },
            openUpdateModule(data){
                this.isNew = false;
                this.isCopy = false;
                this.editModule = data;
                let {type,title,shortId,otherSetting} = data;
                otherSetting = JSON.parse(otherSetting);
                switch (type) {
                    case 'pageHeader':
                        this.moduleType = type;
                        this.titleInputDialogVisible = true;
                        this.titleInputDialogTitle ='页头设置';
                        this.titleTitle = '页头名称';
                        this.moduleTitle = title;
                        break;
                    case 'pageFooter':
                        this.moduleType = type;
                        this.titleInputDialogVisible = true;
                        this.titleInputDialogTitle ='页尾设置';
                        this.titleTitle = '页尾名称';
                        this.moduleTitle =title;
                        break;
                    case 'pageMain':
                        this.moduleType = type;
                        this.titleInputDialogVisible = true;
                        this.titleInputDialogTitle ='页面设置';
                        this.titleTitle = '页面名称';
                        this.moduleTitle =title;
                        this.moduleShortId = shortId;
                        this.otherSetting.pageTitle = otherSetting.pageTitle;
                        this.otherSetting.keywords = otherSetting.keywords || '';
                        this.otherSetting.pageHeaderId = otherSetting.pageHeaderId;
                        this.otherSetting.fixedHeader = otherSetting.fixedHeader;
                        this.otherSetting.pageFooterId = otherSetting.pageFooterId;
                        break;
                    default:
                        this.$message.warning(`不支持的操作：${type}`);
                }
            },
            updateModule(){
                if(!this.moduleTitle){
                    this.$message.warning(`请输入${this.titleInputDialogTitle}`);
                    return;
                }

                let {id,type} = this.editModule;

                switch (type) {
                    case 'pageHeader':
                        this.$request.put('/api/admin/website/pageHeader',{
                            title:this.moduleTitle,modules:'[]',otherSetting:'',id
                        }).then(()=>{
                            this.getWebsiteInfo();
                        });
                        break;
                    case 'pageFooter':
                        this.$request.put('/api/admin/website/pageFooter',{
                            title:this.moduleTitle,modules:'[]',otherSetting:'',id
                        }).then(()=>{
                            this.getWebsiteInfo();
                        });
                        break;
                    case 'pageMain':
                        this.$request.put('/api/admin/website/pageMain',{
                            title:this.moduleTitle,modules:'[]',
                            otherSetting:JSON.stringify({...this.otherSetting}),id, shortId: this.moduleShortId
                        }).then(()=>{
                            this.getWebsiteInfo();
                            if(this.moduleId === id){
                                this.$emit('page-config-change',this.otherSetting);
                            }
                        });
                        break;
                    default:
                        return;
                }
            },
            openCopyModule(data){
                this.copyModule = data;
                this.isNew = false;
                this.isCopy = true;
                let {otherSetting,type,title} = data;
                otherSetting = JSON.parse(otherSetting);
                switch (type) {
                    case 'pageHeader':
                        this.moduleType = type;
                        this.titleInputDialogVisible = true;
                        this.titleInputDialogTitle ='复制页头';
                        this.titleTitle = '页头名称';
                        this.moduleTitle = title;
                        break;
                    case 'pageFooter':
                        this.moduleType = type;
                        this.titleInputDialogVisible = true;
                        this.titleInputDialogTitle ='复制页尾';
                        this.titleTitle = '页尾名称';
                        this.moduleTitle = title;
                        break;
                    case 'pageMain':
                        this.moduleType = type;
                        this.titleInputDialogVisible = true;
                        this.titleInputDialogTitle ='复制页面';
                        this.titleTitle = '页面名称';
                        this.moduleTitle = title;
                        this.moduleShortId = '';
                        this.otherSetting.pageTitle = otherSetting.pageTitle;
                        this.otherSetting.keywords = otherSetting.keywords || '';
                        this.otherSetting.pageHeaderId = otherSetting.pageHeaderId;
                        this.otherSetting.fixedHeader = otherSetting.fixedHeader;
                        this.otherSetting.pageFooterId = otherSetting.pageFooterId;
                        break;
                    default:
                        this.$message.warning(`不支持的操作：${data.type}`);
                }
            },
            copy(){
                let data = this.copyModule;
                let otherSetting = JSON.parse(data.otherSetting);
                switch (data.type) {
                    case 'pageHeader':
                        this.$request.post('/api/admin/website/pageHeader',{
                            title: this.moduleTitle,modules:data.modules,otherSetting:data.otherSetting
                        }).then(()=>{
                            this.$message.success('页头复制成功');
                            this.getWebsiteInfo();
                        });
                        break;
                    case 'pageFooter':
                        this.$request.post('/api/admin/website/pageFooter',{
                            title:this.moduleTitle,modules:data.modules,otherSetting:data.otherSetting
                        }).then(()=>{
                            this.$message.success('页尾复制成功');
                            this.getWebsiteInfo();
                        });
                        break;
                    case 'pageMain':
                        this.$request.post('/api/admin/website/pageMain',{
                            title:this.moduleTitle,modules:data.modules,
                            otherSetting: JSON.stringify({...this.otherSetting,customCss: otherSetting.customCss}),
                            shortId: this.moduleShortId,
                            seq: this.websiteInfo.pageMains.length
                        }).then(()=>{
                            this.$message.success('页面复制成功');
                            this.getWebsiteInfo();
                        });
                        break;
                    default:
                        return;
                }
            },
            designModule(data){
                this.$msgbox.confirm('本操作将前往其它模块的设计页面，请确认你已保存当前模块的变更！！！','提示',{type: 'warning',confirmButtonText:'继续前往'}).then(()=>{
                    let {type,id} = data;
                    switch (type) {
                        case 'pageHeader':
                            this.$router.push(`/website/design/${id}/header`).catch(()=>{});
                            return;
                        case 'pageFooter':
                            this.$router.push(`/website/design/${id}/footer`).catch(()=>{});
                            return;
                        case 'pageMain':
                            this.$router.push(`/website/design/${id}/main`).catch(()=>{});
                            return;
                        default:
                            return;
                    }
                }).catch(()=>{
                    this.$refs.tree.setCurrentKey(this.moduleId);
                });
            }

        },
        created() {
            this.getWebsiteInfo();
        },
        mounted(){
            this.$refs.tree.setCurrentKey(this.moduleId);
        },
        watch:{
            moduleId(val){
                this.$refs.tree.setCurrentKey(val);
            }
        }
    }
</script>

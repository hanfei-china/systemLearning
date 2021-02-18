import Module from '../../base/module';

import AttributeGroup from '../../base/attributeGroup';

import Attribute from '../../base/attribute';
import Vue from "vue";

import {addItem, addItemWithPosition, deleteItem} from '../../util/arrayUtil';
import WsSideMenuItem from './wsSideMenuItem';

export default class WsSideMenu extends Module{

    constructor(config: {id:any,title:any,[id:string]: any}) {
        let id = config.id;
        let title = config.title || '侧边栏';
        super('wsSideMenu',id,title,'1.0',true);
        this.unChildren();
        this.initAttribute();
        this.formatModuleConfig(config);
    }

    initAttribute(){

        let titleGroup = new AttributeGroup('titleGroup', '标题设置');

        let showTitle = new Attribute('显示标题', 'checkbox', true).addAttributes({
            content: '显示标题'
        }).hiddenTitle();


        let title = new Attribute('标题内容', 'text', '侧边栏').addAttributes({
            placeholder: '请输入标题内容',
            titleStyle: {
                paddingRight: '6px'
            }
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titleFont = new Attribute('标题字体设置', 'font', {
            fontSize: '16px',
            color: '#FFFFFF',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'left',
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titleBackground = new Attribute('背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '#409EFF',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titleBorderRadius = new Attribute('圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titlePadding = new Attribute('内边距', 'padding', {
            top: 10,
            bottom: 10,
            left: 18,
            right: 0,
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titleBorder = new Attribute('边框', 'border', {
            top:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let titleBoxShadow = new Attribute('阴影', 'boxShadow', {
            hShadow: 0,
            vShadow: 0,
            blur: 0,
            spread: 0,
            color: '#888888',
            inset: false
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        titleGroup.setAttributes({showTitle, title, titleFont, titleBackground, titleBorderRadius, titlePadding, titleBorder, titleBoxShadow});


        let containerGroup = new AttributeGroup('containerGroup', '容器设置');

        let containerBackground = new Attribute('背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let containerBorderRadius = new Attribute('圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        let containerBorder = new Attribute('边框', 'border', {
            top:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom:{
                borderColor: 'rgba(64, 158, 255, .6)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            left:{
                borderColor: 'rgba(64, 158, 255, .6)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            right:{
                borderColor: 'rgba(64, 158, 255, .6)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
        });

        let containerBoxShadow = new Attribute('阴影', 'boxShadow', {
            hShadow: 0,
            vShadow: 0,
            blur: 0,
            spread: 0,
            color: '#888888',
            inset: false
        }).setShowMode(() => {
            return showTitle.value === true;
        });

        containerGroup.setAttributes({containerBackground, containerBorderRadius, containerBorder, containerBoxShadow});

        let innerContainerGroup = new AttributeGroup('innerContainerGroup', '内容器设置');

        let innerContainerPadding = new Attribute('内边距', 'padding', {
            top: 21,
            bottom: 21,
            left: 21,
            right: 21,
        });

        let innerContainerBorder = new Attribute('边框', 'border', {
            top:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            bottom:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            left:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
            right:{
                borderColor: 'rgba(64, 158, 255, 1)',
                borderWidth: 0,
                borderStyle: 'solid'
            },
        });

        let innerContainerBackground = new Attribute('背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        innerContainerGroup.setAttributes({innerContainerPadding,innerContainerBorder,innerContainerBackground});

        let itemGroup = new AttributeGroup('itemGroup', '子项设置');

        let itemTop = new Attribute('竖直间距', 'number', 21).addAttributes({
            titleStyle: {
                textAlign: 'right',
                width: '78px',
                paddingRight: '6px'
            },
            min: 0
        });

        let itemPrefixText = new Attribute('子项前置文本', 'text', '').addAttributes({
            placeholder: '请输入前置文本内容',
            titleStyle: {
                textAlign: 'right',
                width: '78px',
                paddingRight: '6px'
            }
        });

        let itemPrefixTextPaddingRight = new Attribute('前置水平间距', 'number', 4).addAttributes({
            titleStyle: {
                textAlign: 'right',
                width: '78px',
                paddingRight: '6px'
            },
            min: 0
        });

        let itemSuffixText = new Attribute('子项后置文本', 'text', '').addAttributes({
            placeholder: '请输入后置文本内容',
            titleStyle: {
                textAlign: 'right',
                width: '78px',
                paddingRight: '6px'
            }
        });

        let itemSuffixTextPaddingLeft = new Attribute('后置水平间距', 'number', 4).addAttributes({
            titleStyle: {
                textAlign: 'right',
                width: '78px',
                paddingRight: '6px'
            },
            min: 0
        });


        let itemFont = new Attribute('字体设置', 'font', {
            fontSize: '12px',
            color: '#606266',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'left',
        });

        let itemActiveFont = new Attribute('激活字体设置', 'font', {
            fontSize: '12px',
            color: '#FFFFFF',
            italic: false,
            bold: false,
            textDecoration: false,
            fontFamily: '微软雅黑',
            textAlign: 'left',
        });

        let itemBackground = new Attribute('背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: '#FFFFFF',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let itemActiveBackground = new Attribute('激活背景设置', 'background', {
            backgroundImage: '',
            backgroundColor: 'rgba(64, 158, 255, 1)',
            backgroundPositionX: 'center',
            backgroundPositionY: 'center',
            backgroundSize: 'auto',
            backgroundRepeatX: true,
            backgroundRepeatY: false,
        });

        let itemBorderRadius = new Attribute('圆角', 'radius', {
            leftTop: 0,
            rightTop: 0,
            leftBottom: 0,
            rightBottom: 0,
        });

        let itemPadding = new Attribute('内边距', 'padding', {
            top: 10,
            bottom: 10,
            left: 18,
            right: 0,
        });

        let itemBorder = new Attribute('边框', 'border', {
            top:{
                borderColor: 'rgba(226, 226, 226, 1)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            bottom:{
                borderColor: 'rgba(226, 226, 226, 1)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            left:{
                borderColor: 'rgba(226, 226, 226, 1)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            right:{
                borderColor: 'rgba(226, 226, 226, 1)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
        });

        let itemActiveBorder = new Attribute('激活边框设置', 'border', {
            top:{
                borderColor: 'rgba(226, 226, 226, 1)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            bottom:{
                borderColor: 'rgba(226, 226, 226, 1)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            left:{
                borderColor: 'rgba(226, 226, 226, 1)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
            right:{
                borderColor: 'rgba(226, 226, 226, 1)',
                borderWidth: 1,
                borderStyle: 'solid'
            },
        });

        let itemBoxShadow = new Attribute('阴影', 'boxShadow', {
            hShadow: 0,
            vShadow: 0,
            blur: 0,
            spread: 0,
            color: '#888888',
            inset: false
        });

        itemGroup.setAttributes({itemTop, itemPrefixText, itemPrefixTextPaddingRight, itemSuffixText, itemSuffixTextPaddingLeft,
            itemFont, itemActiveFont, itemBackground, itemActiveBackground,
            itemBorderRadius, itemPadding, itemBorder, itemActiveBorder, itemBoxShadow});

        let layoutGroup = new AttributeGroup('layoutGroup','布局设置');

        let layout = new Attribute('布局设置','layout',{
            width: 256,
            height: 375,
            left: 509,
            top: 183,
            zIndex: 1,
        }).hiddenTitle().addAttributes({
            position:{show:false},
        });

        layoutGroup.setAttributes({layout});

        let otherGroup = new AttributeGroup('otherGroup','其他设置');

        let customClasses = new Attribute('class','text','').addAttributes({
            placeholder: '自定义class',
            titleStyle:{
                width: '40px',
                textAlign: 'right',
                paddingRight: '6px'
            }
        });

        otherGroup.setAttributes({customClasses});

        let dataSrcGroup = new AttributeGroup('dataSrcGroup','数据源设置');

        let dataSrc = new Attribute('页头选择', 'breadcrumbDataSrc',{
            dataSrc: 2,
            pageHeader: ''
        }).hiddenTitle();

        dataSrcGroup.setAttributes({dataSrc});


        let attributes = {dataSrcGroup, containerGroup, innerContainerGroup, titleGroup, itemGroup, layoutGroup ,otherGroup};

        this.setAttributes(attributes);
    }

    setPosition(position:{left:number,top:number}){
        let layout = this.attributes.layoutGroup.attributes.layout.value;
        layout.top = position.top;
        layout.left = position.left;

        return this;
    }

    addModule(index?:number){
        let module = new WsSideMenuItem({id:undefined,title:undefined,version:'1.0'});
        if(index || index === 0){
            addItemWithPosition(index,1,this.modules, module);
        }else{
            addItem(module,this.modules);
        }
    }

    deleteModule(index){
        if(this.modules.length < 2){
            Vue.prototype.$message.warning('请保留至少一个子项');
            return;
        }

        Vue.prototype.$msgbox.confirm('删除操作是不可逆的，是否继续删除？','提示',{type: 'warning',confirmButtonText:'确认删除'}).then(()=>{
            deleteItem(index,this.modules);
        }).catch(()=>{});
    }

    loadModule(module : {id:any,title:any,[id:string]: any}){
        addItem(new WsSideMenuItem(module),this.modules);
    }

    syncModules(modules ?: Array<any>) {
        if(!modules || modules.length < 1){
            this.addModule();
            this.addModule();
        }else{
            for(let module of modules){
                this.loadModule(module);
            }
        }
        return this;
    }

    formatModuleConfig(moduleConfig: any) {
        this.syncAttributes(moduleConfig.attributes || {});
        this.syncModules(moduleConfig.modules || []);
    }

}

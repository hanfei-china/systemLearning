import WsButton from './frequently/wsButton';
import WsImage from './frequently/wsImage';
import WsText from './frequently/wsText';
import WsFillContainer from './layout/wsFillContainer';
import WsFreeContainer from './layout/wsFreeContainer';
import WsArticleList from './base/wsArticleList';
import WsFormList from './base/wsFormList';
import WsGivingTable from './base/wsGivingTable';
import WsMap from './base/wsMap';
import WsScrollList from './base/wsScrollList';
import WsGreatEvents from './base/wsGreatEvents';
import WsMenu from './base/wsMenu';
import WsRichText from './base/wsRichText';
import WsWheelPlanting from './base/wsWheelPlanting';
import WsBreadcrumb from './base/wsBreadcrumb';
import WsSideMenu from "./base/wsSideMenu";

import WsCellContainer from "./layout/wsCell/wsCellContainer";
import WsCol from "./layout/wsCell/wsCol";
import WsRow from "./layout/wsCell/wsRow";
import WsPortalNotice from "./layout/wsCell/wsPortalNotice";
import WsCellTitleContainer from "./layout/wsCell/wsCellTitleContainer";
import WsPortalButton from "./layout/wsCell/wsPortalButton";
import WsPortalChart from "./layout/wsCell/wsPortalChart";
import WsPortalRichText from "./layout/wsCell/wsPortalRicText";
import WsCellTabPane from "./layout/wsCell/wsCellTabPane";

import WsPDFField from "./pdf/wsPDFField";
import WsPDFImage from "./pdf/wsPDFImage";
import WsPDFPage from "./pdf/wsPDFPage";
import WsPDFText from "./pdf/wsPDFText";

import Module from '../base/module';

interface ModuleBuilder {
    (moduleName: string, moduleConfig: any): Module
}

let moduleBuilder: ModuleBuilder = (moduleName, moduleConfig) => {
    switch (moduleName) {
        case 'wsButton':
        case 'WsButton':
            return new WsButton(moduleConfig);
        case 'wsText':
        case 'WsText':
            return new WsText(moduleConfig);
        case 'wsImage':
        case 'WsImage':
            return new WsImage(moduleConfig);
        case 'wsFillContainer':
        case 'WsFillContainer':
            return new WsFillContainer(moduleConfig);
        case 'wsFreeContainer':
        case 'WsFreeContainer':
            return new WsFreeContainer(moduleConfig);
        case 'wsArticleList':
        case 'WsArticleList':
            return new WsArticleList(moduleConfig);
        case 'wsFormList':
        case 'WsFormList':
            return new WsFormList(moduleConfig);
        case 'wsGivingTable':
        case 'WsGivingTable':
            return new WsGivingTable(moduleConfig);
        case 'wsMap':
        case 'WsMap':
            return new WsMap(moduleConfig);
        case 'wsScrollList':
        case 'WsScrollList':
            return new WsScrollList(moduleConfig);
        case 'wsGreatEvents':
        case 'WsGreatEvents':
            return new WsGreatEvents(moduleConfig);
        case 'wsMenu':
        case 'WsMenu':
            return new WsMenu(moduleConfig);
        case 'wsRichText':
        case 'WsRichText':
            return new WsRichText(moduleConfig);
        case 'wsWheelPlanting':
        case 'WsWheelPlanting':
            return new WsWheelPlanting(moduleConfig);
        case 'wsBreadcrumb':
        case 'WsBreadcrumb':
            return new WsBreadcrumb(moduleConfig);
        case 'wsSideMenu':
        case 'WsSideMenu':
            return new WsSideMenu(moduleConfig);
        case 'wsCellContainer':
        case 'WsCellContainer':
            return new WsCellContainer(moduleConfig);
        case 'wsCol':
        case 'WsCol':
            return new WsCol(moduleConfig);
        case 'wsRow':
        case 'WsRow':
            return new WsRow(moduleConfig);
        case 'wsPortalNotice':
        case 'WsPortalNotice':
            return new WsPortalNotice(moduleConfig);
        case 'wsCellTitleContainer':
        case 'WsCellTitleContainer':
            return new WsCellTitleContainer(moduleConfig);
        case 'wsCellTabsContainer':
        case 'WsCellTabsContainer':
            return new WsCellTitleContainer(moduleConfig).tabContainer();
        case 'wsPortalButton':
        case 'WsPortalButton':
            return new WsPortalButton(moduleConfig);
        case 'wsPortalChart':
        case 'WsPortalChart':
            return new WsPortalChart(moduleConfig);
        case 'wsPortalRichText':
        case 'WsPortalRichText':
            return new WsPortalRichText(moduleConfig);
        case 'wsCellTabPane':
        case 'WsCellTabPane':
            return new WsCellTabPane(moduleConfig);
        case 'wsPDFField':
        case 'WsPDFField':
            return new WsPDFField(moduleConfig);
        case 'wsPDFImage':
        case 'WsPDFImage':
            return new WsPDFImage(moduleConfig);
        case 'wsPDFPage':
        case 'WsPDFPage':
            return new WsPDFPage(moduleConfig);
        case 'wsPDFText':
        case 'WsPDFText':
            return new WsPDFText(moduleConfig);
        default:
            throw new Error('未注册的模块：' + moduleName);
    }
};

const moduleGroups = [
    {
        title: '常用',
        name: 'frequently',
        modules: [
            {name: 'wsText', title: '文本', icon: 'iconfont icon-ws-text'},
            {name: 'wsImage', title: '图片', icon: 'iconfont icon-ws-image'},
            {name: 'wsButton', title: '按钮', icon: 'iconfont icon-ws-button'},
        ]
    },
    {
        title: '基础',
        name: 'base',
        modules: [
            {name: 'wsRichText', title: '文章', icon: 'iconfont icon-ws-rich-text'},
            {name: 'wsArticleList', title: '文章列表', icon: 'iconfont icon-ws-article-list'},
            {name: 'wsScrollList', title: '捐赠记录', icon: 'iconfont icon-ws-article-list'},
            {name: 'wsFormList', title: '表单列表', icon: 'iconfont icon-ws-article-list'},
            {name: 'wsGivintTable', title: '捐赠表格', icon: 'iconfont icon-ws-article-list'},
            {name: 'wsMap', title: '分会地图', icon: 'iconfont icon-ws-article-list'},
            {name: 'wsWheelPlanting', title: '轮播多图', icon: 'iconfont icon-ws-wheel-planting'},
            {name: 'wsGreatEvents', title: '时间线', icon: 'iconfont icon-ws-great-events'},
            {name: 'wsMenu', title: '菜单', icon: 'iconfont icon-ws-menu'},
            {name: 'wsBreadcrumb', title: '面包屑', icon: 'iconfont icon-ws-breadcrumb'},
            {name: 'wsSideMenu', title: '侧边栏', icon: 'iconfont icon-ws-side-menu'}
        ]
    },
    {
        title: '排版',
        name: 'layout',
        modules: [
            {name: 'wsFreeContainer', title: '自由容器', icon: 'iconfont icon-ws-free-container'},
            // {name: 'wsMultiColumn', title: '多列排版', icon: 'iconfont icon-ws-multi-column'},
            {name: 'wsFillContainer', title: '通栏排版', icon: 'iconfont icon-ws-fill-container'},
        ]
    }
];

export {moduleBuilder, moduleGroups};

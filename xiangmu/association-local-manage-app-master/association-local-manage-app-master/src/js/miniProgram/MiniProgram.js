import moduleBuilder from './moduleBuilder';
import {addItem, moveItem, deleteItem} from '../util/arrayUtil';
import {isEmptyStr} from '../util/nullValueCheck';

/**
 * 小程序基类
 */
export default class MiniProgram {

    constructor(config) {
        this.pages = [];
        this.tabBar =moduleBuilder('tabBar')

        if (config) {
            if (typeof config == 'string') {
                config = JSON.parse(config);
            }

            this.loadPages(config.pages);
            this.tabBar = moduleBuilder('tabBar', config.tabBar);
        }
    }

    /**
     * 加载旧的页面
     * @param pages
     */
    loadPages(pages) {
        for (let page of pages) {
            this.addPage(page);
        }
    }

    /**
     * 新增页面
     * @param pageConfig
     */
    addPage(pageConfig) {
        addItem(moduleBuilder('page', pageConfig), this.pages);
    }

    /**
     * 删除页面
     * @param index
     */
    deletePage(index) {
        if(this.pages.length <= 1){
            throw new Error('请至少保留一个页面');
        }
        deleteItem(index, this.pages);
    }

    /**
     * 页面排序
     * @param srcIndex 源位置
     * @param targetIndex 目标位置
     * @param dropPosition 1目标之后 -1目标之前
     */
    movePage(srcIndex, targetIndex, dropPosition) {
        moveItem(targetIndex, dropPosition, srcIndex, this.pages);
    }

    getPageByPageId(pageId) {
        if (!isEmptyStr(pageId)) {
            for (let page of this.pages) {
                if (pageId == page.pageId) {
                    return page;
                }
            }
        }
    }

    /**
     * 获取页面数量
     * @returns {number}
     */
    getPageCount() {
        return this.pages.length;
    }

    /**
     * 获取页面对象
     * @returns {Array}
     */
    getPages(){
        return this.pages;
    }

    /**
     * 根据下标获取页面信息
     * @param index
     * @returns {null|*}
     */
    getPageByIndex(index) {
        let length = this.pages.length;
        if (length > index) {
            return this.pages[index];
        } else {
            return null;
        }
    }

    /**
     * 获取tabBar对象
     * @returns
     */
    getTabBar() {
        return this.tabBar;
    }


    /**
     * 拷贝一个对象，目的是使provide生效
     * @param obj
     */
    copyObject(obj) {
        this.tabBar = obj.tabBar;
        this.pages = obj.pages;
    }

    /**
     * 新增一个页签
     * @param tabConfig
     */
    addTab(tabConfig) {
        this.tabBar.addTab(tabConfig);
    }

    toJsonString() {
        let obj = {
            tabBar: this.tabBar.toJson()
        }

        let list = [];
        for (let item of this.pages) {
            list.push(item.toJson());
        }
        obj.pages = list;
        return JSON.stringify(obj);
    }

    /**
     * 生成模版配置，该配置会去掉一些值
     */
    toTemplateString(){
        let obj = {
            tabBar: this.tabBar.toJson(true)
        }

        let list = [];
        for (let item of this.pages) {
            list.push(item.toJson(true));
        }
        obj.pages = list;
        return JSON.stringify(obj);
    }
}

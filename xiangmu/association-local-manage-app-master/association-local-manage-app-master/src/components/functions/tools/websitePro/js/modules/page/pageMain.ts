import Module from '../../base/module';

import {addItem, deleteItem} from '../../util/arrayUtil';
import {moduleBuilder} from "../moduleBuilder";

export default class PageMain extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '页面';
        super('pageMain', id, title, '1.0');
        this.initAttribute();
        this.formatModuleConfig(config);

    }

    initAttribute() {
        this.otherSetting = {
            pageHeaderId: '',
            pageFooterId: '',
            pageTitle: '',
            customCss:'',
            fixedHeader: false
        }
    }

    addModule(module){
        addItem(module,this.modules);
    }

    deleteModule(index){
        deleteItem(index,this.modules);
    }

    setPosition() {
        return this;
    }

    loadModule(module : {id:any,title:any,[id:string]: any}){
        addItem(moduleBuilder(module.name,module),this.modules);
    }

    syncModules(modules ?: Array<any>) {
        for(let module of modules){
            this.loadModule(module);
        }
        return this;
    }


    formatModuleConfig(moduleConfig: any) {
        this.syncOtherSetting(moduleConfig.otherSetting);
        this.syncModules(moduleConfig.modules);
    }

}

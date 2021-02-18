import Module from '../../base/module';
import {moduleBuilder} from "../moduleBuilder";

import {addItem, deleteItem} from '../../util/arrayUtil';

export default class PageHeader extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '页头';
        super('pageHeader', id, title, '1.0');
        this.formatModuleConfig(config);

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

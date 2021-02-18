import Module from '../../../base/module';

import {moduleBuilder} from "../../moduleBuilder";

import {addItem, deleteItem} from '../../../util/arrayUtil';

export default class WsCellContainer extends Module {

    constructor(config: { id: any, title: any, [id: string]: any }) {
        let id = config.id;
        let title = config.title || '栅栏容器';
        super('wsCellContainer', id, title, '1.0');
        this.formatModuleConfig(config);
    }


    setPosition() {
        return this;
    }

    syncModules(modules ?: Array<any>) {
        if(modules){
            for(let module of modules){
                this.loadModule(module);
            }
        }
        return this;
    }

    addModule(module){
        addItem(module,this.modules);
    }

    deleteModule(index){
        deleteItem(index,this.modules);
    }

    loadModule(module : {id:any,title:any,[id:string]: any}){
        addItem(moduleBuilder(module.name,module),this.modules);
    }

    formatModuleConfig(moduleConfig: any) {
        let attributes = moduleConfig.attributes;
        this.syncAttributes(attributes);
        this.syncModules( moduleConfig.modules);
    }
}

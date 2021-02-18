import ActivityTemplate1 from "../template/activityTemplate1";
import ActivityTemplate2 from "../template/activityTemplate2";
import ActivityTemplate from "./activityTemplate";

export default class ActivityTemplateConfig {

    index: number = 0;

    templates: Array<ActivityTemplate> = [];

    constructor(config:any) {
        if(config){
            this.loadTemplates(config);
        }else{
            this.initTemplates();
        }
    }

    initTemplates(){
        let activityTemplate1 = new ActivityTemplate1().loadDefaultModules();
        let activityTemplate2 = new ActivityTemplate2().loadDefaultModules();

        this.templates.push(activityTemplate1,activityTemplate2);
        return this;
    }

    loadTemplates(config:any){
        this.index = config.index;

        for(let template of config.templates){
            let {name} = template;
            if(name === 'activityTemplate1'){
                let activityTemplate1 = new ActivityTemplate1()
                    .syncAttributes(template.attributes)
                    .loadModules(template.modules);
                this.templates.push(activityTemplate1);
            }else if(name === 'activityTemplate2'){
                let activityTemplate2 = new ActivityTemplate2()
                    .syncAttributes(template.attributes)
                    .loadModules(template.modules);
                this.templates.push(activityTemplate2);
            }else{
                throw new Error('不支持的模版类型'+name);
            }
        }

        return this;
    }

    toJson(){
        let templates = [];
        for(let template of this.templates){
            templates.push(template.toJson());
        }

        return {
            index: this.index,
            templates,
        };
    }

}

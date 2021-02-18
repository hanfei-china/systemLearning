const stores = {

};

/**
 * 获取图片库
 * @param selectedStores 用户选中的图片库
 *      <br> null/undefined: 不启用
 *      <br> all:加载所有的图标库
 *      <br> store1: 加载单个图标库
 *      <br> [store1,store2]:加载选中的图标库
 * @param extendsStore 拓展图标库，一个字符串数组
 */
export default function getImageStore(selectedStores, extendsStore) {

    if(extendsStore == null || extendsStore == undefined){
        extendsStore = [];
    }

    if(selectedStores){

        if(typeof selectedStore == 'string'){
            if(selectedStores == 'all'){
                //加载全部的图片库
                for(let store of stores){
                    extendsStore = extendsStore.concat(store);
                }
            }else{
                let store = stores[selectedStores];
                if(store){
                    extendsStore = extendsStore.concat(store);
                }
            }
        }else if(selectedStores instanceof Array){
            for(let selectedStore of selectedStores){
                let store = stores[selectedStore];
                if(store){
                    extendsStore = extendsStore.concat(store);
                }
            }
        }

    }

    return extendsStore;

}
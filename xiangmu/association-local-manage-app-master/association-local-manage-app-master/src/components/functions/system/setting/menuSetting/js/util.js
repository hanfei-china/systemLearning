export const menuTranslator = (parents, children) => {

    //遍历父节点数据
    parents.forEach(parent => {
        //遍历子节点数据
        children.forEach((current, index) => {
            //若该节点是对应的父级节点的子节点
            if (current.parentId === parent.id) {
                //深拷贝一份子节点数组
                let temp = JSON.parse(JSON.stringify(children));
                //让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
                temp.splice(index, 1);
                //让当前子节点作为唯一的父节点，去递归查找其对应的子节点
                menuTranslator([current], temp);
                //把找到子节点放入父节点的children属性中
                parent.children ? parent.children.push(current) : parent.children = [current];
            }
        });
    });
};

export const compare = (src, target) => {
    let {menuSort: srcMenuSort} = src;
    let {menuSort: targetMenuSort} = target;
    if (srcMenuSort < targetMenuSort) {
        return -1;
    } else if (srcMenuSort > targetMenuSort) {
        return 1;
    } else {
        return 0;
    }
};

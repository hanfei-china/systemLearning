/**
 * 新增项目
 * @param item
 * @param srcArray
 */
export function addItem(item,srcArray=[]){
    srcArray.push(item);
}

/**
 * 在指定位置前后新增项目
 * @param targetIndex
 * @param dropPosition
 * @param srcArray
 * @param item
 */
export function addItemWithPosition(targetIndex,dropPosition,srcArray=[],item) {

  if(targetIndex === -1){
    srcArray.push(item);
  }else{
    if(dropPosition === -1){
      //移动到目标位置前方
      srcArray.splice(targetIndex,0,item);
    }else if(dropPosition === 1){
      srcArray.splice(targetIndex+1,0,item);

    }
  }

}

/**
 * 删除项目
 * @param index
 * @param srcArray
 */
export function deleteItem(index,srcArray=[]){
  srcArray.splice(index,1);
}

/**
 * 移动项目到目标位置
 * @param targetIndex 目标位置
 * @param dropPosition -1：目标位置之前 1：目标位置之后
 * @param srcIndex 源地址
 * @param srcArray
 */
export function moveItem(targetIndex,dropPosition,srcIndex,srcArray=[]){

  if(dropPosition === -1){
    //移动到目标位置前方
    let item = srcArray[srcIndex];
    srcArray.splice(targetIndex,0,item);
    //判断被移动的元素，在插入位置的前还是后
    if(srcIndex <= targetIndex){
      srcArray.splice(srcIndex,1);
    }else{
      srcArray.splice(srcIndex+1,1);
    }
  }else if(dropPosition === 1){
    //移动到目标位置后方
    let item = srcArray[srcIndex];
    srcArray.splice(targetIndex+1,0,item);
    //判断被移动的元素，在插入位置的前还是后
    if(srcIndex <= targetIndex){
      srcArray.splice(srcIndex,1);
    }else{
      srcArray.splice(srcIndex+1,1);
    }
  }

}

/**
 * 交换项目位置
 * @param oldIndex
 * @param newIndex
 * @param srcArray
 */
export function exchangeItem(oldIndex, newIndex, srcArray=[]) {

  let temp = srcArray[oldIndex];
  srcArray[oldIndex] = srcArray[newIndex];
  srcArray[newIndex] = temp;


}

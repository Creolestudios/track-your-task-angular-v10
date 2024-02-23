import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskByStatus',
  pure: false
})
export class TaskPipe implements PipeTransform {

  transform(items: any, filterItems: Array<any>, isAnd: boolean): any {

    if (items) {
      let checkedItemsStatus = filterItems.filter(item1 => { return item1.name; });
      if (!checkedItemsStatus || checkedItemsStatus.length === 0) {
        return items;
      }
      if (checkedItemsStatus.length != 0) {
        let itemsData:any = [];
        for(let i = 0; i< checkedItemsStatus.length ; i++){
          let abcitemsData = items.filter( g => { return g.taskStatus.toLowerCase().indexOf(checkedItemsStatus[i].name.toString().toLowerCase()) > -1});
          if(abcitemsData.length != 0){
            itemsData.push(abcitemsData)
          }
          // return items.filter( g => g.taskStatus.toLowerCase().indexOf(checkedItemsStatus[i].name.toString().toLowerCase()) > -1);
        }
        return itemsData.flat(Infinity);
      }
    } else {
      return items;
    }
  }

}

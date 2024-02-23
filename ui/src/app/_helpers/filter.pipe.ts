import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
  pure: false
})
export class FilterPipe implements PipeTransform {
  isLoading: boolean;
  transform(GroupData: any[], filter: Object): any {

    if (!GroupData || !filter) {
      // this.isLoading = true
      return GroupData;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    // this.isLoading = false
    // return  GroupData.filter(g => g.groupName.indexOf(filter) !== -1);
    return GroupData.filter( g => g.groupName.toLowerCase().indexOf(filter.toString().toLowerCase()) > -1);
  }
}

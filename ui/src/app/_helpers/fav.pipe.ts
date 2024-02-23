import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByFav',
  pure: false
})
export class FavPipe implements PipeTransform {

  transform(GroupData: any[], isFavoriteGroup: boolean): any {
    if (!GroupData || !isFavoriteGroup) {
      return GroupData;
    }

    GroupData.sort((a: any, b: any) => {
      // if (a.isFavoriteGroup == b.isFavoriteGroup > -1) {
      //   return -1;
      // }
      return (a.isFavoriteGroup == b.isFavoriteGroup > -1) ? -1 : ((a.isFavoriteGroup == b.isFavoriteGroup > 1) ? 1 : 1);
       
    });
    return GroupData;

  }

}

import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

export class AppCustomDirective extends Validators{
   static fromDateValidator(fdValue: FormControl) {
    const date = fdValue.value;
    if (date ===null || date==='') return { requiredFromDate: true };
  
  }

   static ToDateValidator(todValue: FormControl) {
    const date = todValue.value;
   
    if (date ===null || date==='') return { requiredToDate: true };
  
  }
  static numeric(control: AbstractControl) {
    let val = control.value;
    
    if (val === null || val === '') return null;
    
    if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) return { 'invalidNumber': true };
    
    return null;
  }
// Not working
//   static timeValidator(formGroupValues: FormGroup): any {
//     console.log(formGroupValues);
//     const FromDate = formGroupValues.get('FromDate').value;
//     const ToDate = formGroupValues.get('ToDate').value;
//     const FromTime = formGroupValues.get('FromTime').value;
//     const ToTime = formGroupValues.get('ToTime').value;
   
//     if (FromDate.toString() === ToDate.toString()) {
//       let fromTime = [];
//       let toTime = [];
//       fromTime = FromTime.split(':');
//       toTime = ToTime.split(':');
//       if (parseInt(fromTime[0]) > parseInt(toTime[0])){
//       alert("condition satisfied not return any error message");
//        return { InValidToTime: true };
//         }
//       else if (
//         parseInt(fromTime[0]) === parseInt(toTime[0]) &&
//         parseInt(fromTime[1]) > parseInt(toTime[1])
//       ){  alert("condition satisfied not return any error message")
//         return { InValidToTime: true };
//       }
//     }
//   }
}
// export class CustomValidator{
//   // Number only validation

// }
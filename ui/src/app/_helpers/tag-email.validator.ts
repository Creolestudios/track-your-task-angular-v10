import { AbstractControl, FormGroup } from '@angular/forms';
export function isArrayTagEmails(formControl: AbstractControl) {
    if (!formControl.value) {
        return null;
    }
    var errorFlag = "" ;
    for (let j = 0; j < formControl.value.length; j++) {
        const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return  checkTagEmail(formControl.value[j].userEmail);
    if (!emailPattern.test(formControl.value[j].userEmail.trim())) {
      return  errorFlag = "error";
     }
    // const value = formControl.value[j].userEmail.replace(/ /g, '');
    // const arrayOfEmails = value.split(',');
    // return arrayOfEmails.some((mail: string) => !validateEmail(mail)) ? { pattern: true } : null;
      }
  
}
// function checkTagEmail(aaaa){
//     const value = aaaa.replace(/ /g, '');
//     const arrayOfEmails = value.split(',');
//     return arrayOfEmails.some((mail: string) => !validateEmail(mail)) ? { pattern: true } : null;
// }
export function isEmail(formControl: AbstractControl) {
    if (!formControl.value) {
        return null;
    }
    return !validateEmail(formControl.value) ? { isNotEmail: true } : 'error';
}
function validateEmail(email: string): boolean {
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(String(email).toLowerCase());
}
export function removeSpaces(control: AbstractControl) {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
    }
    return null;
}

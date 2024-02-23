import { AbstractControl, ValidationErrors } from '@angular/forms';
  
export class CustomValidator {
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
        if((control.value as string).indexOf(' ') >= 0){
            return {cannotContainSpace: true}
        }
        return null;
    }

    static trimRequired(control: AbstractControl) : ValidationErrors | null {
        if(!control.value || control.value.trim() == '')
        {
          return {'trimRequired' : true };
        }

        return null;
    }
}
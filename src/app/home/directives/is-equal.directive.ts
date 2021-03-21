import { ValidatorFn, AbstractControl } from '@angular/forms';

export function isEqual(property: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const currentValue = control.value;
        const valueToCompare = control.root.get(property)?.value;

        if (valueToCompare)
        {
        const currentLength = currentValue.toString().trim().length;
        const lengthToCompare = valueToCompare.toString().trim().length;

        if (currentLength > 0 && lengthToCompare > 0 && !(valueToCompare === currentValue))
        {
            return { isEqualValidationFailed: true };
        }
        return null;
        }
    };
}
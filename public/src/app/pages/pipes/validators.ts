
/*
  Custom validators to use everywhere.
*/

import { FormGroup, FormControl, AbstractControl, Validators, ValidatorFn } from '@angular/forms';

// SINGLE FIELD VALIDATORS
export function emailValidator(control: FormControl): { [key: string]: any } {
  var emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true };
  }
}

//CONTROL GROUP VALIDATORS
export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
  return (group: FormGroup): { [key: string]: any } => {
    let password = group.controls[passwordKey];
    let confirmPassword = group.controls[confirmPasswordKey];

    if (password.value !== confirmPassword.value) {
      return {
        mismatchedPasswords: true
      };
    }
  }
}

/**
 * Validator that requires controls to have a value of a range length.
 */
export function rangeLength(rangeLength: Array<number>) {
  return (control: AbstractControl): { [key: string]: any } => {
    if (isPresent(Validators.required(control))) return null;

    let v: string = control.value;
    return v.length >= rangeLength[0] && v.length <= rangeLength[1] ? null : { 'rangeLength': true };
  };
}

/**
 * Validator that requires controls to have a value of a min value.
 */
export function min(min: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (isPresent(Validators.required(control))) return null;

    let v: number = control.value;
    return v >= min ? null : { 'min': true };
  };
}

/**
 * Validator that requires controls to have a value of a max value.
 */
export function max(max: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (isPresent(Validators.required(control))) return null;

    let v: number = control.value;
    return v <= max ? null : { 'max': true };
  };
}

/**
 * Validator that requires controls to have a value of minDate.
 */
export function minDate(minDate: any): ValidatorFn {
  if (!isDate(minDate)) throw Error('minDate value must be a formatted date');

  return (control: AbstractControl): { [key: string]: any } => {
    if (isPresent(Validators.required(control))) return null;

    let d: Date = new Date(control.value);

    if (!isDate(d)) return { minDate: true };

    return d >= new Date(minDate) ? null : { minDate: true };
  };
}

/**
 * Validator that requires controls to have a value of maxDate.
 */
export function maxDate(maxDate: any): ValidatorFn {
  if (!isDate(maxDate)) throw Error('maxDate value must be a formatted date');

  return (control: AbstractControl): { [key: string]: any } => {
    if (isPresent(Validators.required(control))) return null;

    let d: Date = new Date(control.value);

    if (!isDate(d)) return { maxDate: true };

    return d <= new Date(maxDate) ? null : { maxDate: true };
  };
}

function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

function isDate(obj: any): boolean {
  return !/Invalid|NaN/.test(new Date(obj).toString());
}
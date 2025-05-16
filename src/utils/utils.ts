import { NullOrUndefined } from '../utils/types.js';

export function stringEquals(value1: string | NullOrUndefined, value2: string | NullOrUndefined): boolean {
  return isNotNullOrUndefined(value1) && isNotNullOrUndefined(value2)
    ? value1!!.toUpperCase() === value2!!.toUpperCase()
    : false;
}

export function toJsonString(value: any) {
  return JSON.stringify(value, null, 1);
}

export function isNullOrUndefined(value: any | NullOrUndefined) {
  return value === null || value === undefined;
}

export function isNotNullOrUndefined(value: any | NullOrUndefined) {
  return value !== null && value !== undefined;
}

export function isNotEmpty(value: string | NullOrUndefined) {
  return isNotNullOrUndefined(value) && (value?.trim().length ?? 0 > 0);
}

export function isNotNullOrUndefinedOrEmpty(values: any[] | NullOrUndefined) {
  return values !== null && values !== undefined && values.length > 0;
}

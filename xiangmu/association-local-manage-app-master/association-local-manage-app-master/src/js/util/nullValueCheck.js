/**
 * 校验是否不是空串
 * @param value
 * @returns {*|boolean}
 */
export function isEmptyStr(value) {
  return isNullValue(value) || value == '';
}

/**
 * 空值校验
 * @param value
 * @returns {boolean}
 */
export function isNullValue(value) {
  return value == null || value == undefined;
}

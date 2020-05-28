export const Numbers = /^\d+$/
export const NumbersWithDecimalPlace = /^\d+\.?\d*$/ // Note that this allows no number after the decimal place, since JS can still parse this.
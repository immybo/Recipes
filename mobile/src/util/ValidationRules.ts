import { NumbersWithDecimalPlace } from "./Regex";
import { ValidationRule } from "../components/shared/Validator";

export const PositiveOrZero: ValidationRule<string> = { rule: value => NumbersWithDecimalPlace.test(value) || value == "", errorMessage: _ => "Please enter a positive number or 0." };
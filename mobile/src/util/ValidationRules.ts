import { Numbers } from "./Regex";
import { ValidationRule } from "../components/shared/Validator";

export const PositiveOrZero: ValidationRule<string> = { rule: value => Numbers.test(value) || value == "", errorMessage: _ => "Please enter a positive number or 0." };
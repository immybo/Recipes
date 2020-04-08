import { callApi, HttpMethod } from "../Server";
import { nutritionalInformationToJson } from "../NutritionalInformationParser";
import { NutritionalInformation } from "../../model/NutritionalInformation";
import { parseNull } from "../NullParser";

export class NutritionApi {
    public static addNutritionalInformationForIngredient(nutrition: NutritionalInformation): Promise<void> {
        return callApi(
                "nutrition/ingredients",
                HttpMethod.POST,
                parseNull,
                nutritionalInformationToJson(nutrition));
    }
} 
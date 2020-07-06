import { ActionSheetIOS } from "react-native";

export function copyMap<A, B>(map: Map<A, B>): Map<A, B> {
    return Object.assign({}, map);
}

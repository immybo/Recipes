import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    h1: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 10
    },
    rowLayout: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 10,
        marginRight: 10,
    },
    rightButton: {
        alignItems: "flex-end",
        margin: 10
    },
    rowRightButton: {
        flexDirection: "row",
        alignItems: "flex-end",
        margin: 10,
    },
    verticalMiddleAlign: {
        alignItems: "center"
    },
    sideMarginSmall: {
        marginHorizontal: 10
    }
});
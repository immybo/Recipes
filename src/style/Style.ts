import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        flexGrow: 1
    },
    h1: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 10
    },
    rowLayout: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 10,
    },
    rightButton: {
        alignItems: "flex-end",
        margin: 10
    },
    rowRightButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        margin: 10,
    },
    sideMarginSmall: {
        marginHorizontal: 10
    },
    bottomButtonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignSelf: "stretch",
        textAlign: "center"
    }
});
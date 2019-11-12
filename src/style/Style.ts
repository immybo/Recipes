import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15
    },
    scrollContainer: {
        flexGrow: 1,
        marginRight: 20
    },
    h1: {
        fontSize: 20,
        fontWeight: "bold"
    },
    rowLayout: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    rightAlign: {
        alignItems: "flex-end"
    },
    rowRightButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    bottomButtonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignSelf: "stretch",
        textAlign: "center"
    },
    verticalMarginSmall: {
        marginVertical: 10
    },
    horizontalMarginSmall: {
        marginHorizontal: 10
    },
    marginSmall: {
        margin: 10
    },
    textInput: {
        height: 40,
        paddingLeft: 6
    },
    topMargin: {
        marginTop: 20
    }
});
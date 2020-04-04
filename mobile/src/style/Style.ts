import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15
    },
    scrollContainer: {
        flexGrow: 1
    },
    h1: {
        fontSize: 20,
        fontWeight: "bold"
    },
    h2: {
        fontSize: 15,
        fontWeight: "bold"
    },
    rowLayout: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    rowWithoutJustify: {
        flexDirection: "row",
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
    smallContainerBottom: {
        flex: 0.04,
        alignSelf: "stretch",
        textAlign: "center"
    },
    verticalMarginSmall: {
        marginVertical: 10
    },
    verticalMargin: {
        marginVertical: 20
    },
    horizontalMarginSmall: {
        marginHorizontal: 10
    },
    marginSmall: {
        margin: 10
    },
    textInput: {
        paddingLeft: 6
    },
    topMargin: {
        marginTop: 20
    },
    centerAlign: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    centerText: {
        textAlign: "center"
    },
    errorMessage: {
        fontSize: 15,
        color: "red",
        fontWeight: "bold"
    }
});
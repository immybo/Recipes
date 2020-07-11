import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Cultured
    },
    containerWithMargin: {
        flex: 1,
        padding: 15
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 15
    },
    hugeText: {
        fontSize: 30
    },
    largeText: {
        fontSize: 20
    },
    pickerText: {
        fontSize: 16
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
        flex: 0.1,
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
    horizontalMargin: {
        marginHorizontal: 20
    },
    rightMarginSmall: {
        marginRight: 10
    },
    marginSmall: {
        margin: 10
    },
    margin: {
        margin: 20
    },
    textInput: {
        paddingLeft: 6
    },
    topMargin: {
        marginTop: 20
    },
    bottomMargin: {
        marginBottom: 20
    },
    noMargin: {
        margin: 0
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
    },
    smallErrorMessage: {
        color: "red"
    },
    pickerItem: {
        transform: [
            { scaleX: 0.92 },
            { scaleY: 0.92 }
        ]
    },
    flexWrap: {
        flexWrap: "wrap"
    },
    buttonPadding: {
        padding: 20
    },
    textHeaderLight: {
        color: Colors.Cultured,
        fontFamily: "PlayfairDisplay-Bold"
    },
    textLight: {
        color: Colors.Cultured,
        fontFamily: "Montserrat-Regular"
    },
    textHeader: {
        color: Colors.Charcoal,
        fontFamily: "PlayfairDisplay-Bold"
    },
    text: {
        color: Colors.Charcoal,
        fontFamily: "Montserrat-Regular"
    }
});
import React from "react";
import { styles } from "../style/Style";
import { View, Text } from "react-native";

interface ErrorDisplayProps extends React.Props<ErrorDisplay> {
    errorMessage: string
}

export default class ErrorDisplay extends React.Component<ErrorDisplayProps, any> {
    constructor(props: ErrorDisplayProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.smallContainerBottom}>
                <Text style={[styles.errorMessage, styles.centerText]}>{ this.props.errorMessage }</Text>
            </View>
        );
    }
}
import React from "react";
import { styles } from "../style/Style";
import { View, Text, Button } from "react-native";

interface NoConnectionToServerProps extends React.Props<NoConnectionToServer> {
    attemptReload: () => void
}

export default class NoConnectionToServer extends React.Component<NoConnectionToServerProps, any> {
    constructor(props: NoConnectionToServerProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={[styles.container, styles.centerAlign]}>
                <Text style={styles.largeText}>Unable to connect to server.</Text>
                <Text style={styles.largeText}>Please try again later.</Text>
                <Button title="Retry" onPress={(event) => this.attemptReload()}>Retry</Button>
            </View>
        );
    }

    private attemptReload(): void {
        this.props.attemptReload();
    }
}
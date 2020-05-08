import React from "react";
import { View } from "react-native";

interface ValidationContainerProps extends React.Props<ValidationContainer> {
}

interface ValidationContainerState {
    validator?: JSX.Element
}

class ValidationContainer extends React.Component<ValidationContainerProps, ValidationContainerState> {
    constructor(props: ValidationContainerProps) {
        super(props);

        this.state = {
        };
    }

    public render(): JSX.Element {
        if (this.state.validator != null) {
            return this.state.validator;
        }

        return <View />
    }

    public setValidator(validator: JSX.Element) {
        this.setState({ validator: validator });
    }

    public hasValidator(): boolean {
        return this.state.validator != null;
    }
}

export default ValidationContainer;
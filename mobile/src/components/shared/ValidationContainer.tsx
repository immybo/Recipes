import React from "react";
import { View } from "react-native";

interface ValidationContainerProps extends React.Props<ValidationContainer> {
}

interface ValidationContainerState {
}

class ValidationContainer extends React.Component<ValidationContainerProps, ValidationContainerState> {
    public _validator?: JSX.Element;

    constructor(props: ValidationContainerProps) {
        super(props);

        this.state = {
        };
    }

    public render(): JSX.Element {
        if (this._validator != null) {
            return this._validator;
        }

        return <View />
    }
}

export default ValidationContainer;
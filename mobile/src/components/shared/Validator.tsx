import React from "react";
import { Text, View } from "react-native";

export interface ValidationRule<T> {
    rule: (value: T) => boolean
    errorMessage: (value: T) => string
}

interface ValidatorProps<T> extends React.Props<Validator<T>> {
    currentValue: T,
    rules: ValidationRule<T>[]
    onValidChange: (newValue: boolean) => void
}

interface ValidatorState {
    isValid: boolean
}

class Validator<T> extends React.Component<ValidatorProps<T>, ValidatorState> {
    constructor(props: ValidatorProps<T>) {
        super(props);

        this.state = {
            isValid: true
        };
    }

    public componentDidUpdate() {
        let wasPreviouslyValid: boolean = this.state.isValid;

        let errors = this.props.rules
            .filter(rule => !rule.rule(this.props.currentValue));

        let isCurrentlyValid: boolean = errors.length === 0;
        if (wasPreviouslyValid !== isCurrentlyValid) {
            this.setState({ isValid: isCurrentlyValid });
            this.props.onValidChange(isCurrentlyValid);
        }
    }

    public render(): JSX.Element {
        let errors: string[] = this.props.rules
            .filter(rule => !rule.rule(this.props.currentValue))
            .map(rule => rule.errorMessage(this.props.currentValue));

        return (
            <View>
                { errors.map(message => this.getErrorElement(message)) }
            </View>
        );
    }

    private getErrorElement(message: string): JSX.Element {
        return <Text>{message}</Text>// TODO
    }
}

export default Validator;
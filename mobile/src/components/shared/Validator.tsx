import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../style/Style";

export interface ValidationRule<T> {
    rule: (value: T) => boolean
    errorMessage: (value: T) => string
}

interface ValidatorProps<T> extends React.Props<Validator<T>> {
    enabled: boolean,
    rules?: ValidationRule<T>[]
    onValidChange: (newValue: boolean) => void
    initialValue: T
}

interface ValidatorState<T> {
    isValid: boolean,
    currentValue: T
}

class Validator<T> extends React.Component<ValidatorProps<T>, ValidatorState<T>> {
    constructor(props: ValidatorProps<T>) {
        super(props);

        this.state = {
            isValid: true,
            currentValue: props.initialValue
        };
    }

    public componentDidUpdate() {
        let wasPreviouslyValid: boolean = this.state.isValid;

        let errors = this.props.rules ? this.props.rules.filter(rule => !rule.rule(this.state.currentValue)) : [];

        let isCurrentlyValid: boolean = errors.length === 0;
        if (wasPreviouslyValid !== isCurrentlyValid) {
            this.setState({ isValid: isCurrentlyValid });
            this.props.onValidChange(isCurrentlyValid);
        }
    }

    public render(): JSX.Element {
        if (this.props.enabled) {
            let errors: string[] = this.props.rules ? this.props.rules
                .filter(rule => !rule.rule(this.state.currentValue))
                .map(rule => rule.errorMessage(this.state.currentValue)) : [];

            return (
                <View>
                    { errors.map((message, i) => this.getErrorElement(message, i)) }
                </View>
            );
        } else {
            return <View />
        }
    }

    private getErrorElement(message: string, index: number): JSX.Element {
        return <Text style={styles.smallErrorMessage} key={index}>{message}</Text>
    }

    public setValue(newValue: T): void {
        this.setState({ currentValue: newValue });
    }
}

export default Validator;
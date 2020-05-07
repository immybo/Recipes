import React from "react";
import { Text, View } from "react-native";
import { styles } from "../../style/Style";

export interface ValidationRule<T> {
    rule: (value: T) => boolean
    errorMessage: (value: T) => string
}

interface ValidatorProps<T> extends React.Props<Validator<T>> {
    enabled: boolean,
    currentValue: T,
    rules?: ValidationRule<T>[]
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

        let errors = this.props.rules ? this.props.rules.filter(rule => !rule.rule(this.props.currentValue)) : [];

        let isCurrentlyValid: boolean = errors.length === 0;
        if (wasPreviouslyValid !== isCurrentlyValid) {
            this.setState({ isValid: isCurrentlyValid });
            this.props.onValidChange(isCurrentlyValid);
        }
    }

    public render(): JSX.Element {
        if (this.props.enabled) {
            let errors: string[] = this.props.rules ? this.props.rules
                .filter(rule => !rule.rule(this.props.currentValue))
                .map(rule => rule.errorMessage(this.props.currentValue)) : [];

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
}

export default Validator;
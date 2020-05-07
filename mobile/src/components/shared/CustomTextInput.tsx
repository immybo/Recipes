import { Colors } from "../../style/Colors";
import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import Validator, { ValidationRule } from "./Validator";
import ValidationContainer from "./ValidationContainer";

interface CustomTextInputProps extends TextInputProps {
    validationRules?: ValidationRule<string>[]
    validationContainer?: React.RefObject<ValidationContainer>
}

interface CustomTextInputState {
    isFocused: boolean
    rawValue: string
    isValid: boolean
}

class CustomTextInput extends React.Component<CustomTextInputProps, CustomTextInputState> {
    constructor(props: CustomTextInputProps) {
        super(props);

        this.state = {
            isFocused: false,
            rawValue: "",
            isValid: true
        };
    }

    public handleFocus(): void {
        this.setState({...this.state, isFocused: true});
    }

    public handleBlur(): void {
        this.setState({...this.state, isFocused: false});
    }

    public componentDidUpdate(): void {
        let hasValidation: boolean = this.props.validationRules != null && this.props.validationRules.length > 0;

        let validator = null;

        if (hasValidation && this.props.validationRules != null) {
            validator = (<Validator 
                currentValue={ this.state.rawValue }
                onValidChange={ isValid => this.setState({ isValid: isValid }) }
                rules={ this.props.validationRules }
                enabled={this.props.validationContainer != null && this.props.validationContainer.current != null}
            />);

            if (this.props.validationContainer != null && this.props.validationContainer.current != null) {
                this.props.validationContainer.current.setValidator(validator);
            }
        }
    }

    public render(): JSX.Element {
        return (
            <View>
                <TextInput
                    selectionColor={Colors.Blue}
                    underlineColorAndroid={this.state.isFocused ? Colors.Blue : Colors.LightGrey }
                    onFocus={() => this.handleFocus()}
                    onBlur={() => this.handleBlur()}
                    { ...this.props }
                    onChangeText={newStr => this.onChange(newStr, this.props.onChangeText)}
                    />
            </View>
        );    
    }

    private onChange(newValue: string, underlyingChangeFunction?: (text: string) => void) {
        this.setState({ rawValue: newValue });
        if (underlyingChangeFunction != null) {
            underlyingChangeFunction(newValue);
        }
    }
}

export default CustomTextInput;
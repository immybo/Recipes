import { Colors } from "../../style/Colors";
import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import Validator, { ValidationRule } from "./Validator";
import ValidationContainer from "./ValidationContainer";

interface CustomTextInputProps extends TextInputProps {
    validationRules?: ValidationRule<string>[]
    validationContainer?: React.RefObject<ValidationContainer>
    onValidChange?: (newValue: boolean) => void
}

interface CustomTextInputState {
    isFocused: boolean
    rawValue: string
    isValid: boolean
    validator?: React.RefObject<Validator<string>>
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

    public componentDidMount(): void {
        this.componentDidUpdate();
    }

    public componentDidUpdate(): void {
        // All of this stuff really goes against the react mindset.
        // The actual Validator object is a child of this.props.validationContainer, rather than as a child of this object.
        // So we're updating the state on a component which is probably not a child of this component... however, I haven't
        // found any better way to do validation where the error message appears somewhere else.
        let hasValidation: boolean = this.props.validationRules != null && this.props.validationRules.length > 0;

        if (hasValidation && this.props.validationContainer != null && this.props.validationContainer.current != null && !this.props.validationContainer.current.hasValidator()) {
            let validatorRef = React.createRef<Validator<string>>();
            let validator = (<Validator 
                initialValue={ this.state.rawValue }
                onValidChange={ isValid => { 
                    this.setState({ isValid: isValid });

                    if (this.props.onValidChange != null) {
                        this.props.onValidChange(isValid);
                    }
                }}
                rules={ this.props.validationRules }
                enabled={ true }
                ref={ validatorRef }
            />);

            this.props.validationContainer.current.setValidator(validator);
            this.setState({ validator: validatorRef });
        }

        if (this.state.validator != null && this.state.validator.current != null) {
            this.state.validator.current.setValue(this.state.rawValue);
        }
    }

    public render(): JSX.Element {
        return (
            <TextInput
                selectionColor={Colors.Blue}
                underlineColorAndroid={this.state.isFocused ? Colors.Blue : Colors.LightGrey }
                onFocus={() => this.handleFocus()}
                onBlur={() => this.handleBlur()}
                { ...this.props }
                onChangeText={newStr => this.onChange(newStr, this.props.onChangeText)}
                />
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
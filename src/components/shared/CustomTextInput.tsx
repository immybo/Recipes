import { Colors } from "../../style/Colors";
import { styles } from "../../style/Style";
import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface CustomTextInputProps extends TextInputProps {
}

interface CustomTextInputState {
    isFocused: boolean
}

class CustomTextInput extends React.Component<CustomTextInputProps, CustomTextInputState> {
    constructor(props: CustomTextInputProps) {
        super(props);

        this.state = {
            isFocused: false
        };
    }

    public handleFocus(): void {
        this.setState({...this.state, isFocused: true});
    }

    public handleBlur(): void {
        this.setState({...this.state, isFocused: false});
    }

    public render(): JSX.Element {
        return (
            <TextInput
                selectionColor={Colors.Blue}
                underlineColorAndroid={this.state.isFocused ? Colors.Blue : Colors.LightGrey }
                onFocus={() => this.handleFocus()}
                onBlur={() => this.handleBlur()}
                {...this.props}
                />
        );    
    }
}

export default CustomTextInput;
import React from "react";
import { View, ViewProps } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface FormProps extends ViewProps {
}

interface FormState {
}

// Essentially taken from https://github.com/zackify/react-native-autofocus.
// That library didn't play nicely with my custom text input so I figured it was just easier to reimplement here.
export default class Form extends React.Component<FormProps, FormState> {
    private inputs: TextInput[];

    constructor(props: FormProps) {
        super(props);

        this.inputs = [];
    }

    public renderChildren(children, recursiveIndex = 0) {
        return React.Children.map(children, (child, index) => {
            if (child == null) return;

            if (typeof(child) != "object") return child; // Leave strings/etc as-is, only affect react objects

            if (child.props.children != null) {
                return React.cloneElement(child, {
                    ...child.props,
                    children: this.renderChildren(child.props.children, index)
                });
            }

            if (child.type.name !== 'CustomTextInput') return child;

            let realIndex = index + recursiveIndex;
            return React.cloneElement(child, {
                onEnter: () => {
                    let i = realIndex + 1;
                    while (i < this.inputs.length) {
                        let input = this.inputs[i]
                        if (input != null) {
                            input.focus();
                            break;
                        }
                        i++;
                    }
                },
                inputRef: ref => (this.inputs[realIndex] = ref)
            });
        });
    }

    public render(): JSX.Element {
        let { children, ...props } = this.props;
        
        return (
            <View {...props}>
                { this.renderChildren(children) }
            </View>
        );
    }
}
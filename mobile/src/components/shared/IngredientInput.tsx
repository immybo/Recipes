import React from 'react';
import {
    View,
    Button,
} from 'react-native';
import { styles } from '../../style/Style';
import CustomTextInput from './CustomTextInput';
import { Ingredient } from '../../model/Ingredient';

interface IngredientInputProps extends React.Props<IngredientInput> {
    initialIngredient: Ingredient,
    submitIngredient: (ingredient: Ingredient) => void
}

interface IngredientInputState {
    ingredientName: string
}

export default class IngredientInput extends React.Component<IngredientInputProps, IngredientInputState> {
    constructor(props: IngredientInputProps) {
        super(props);

        this.state = {
            ingredientName: props.initialIngredient.name
        };
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <CustomTextInput style={styles.h1} placeholder="Ingredient Name" defaultValue={this.props.initialIngredient.name} onChangeText={(text) => this.onChangeIngredientName(text)} />
                <Button title="Submit Ingredient" onPress={(event) => this.submitIngredient()}>Submit Ingredient</Button>
            </View>
        );
    }

    private onChangeIngredientName(newName: string): void {
        this.setState({ ingredientName: newName });
    }

    private submitIngredient(): void {
        let ingredient: Ingredient = this.buildIngredient();
        this.props.submitIngredient(ingredient);
    }

    private buildIngredient(): Ingredient {
        return {
            id: this.props.initialIngredient.id,
            name: this.state.ingredientName
        };
    }
}

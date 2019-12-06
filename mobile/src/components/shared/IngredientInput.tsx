import React from 'react';
import {
    TextInput, View
} from 'react-native';
import { Ingredient } from '../../model/Ingredient';
import { Numbers } from '../../util/Regex';
import { styles } from '../../style/Style';
import CustomTextInput from './CustomTextInput';

interface IngredientInputProps extends React.Props<IngredientInput> {
    ingredient: Ingredient,
    onChangeIngredient: (ingredient: Ingredient) => void
}

class IngredientInput extends React.Component<IngredientInputProps, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.rowLayout}>
                <CustomTextInput style={{ "flex": 0.7 }} value={this.props.ingredient.name} onChangeText={(newText) => this.updateIngredientName(newText)} placeholder={"Ingredient Name"} />
                <CustomTextInput
                    style={{ "flex": 0.2 }}
                    value={this.props.ingredient.quantity.quantity > 0 ? this.props.ingredient.quantity.quantity.toString() : ""}
                    keyboardType="numeric"
                    onChangeText={(newQuantity) => this.updateIngredientQuantity(newQuantity)}
                    placeholder={"Quantity"} />
            </View>
        );
    }

    private updateIngredientName(newText: string): void {
        this.props.onChangeIngredient({
            ...this.props.ingredient,
            name: newText
        });
    }

    private updateIngredientQuantity(newQuantity: string): void {
        if (!Numbers.test(newQuantity)) {
            this.props.onChangeIngredient({
                ...this.props.ingredient,
                quantity: { quantity: Number(newQuantity) }
            });
        }
    }
}

export default IngredientInput;
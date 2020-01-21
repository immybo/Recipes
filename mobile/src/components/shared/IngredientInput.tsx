 import React from 'react';
import {
    View, Picker
} from 'react-native';
import { IngredientWithQuantity } from '../../model/IngredientWithQuantity';
import { Numbers } from '../../util/Regex';
import { styles } from '../../style/Style';
import CustomTextInput from './CustomTextInput';
import { QuantityUnit } from '../../model/QuantityUnit';
import { QuantityFormatter } from '../../util/QuantityFormatter';

interface IngredientInputProps extends React.Props<IngredientInput> {
    ingredient: IngredientWithQuantity,
    onChangeIngredient: (ingredient: IngredientWithQuantity) => void
}

class IngredientInput extends React.Component<IngredientInputProps, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.rowLayout}>
                <CustomTextInput style={{ "flex": 0.45 }} value={this.props.ingredient.ingredient.name} onChangeText={(newText) => this.updateIngredientName(newText)} placeholder={"Ingredient Name"} />
                <CustomTextInput
                    style={{ "flex": 0.1 }}
                    value={this.props.ingredient.quantity.amount > 0 ? this.props.ingredient.quantity.amount.toString() : ""}
                    keyboardType="numeric"
                    onChangeText={(newQuantity) => this.updateIngredientQuantityNumber(newQuantity)}
                    placeholder={"Quantity"}
                    maxLength={10} />
                <View style={{ "flex": 0.35 }}>
                    <Picker selectedValue={this.props.ingredient.quantity.unit} onValueChange={(value, _) => this.updateIngredientQuantityUnit(value)}>
                        { [ QuantityUnit.Cups, QuantityUnit.Grams, QuantityUnit.Kilograms, QuantityUnit.Teaspoons].map((unit: QuantityUnit) => {
                            let formattedUnit: string = QuantityFormatter.formatUnit(unit, true);
                            return <Picker.Item label={formattedUnit} key={formattedUnit} value={unit} />
                        })}
                    </Picker>
                </View>
            </View>
        );
    }

    private updateIngredientName(newText: string): void {
        this.props.onChangeIngredient({
            ...this.props.ingredient,
            ingredient: {
                ...this.props.ingredient.ingredient,
                name: newText
            }
        });
    }

    private updateIngredientQuantityNumber(newQuantity: string): void {
        if (!Numbers.test(newQuantity)) {
            this.props.onChangeIngredient({
                ...this.props.ingredient,
                quantity: {
                    ...this.props.ingredient.quantity,
                    amount: Number(newQuantity)
                }
            });
        }
    }

    private updateIngredientQuantityUnit(newQuantityUnit: QuantityUnit): void {
        this.props.onChangeIngredient({
            ...this.props.ingredient,
            quantity: {
                ...this.props.ingredient.quantity,
                unit: newQuantityUnit
            }
        });
    }
}

export default IngredientInput;

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
import { Ingredient } from '../../model/Ingredient';

interface IngredientSelectProps extends React.Props<IngredientSelect> {
    ingredient: IngredientWithQuantity,
    allIngredients: Ingredient[],
    onChangeIngredient: (ingredient: IngredientWithQuantity) => void
}

class IngredientSelect extends React.Component<IngredientSelectProps, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.rowLayout}>
                <Picker style={{ "flex": 0.55 }} selectedValue={this.props.ingredient.ingredient.id} onValueChange={(value, _) => this.updateIngredient(value)}>
                    { this.props.allIngredients.map((ingredient: Ingredient) => {
                        return <Picker.Item label={ingredient.name} key={ingredient.id} value={ingredient.id} />
                    })}
                </Picker>
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

    private updateIngredient(newIngredientId: number): void {
        let newIngredient: Ingredient | undefined = this.props.allIngredients.find(ingr => ingr.id === newIngredientId);

        if (newIngredient == null) {
            return; // Should always be able to find the ingredient though...
        }

        this.props.onChangeIngredient({
            ...this.props.ingredient,
            ingredient: newIngredient
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

export default IngredientSelect;

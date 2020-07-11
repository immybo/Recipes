 import React from 'react';
import {
    View, Text
} from 'react-native';
import { IngredientWithQuantity } from '../../model/IngredientWithQuantity';
import { Numbers, NumbersWithDecimalPlace } from '../../util/Regex';
import { styles } from '../../style/Style';
import CustomTextInput from './CustomTextInput';
import { QuantityUnit } from '../../model/QuantityUnit';
import { QuantityFormatter } from '../../util/QuantityFormatter';
import { Ingredient } from '../../model/Ingredient';
import ValidationContainer from './ValidationContainer';
import { PositiveOrZero } from '../../util/ValidationRules';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { Colors } from '../../style/Colors';

interface IngredientSelectProps extends React.Props<IngredientSelect> {
    ingredient: IngredientWithQuantity,
    allIngredients: Ingredient[],
    onChangeIngredient: (ingredient: IngredientWithQuantity) => void,
    goToIngredientInput: () => void,
    onValidChange?: (isValid: boolean) => void
}

class IngredientSelect extends React.Component<IngredientSelectProps, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        let validationContainer = React.createRef<ValidationContainer>();

        return (
            <View>
                <View style={styles.rowLayout}>
                    <View style={{ "flex": 0.55 }}>
                        <RNPickerSelect useNativeAndroidPickerStyle={false} placeholder={{}} style={{inputAndroid: {fontFamily: "Montserrat-Regular", color: Colors.Charcoal}}} value={this.props.ingredient.ingredient.id} onValueChange={(value, _) => this.updateIngredient(value)}
                            items={this.getIngredientPickerItems()}
                        />
                    </View>
                    <CustomTextInput
                        style={[{ "flex": 0.1 }, styles.text]}
                        keyboardType="numeric"
                        onChangeText={(newQuantity) => this.updateIngredientQuantityNumber(newQuantity)}
                        placeholder={"Quantity"}
                        maxLength={10}
                        defaultValue={this.props.ingredient.quantity.amount.toString()}
                        validationRules={[ PositiveOrZero ]}
                        validationContainer={validationContainer}
                        onValidChange={this.props.onValidChange} />
                    <View style={{ "flex": 0.35 }}>
                        <RNPickerSelect useNativeAndroidPickerStyle={false} placeholder={{}} value={this.props.ingredient.quantity.unit} style={{inputAndroid: {fontFamily: "Montserrat-Regular", color: Colors.Charcoal}}} onValueChange={(value, _) => this.updateIngredientQuantityUnit(value)}
                            items={ [ QuantityUnit.Grams, QuantityUnit.Kilograms, QuantityUnit.Teaspoons, QuantityUnit.Tablespoons, QuantityUnit.Cups, QuantityUnit.Millilitres, QuantityUnit.Litres ].map((unit: QuantityUnit) => {
                                let formattedUnit: string = QuantityFormatter.formatUnitShorthand(unit);
                                return {
                                    label: formattedUnit,
                                    value: unit
                                };
                            })}
                            />
                    </View>
                </View>
                <View style={styles.rowLayout}>
                    <ValidationContainer ref={validationContainer} />
                </View>
            </View>
        );
    }

    private getIngredientPickerItems(): Item[] {
        return this.props.allIngredients.map((ingredient: Ingredient) => {
            return {
                label: ingredient.name,
                value: ingredient.id
            }
        });
    }

    private updateIngredient(newIngredientId: number): void {
        if (newIngredientId == null) {
            return;
        }

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
        if (NumbersWithDecimalPlace.test(newQuantity)) {
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

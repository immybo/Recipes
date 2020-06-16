 import React from 'react';
import {
    View, Picker, Text
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
                    <Picker style={{ "flex": 0.55 }} selectedValue={this.props.ingredient.ingredient.id} onValueChange={(value, _) => this.updateIngredient(value)}>
                        <Picker.Item label={""} key={-1} value={-1} />
                        { this.props.allIngredients.map((ingredient: Ingredient) => {
                            return <Picker.Item label={ingredient.name} key={ingredient.id} value={ingredient.id} />
                        })}
                        <Picker.Item label={"Add New Ingredient"} key={-2} value={-2} />
                    </Picker>
                    <CustomTextInput
                        style={{ "flex": 0.1 }}
                        keyboardType="numeric"
                        onChangeText={(newQuantity) => this.updateIngredientQuantityNumber(newQuantity)}
                        placeholder={"Quantity"}
                        maxLength={10}
                        defaultValue={this.props.ingredient.quantity.amount.toString()}
                        validationRules={[ PositiveOrZero ]}
                        validationContainer={validationContainer}
                        onValidChange={this.props.onValidChange} />
                    <View style={{ "flex": 0.35 }}>
                        <Picker style={[{"flex": 1}, styles.pickerItem]} selectedValue={this.props.ingredient.quantity.unit} onValueChange={(value, _) => this.updateIngredientQuantityUnit(value)}>
                            { [ QuantityUnit.Grams, QuantityUnit.Kilograms, QuantityUnit.Teaspoons, QuantityUnit.Tablespoons, QuantityUnit.Cups, QuantityUnit.Millilitres, QuantityUnit.Litres ].map((unit: QuantityUnit) => {
                                let formattedUnit: string = QuantityFormatter.formatUnitShorthand(unit);
                                return <Picker.Item label={formattedUnit} key={formattedUnit} value={unit} />
                            })}
                        </Picker>
                    </View>
                </View>
                <View style={styles.rowLayout}>
                    <ValidationContainer ref={validationContainer} />
                </View>
            </View>
        );
    }

    private updateIngredient(newIngredientId: number): void {
        // Couple special cases here. Probably the easiest way to do it
        if (newIngredientId == -1) {
            return;
        } else if (newIngredientId == -2) {
            this.props.goToIngredientInput();
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

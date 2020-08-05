 import React from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import { IngredientWithQuantity } from '../../model/IngredientWithQuantity';
import { NumbersWithDecimalPlace } from '../../util/Regex';
import { styles } from '../../style/Style';
import CustomTextInput from './CustomTextInput';
import { QuantityUnit } from '../../model/QuantityUnit';
import { QuantityFormatter } from '../../util/QuantityFormatter';
import { Ingredient } from '../../model/Ingredient';
import ValidationContainer from './ValidationContainer';
import { PositiveOrZero } from '../../util/ValidationRules';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { Colors } from '../../style/Colors';
import Autocomplete from 'react-native-autocomplete-input';

interface IngredientSelectProps extends React.Props<IngredientSelect> {
    ingredient: IngredientWithQuantity,
    allIngredients: Ingredient[],
    onChangeIngredient: (ingredient: IngredientWithQuantity) => void,
    goToIngredientInput: () => void,
    onValidChange?: (isValid: boolean) => void
}

interface IngredientSelectState {
    currentIngredientName: string
}

class IngredientSelect extends React.Component<IngredientSelectProps, IngredientSelectState> {
    constructor(props: any) {
        super(props);

        this.state = {
            currentIngredientName: this.props.ingredient.ingredient ? this.props.ingredient.ingredient.name : ""
        };
    }

    public render(): JSX.Element {
        let validationContainer = React.createRef<ValidationContainer>();

        return (
            <View>
                <View style={styles.rowLayout}>
                    <View style={[{ "flex": 0.45 }]}>
                        <View style={styles.autocompleteContainer}>
                            <Autocomplete
                                defaultValue={this.state.currentIngredientName}
                                data={this.getIngredientsSuggestionList(this.state.currentIngredientName)}
                                onChangeText={ingredientName => this.updateIngredientIfValidIngredientName(ingredientName)}
                                renderItem={({item}) => (
                                    <TouchableOpacity onPress={ () => this.updateIngredientIfValidIngredientName(item) } style={styles.autocompleteEntry}>
                                        <Text>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                listStyle={styles.autocompleteList}
                                inputContainerStyle={styles.autocompleteInputContainer}/>
                        </View>
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

    private getIngredientsSuggestionList(currentText: string): string[] {
        let ingredients: string[] = this.props.allIngredients.filter(x => x.name.toLowerCase().startsWith(currentText.toLowerCase())).map(x => x.name);
        if (ingredients.length > 1 || (ingredients.length === 1 && ingredients[0].toLowerCase() !== currentText.toLowerCase())) {
            return ingredients;
        } else {
            return [];
        }
    }

    private updateIngredientIfValidIngredientName(ingredientName: string): void {
        let exactMatches: Ingredient[] = this.props.allIngredients.filter(x => x.name.toLowerCase() === ingredientName.toLowerCase());
        if (exactMatches.length > 0) {
            this.updateIngredient(exactMatches[0].id);
        } else {
            this.deselectIngredient();
        }

        this.setState({ currentIngredientName: ingredientName });
    }

    private updateIngredient(newIngredientId: number): void {
        if (newIngredientId == null) {
            if (this.props.onValidChange) this.props.onValidChange(false);
            return;
        }

        let newIngredient: Ingredient | undefined = this.props.allIngredients.find(ingr => ingr.id === newIngredientId);

        if (newIngredient == null) {
            if (this.props.onValidChange) this.props.onValidChange(false);
            return; // Should always be able to find the ingredient though...
        }

        this.props.onChangeIngredient({
            ...this.props.ingredient,
            ingredient: newIngredient
        });
        if (this.props.onValidChange) this.props.onValidChange(true);
    }

    private deselectIngredient(): void {
        if (this.props.onValidChange) this.props.onValidChange(false);
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

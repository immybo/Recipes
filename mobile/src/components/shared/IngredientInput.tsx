import React from 'react';
import {
    View,
    Button,
    Text,
    Picker
} from 'react-native';
import { styles } from '../../style/Style';
import CustomTextInput from './CustomTextInput';
import { Ingredient } from '../../model/Ingredient';
import { Numbers } from '../../util/Regex';
import { QuantityUnit } from '../../model/QuantityUnit';
import { NutritionalInformation } from '../../model/NutritionalInformation';
import { QuantityFormatter } from '../../util/QuantityFormatter';

interface IngredientInputProps extends React.Props<IngredientInput> {
    initialIngredient: Ingredient,
    submitIngredient: (ingredient: Ingredient, nutrition: NutritionalInformation) => void
}

interface IngredientInputState {
    ingredientName: string,
    servingSizeAmount?: number,
    servingSizeUnit?: QuantityUnit,
    caloriesPerServing?: number,
    gramsProteinPerServing?: number,
    gramsFatPerServing?: number,
    gramsCarbsPerServing?: number
}

export default class IngredientInput extends React.Component<IngredientInputProps, IngredientInputState> {
    constructor(props: IngredientInputProps) {
        super(props);

        this.state = {
            ingredientName: props.initialIngredient.name,
            caloriesPerServing: 0,
            gramsCarbsPerServing: 0,
            gramsFatPerServing: 0,
            gramsProteinPerServing: 0,
            servingSizeAmount: 0,
            servingSizeUnit: QuantityUnit.Cups
        };
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <CustomTextInput style={styles.h1} placeholder="Ingredient Name" defaultValue={this.props.initialIngredient.name} onChangeText={(text) => this.onChangeIngredientName(text)} />
                <View style={styles.rowWithoutJustify}>
                    <Text style={styles.rightMarginSmall}>Serving size of </Text>
                    <CustomTextInput
                        keyboardType="numeric"
                        onChangeText={(newQuantity) => this.updateServingSizeAmount(newQuantity)}
                        placeholder={"0"}
                        maxLength={10} />
                    <Picker style={[{"flex": 1}, styles.pickerItem]} selectedValue={this.state.servingSizeUnit} onValueChange={(value, _) => this.updateServingSizeUnit(value)}>
                        { [ QuantityUnit.None, QuantityUnit.Grams, QuantityUnit.Kilograms, QuantityUnit.Teaspoons, QuantityUnit.Tablespoons, QuantityUnit.Cups, QuantityUnit.Millilitres, QuantityUnit.Litres ].map((unit: QuantityUnit) => {
                            let formattedUnit: string = QuantityFormatter.formatUnit(unit, true);
                            return <Picker.Item label={formattedUnit} key={formattedUnit} value={unit} />
                        })}
                    </Picker>
                </View>
                <View style={styles.rowWithoutJustify}>
                    <CustomTextInput placeholder="0" keyboardType="numeric" defaultValue={this.props.initialIngredient.name} onChangeText={(text) => this.onSetCalories(text)} />
                    <Text style={styles.horizontalMarginSmall}>calories per serving</Text>
                </View>
                <View style={styles.rowWithoutJustify}>
                    <CustomTextInput placeholder="0" keyboardType="numeric" defaultValue={this.props.initialIngredient.name} onChangeText={(text) => this.onSetProteinPercentage(text)} />
                    <Text style={styles.horizontalMarginSmall}>grams of protein per serving</Text>
                </View>
                <View style={styles.rowWithoutJustify}>
                    <CustomTextInput placeholder="0" keyboardType="numeric" defaultValue={this.props.initialIngredient.name} onChangeText={(text) => this.onSetFatPercentage(text)} />
                    <Text style={styles.horizontalMarginSmall}>grams of fat per serving</Text>
                </View>
                <View style={styles.rowWithoutJustify}>
                    <CustomTextInput placeholder="0" keyboardType="numeric" defaultValue={this.props.initialIngredient.name} onChangeText={(text) => this.onSetCarbPercentage(text)} />
                    <Text style={styles.horizontalMarginSmall}>grams of carbs per serving</Text>
                </View>
                <View style={styles.verticalMargin}>
                    <Button title="Submit" onPress={(event) => this.submitIngredient()}>Submit Ingredient</Button>
                </View>
            </View>
        );
    }

    private updateServingSizeAmount(newQuantity: string): void {
        if (!Numbers.test(newQuantity)) {
            this.setState({ servingSizeAmount: Number(newQuantity) });
        }
    }
    
    private updateServingSizeUnit(newUnit: QuantityUnit): void {
        this.setState({ servingSizeUnit: newUnit });
    }

    private onChangeIngredientName(newName: string): void {
        this.setState({ ingredientName: newName });
    }

    private onSetCalories(newCalories: string): void {
        if (!Numbers.test(newCalories)) {
            this.setState({ caloriesPerServing: Number(newCalories) });
        }
    }

    private onSetProteinPercentage(newProteinPercentage: string): void {
        if (!Numbers.test(newProteinPercentage)) {
            this.setState({ gramsProteinPerServing: Number(newProteinPercentage) });
        }
    }

    private onSetFatPercentage(newFatPercentage: string): void {
        if (!Numbers.test(newFatPercentage)) {
            this.setState({ gramsFatPerServing: Number(newFatPercentage) });
        }
    }

    private onSetCarbPercentage(newCarbPercentage: string): void {
        if (!Numbers.test(newCarbPercentage)) {
            this.setState({ gramsCarbsPerServing: Number(newCarbPercentage) });
        }
    }

    private submitIngredient(): void {
        let ingredient: Ingredient = this.buildIngredient();
        let nutrition: NutritionalInformation = this.buildNutritionalInformation();
        this.props.submitIngredient(ingredient, nutrition);
    }

    private buildIngredient(): Ingredient {
        return {
            id: this.props.initialIngredient.id,
            name: this.state.ingredientName
        };
    }
    
    private buildNutritionalInformation(): NutritionalInformation {
        // TODO validation
        return {
            ingredientId: -1,
            macronutrients: {
                caloriesPerServing: this.state.caloriesPerServing ?? 0,
                carbGramsPerServing: this.state.gramsCarbsPerServing ?? 0,
                fatGramsPerServing: this.state.gramsFatPerServing ?? 0,
                proteinGramsPerServing: this.state.gramsProteinPerServing ?? 0,
                servingSize: {
                    amount: this.state.servingSizeAmount ?? 0,
                    unit: this.state.servingSizeUnit ?? QuantityUnit.Cups
                }
            }
        };
    }
}

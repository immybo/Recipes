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
import ValidationContainer from './ValidationContainer';
import { PositiveOrZero } from '../../util/ValidationRules';

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
    gramsCarbsPerServing?: number,
    numInvalidInputs: number
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
            servingSizeUnit: QuantityUnit.Cups,
            numInvalidInputs: 0
        };
    }

    public render(): JSX.Element {
        let servingSizeAmountErrors = React.createRef<ValidationContainer>();
        let caloriesErrors = React.createRef<ValidationContainer>();
        let proteinErrors = React.createRef<ValidationContainer>();
        let fatErrors = React.createRef<ValidationContainer>();
        let carbsErrors = React.createRef<ValidationContainer>();
        
        return (
            <View style={styles.container}>
                <CustomTextInput style={styles.h1} placeholder="Ingredient Name" defaultValue={this.props.initialIngredient.name} onChangeText={(text) => this.onChangeIngredientName(text)} />
                <View style={styles.rowWithoutJustify}>
                    <Text style={styles.rightMarginSmall}>Serving size of </Text>
                    <CustomTextInput
                        keyboardType="numeric"
                        onChangeText={(newQuantity) => this.updateServingSizeAmount(newQuantity)}
                        placeholder={"0"}
                        maxLength={10}
                        validationRules={[ PositiveOrZero ]}
                        validationContainer={servingSizeAmountErrors}
                        onValidChange={isValid => this.updateValid(isValid) } />
                    <Picker style={[{"flex": 1}, styles.pickerItem]} selectedValue={this.state.servingSizeUnit} onValueChange={(value, _) => this.updateServingSizeUnit(value)}>
                        { [ QuantityUnit.None, QuantityUnit.Grams, QuantityUnit.Kilograms, QuantityUnit.Teaspoons, QuantityUnit.Tablespoons, QuantityUnit.Cups, QuantityUnit.Millilitres, QuantityUnit.Litres ].map((unit: QuantityUnit) => {
                            let formattedUnit: string = QuantityFormatter.formatUnit(unit, true);
                            return <Picker.Item label={formattedUnit} key={formattedUnit} value={unit} />
                        })}
                    </Picker>
                </View>
                <ValidationContainer ref={servingSizeAmountErrors} />
                <View style={styles.rowWithoutJustify}>
                    <CustomTextInput
                        placeholder="0"
                        keyboardType="numeric"
                        defaultValue={this.props.initialIngredient.name}
                        onChangeText={(text) => this.onSetCalories(text)}
                        validationRules={[ PositiveOrZero ]}
                        validationContainer={caloriesErrors}
                        onValidChange={isValid => this.updateValid(isValid) } />
                    <Text style={styles.horizontalMarginSmall}>calories per serving</Text>
                </View>
                <ValidationContainer ref={caloriesErrors} />
                <View style={styles.rowWithoutJustify}>
                    <CustomTextInput
                        placeholder="0"
                        keyboardType="numeric"
                        defaultValue={this.props.initialIngredient.name}
                        onChangeText={(text) => this.onSetProteinPercentage(text)}
                        validationRules={[ PositiveOrZero ]}
                        validationContainer={proteinErrors}
                        onValidChange={isValid => this.updateValid(isValid) } />
                    <Text style={styles.horizontalMarginSmall}>grams of protein per serving</Text>
                </View>
                <ValidationContainer ref={proteinErrors} />
                <View style={styles.rowWithoutJustify}>
                    <CustomTextInput
                        placeholder="0"
                        keyboardType="numeric"
                        defaultValue={this.props.initialIngredient.name}
                        onChangeText={(text) => this.onSetFatPercentage(text)}
                        validationRules={[ PositiveOrZero ]}
                        validationContainer={fatErrors}
                        onValidChange={isValid => this.updateValid(isValid) } />
                    <Text style={styles.horizontalMarginSmall}>grams of fat per serving</Text>
                </View>
                <ValidationContainer ref={fatErrors} />
                <View style={styles.rowWithoutJustify}>
                    <CustomTextInput
                        placeholder="0"
                        keyboardType="numeric"
                        defaultValue={this.props.initialIngredient.name}
                        onChangeText={(text) => this.onSetCarbPercentage(text)}
                        validationRules={[ PositiveOrZero ]}
                        validationContainer={carbsErrors}
                        onValidChange={isValid => this.updateValid(isValid) } />
                    <Text style={styles.horizontalMarginSmall}>grams of carbs per serving</Text>
                </View>
                <ValidationContainer ref={carbsErrors} />
                <View style={styles.verticalMargin}>
                    <Button title="Submit" onPress={_ => this.submitIngredient()} disabled={this.state.numInvalidInputs !== 0}>Submit Ingredient</Button>
                </View>
            </View>
        );
    }

    private updateValid(isValid: boolean): void {
        // This does break if onValidChange is called with the same value as last time
        if (isValid) {
            // Passing a lambda is the only safe way to do this, because the normal setState will evaluate
            // the new numInvalidInputs when it's declared, whereas this does so synchronously when evaluated.
            this.setState(state => { return { ...state, numInvalidInputs: state.numInvalidInputs - 1 }});
        } else {
            this.setState(state => { return { ...state, numInvalidInputs: state.numInvalidInputs + 1 }});
        }
    }

    private updateServingSizeAmount(newQuantity: string): void {
        if (Numbers.test(newQuantity)) {
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
        if (Numbers.test(newCalories)) {
            this.setState({ caloriesPerServing: Number(newCalories) });
        }
    }

    private onSetProteinPercentage(newProtein: string): void {
        if (Numbers.test(newProtein)) {
            this.setState({ gramsProteinPerServing: Number(newProtein) });
        }
    }

    private onSetFatPercentage(newFat: string): void {
        if (Numbers.test(newFat)) {
            this.setState({ gramsFatPerServing: Number(newFat) });
        }
    }

    private onSetCarbPercentage(newCarbs: string): void {
        if (Numbers.test(newCarbs)) {
            this.setState({ gramsCarbsPerServing: Number(newCarbs) });
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

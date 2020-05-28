import React from 'react';
import {
    View,
    Button,
    Text,
    Picker,
    CheckBox
} from 'react-native';
import { styles } from '../../style/Style';
import CustomTextInput from './CustomTextInput';
import { Ingredient } from '../../model/Ingredient';
import { Numbers } from '../../util/Regex';
import { QuantityUnit } from '../../model/QuantityUnit';
import { IngredientNutrition } from '../../model/IngredientNutrition';
import { QuantityFormatter } from '../../util/QuantityFormatter';
import ValidationContainer from './ValidationContainer';
import { PositiveOrZero } from '../../util/ValidationRules';
import { Density } from '../../model/Density';
import Form from './Form';

interface IngredientInputProps extends React.Props<IngredientInput> {
    initialIngredient: Ingredient,
    submitIngredient: (ingredient: Ingredient, nutrition: IngredientNutrition) => void,
    submitIngredientWithoutNutrition: (ingredient: Ingredient) => void,
    allIngredients: Ingredient[]
}

interface IngredientInputState {
    ingredientName: string,
    servingSizeAmount?: number,
    servingSizeUnit?: QuantityUnit,
    caloriesPerServing?: number,
    gramsProteinPerServing?: number,
    gramsFatPerServing?: number,
    gramsCarbsPerServing?: number,
    numInvalidInputs: number,
    density: Density,
    noNutrition: boolean
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
            numInvalidInputs: 0,
            density: {
                equivalentByWeight: {
                    amount: 100,
                    unit: QuantityUnit.Grams
                },
                equivalentByVolume: {
                    amount: 1,
                    unit: QuantityUnit.Cups
                }
            },
            noNutrition: false
        };
    }

    public render(): JSX.Element {
        let nameErrors = React.createRef<ValidationContainer>();
        let servingSizeAmountErrors = React.createRef<ValidationContainer>();
        let caloriesErrors = React.createRef<ValidationContainer>();
        let proteinErrors = React.createRef<ValidationContainer>();
        let fatErrors = React.createRef<ValidationContainer>();
        let carbsErrors = React.createRef<ValidationContainer>();
        
        return (
            <Form style={styles.container}>
                <CustomTextInput
                    style={styles.h1}
                    placeholder="Ingredient Name"
                    defaultValue={this.props.initialIngredient.name}
                    onChangeText={(text) => this.onChangeIngredientName(text)}
                    validationRules={[
                        { rule: (name: string) => name.length == 0 || this.ingredientNameIsUnique(name), errorMessage: _ => "An ingredient with this name already exists."},
                        { rule: (name: string) => name.length > 0, errorMessage: _ => "Name must not be empty."}
                    ]} 
                    validationContainer={nameErrors}
                    onValidChange={isValid => this.updateValid(isValid) } />
                <ValidationContainer ref={nameErrors} />

                <View style={styles.rowWithoutJustify}>
                    <CheckBox value={this.state.noNutrition} onValueChange={newValue => this.setState({noNutrition: newValue})}/>
                    <Text>No nutrition</Text>
                </View>

                { !this.state.noNutrition &&
                    <View>
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

                        <View style={[styles.rowWithoutJustify, styles.flexWrap, styles.noMargin]}>
                            <Text>The weight of </Text>
                            <CustomTextInput
                                keyboardType="numeric"
                                defaultValue={String(this.state.density.equivalentByVolume.amount)}
                                onChangeText={(text) => this.updateDensityVolumeAmount(text)} />
                            <Picker style={[styles.pickerItem, {"flex": 0.45}]} selectedValue={this.state.density.equivalentByVolume.unit} onValueChange={(value, _) => this.updateDensityVolumeUnit(value)}>
                                { [ QuantityUnit.Millilitres, QuantityUnit.Teaspoons, QuantityUnit.Tablespoons, QuantityUnit.Cups, QuantityUnit.Litres ].map((unit: QuantityUnit) => {
                                    let formattedUnit: string = QuantityFormatter.formatUnitShorthand(unit);
                                    return <Picker.Item label={formattedUnit} key={formattedUnit} value={unit} />
                                })}
                            </Picker>
                        </View>
                        <View style={[styles.rowWithoutJustify, styles.flexWrap, styles.noMargin]}>
                            <Text> is </Text>
                            <CustomTextInput
                                keyboardType="numeric"
                                defaultValue={String(this.state.density.equivalentByWeight.amount)}
                                onChangeText={(text) => this.updateDensityWeightAmount(text)} />
                            <Picker style={[styles.pickerItem, {"flex": 0.3}]} selectedValue={this.state.density.equivalentByWeight.unit} onValueChange={(value, _) => this.updateDensityWeightUnit(value)}>
                                { [ QuantityUnit.Grams, QuantityUnit.Kilograms ].map((unit: QuantityUnit) => {
                                    let formattedUnit: string = QuantityFormatter.formatUnitShorthand(unit);
                                    return <Picker.Item label={formattedUnit} key={formattedUnit} value={unit} />
                                })}
                            </Picker>
                        </View>
                    </View>
                }

                <View style={styles.verticalMargin}>
                    <Button title="Submit" onPress={_ => this.submitIngredient()} disabled={this.state.numInvalidInputs > 0}>Submit Ingredient</Button>
                </View>
            </Form>
        );
    }

    private updateDensityWeightAmount(newAmount: string) {
        if (Numbers.test(newAmount)) {
            this.setState({ density: { ...this.state.density, equivalentByWeight: { ...this.state.density.equivalentByWeight, amount: Number(newAmount) }}});
        }
    }

    private updateDensityWeightUnit(newValue: QuantityUnit) {
        this.setState({ density: { ...this.state.density, equivalentByWeight: { ...this.state.density.equivalentByWeight, unit: newValue }}});
    }

    private updateDensityVolumeAmount(newAmount: string) {
        if (Numbers.test(newAmount)) {
            this.setState({ density: { ...this.state.density, equivalentByVolume: { ...this.state.density.equivalentByVolume, amount: Number(newAmount) }}});
        }
    }
    
    private updateDensityVolumeUnit(newValue: QuantityUnit) {
        this.setState({ density: { ...this.state.density, equivalentByVolume: { ...this.state.density.equivalentByVolume, unit: newValue }}});
    }


    private ingredientNameIsUnique(name: string): boolean {
        return !this.props.allIngredients.some(ingredient => ingredient.name == name);
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
        let nutrition: IngredientNutrition | null = this.buildNutritionalInformation();
        if (nutrition == null) {
            this.props.submitIngredientWithoutNutrition(ingredient);
        } else {
            this.props.submitIngredient(ingredient, nutrition);
        }
    }

    private buildIngredient(): Ingredient {
        return {
            id: this.props.initialIngredient.id,
            name: this.state.ingredientName
        };
    }
    
    private buildNutritionalInformation(): IngredientNutrition | null {
        if (this.state.noNutrition) {
            return null;
        }

        return {
            ingredientId: -1,
            macronutrientsPerServing: {
                calories: this.state.caloriesPerServing ?? 0,
                carbGrams: this.state.gramsCarbsPerServing ?? 0,
                fatGrams: this.state.gramsFatPerServing ?? 0,
                proteinGrams: this.state.gramsProteinPerServing ?? 0,
            },
            servingSize: {
                amount: this.state.servingSizeAmount ?? 0,
                unit: this.state.servingSizeUnit ?? QuantityUnit.Cups
            },
            density: this.state.density
        };
    }
}

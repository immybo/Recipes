import React from 'react';
import {
    View,
    Button,
    Text,
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
import { Density, getDefaultDensity } from '../../model/Density';
import Form from './Form';
import { EnergyUnit, KilojoulesPerCalorie } from '../../model/EnergyUnit';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { Colors } from '../../style/Colors';

interface IngredientInputProps extends React.Props<IngredientInput> {
    initialIngredient: Ingredient,
    initialNutrition?: IngredientNutrition,
    submitIngredient: (ingredient: Ingredient, nutrition: IngredientNutrition) => void,
    submitIngredientWithoutNutrition: (ingredient: Ingredient) => void,
    allIngredients: Ingredient[]
}

interface IngredientInputState {
    ingredientName: string,
    servingSizeAmount?: number,
    servingSizeUnit?: QuantityUnit,
    energyPerServing?: number,
    gramsProteinPerServing?: number,
    gramsFatPerServing?: number,
    gramsCarbsPerServing?: number,
    numInvalidInputs: number,
    density: Density,
    noNutrition: boolean,
    energyUnit: EnergyUnit
}

export default class IngredientInput extends React.Component<IngredientInputProps, IngredientInputState> {
    constructor(props: IngredientInputProps) {
        super(props);

        this.state = {
            ingredientName: props.initialIngredient.name,
            energyPerServing: props.initialNutrition?.macronutrientsPerServing.calories,
            gramsCarbsPerServing: props.initialNutrition?.macronutrientsPerServing.carbGrams,
            gramsFatPerServing: props.initialNutrition?.macronutrientsPerServing.fatGrams,
            gramsProteinPerServing: props.initialNutrition?.macronutrientsPerServing.proteinGrams,
            servingSizeAmount: props.initialNutrition?.servingSize.amount,
            servingSizeUnit: props.initialNutrition?.servingSize.unit,
            numInvalidInputs: 0,
            density: props.initialNutrition ? props.initialNutrition.density : getDefaultDensity(),
            noNutrition: false,
            energyUnit: EnergyUnit.Calories
        };
    }

    public componentDidUpdate(previousProps: IngredientInputProps) {
        if (previousProps.initialNutrition == null && this.props.initialNutrition != null) {
            this.setState({
                energyPerServing: this.props.initialNutrition.macronutrientsPerServing.calories,
                gramsCarbsPerServing: this.props.initialNutrition.macronutrientsPerServing.carbGrams,
                gramsFatPerServing: this.props.initialNutrition.macronutrientsPerServing.fatGrams,
                gramsProteinPerServing: this.props.initialNutrition.macronutrientsPerServing.proteinGrams,
                servingSizeAmount: this.props.initialNutrition.servingSize.amount,
                servingSizeUnit: this.props.initialNutrition.servingSize.unit,
                density: this.props.initialNutrition.density,
                noNutrition: false
            });
        }
    }

    public render(): JSX.Element {
        let nameErrors = React.createRef<ValidationContainer>();
        let servingSizeAmountErrors = React.createRef<ValidationContainer>();
        let caloriesErrors = React.createRef<ValidationContainer>();
        let proteinErrors = React.createRef<ValidationContainer>();
        let fatErrors = React.createRef<ValidationContainer>();
        let carbsErrors = React.createRef<ValidationContainer>();
        
        return (
            <Form style={styles.containerWithMargin}>
                <CustomTextInput
                    style={[styles.text, styles.largeText]}
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

                <View style={[styles.rowWithoutJustify, styles.verticalMarginSmall]}>
                    <CheckBox value={this.state.noNutrition} onValueChange={newValue => this.setState({noNutrition: newValue})}/>
                    <Text style={styles.text}>No nutrition</Text>
                </View>

                { !this.state.noNutrition &&
                    <View>
                        <View style={styles.rowWithoutJustify}>
                            <Text style={[styles.text, styles.rightMarginSmall]}>Serving size of </Text>
                            <CustomTextInput
                                style={styles.text}
                                keyboardType="numeric"
                                onChangeText={(newQuantity) => this.updateServingSizeAmount(newQuantity)}
                                placeholder={"0"}
                                defaultValue={this.state.servingSizeAmount ? this.state.servingSizeAmount.toString() : "0"}
                                maxLength={10}
                                validationRules={[ PositiveOrZero ]}
                                validationContainer={servingSizeAmountErrors}
                                onValidChange={isValid => this.updateValid(isValid) } />
                                
                            <RNPickerSelect useNativeAndroidPickerStyle={false} placeholder={{}} style={{inputAndroid: {fontFamily: "Montserrat-Regular", color: Colors.Charcoal}}} value={this.state.servingSizeUnit} onValueChange={(value, _) => this.updateServingSizeUnit(value)}
                                items={ [ QuantityUnit.None, QuantityUnit.Grams, QuantityUnit.Kilograms, QuantityUnit.Teaspoons, QuantityUnit.Tablespoons, QuantityUnit.Cups, QuantityUnit.Millilitres, QuantityUnit.Litres ].map((unit: QuantityUnit) => {
                                    let formattedUnit: string = QuantityFormatter.formatUnit(unit, true);
                                    return { label: formattedUnit, value: unit }
                                })}
                            />
                        </View>
                        <ValidationContainer ref={servingSizeAmountErrors} />
                        <View style={styles.rowWithoutJustify}>
                            <CustomTextInput
                                style={styles.text}
                                placeholder="0"
                                keyboardType="numeric"
                                defaultValue={this.state.energyPerServing?.toString()}
                                onChangeText={(text) => this.onSetCalories(text)}
                                validationRules={[ PositiveOrZero ]}
                                validationContainer={caloriesErrors}
                                onValidChange={isValid => this.updateValid(isValid) } />
                            
                            <View style={{"flex": 0.7}}>
                                <RNPickerSelect useNativeAndroidPickerStyle={false} placeholder={{}} style={{inputAndroid: {fontFamily: "Montserrat-Regular", color: Colors.Charcoal}}} value={this.state.energyUnit} onValueChange={(value, _) => this.updateEnergyUnit(value)}
                                    items={[
                                        { label: "calories", value: EnergyUnit.Calories },
                                        { label: "kilojoules", value: EnergyUnit.Kilojoules }
                                    ]}
                                />
                            </View>
                            <Text style={[styles.text, styles.horizontalMarginSmall]}>per serving</Text>
                        </View>
                        <ValidationContainer ref={caloriesErrors} />
                        <View style={styles.rowWithoutJustify}>
                            <CustomTextInput
                                style={styles.text}
                                placeholder="0"
                                keyboardType="numeric"
                                defaultValue={this.state.gramsProteinPerServing?.toString()}
                                onChangeText={(text) => this.onSetProteinPercentage(text)}
                                validationRules={[ PositiveOrZero ]}
                                validationContainer={proteinErrors}
                                onValidChange={isValid => this.updateValid(isValid) } />
                            <Text style={[styles.text, styles.horizontalMarginSmall]}>grams of protein per serving</Text>
                        </View>
                        <ValidationContainer ref={proteinErrors} />
                        <View style={styles.rowWithoutJustify}>
                            <CustomTextInput
                                style={styles.text}
                                placeholder="0"
                                keyboardType="numeric"
                                defaultValue={this.state.gramsFatPerServing?.toString()}
                                onChangeText={(text) => this.onSetFatPercentage(text)}
                                validationRules={[ PositiveOrZero ]}
                                validationContainer={fatErrors}
                                onValidChange={isValid => this.updateValid(isValid) } />
                            <Text style={[styles.text, styles.horizontalMarginSmall]}>grams of fat per serving</Text>
                        </View>
                        <ValidationContainer ref={fatErrors} />
                        <View style={styles.rowWithoutJustify}>
                            <CustomTextInput
                                style={styles.text}
                                placeholder="0"
                                keyboardType="numeric"
                                defaultValue={this.state.gramsCarbsPerServing?.toString()}
                                onChangeText={(text) => this.onSetCarbPercentage(text)}
                                validationRules={[ PositiveOrZero ]}
                                validationContainer={carbsErrors}
                                onValidChange={isValid => this.updateValid(isValid) } />
                            <Text style={[styles.text, styles.horizontalMarginSmall]}>grams of carbs per serving</Text>
                        </View>
                        <ValidationContainer ref={carbsErrors} />

                        <View style={[styles.rowWithoutJustify, styles.flexWrap, styles.noMargin]}>
                            <Text style={styles.text}>The weight of </Text>
                            <CustomTextInput
                                style={styles.text}
                                keyboardType="numeric"
                                defaultValue={String(this.state.density.equivalentByVolume.amount)}
                                onChangeText={(text) => this.updateDensityVolumeAmount(text)} />
                            <View style={{"flex": 0.45}}>
                                <RNPickerSelect useNativeAndroidPickerStyle={false} placeholder={{}} style={{inputAndroid: {fontFamily: "Montserrat-Regular", color: Colors.Charcoal}}} value={this.state.density.equivalentByVolume.unit} onValueChange={(value, _) => this.updateDensityVolumeUnit(value)}
                                    items={ [ QuantityUnit.Millilitres, QuantityUnit.Teaspoons, QuantityUnit.Tablespoons, QuantityUnit.Cups, QuantityUnit.Litres ].map((unit: QuantityUnit) => {
                                        let formattedUnit: string = QuantityFormatter.formatUnitShorthand(unit);
                                        return { label: formattedUnit, value: unit };
                                    })}
                                />
                            </View>
                        </View>

                        <View style={[styles.rowWithoutJustify, styles.flexWrap, styles.noMargin]}>
                            <Text style={styles.text}> is </Text>
                            <CustomTextInput
                                style={styles.text}
                                keyboardType="numeric"
                                defaultValue={String(this.state.density.equivalentByWeight.amount)}
                                onChangeText={(text) => this.updateDensityWeightAmount(text)} />
                            <View style={{"flex": 0.3}}>
                                <RNPickerSelect useNativeAndroidPickerStyle={false} placeholder={{}} style={{inputAndroid: {fontFamily: "Montserrat-Regular", color: Colors.Charcoal}}} value={this.state.density.equivalentByWeight.unit} onValueChange={(value, _) => this.updateDensityWeightUnit(value)}
                                    items={ [ QuantityUnit.Grams, QuantityUnit.Kilograms ].map((unit: QuantityUnit) => {
                                        let formattedUnit: string = QuantityFormatter.formatUnitShorthand(unit);
                                        return { label: formattedUnit, value: unit };
                                    })}
                                />
                            </View>
                        </View>
                    </View>
                }

                <View style={styles.verticalMargin}>
                    <Button title="Submit" onPress={_ => this.submitIngredient()} disabled={this.state.numInvalidInputs > 0}>Submit Ingredient</Button>
                </View>
            </Form>
        );
    }

    private updateEnergyUnit(newUnit: EnergyUnit) {
        this.setState({ energyUnit: newUnit });
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
            this.setState({ energyPerServing: Number(newCalories) });
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

        let caloriesPerServing = 0;
        if (this.state.energyPerServing != null) {
            if (this.state.energyUnit == EnergyUnit.Calories) {
                caloriesPerServing = this.state.energyPerServing;
            } else if (this.state.energyUnit == EnergyUnit.Kilojoules) {
                caloriesPerServing = this.state.energyPerServing / KilojoulesPerCalorie;
            } 
        }

        return {
            ingredientId: this.props.initialIngredient.id,
            macronutrientsPerServing: {
                calories: caloriesPerServing,
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

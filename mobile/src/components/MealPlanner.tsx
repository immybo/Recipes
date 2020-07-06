import React from 'react';
import { View, Text, Picker, Button, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import { styles } from '../style/Style';
import { DayUtils } from '../style/DayOfWeek';
import { getMealPlan, setMealPlan, deleteMealPlanEntry, generateRandomWeeklyMealPlan, MealPlannerActionTypes } from '../actions/MealPlannerActions';
import { getNutritionalInformationForRecipe } from '../actions/RecipeActions';
import { MealPlanEntry } from '../model/MealPlanEntry';
import NavigationToggle from './NavigationToggle';
import { MacronutrientInformation } from '../model/MacronutrientInformation';
import { MacronutrientPercentages, fromMacronutrientInformation } from '../model/MacronutrientPercentages';
import { datesEqual } from '../util/DateUtils';

interface MealPlannerProps extends React.Props<MealPlanner> {
    mealPlan: MealPlanEntry[];
    allRecipes: Recipe[];
    recipeNutrition: Map<number, MacronutrientInformation>;
    getMealPlan: (startDate: Date, endDate: Date) => Promise<MealPlannerActionTypes>;
    setMealPlan: (day: Date, recipeId: number, mealNumber: number) => void;
    deleteMealPlanEntry: (day: Date, mealNumber: number) => void;
    generateRandomWeeklyMealPlan: (startDate: Date) => void;
    getNutritionalInformationForRecipe: (recipeId: number) => void;
}

interface MealPlannerState {
    startDate: Date,
    endDate: Date
}

const mapStateToProps = (state: AppState) => {
    return {
        allRecipes: state.recipes.recipes,
        mealPlan: state.mealPlanner.mealPlan,
        recipeNutrition: state.recipes.recipeNutrition
    };
}

const mapDispatchToProps = {
    getMealPlan,
    setMealPlan,
    deleteMealPlanEntry,
    generateRandomWeeklyMealPlan,
    getNutritionalInformationForRecipe
};

class MealPlanner extends React.Component<MealPlannerProps, MealPlannerState> {
    constructor(props: MealPlannerProps) {
        super(props);
        
        let today: Date = new Date();
        let sundayThisWeek: Date = new Date(0);
        sundayThisWeek.setFullYear(today.getFullYear());
        sundayThisWeek.setMonth(today.getMonth());
        sundayThisWeek.setDate(today.getDate()-today.getDay());

        let endDate = new Date(sundayThisWeek.valueOf());
        endDate.setDate(sundayThisWeek.getDate() + 6);

        this.state = {
            startDate: sundayThisWeek,
            endDate: endDate
        };
    }

    public componentDidMount() {
        this.props.getMealPlan(this.state.startDate, this.state.endDate)
            .then(_ => this.updateNutrition());
    }

    public updateNutrition() {
        this.props.mealPlan.forEach(mealPlanEntry => {
            this.props.getNutritionalInformationForRecipe(mealPlanEntry.recipeId);
        });
    }

    public render(): JSX.Element {
        let averageNutrition: MacronutrientInformation = this.getAverageDailyNutrition();
        let macroPercentages: MacronutrientPercentages = fromMacronutrientInformation(averageNutrition);

        return (
            <View style={styles.container}>
                <NavigationToggle navigation={this.props.navigation} pageTitle="Meal Planner" />
                
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    { this.getDateRows() }
                    
                    <View style={styles.verticalMarginSmall}>
                        <Text>Average calories per day: { averageNutrition.calories.toFixed(0) }</Text>
                        <Text>Approximately { macroPercentages.percentCarbs.toFixed(1) }% carbs, { macroPercentages.percentFat.toFixed(1) }% fat, { macroPercentages.percentProtein.toFixed(1) }% protein</Text>
                    </View>

                    <Button title="Randomize" onPress={_ => this.props.generateRandomWeeklyMealPlan(this.state.startDate).then(() => this.updateNutrition)}>Random</Button>
                </ScrollView>
            </View>
        );
    }

    private getDateRows(): JSX.Element[] {
        let rows: JSX.Element[] = [];
        for (var i = 0; i < 7; i++) {
            let dayOfWeek: Date = new Date(this.state.startDate.valueOf());
            dayOfWeek.setDate(dayOfWeek.getDate() + i);
            rows.push(this.getRow(dayOfWeek));
        }
        return rows;
    }

    private hasMealOnDate(date: Date, mealNumber: number): boolean {
        let planEntriesOnDate = this.props.mealPlan.filter(x => datesEqual(x.date, date) && x.mealNumber === mealNumber);
        if (planEntriesOnDate.length < 1) return false;

        let matchingRecipes = this.props.allRecipes.filter(x => x.id === planEntriesOnDate[0].recipeId)
        return matchingRecipes.length > 0;
    }

    private getMealOnDate(date: Date, mealNumber: number): Recipe {
        let planEntry = this.props.mealPlan.filter(x => datesEqual(x.date, date) && x.mealNumber === mealNumber)[0];
        let potentialMeal = this.props.allRecipes.filter(x => x.id === planEntry.recipeId)[0];
        if (potentialMeal == null) {
            throw new Error("Unable to get meal for " + date.toString());
        } else {
            return potentialMeal;
        }
    }

    private getRow(date: Date): JSX.Element {
        return (
            <View key={date.getDay()}>
                <Text style={styles.largeText}>{ DayUtils.toString(date.getDay()).substring(0,3) + " " + date.getDate() + "/" + (date.getMonth()+1) }</Text>
                <View>
                    { this.getIngredientRowSection(date) }
                </View>
            </View>
        );
    }

    private getIngredientRowSection(date: Date) {
        return (
            <View style={styles.verticalMarginSmall}>
                <View style={styles.rowLayout}>
                    <View style={{flex: 0.3}}><Text style={styles.pickerText}>Breakfast: </Text></View>
                    <View style={{flex: 0.7}}>{ this.getMealPicker(date, 0) }</View>
                </View>
                <View style={styles.rowLayout}>
                    <View style={{flex: 0.3}}><Text style={styles.pickerText}>Lunch: </Text></View>
                    <View style={{flex: 0.7}}>{ this.getMealPicker(date, 1) }</View>
                </View>
                <View style={styles.rowLayout}>
                    <View style={{flex: 0.3}}><Text style={styles.pickerText}>Dinner: </Text></View>
                    <View style={{flex: 0.7}}>{ this.getMealPicker(date, 2) }</View>
                </View>
            </View>
        );
    }

    private getMealPicker(date: Date, mealNumber: number) {
        return (
            <Picker key={ date.getDay() } selectedValue={ this.hasMealOnDate(date, mealNumber) ? this.getMealOnDate(date, mealNumber).id : "" } onValueChange={(value, _) => {
                     if (value == -1) {
                         this.props.deleteMealPlanEntry(date, mealNumber);
                     } else {
                        this.props.setMealPlan(date, value, mealNumber);
                     }
                }}>
                <Picker.Item label="" key={-1} value={-1} />
                { this.props.allRecipes.map((recipe: Recipe) => {
                    return <Picker.Item label={recipe.name} key={recipe.id} value={recipe.id} />
                })}
            </Picker>
        );
    }

    private getAverageDailyNutrition(): MacronutrientInformation {
        let mealPlanMacronutrientsInformation: MacronutrientInformation[] = this.props.mealPlan.map(mealPlanEntry => this.props.recipeNutrition[mealPlanEntry.recipeId]);
        
        let totalMacronutrients: MacronutrientInformation = {
            calories: 0,
            carbGrams: 0,
            fatGrams: 0,
            proteinGrams: 0
        };
        
        // If some are null then we haven't properly loaded the recipe nutrition yet.
        if (mealPlanMacronutrientsInformation.length === 0 || mealPlanMacronutrientsInformation.some(x => x == null)) {
            return totalMacronutrients;
        }

        mealPlanMacronutrientsInformation.forEach(nutrition => {
            totalMacronutrients.calories += nutrition.calories;
            totalMacronutrients.carbGrams += nutrition.carbGrams;
            totalMacronutrients.fatGrams += nutrition.fatGrams;
            totalMacronutrients.proteinGrams += nutrition.proteinGrams;
        });

        let totalNumDays = 7;
        if (mealPlanMacronutrientsInformation.length > 0) {
            totalMacronutrients.calories /= totalNumDays;
            totalMacronutrients.carbGrams /= totalNumDays;
            totalMacronutrients.fatGrams /= totalNumDays;
            totalMacronutrients.proteinGrams /= totalNumDays;
        }

        return totalMacronutrients;
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(MealPlanner));

import React from 'react';
import { View, Text, Picker } from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import { styles } from '../style/Style';
import { DayUtils } from '../style/DayOfWeek';
import RecipeCompactDisplay from './shared/RecipeCompactDisplay';
import { getMealPlan, setMealPlan, deleteMealPlanEntry } from '../actions/MealPlannerActions';
import { MealPlanEntry } from '../model/MealPlanEntry';

interface MealPlannerProps extends React.Props<MealPlanner> {
    mealPlan: MealPlanEntry[];
    allRecipes: Recipe[];
    getMealPlan: (startDate: Date, endDate: Date) => void;
    setMealPlan: (day: Date, recipeId: number) => void;
    deleteMealPlanEntry: (day: Date) => void;
}

interface MealPlannerState {
    startDate: Date,
    endDate: Date
}

const mapStateToProps = (state: AppState) => {
    return {
        allRecipes: state.recipes.recipes,
        mealPlan: state.mealPlanner.mealPlan
    };
}

const mapDispatchToProps = {
    getMealPlan,
    setMealPlan,
    deleteMealPlanEntry
};

class MealPlanner extends React.Component<MealPlannerProps, MealPlannerState> {
    constructor(props: MealPlannerProps) {
        super(props);
        
        let today: Date = new Date();
        let sundayThisWeek: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        sundayThisWeek.setDate(today.getDate()-today.getDay());

        let endDate = new Date(sundayThisWeek);
        endDate.setDate(sundayThisWeek.getDate() + 6);

        this.state = {
            startDate: sundayThisWeek,
            endDate: endDate
        };
    }

    public componentDidMount() {
        this.props.getMealPlan(this.state.startDate, this.state.endDate);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                { this.getDateRows() }
            </View>
        );
    }

    private getDateRows(): JSX.Element[] {
        let rows: JSX.Element[] = [];
        for (var i = 0; i < 7; i++) {
            let dayOfWeek: Date = new Date(this.state.startDate);
            dayOfWeek.setDate(dayOfWeek.getDate() + i);
            rows.push(this.getRow(dayOfWeek));
        }
        return rows;
    }

    private hasMealOnDate(date: Date): boolean {
        // Can be a bit slow if we have a lot of recipes. Maybe start using dictionaries for recipes/ingredients.
        return (this.props.mealPlan.find(x => +x.date === +date) != undefined) && this.props.allRecipes.find(x => x.id === this.props.mealPlan.find(x => +x.date === +date)!.recipeId) != undefined;
    }

    private getMealOnDate(date: Date): Recipe {
        let potentialMeal = this.props.allRecipes.find(x => x.id === this.props.mealPlan.find(x => +x.date === +date)!.recipeId);
        if (potentialMeal == null) {
            throw new Error("Unable to get meal for " + date.toString());
        } else {
            return potentialMeal;
        }
    }

    private getRow(date: Date): JSX.Element {
        return (
            <View style={styles.rowLayout} key={date.getDay()}>
                <Text style={{ flex: 0.25 }}>{ DayUtils.toString(date.getDay()) }</Text>
                <View style={{ flex: 0.75 }}>
                    { this.getIngredientRowSection(date) }
                </View>
            </View>
        );
    }

    private getIngredientRowSection(date: Date) {
        if (this.hasMealOnDate(date)) {
            let selectedRecipe: Recipe = this.getMealOnDate(date);
            return <RecipeCompactDisplay recipe={selectedRecipe} onDelete={() => this.props.deleteMealPlanEntry(date)} />
        } else {
            // TODO change this to an autocomplete text field
            return (
                <Picker key={date.getDay()} selectedValue={ "" } onValueChange={(value, _) => { if (value != -1) this.props.setMealPlan(date, value) }}>
                    <Picker.Item label="" key={-1} value={-1} />
                    { this.props.allRecipes.map((recipe: Recipe) => {
                        return <Picker.Item label={recipe.name} key={recipe.id} value={recipe.id} />
                    })}
                </Picker>
            );
        }
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(MealPlanner));

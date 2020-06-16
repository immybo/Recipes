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
            let dayOfWeek: Date = new Date(this.state.startDate.valueOf());
            dayOfWeek.setDate(dayOfWeek.getDate() + i);
            rows.push(this.getRow(dayOfWeek));
        }
        return rows;
    }

    private hasMealOnDate(date: Date): boolean {
        let planEntriesOnDate = this.props.mealPlan.filter(x => this.datesEqual(x.date, date));
        if (planEntriesOnDate.length < 1) return false;

        let matchingRecipes = this.props.allRecipes.filter(x => x.id === planEntriesOnDate[0].recipeId)
        return matchingRecipes.length > 0;
    }

    private getMealOnDate(date: Date): Recipe {
        let planEntry = this.props.mealPlan.filter(x => this.datesEqual(x.date, date))[0];
        let potentialMeal = this.props.allRecipes.filter(x => x.id === planEntry.recipeId)[0];
        if (potentialMeal == null) {
            throw new Error("Unable to get meal for " + date.toString());
        } else {
            return potentialMeal;
        }
    }

    private getRow(date: Date): JSX.Element {
        return (
            <View style={styles.rowLayout} key={date.getDay()}>
                <Text style={{ flex: 0.3 }}>{ DayUtils.toString(date.getDay()).substring(0,3) + " " + date.getDate() + "/" + date.getMonth() }</Text>
                <View style={{ flex: 0.7 }}>
                    { this.getIngredientRowSection(date) }
                </View>
            </View>
        );
    }

    private getIngredientRowSection(date: Date) {
        return (
            <Picker key={date.getDay()} selectedValue={ this.hasMealOnDate(date) ? this.getMealOnDate(date).id : "" } onValueChange={(value, _) => { if (value != -1) this.props.setMealPlan(date, value) }}>
                <Picker.Item label="" key={-1} value={-1} />
                { this.props.allRecipes.map((recipe: Recipe) => {
                    return <Picker.Item label={recipe.name} key={recipe.id} value={recipe.id} />
                })}
            </Picker>
        );
    }

    private datesEqual(date: Date, date2: Date): boolean {
        return date.getDay() === date2.getDay() && date.getMonth() === date2.getMonth() && date.getFullYear() === date2.getFullYear();
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(MealPlanner));

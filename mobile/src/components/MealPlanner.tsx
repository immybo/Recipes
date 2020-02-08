import React from 'react';
import { View, Text, Picker } from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import { styles } from '../style/Style';
import { DayOfWeek, DayUtils } from '../style/DayOfWeek';
import RecipeCompactDisplay from './shared/RecipeCompactDisplay';
import { setMeal, removeMeal } from '../actions/MealPlannerActions';

interface MealPlannerProps extends React.Props<MealPlanner> {
    selectedRecipes: Record<DayOfWeek, number>;
    allRecipes: Recipe[];
    setMeal: (day: DayOfWeek, recipeId: number) => void;
    removeMeal: (day: DayOfWeek, recipeId: number) => void;
}

interface MealPlannerState {
}

const mapStateToProps = (state: AppState) => {
    return {
        allRecipes: state.recipes.recipes,
        selectedRecipes: state.mealPlanner.weeklyPlan
    };
}

const mapDispatchToProps = {
    setMeal,
    removeMeal
};

class MealPlanner extends React.Component<MealPlannerProps, MealPlannerState> {
    constructor(props: MealPlannerProps) {
        super(props);

        this.state = {
        };
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                { [ DayOfWeek.Sunday, DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday ].map(
                    day => this.getRow(day)
                )}
            </View>
        );
    }

    private hasMealOnDay(day: DayOfWeek): boolean {
        // Can be a bit slow if we have a lot of recipes. Maybe start using dictionaries for recipes/ingredients.
        return (day in this.props.selectedRecipes) && this.props.allRecipes.find(x => x.id === this.props.selectedRecipes[day]) != null;
    }

    private getMealOnDay(day: DayOfWeek): Recipe {
        let potentialMeal = this.props.allRecipes.find(x => x.id === this.props.selectedRecipes[day]);
        if (potentialMeal == null) {
            throw new Error("Unable to get meal for " + day.toString());
        } else {
            return potentialMeal;
        }
    }

    private getRow(day: DayOfWeek): JSX.Element {
        return (
            <View style={styles.rowLayout}>
                <Text style={{ flex: 0.25 }}>{ DayUtils.toString(day) }</Text>
                <View style={{ flex: 0.75 }}>
                    { this.getIngredientRowSection(day) }
                </View>
            </View>
        );
    }

    private getIngredientRowSection(day: DayOfWeek) {
        if (this.hasMealOnDay(day)) {
            let selectedRecipe: Recipe = this.getMealOnDay(day);
            return <RecipeCompactDisplay recipe={selectedRecipe} onDelete={() => this.props.removeMeal(day, selectedRecipe.id) } />
        } else {
            // TODO change this to an autocomplete text field
            return (
                <Picker selectedValue={ "" } onValueChange={(value, _) => this.props.setMeal(day, value)}>
                    { this.props.allRecipes.map((recipe: Recipe) => {
                        return <Picker.Item label={recipe.name} key={recipe.id} value={recipe.id} />
                    })}
                </Picker>
            );
        }
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(MealPlanner));

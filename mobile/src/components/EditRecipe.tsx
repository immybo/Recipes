import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { Recipe, getBlankRecipe } from '../model/Recipe';
import { updateRecipe } from '../actions/RecipeActions';
import { withNavigation, NavigationParams, NavigationState, NavigationScreenProp } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import RecipeInput from './shared/RecipeInput';
import { Ingredient } from '../model/Ingredient';
import { addIngredientWithNutritionalInformation, addIngredient } from '../actions/IngredientActions';
import { IngredientNutrition } from '../model/IngredientNutrition';

interface EditRecipeProps extends React.Props<EditRecipe> {
    allIngredients: Ingredient[],
    allRecipes: Recipe[],
    updateRecipe: (newRecipe: Recipe) => void,
    addIngredientWithNutritionalInformation: (ingredient: Ingredient, nutrition: IngredientNutrition) => void,
    addIngredient: (ingredient: Ingredient) => void
}

interface EditRecipeState {
    initialRecipe: Recipe
}

const mapStateToProps = (state: AppState) => {
    return {
        allIngredients: state.ingredients.allIngredients,
        allRecipes: state.recipes.recipes
    };
}

const mapDispatchToProps = {
    updateRecipe,
    addIngredientWithNutritionalInformation,
    addIngredient
};

class EditRecipe extends React.Component<EditRecipeProps, EditRecipeState> {
    constructor(props: any) {
        super(props);

        this.state = {
            initialRecipe: this.props.navigation.getParam("recipe", null)
        };
    }

    public render(): JSX.Element {
        return (
            <RecipeInput allRecipes={this.props.allRecipes}
                allIngredients={this.props.allIngredients}
                initialRecipe={this.state.initialRecipe}
                submitRecipe={(recipe) => this.submitRecipe(recipe)}
                submitIngredient={(ingredient, nutrition) => this.submitIngredient(ingredient, nutrition)}
                submitIngredientWithoutNutrition={(ingredient) => this.submitIngredientWithoutNutrition(ingredient)} />
        );
    }

    private submitRecipe(recipe: Recipe): void {
        this.props.updateRecipe(recipe);
        this.props.navigation.navigate(RouteViewRecipes);
    }

    private submitIngredient(ingredient: Ingredient, nutrition: IngredientNutrition): void {
        this.props.addIngredientWithNutritionalInformation(ingredient, nutrition);
    }

    private submitIngredientWithoutNutrition(ingredient: Ingredient): void {
        this.props.addIngredient(ingredient);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(EditRecipe));

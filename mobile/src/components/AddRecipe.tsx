import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { Recipe, getBlankRecipe } from '../model/Recipe';
import { addRecipe } from '../actions/RecipeActions';
import { withNavigation } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import RecipeInput from './shared/RecipeInput';
import { Ingredient } from '../model/Ingredient';
import { NutritionalInformation } from '../model/NutritionalInformation';
import { addIngredientWithNutritionalInformation } from '../actions/IngredientActions';

interface AddRecipeProps extends React.Props<AddRecipe> {
    allIngredients: Ingredient[],
    addRecipe: (recipe: Recipe) => void,
    addIngredientWithNutritionalInformation: (ingredient: Ingredient, nutrition: NutritionalInformation) => void
}

interface AddRecipeState {
}

const mapStateToProps = (state: AppState) => {
    return {
        allIngredients: state.ingredients.allIngredients
    };
}

const mapDispatchToProps = {
    addRecipe,
    addIngredientWithNutritionalInformation
};

class AddRecipe extends React.Component<AddRecipeProps, AddRecipeState> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <RecipeInput allIngredients={this.props.allIngredients} initialRecipe={getBlankRecipe()} submitRecipe={(recipe) => this.submitRecipe(recipe)} submitIngredient={(ingredient, nutrition) => this.submitIngredient(ingredient, nutrition)} />
        );
    }

    private submitRecipe(recipe: Recipe): void {
        this.props.addRecipe(recipe);
        this.props.navigation.navigate(RouteViewRecipes);
    }

    private submitIngredient(ingredient: Ingredient, nutrition: NutritionalInformation): void {
        this.props.addIngredientWithNutritionalInformation(ingredient, nutrition);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddRecipe));

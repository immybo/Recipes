import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { Recipe, getBlankRecipe } from '../model/Recipe';
import { updateRecipe } from '../actions/RecipeActions';
import { withNavigation, NavigationParams, NavigationState, NavigationScreenProp } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import RecipeInput from './shared/RecipeInput';
import { Ingredient } from '../model/Ingredient';

interface EditRecipeProps extends React.Props<EditRecipe> {
    allIngredients: Ingredient[]
    updateRecipe: (newRecipe: Recipe) => void
}

interface EditRecipeState {
    initialRecipe: Recipe
}

const mapStateToProps = (state: AppState) => {
    return {
        allIngredients: state.ingredients.allIngredients
    };
}

const mapDispatchToProps = {
    updateRecipe
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
            <RecipeInput allIngredients={this.props.allIngredients} initialRecipe={this.state.initialRecipe} submitRecipe={(recipe) => this.submitRecipe(recipe)} />
        );
    }

    private submitRecipe(recipe: Recipe): void {
        this.props.updateRecipe(recipe);
        this.props.navigation.navigate(RouteViewRecipes);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(EditRecipe));

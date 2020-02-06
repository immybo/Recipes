import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { Recipe, getBlankRecipe } from '../model/Recipe';
import { addRecipe } from '../actions/RecipeActions';
import { withNavigation, ScrollView } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import RecipeInput from './shared/RecipeInput';
import { Ingredient } from '../model/Ingredient';

interface AddRecipeProps extends React.Props<AddRecipe> {
    allIngredients: Ingredient[]
}

interface AddRecipeState {
}

const mapStateToProps = (state: AppState) => {
    return {
        allIngredients: state.ingredients.allIngredients
    };
}

const mapDispatchToProps = {
    addRecipe
};

class AddRecipe extends React.Component<AddRecipeProps, AddRecipeState> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <RecipeInput allIngredients={this.props.allIngredients} initialRecipe={getBlankRecipe()} submitRecipe={(recipe) => this.submitRecipe(recipe)} />
        );
    }

    private submitRecipe(recipe: Recipe): void {
        this.props.addRecipe(recipe);
        this.props.navigation.navigate(RouteViewRecipes);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddRecipe));

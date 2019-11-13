import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { Ingredient, getBlankIngredient } from '../model/Ingredient';
import { Recipe, getBlankRecipe } from '../model/Recipe';
import { addRecipe } from '../actions/RecipeActions';
import { withNavigation, ScrollView } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import { Category } from '../model/Category';
import RecipeInput from './shared/RecipeInput';

interface AddRecipeState {
}

const mapStateToProps = (state: AppState) => {
    return {};
}

const mapDispatchToProps = {
    addRecipe
};

class AddRecipe extends React.Component<any, AddRecipeState> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <RecipeInput initialRecipe={getBlankRecipe()} submitRecipe={(recipe) => this.submitRecipe(recipe)} />
        );
    }

    private submitRecipe(recipe: Recipe): void {
        this.props.addRecipe(recipe);
        this.props.navigation.navigate(RouteViewRecipes);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddRecipe));

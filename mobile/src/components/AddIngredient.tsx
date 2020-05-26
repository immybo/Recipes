import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import { addIngredientWithNutritionalInformation, addIngredient } from '../actions/IngredientActions';
import { Ingredient, getBlankIngredient } from '../model/Ingredient';
import IngredientInput from './shared/IngredientInput';
import { IngredientNutrition } from '../model/IngredientNutrition';

interface AddIngredientProps {
    allIngredients: Ingredient[],
    addIngredientWithNutritionalInformation: (ingredient: Ingredient, nutrition: IngredientNutrition) => void
    addIngredient: (ingredient: Ingredient) => void
}

interface AddIngredientState {
}

const mapStateToProps = (state: AppState) => {
    return {
        allIngredients: state.ingredients.allIngredients
    };
}

const mapDispatchToProps = {
    addIngredientWithNutritionalInformation,
    addIngredient
};

class AddIngredient extends React.Component<AddIngredientProps, AddIngredientState> {
    constructor(props: AddIngredientProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <IngredientInput initialIngredient={getBlankIngredient()}
                submitIngredientWithoutNutrition={ingredient => this.submitIngredientWithoutNutrition(ingredient)}
                submitIngredient={(ingredient, nutrition) => this.submitIngredient(ingredient, nutrition)}
                allIngredients={this.props.allIngredients} />
        );
    }

    private submitIngredient(ingredient: Ingredient, nutrition: IngredientNutrition): void {
        this.props.addIngredientWithNutritionalInformation(ingredient, nutrition);
        this.props.navigation.navigate(RouteViewRecipes);
    }

    private submitIngredientWithoutNutrition(ingredient: Ingredient): void {
        this.props.addIngredient(ingredient);
        this.props.navigation.navigate(RouteViewRecipes);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddIngredient));

import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import { addIngredientWithNutritionalInformation } from '../actions/IngredientActions';
import { Ingredient, getBlankIngredient } from '../model/Ingredient';
import IngredientInput from './shared/IngredientInput';
import { NutritionalInformation } from '../model/NutritionalInformation';

interface AddIngredientProps {
    allIngredients: Ingredient[]
}

interface AddIngredientState {
}

const mapStateToProps = (state: AppState) => {
    return {
        allIngredients: state.ingredients.allIngredients
    };
}

const mapDispatchToProps = {
    addIngredientWithNutritionalInformation
};

class AddIngredient extends React.Component<AddIngredientProps, AddIngredientState> {
    constructor(props: AddIngredientProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <IngredientInput initialIngredient={getBlankIngredient()} submitIngredient={(ingredient, nutrition) => this.submitIngredient(ingredient, nutrition)} allIngredients={this.props.allIngredients} />
        );
    }

    private submitIngredient(ingredient: Ingredient, nutrition: NutritionalInformation): void {
        this.props.addIngredientWithNutritionalInformation(ingredient, nutrition);
        this.props.navigation.navigate(RouteViewRecipes);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddIngredient));

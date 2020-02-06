import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import { addIngredient } from '../actions/IngredientActions';
import { Ingredient, getBlankIngredient } from '../model/Ingredient';
import IngredientInput from './shared/IngredientInput';

interface AddIngredientState {
}

const mapStateToProps = (state: AppState) => {
    return {};
}

const mapDispatchToProps = {
    addIngredient
};

class AddIngredient extends React.Component<any, AddIngredientState> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <IngredientInput initialIngredient={getBlankIngredient()} submitIngredient={(ingredient) => this.submitIngredient(ingredient)} />
        );
    }

    private submitIngredient(ingredient: Ingredient): void {
        this.props.addIngredient(ingredient);
        this.props.navigation.navigate(RouteViewRecipes);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddIngredient));

import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { Ingredient } from '../model/Ingredient';
import { updateIngredient, updateIngredientNutrition, fetchNutritionForIngredient } from '../actions/IngredientActions';
import { withNavigation } from 'react-navigation';
import IngredientInput from './shared/IngredientInput';
import { IngredientNutrition } from '../model/IngredientNutrition';
import { RouteViewIngredients } from '../Routes';

interface EditIngredientProps extends React.Props<EditIngredient> {
    allIngredients: Ingredient[]
    allIngredientNutrition: IngredientNutrition[]
    updateIngredient: (newIngredient: Ingredient) => void
    updateIngredientNutrition: (nutrition: IngredientNutrition) => void
    fetchNutritionForIngredient: (ingredient: Ingredient) => void
}

interface EditIngredientState {
    initialIngredient: Ingredient
}

const mapStateToProps = (state: AppState) => {
    return {
        allIngredients: state.ingredients.allIngredients,
        allIngredientNutrition: state.ingredients.ingredientNutrition
    };
}

const mapDispatchToProps = {
    updateIngredient,
    updateIngredientNutrition,
    fetchNutritionForIngredient
};

class EditIngredient extends React.Component<EditIngredientProps, EditIngredientState> {
    constructor(props: any) {
        super(props);

        this.state = {
            initialIngredient: this.props.navigation.getParam("ingredient", null)
        };
    }

    public componentDidMount() {
        this.props.fetchNutritionForIngredient(this.state.initialIngredient);
    }

    public render(): JSX.Element {
        let ingredientNutrition = this.props.allIngredientNutrition.find(x => x.ingredientId === this.state.initialIngredient.id)

        return (
            <IngredientInput allIngredients={this.props.allIngredients.filter(x => x.id !== this.state.initialIngredient.id)}
                initialIngredient={this.state.initialIngredient}
                submitIngredient={(ingredient, nutrition) => this.submitIngredient(ingredient, nutrition)}
                submitIngredientWithoutNutrition={(ingredient) => this.submitIngredientWithoutNutrition(ingredient)}
                initialNutrition={ingredientNutrition} />
        );
    }

    private submitIngredient(ingredient: Ingredient, nutrition: IngredientNutrition): void {
        this.props.updateIngredient(ingredient);
        this.props.updateIngredientNutrition(nutrition);
        this.props.navigation.navigate(RouteViewIngredients);
    }

    private submitIngredientWithoutNutrition(ingredient: Ingredient): void {
        this.props.updateIngredient(ingredient);
        this.props.navigation.navigate(RouteViewIngredients);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(EditIngredient));

import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import { RouteViewRecipes } from '../Routes';
import { addIngredientWithNutritionalInformation, addIngredient } from '../actions/IngredientActions';
import { Ingredient, getBlankIngredient } from '../model/Ingredient';
import IngredientInput from './shared/IngredientInput';
import { IngredientNutrition } from '../model/IngredientNutrition';
import { LoadingType, beginLoading, endLoading } from '../actions/LoadingActions';
import { styles } from '../style/Style';
import { View } from 'react-native';
import NavigationToggle from './NavigationToggle';
import { DrawerNavigationProp } from '@react-navigation/drawer';

interface AddIngredientProps {
    navigation: DrawerNavigationProp<any, any>,
    allIngredients: Ingredient[],
    addIngredientWithNutritionalInformation: (ingredient: Ingredient, nutrition: IngredientNutrition) => void
    addIngredient: (ingredient: Ingredient) => void
    beginLoading: (type: LoadingType) => void
    endLoading: (type: LoadingType) => void
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
    addIngredient,
    beginLoading,
    endLoading
};

class AddIngredient extends React.Component<AddIngredientProps, AddIngredientState> {
    constructor(props: AddIngredientProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <NavigationToggle drawerNavigation={this.props.navigation} pageTitle="Add Ingredient" />
                <IngredientInput initialIngredient={getBlankIngredient()}
                    submitIngredientWithoutNutrition={ingredient => this.submitIngredientWithoutNutrition(ingredient)}
                    submitIngredient={(ingredient, nutrition) => this.submitIngredient(ingredient, nutrition)}
                    allIngredients={this.props.allIngredients} />
            </View>
        );
    }

    private submitIngredient(ingredient: Ingredient, nutrition: IngredientNutrition): void {
        this.props.beginLoading(LoadingType.SubmitIngredient);
        this.props.addIngredientWithNutritionalInformation(ingredient, nutrition);
        this.props.endLoading(LoadingType.SubmitIngredient);
        this.props.navigation.navigate(RouteViewRecipes);
    }

    private submitIngredientWithoutNutrition(ingredient: Ingredient): void {
        this.props.beginLoading(LoadingType.SubmitIngredient);
        this.props.addIngredient(ingredient);
        this.props.endLoading(LoadingType.SubmitIngredient);
        this.props.navigation.navigate(RouteViewRecipes);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddIngredient));

import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/Reducers';
import { Recipe, getBlankRecipe } from '../model/Recipe';
import { addRecipe } from '../actions/RecipeActions';
import { withNavigation, NavigationScreenProp } from 'react-navigation';
import { RouteViewRecipes, RouteAddRecipe } from '../Routes';
import RecipeInput from './shared/RecipeInput';
import { Ingredient } from '../model/Ingredient';
import { IngredientNutrition } from '../model/IngredientNutrition';
import { addIngredientWithNutritionalInformation, addIngredient } from '../actions/IngredientActions';
import { LoadingType, LoadingActionTypes, beginLoading, endLoading } from '../actions/LoadingActions';
import { View, TouchableOpacity } from 'react-native';
import { styles } from '../style/Style';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import NavigationToggle from './NavigationToggle';

interface AddRecipeProps extends React.Props<AddRecipe> {
    allIngredients: Ingredient[],
    allRecipes: Recipe[]
    addRecipe: (recipe: Recipe) => void,
    addIngredientWithNutritionalInformation: (ingredient: Ingredient, nutrition: IngredientNutrition) => void,
    addIngredient: (ingredient: Ingredient) => void
    beginLoading: (type: LoadingType) => LoadingActionTypes
    endLoading: (type: LoadingType) => LoadingActionTypes
    navigation: DrawerNavigationProp<any, any>
}

interface AddRecipeState {
}

const mapStateToProps = (state: AppState) => {
    return {
        allIngredients: state.ingredients.allIngredients,
        allRecipes: state.recipes.recipes
    };
}

const mapDispatchToProps = {
    addRecipe,
    addIngredientWithNutritionalInformation,
    addIngredient,
    endLoading,
    beginLoading
};

class AddRecipe extends React.Component<AddRecipeProps, AddRecipeState> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <NavigationToggle drawerNavigation={this.props.navigation} pageTitle="Add Recipe" />
                <RecipeInput
                    allRecipes={this.props.allRecipes}
                    allIngredients={this.props.allIngredients}
                    initialRecipe={getBlankRecipe()}
                    submitRecipe={(recipe) => this.submitRecipe(recipe)}
                    submitIngredient={(ingredient, nutrition) => this.submitIngredient(ingredient, nutrition)}
                    submitIngredientWithoutNutrition={(ingredient) => this.submitIngredientWithoutNutrition(ingredient)} />
            </View>
        );
    }

    private submitRecipe(recipe: Recipe): void {
        this.props.beginLoading(LoadingType.SubmitRecipe);
        this.props.addRecipe(recipe);
        this.props.endLoading(LoadingType.SubmitRecipe);
        this.props.navigation.navigate(RouteViewRecipes);
    }

    private submitIngredient(ingredient: Ingredient, nutrition: IngredientNutrition): void {
        this.props.addIngredientWithNutritionalInformation(ingredient, nutrition);
    }

    private submitIngredientWithoutNutrition(ingredient: Ingredient): void {
        this.props.addIngredient(ingredient);
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(AddRecipe));

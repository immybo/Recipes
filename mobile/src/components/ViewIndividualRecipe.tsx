import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import { withNavigation } from 'react-navigation';
import IngredientDisplay from './shared/IngredientDisplay';
import { styles } from '../style/Style';
import { getNutritionalInformationForRecipe } from '../actions/RecipeActions';
import { MacronutrientInformation } from '../model/MacronutrientInformation';
import { convertToNutritionPerServing } from '../util/NutritionUtils';
import { StackNavigationProp } from '@react-navigation/stack';

interface ViewIndividualRecipeProps extends React.Props<ViewIndividualRecipe> {
    navigation: StackNavigationProp<any>,
    recipeNutrition: Map<number, MacronutrientInformation>,
    getNutritionalInformationForRecipe: (recipeId: number) => void
}

interface ViewIndividualRecipeState {
    recipe: Recipe
}

const mapStateToProps = (state: AppState) => {
    return {
        recipeNutrition: state.recipes.recipeNutrition
    };
}

const mapDispatchToProps = {
    getNutritionalInformationForRecipe
};

class ViewIndividualRecipe extends React.Component<ViewIndividualRecipeProps, ViewIndividualRecipeState> {
    constructor(props: ViewIndividualRecipeProps) {
        super(props);

        this.state = {
            recipe: this.props.route.params["recipe"]
        };
    }

    public componentDidMount() {
        this.props.getNutritionalInformationForRecipe(this.state.recipe.id);
    }

    public render(): JSX.Element {
        if (this.state.recipe == null) {
            return <View />;
        }

        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={[styles.textHeader, styles.hugeText, styles.verticalMarginSmall, styles.centerText]}>{this.state.recipe.name.toUpperCase()}</Text>
                    <Text style={[styles.text, styles.verticalMarginSmall]}>{this.state.recipe.description}</Text>
                    <View style={[styles.centerAlign, styles.verticalMarginSmall]}>
                        <Text style={[styles.textHeader, styles.hugeText, styles.bottomMargin]}>Ingredients</Text>
                        {this.getIngredientList()}
                    </View>
                    <View style={[styles.centerAlign, styles.verticalMarginSmall]}>
                        <Text style={[styles.textHeader, styles.hugeText, styles.bottomMargin]}>Method</Text>
                        {this.getMethod()}
                    </View>
                    <View style={styles.centerAlign}>
                        <Text style={[styles.textHeader, styles.hugeText, styles.bottomMargin]}>Categories</Text>
                        {this.getCategoryList()}
                    </View>
                    { this.getNutritionDisplay() }
                </ScrollView>
            </View>
        );
    }

    private getNutritionDisplay(): JSX.Element {
        if (this.props.recipeNutrition != null && this.props.recipeNutrition[this.state.recipe.id] != null) {
            let recipeNutritionPerServing: MacronutrientInformation = convertToNutritionPerServing(this.state.recipe, this.props.recipeNutrition[this.state.recipe.id])

            return (
                <View style={styles.verticalMarginSmall}>
                    <Text style={styles.text}>Calories per serving: { recipeNutritionPerServing.calories.toFixed(0) ?? 0 }</Text>
                    <Text style={styles.text}>Protein per serving: { recipeNutritionPerServing.proteinGrams.toFixed(0) ?? 0 }g</Text>
                    <Text style={styles.text}>Fat per serving: { recipeNutritionPerServing.fatGrams.toFixed(0) ?? 0 }g</Text>
                    <Text style={styles.text}>Carbs per serving: { recipeNutritionPerServing.carbGrams.toFixed(0) ?? 0 }g</Text>
                </View>
            );
        } else {
            return <View />;
        }
    }

    private getIngredientList(): JSX.Element[] {
        return this.state.recipe.ingredients.map((ingredient, key) => <IngredientDisplay key={key} ingredient={ingredient} />);
    }

    private getMethod(): JSX.Element[] {
        return this.state.recipe.method.steps.map(
            (step: string, key: number) => (
                <View style={[styles.rowLayout, styles.bottomMargin]} key={"step-" + key + "-container"}>
                    <Text style={[styles.text, {flex: 0.1}]}>{(key+1) + "."}</Text>
                    <Text style={[styles.text, {flex: 0.9}]} key={"step-" + key}>{step}</Text>
                </View>
            )
        );
    }

    private getCategoryList(): JSX.Element {
        return <Text style={styles.text}>{this.state.recipe.categories.map(x => x.name).join(", ")}</Text>
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ViewIndividualRecipe));

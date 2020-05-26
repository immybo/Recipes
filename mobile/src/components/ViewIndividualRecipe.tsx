import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import { withNavigation, ScrollView } from 'react-navigation';
import IngredientDisplay from './shared/IngredientDisplay';
import { styles } from '../style/Style';
import { getNutritionalInformationForRecipe } from '../actions/RecipeActions';
import { MacronutrientInformation } from '../model/MacronutrientInformation';

interface ViewIndividualRecipeProps extends React.Props<ViewIndividualRecipe> {
    navigation: any,
    nutritionalInformation?: MacronutrientInformation,
    getNutritionalInformationForRecipe: (recipeId: number) => void
}

interface ViewIndividualRecipeState {
    recipe: Recipe
}

const mapStateToProps = (state: AppState) => {
    return {
        nutritionalInformation: state.recipes.nutritionalInformationForCurrentRecipe
    };
}

const mapDispatchToProps = {
    getNutritionalInformationForRecipe
};

class ViewIndividualRecipe extends React.Component<ViewIndividualRecipeProps, ViewIndividualRecipeState> {
    constructor(props: ViewIndividualRecipeProps) {
        super(props);

        this.state = {
            recipe: this.props.navigation.getParam("recipe", null)
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
                    <Text style={[styles.h1, styles.verticalMarginSmall]}>{this.state.recipe.name}</Text>
                    <Text style={styles.verticalMarginSmall}>{this.state.recipe.description}</Text>
                    <View style={styles.verticalMarginSmall}>
                        <Text style={styles.h2}>Ingredients</Text>
                        {this.getIngredientList()}
                    </View>
                    {
                        this.props.nutritionalInformation != null &&
                            <View style={styles.verticalMarginSmall}>
                                <Text>Calories: { this.props.nutritionalInformation.calories ?? 0 }</Text>
                                <Text>Protein: { this.props.nutritionalInformation.proteinGrams ?? 0 }g</Text>
                                <Text>Fat: { this.props.nutritionalInformation.fatGrams ?? 0 }g</Text>
                                <Text>Carbs: { this.props.nutritionalInformation.carbGrams ?? 0 }g</Text>
                            </View>
                    }
                    <View>
                        <Text style={styles.h2}>Method</Text>
                        {this.getMethod()}
                    </View>
                    <View style={styles.verticalMarginSmall}>
                        <Text style={styles.h2}>Categories</Text>
                        {this.getCategoryList()}
                    </View>
                </ScrollView>
            </View>
        );
    }

    private getIngredientList(): JSX.Element[] {
        return this.state.recipe.ingredients.map((ingredient, key) => <IngredientDisplay key={key} ingredient={ingredient} />);
    }

    private getMethod(): JSX.Element[] {
        return this.state.recipe.method.steps.map(
            (step: string, key: number) => <Text key={"step-" + key}>{(key+1) + ". " + step}</Text>
        );
    }

    private getCategoryList(): JSX.Element {
        return <Text>{this.state.recipe.categories.map(x => x.name).join(", ")}</Text>
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ViewIndividualRecipe));

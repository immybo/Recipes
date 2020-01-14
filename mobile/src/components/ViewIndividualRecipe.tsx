import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Recipe } from '../model/Recipe';
import { AppState } from '../reducers/Reducers';
import RecipeComponent from './shared/RecipeCompactDisplay';
import { withNavigation, ScrollView } from 'react-navigation';
import IngredientDisplay from './shared/IngredientDisplay';
import { styles } from '../style/Style';

interface ViewIndividualRecipeProps extends React.Props<ViewIndividualRecipe> {
    navigation: any
}

interface ViewIndividualRecipeState {
    recipe: Recipe
}

const mapStateToProps = (state: AppState) => {
    return {};
}

class ViewIndividualRecipe extends React.Component<ViewIndividualRecipeProps, ViewIndividualRecipeState> {
    constructor(props: ViewIndividualRecipeProps) {
        super(props);

        this.state = {
            recipe: this.props.navigation.getParam("recipe", null)
        };
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

export default withNavigation(connect(mapStateToProps)(ViewIndividualRecipe));

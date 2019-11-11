import React from 'react';
import {
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Text
} from 'react-native';
import { Ingredient, getBlankIngredient } from '../../model/Ingredient';
import IngredientInput from './../shared/IngredientInput';
import { Recipe } from '../../model/Recipe';
import { ScrollView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Category, getBlankCategory } from '../../model/Category';
import { styles } from '../../style/Style';

interface RecipeInputProps extends React.Props<RecipeInput> {
    initialRecipe: Recipe,
    submitRecipe: (recipe: Recipe) => void
}

interface RecipeInputState {
    recipeName: string,
    recipeDescription: string,
    ingredients: Ingredient[],
    categories: Category[]
}

export default class RecipeInput extends React.Component<RecipeInputProps, RecipeInputState> {
    constructor(props: RecipeInputProps) {
        super(props);

        this.state = {
            recipeName: props.initialRecipe.name,
            recipeDescription: props.initialRecipe.description,
            ingredients: props.initialRecipe.ingredients,
            categories: props.initialRecipe.categories
        };
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View>
                    <TextInput style={styles.h1} placeholder="Recipe Name" defaultValue={this.props.initialRecipe.name} onChangeText={(text) => this.onRecipeNameChange(text)} />
                    <TextInput style={styles.sideMarginSmall} placeholder="Recipe Description" defaultValue={this.props.initialRecipe.description} onChangeText={(text) => this.onRecipeDescriptionChange(text)} />
                    <Text style={styles.h1}>Ingredients</Text>
                    {this.getIngredientInputList()}
                    <TouchableHighlight onPress={(event) => this.addNewIngredient()}>
                        <View style={styles.rightButton}>
                            <Icon name="plus" size={20} color="black" />
                        </View>
                    </TouchableHighlight>
                    <Text style={styles.h1}>Categories</Text>
                    {this.getCategoryList()}
                    <TouchableHighlight onPress={(event) => this.addNewCategory()}>
                        <View style={styles.rightButton}>
                            <Icon name="plus" size={20} color="black" />
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.bottomButtonContainer}>
                    <Button title="Submit Recipe" onPress={(event) => this.submitRecipe()}>Submit Recipe</Button>
                </View>
            </ScrollView>
            </View>
        );
    }

    private getIngredientInputList(): JSX.Element[] {
        return this.state.ingredients.map(
            (ingredient: Ingredient, key: number) => <IngredientInput ingredient={ingredient} key={"ingredient-" + key} onChangeIngredient={(newIngredient) => this.onChangeIngredient(newIngredient, key)} />
        );
    }

    private getCategoryList(): JSX.Element[] {
        return this.state.categories.map(
            (category: Category, key: number) => <TextInput style={styles.rowLayout} defaultValue={category.name} placeholder="Category Name" key={"category-" + key} onChangeText={(text) => this.onCategoryTextChange(text, key)} />
        );
    }

    private addNewIngredient(): void {
        this.setState({ ingredients: this.state.ingredients.concat(getBlankIngredient()) });
    }

    private addNewCategory(): void {
        this.setState({ categories: this.state.categories.concat(getBlankCategory()) });
    }

    private onRecipeNameChange(newName: string): void {
        this.setState({ recipeName: newName });
    }

    private onRecipeDescriptionChange(newDescription: string) {
        this.setState({ recipeDescription: newDescription });
    }

    private onChangeIngredient(ingredient: Ingredient, index: number) {
        this.setState({ ingredients: [...this.state.ingredients.slice(0, index), ingredient, ...this.state.ingredients.slice(index + 1)] });
    }

    private onCategoryTextChange(newText: string, index: number) {
        this.setState({ categories: [...this.state.categories.slice(0, index), { ...this.state.categories[index], name: newText }, ...this.state.categories.slice(index + 1)] });
    }

    private submitRecipe(): void {
        let recipe: Recipe = this.buildRecipe();
        this.props.submitRecipe(recipe);
    }

    private buildRecipe(): Recipe {
        return {
            id: this.props.initialRecipe.id,
            name: this.state.recipeName,
            description: this.state.recipeDescription,
            ingredients: this.state.ingredients.filter((ingredient: Ingredient) => this.isValidIngredient(ingredient)),
            categories: this.state.categories
        };
    }

    private isValidIngredient(ingredient: Ingredient): boolean {
        return ingredient.name != null && ingredient.name.length > 0;
    }
}

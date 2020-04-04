import React from 'react';
import {
    View,
    Button,
    TouchableOpacity,
    Text
} from 'react-native';
import { IngredientWithQuantity, getBlankIngredient } from '../../model/IngredientWithQuantity';
import IngredientSelect from './IngredientSelect';
import { Recipe } from '../../model/Recipe';
import { ScrollView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Category, getBlankCategory } from '../../model/Category';
import { styles } from '../../style/Style';
import CustomTextInput from './CustomTextInput';
import { Method } from '../../model/Method';
import { Ingredient } from '../../model/Ingredient';

interface RecipeInputProps extends React.Props<RecipeInput> {
    initialRecipe: Recipe,
    allIngredients: Ingredient[],
    submitRecipe: (recipe: Recipe) => void
}

interface RecipeInputState {
    recipeName: string,
    recipeDescription: string,
    ingredients: IngredientWithQuantity[],
    categories: Category[],
    method: Method
}

export default class RecipeInput extends React.Component<RecipeInputProps, RecipeInputState> {
    constructor(props: RecipeInputProps) {
        super(props);

        this.state = {
            recipeName: props.initialRecipe.name,
            recipeDescription: props.initialRecipe.description,
            ingredients: props.initialRecipe.ingredients,
            categories: props.initialRecipe.categories,
            method: props.initialRecipe.method
        };
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View>
                        <CustomTextInput style={styles.h1} placeholder="Recipe Name" defaultValue={this.props.initialRecipe.name} onChangeText={(text) => this.onRecipeNameChange(text)} />
                        <CustomTextInput style={styles.verticalMarginSmall} multiline={true} placeholder="Recipe Description" defaultValue={this.props.initialRecipe.description} onChangeText={(text) => this.onRecipeDescriptionChange(text)} />
                        
                        <View style={styles.rowLayout}>
                            <Text style={[styles.h1, styles.verticalMarginSmall]}>Ingredients</Text>
                            <TouchableOpacity onPress={(event) => this.addNewIngredient()}>
                                <View style={[styles.rightAlign, styles.verticalMarginSmall]}>
                                    <Icon name="plus" size={20} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {this.getIngredientInputList()}

                        <View style={styles.rowLayout}>
                            <Text style={[styles.h1, styles.verticalMarginSmall]}>Method</Text>
                            <TouchableOpacity onPress={(event) => this.addNewStep()}>
                                <View style={[styles.rightAlign, styles.verticalMarginSmall]}>
                                    <Icon name="plus" size={20} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {this.getMethodStepList()}

                        <View style={styles.rowLayout}>
                            <Text style={[styles.h1, styles.verticalMarginSmall]}>Categories</Text>
                            <TouchableOpacity onPress={(event) => this.addNewCategory()}>
                                <View style={[styles.rightAlign, styles.verticalMarginSmall]}>
                                    <Icon name="plus" size={20} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {this.getCategoryList()}
                    </View>
                    <View style={[styles.topMargin]}>
                        <Button title="Submit Recipe" onPress={(event) => this.submitRecipe()}>Submit Recipe</Button>
                    </View>
                </ScrollView>
            </View>
        );
    }

    private getIngredientInputList(): JSX.Element[] {
        return this.state.ingredients.map(
            (ingredient: IngredientWithQuantity, key: number) => <IngredientSelect allIngredients={this.props.allIngredients} ingredient={ingredient} key={"ingredient-" + key} onChangeIngredient={(newIngredient) => this.onChangeIngredient(newIngredient, key)} />
        );
    }

    private getMethodStepList(): JSX.Element[] {
        return this.state.method.steps.map(
            (step: string, key: number) => 
                <View style={styles.rowLayout} key={"step-" + key}>
                    <Text style={{"flex": 0.1}}>{(key+1) + ". "}</Text>
                    <CustomTextInput style={{"flex": 0.9}} multiline={true} defaultValue={step} placeholder={"Step " + key} onChangeText={(text) => this.onMethodStepTextChange(text, key)} />
                </View>
        );
    }

    private getCategoryList(): JSX.Element[] {
        return this.state.categories.map(
            (category: Category, key: number) => <CustomTextInput defaultValue={category.name} placeholder="Category Name" key={"category-" + key} onChangeText={(text) => this.onCategoryTextChange(text, key)} />
        );
    }

    private addNewIngredient(): void {
        this.setState({ ingredients: this.state.ingredients.concat(getBlankIngredient()) });
    }

    private addNewCategory(): void {
        this.setState({ categories: this.state.categories.concat(getBlankCategory()) });
    }

    private addNewStep(): void {
        this.setState({ method: { ...this.state.method, steps: this.state.method.steps.concat("") }});
    }

    private onRecipeNameChange(newName: string): void {
        this.setState({ recipeName: newName });
    }

    private onRecipeDescriptionChange(newDescription: string) {
        this.setState({ recipeDescription: newDescription });
    }

    private onChangeIngredient(ingredient: IngredientWithQuantity, index: number) {
        this.setState({ ingredients: [...this.state.ingredients.slice(0, index), ingredient, ...this.state.ingredients.slice(index + 1)] });
    }

    private onMethodStepTextChange(newText: string, index: number) {
        this.setState({ method: {...this.state.method, steps: [...this.state.method.steps.slice(0, index), newText, ...this.state.method.steps.slice(index + 1)]}});
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
            ingredients: this.state.ingredients.filter((ingredient: IngredientWithQuantity) => this.isValidIngredient(ingredient)),
            categories: this.state.categories,
            method: this.state.method
        };
    }

    private isValidIngredient(ingredient: IngredientWithQuantity): boolean {
        return ingredient.ingredient.name != null && ingredient.ingredient.name.length > 0;
    }
}

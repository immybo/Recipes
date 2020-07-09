import React from 'react';
import {
    View,
    Button,
    TouchableOpacity,
    Text,
    Keyboard,
    ScrollView
} from 'react-native';
import { IngredientWithQuantity, getBlankIngredientWithQuantity } from '../../model/IngredientWithQuantity';
import IngredientSelect from './IngredientSelect';
import { Recipe } from '../../model/Recipe';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Category, getBlankCategory } from '../../model/Category';
import { styles } from '../../style/Style';
import CustomTextInput from './CustomTextInput';
import { Method } from '../../model/Method';
import { Ingredient, getBlankIngredient } from '../../model/Ingredient';
import IngredientInput from './IngredientInput';
import { IngredientNutrition } from '../../model/IngredientNutrition';
import { QuantityUnit } from '../../model/QuantityUnit';
import ValidationContainer from './ValidationContainer';
import Form from './Form';
import { PositiveOrZero } from '../../util/ValidationRules';
import { Numbers } from '../../util/Regex';

interface RecipeInputProps extends React.Props<RecipeInput> {
    initialRecipe: Recipe,
    allIngredients: Ingredient[],
    allRecipes: Recipe[],
    submitRecipe: (recipe: Recipe) => void,
    submitIngredient: (ingredient: Ingredient, nutrition: IngredientNutrition) => void,
    submitIngredientWithoutNutrition: (ingredient: Ingredient) => void
}

interface RecipeInputState {
    recipeName: string,
    recipeDescription: string,
    ingredients: IngredientWithQuantity[],
    categories: Category[],
    method: Method,
    isInputtingIngredient: boolean,
    ingredientInputKey: number,
    ingredientWaitingToAdd?: Ingredient,
    numInvalidInputs: number,
    numberOfServings: number
}

export default class RecipeInput extends React.Component<RecipeInputProps, RecipeInputState> {
    constructor(props: RecipeInputProps) {
        super(props);

        this.state = {
            recipeName: props.initialRecipe.name,
            recipeDescription: props.initialRecipe.description,
            ingredients: props.initialRecipe.ingredients,
            categories: props.initialRecipe.categories,
            method: props.initialRecipe.method,
            isInputtingIngredient: false,
            ingredientInputKey: -1, 
            numInvalidInputs: 0,
            numberOfServings: 1
        };
    }

    public componentDidUpdate(): void {
        // If we just added an ingredient and we've got the ID back from the server, fill it in
        if (this.state.ingredientInputKey >= 0 && this.state.ingredientWaitingToAdd != null) {
            let waitingToAdd: Ingredient = this.state.ingredientWaitingToAdd;
            let matchingIngredients: Ingredient[] = this.props.allIngredients.filter(ingredient => ingredient.name === waitingToAdd.name);
            if (matchingIngredients.length > 0) {
                waitingToAdd.id = matchingIngredients[0].id;
                this.setState({ ingredientWaitingToAdd: undefined, ingredients: [...this.state.ingredients.slice(0, this.state.ingredientInputKey), this.convertToIngredientWithQuantity(waitingToAdd), ...this.state.ingredients.slice(this.state.ingredientInputKey + 1)] });
            }
        }
    }

    public render(): JSX.Element {
        if (this.state.isInputtingIngredient) {
            return <IngredientInput initialIngredient={getBlankIngredient()}
                submitIngredientWithoutNutrition={ingredient => this.submitIngredientWithoutNutrition(ingredient)}
                submitIngredient={(ingredient, nutrition) => this.submitIngredient(ingredient, nutrition)}
                allIngredients={this.props.allIngredients} />
        } else {
            return this.getRecipeInput();
        }
    }

    private getRecipeInput(): JSX.Element {
        let nameErrors = React.createRef<ValidationContainer>();
        let numServingsErrors = React.createRef<ValidationContainer>();

        return (
            <Form style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps={"handled"}>
                    <View>
                        <CustomTextInput
                            style={styles.h1}
                            placeholder="Recipe Name"
                            value={this.state.recipeName}
                            onChangeText={(text) => this.onRecipeNameChange(text)}
                            validationRules={[
                                { rule: (name: string) => name.length == 0 || this.recipeNameIsUnique(name), errorMessage: _ => "A recipe with this name already exists."},
                                { rule: (name: string) => name.length > 0, errorMessage: _ => "Name must not be empty."}
                            ]} 
                            validationContainer={nameErrors}
                            onValidChange={isValid => this.updateValid(isValid) } />
                        <ValidationContainer ref={nameErrors} />
                        <CustomTextInput style={styles.verticalMarginSmall} multiline={true} placeholder="Recipe Description" value={this.state.recipeDescription} onChangeText={(text) => this.onRecipeDescriptionChange(text)} />

                        <View style={styles.rowWithoutJustify}>
                            <Text>Makes </Text>
                            <CustomTextInput
                                keyboardType="numeric"
                                onChangeText={(newQuantity) => this.updateNumberOfServings(newQuantity)}
                                placeholder={"0"}
                                defaultValue={this.state.numberOfServings ? this.state.numberOfServings.toString() : "1"}
                                maxLength={10}
                                validationRules={[ PositiveOrZero ]}
                                validationContainer={numServingsErrors}
                                onValidChange={isValid => this.updateValid(isValid) } />
                            <Text> servings</Text>
                        </View>
                        <ValidationContainer ref={numServingsErrors} />
                        
                        <View style={styles.rowLayout}>
                            <Text style={[styles.h1, styles.verticalMarginSmall]}>Ingredients</Text>
                            <TouchableOpacity onPress={(event) => { Keyboard.dismiss(); this.addNewIngredient()}}>
                                <View style={[styles.rightAlign, styles.verticalMarginSmall]}>
                                    <Icon name="plus" size={35} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {this.getIngredientInputList()}

                        <View style={styles.rowLayout}>
                            <Text style={[styles.h1, styles.verticalMarginSmall]}>Method</Text>
                            <TouchableOpacity onPress={(event) => { Keyboard.dismiss(); this.addNewStep()}}>
                                <View style={[styles.rightAlign, styles.verticalMarginSmall]}>
                                    <Icon name="plus" size={35} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {this.getMethodStepList()}

                        <View style={[styles.rowLayout]}>
                            <Text style={[styles.h1, styles.verticalMarginSmall]}>Categories</Text>
                            <TouchableOpacity onPress={(event) => {Keyboard.dismiss(); this.addNewCategory()}}>
                                <View style={[styles.rightAlign, styles.verticalMarginSmall]}>
                                    <Icon name="plus" size={35} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {this.getCategoryList()}
                    </View>
                    <View style={[styles.topMargin]}>
                        <Button title="Submit Recipe" onPress={(event) => { Keyboard.dismiss(); this.submitRecipe()}} disabled={this.state.numInvalidInputs > 0}>Submit Recipe</Button>
                    </View>
                </ScrollView>
            </Form>);
    }

    private recipeNameIsUnique(name: string): boolean {
        return !this.props.allRecipes.some(recipe => recipe.name == name);
    }

    private updateValid(isValid: boolean): void {
        if (isValid) {
            this.setState(state => { return { ...state, numInvalidInputs: state.numInvalidInputs - 1 }});
        } else {
            this.setState(state => { return { ...state, numInvalidInputs: state.numInvalidInputs + 1 }});
        }
    }

    private getIngredientInputList(): JSX.Element[] {
        return this.state.ingredients.map(
            (ingredient: IngredientWithQuantity, key: number) =><IngredientSelect onValidChange={isValid => this.updateValid(isValid)} allIngredients={this.props.allIngredients} ingredient={ingredient} key={"ingredient-" + key} onChangeIngredient={(newIngredient) => this.onChangeIngredient(newIngredient, key)} goToIngredientInput={() => this.switchToIngredientInput(key)} />
        );
    }
    
    private switchToIngredientInput(key: number): void {
        this.setState({ isInputtingIngredient: true, ingredientInputKey: key });
    }

    private switchToRecipeInput(): void {
        this.setState({ isInputtingIngredient: false });
    }

    private submitIngredient(ingredient: Ingredient, nutrition: IngredientNutrition): void {
        this.props.submitIngredient(ingredient, nutrition);
        this.setState({ ingredientWaitingToAdd: ingredient });
        this.switchToRecipeInput();
    }

    private submitIngredientWithoutNutrition(ingredient: Ingredient): void {
        this.props.submitIngredientWithoutNutrition(ingredient);
        this.setState({ ingredientWaitingToAdd: ingredient });
        this.switchToRecipeInput();
    }

    private convertToIngredientWithQuantity(ingredient: Ingredient): IngredientWithQuantity {
        return {
            ingredient: ingredient,
            quantity: {
                amount: 0,
                unit: QuantityUnit.None
            }
        };
    }

    private getMethodStepList(): JSX.Element[] {
        return this.state.method.steps.map(
            (step: string, key: number) => 
                <View style={styles.rowLayout} key={"step-" + key}>
                    <Text style={{"flex": 0.1}}>{(key+1) + ". "}</Text>
                    <CustomTextInput style={{"flex": 0.9}} multiline={true} blurOnSubmit={true} returnKeyType={"done"} defaultValue={step} placeholder={"Step " + (key+1)} onChangeText={(text) => this.onMethodStepTextChange(text, key)} />
                </View>
        );
    }

    private getCategoryList(): JSX.Element[] {
        return this.state.categories.map(
            (category: Category, key: number) => <CustomTextInput style={{"flex": 0.3}} defaultValue={category.name} placeholder="Category Name" key={"category-" + key} onChangeText={(text) => this.onCategoryTextChange(text, key)} />
        );
    }

    private addNewIngredient(): void {
        this.setState({ ingredients: this.state.ingredients.concat(getBlankIngredientWithQuantity()) });
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

    private updateNumberOfServings(newNumber: string) {
        if (Numbers.test(newNumber)) {
            this.setState({ numberOfServings: Number(newNumber) });
        }
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
            categories: this.state.categories.filter((category: Category) => category.name.length > 0),
            method: { ...this.state.method, steps: this.state.method.steps.filter((step: string) => step.length > 0)},
            numberOfServings: this.state.numberOfServings
        };
    }

    private isValidIngredient(ingredient: IngredientWithQuantity): boolean {
        return ingredient.ingredient.name != null && ingredient.ingredient.name.length > 0 && this.state.numberOfServings > 0;
    }
}

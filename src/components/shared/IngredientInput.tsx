import React from 'react';
import {
  TextInput, View
} from 'react-native';
import { Ingredient } from '../../model/Ingredient';

interface IngredientInputProps extends React.Props<IngredientInput> {
  ingredient: Ingredient,
  onChangeIngredient: (ingredient: Ingredient) => void
}

class IngredientInput extends React.Component<IngredientInputProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <View>
        <TextInput onChangeText={(newText) => this.updateIngredientName(newText)} placeholder={ "Ingredient Name" } />
        <TextInput keyboardType="numeric" onChangeText={(newQuantity) => this.updateIngredientQuantity(newQuantity)} placeholder={ "Quantity" } />
      </View>
    );
  }

  private updateIngredientName(newText: string): void {
    this.props.onChangeIngredient({
      ...this.props.ingredient,
      name: newText
    });
  }

  private updateIngredientQuantity(newQuantity: string) {
    this.props.onChangeIngredient({
      ...this.props.ingredient,
      quantity: { quantity: Number(newQuantity) }
    });
  }
}

export default IngredientInput;

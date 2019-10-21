import React from 'react';
import {
  TextInput
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
        <TextInput onChangeText={(newText) => this.updateIngredientName(newText)} placeholder={ this.props.ingredient.name == null ? this.props.ingredient.name : "" } />
    );
  }

  private updateIngredientName(newText: string): void {
    this.props.onChangeIngredient({
      ...this.props.ingredient,
      name: newText
    });
  }
}

export default IngredientInput;

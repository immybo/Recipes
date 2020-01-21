import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { IngredientWithQuantity } from '../../model/IngredientWithQuantity';
import { styles } from '../../style/Style';
import { QuantityFormatter } from '../../util/QuantityFormatter';

interface IngredientDisplayProps {
    ingredient: IngredientWithQuantity
}

class IngredientDisplay extends React.Component<IngredientDisplayProps, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={styles.rowLayout}>
                <Text>{this.props.ingredient.ingredient.name}</Text>
                <Text>{QuantityFormatter.format(this.props.ingredient.quantity)}</Text>
            </View>
        );
    }
}

export default IngredientDisplay;

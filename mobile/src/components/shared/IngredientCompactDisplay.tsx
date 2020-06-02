import React from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { styles } from '../../style/Style';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ingredient } from '../../model/Ingredient';

interface IngredientCompactDisplayProps {
    ingredient: Ingredient,
    onClick?: (ingredient: Ingredient) => void,
    onEdit?: (ingredient: Ingredient) => void,
    onDelete?: (ingredient: Ingredient) => void
}

class IngredientCompactDisplay extends React.Component<IngredientCompactDisplayProps, any> {
    constructor(props: IngredientCompactDisplayProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <TouchableOpacity onPress={(event) => { if (this.props.onClick != null) { this.props.onClick(this.props.ingredient)}}}>
                <View style={styles.rowLayout}>
                    <Text style={styles.largeText}>{this.props.ingredient.name}</Text>
                    <View style={styles.rowRightButton}>
                        { this.props.onEdit != null &&
                            <TouchableOpacity style={styles.marginSmall} onPress={(event) => { if (this.props.onEdit != null) { this.props.onEdit(this.props.ingredient)}}}>
                                <Icon name="edit" size={30} color="black" />
                            </TouchableOpacity>
                        }
                        { this.props.onDelete != null &&
                            <TouchableOpacity style={styles.marginSmall} onPress={(event) => { if (this.props.onDelete != null) { this.props.onDelete(this.props.ingredient)}}}>
                                <Icon name="trash" size={30} color="black" />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default IngredientCompactDisplay;

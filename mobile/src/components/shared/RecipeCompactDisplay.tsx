import React from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { Recipe } from '../../model/Recipe';
import { styles } from '../../style/Style';
import Icon from 'react-native-vector-icons/FontAwesome';

interface RecipeCompactDisplayProps {
    recipe: Recipe,
    onClick?: (recipe: Recipe) => void,
    onEdit?: (recipe: Recipe) => void,
    onDelete?: (recipe: Recipe) => void
}

class RecipeCompactDisplay extends React.Component<RecipeCompactDisplayProps, any> {
    constructor(props: RecipeCompactDisplayProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <TouchableOpacity onPress={(event) => { if (this.props.onClick != null) { this.props.onClick(this.props.recipe)}}}>
                <View style={styles.rowLayout}>
                    <Text style={styles.largeText}>{this.props.recipe.name}</Text>
                    <View style={styles.rowRightButton}>
                        { this.props.onEdit != null &&
                            <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} style={styles.marginSmall} onPress={(event) => { if (this.props.onEdit != null) { this.props.onEdit(this.props.recipe)}}}>
                                <Icon name="edit" size={30} color="black" />
                            </TouchableOpacity>
                        }
                        { this.props.onDelete != null &&
                            <TouchableOpacity style={styles.marginSmall} onPress={(event) => { if (this.props.onDelete != null) { this.props.onDelete(this.props.recipe)}}}>
                                <Icon name="trash" size={30} color="black" />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default RecipeCompactDisplay;

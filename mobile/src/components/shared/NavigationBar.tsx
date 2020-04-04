import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../../style/Style";
import { RouteAddRecipe, RouteAddIngredient, RouteMealPlanner } from "../../Routes";
import Icon from "react-native-vector-icons/FontAwesome";

interface NavigationBarProps extends React.Props<NavigationBar> {
    navigate: (route: string) => void
}

interface NavigationBarState {
}

export default class NavigationBar extends React.Component<NavigationBarProps, NavigationBarState> {
    constructor(props: NavigationBarProps) {
        super(props);

        this.state = {
        };
    }

    public render(): JSX.Element {
        return (
            <View style={styles.rowLayout}>
                <TouchableOpacity onPress={_ => this.props.navigate(RouteMealPlanner)}>
                    <View style={[styles.centerAlign, styles.verticalMarginSmall]}>
                        <Icon name="calendar" size={40} color="black" />
                        <Text>Meal Planner</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={_ => this.props.navigate(RouteAddRecipe)}>
                    <View style={[styles.centerAlign, styles.verticalMarginSmall]}>
                        <Icon name="plus-circle" size={40} color="black" />
                        <Text>Add Recipe</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={_ => this.props.navigate(RouteAddIngredient)}>
                    <View style={[styles.centerAlign, styles.verticalMarginSmall]}>
                        <Icon name="plus-circle" size={40} color="black" />
                        <Text>Add Ingredient</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
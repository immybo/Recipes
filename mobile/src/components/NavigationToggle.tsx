import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "../style/Style";

export default (props) => {
    return (
        <View style={[styles.bottomMargin, styles.rowWithoutJustify,
            {
                backgroundColor: "#FFFFFF",
                elevation: 5,
                padding: 12
            }]}>
            <TouchableOpacity onPress={_ => props.navigation.toggleDrawer()}>
                <Icon name="bars" size={35} color="black" />
            </TouchableOpacity>
            <View style={styles.horizontalMargin}>
                <Text style={styles.h1}>{ props.pageTitle ?? "" }</Text>
            </View>
        </View>
    );
}
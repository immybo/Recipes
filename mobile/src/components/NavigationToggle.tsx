import { DrawerNavigationProp } from "@react-navigation/drawer";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { styles } from "../style/Style";
import { Colors } from "../style/Colors";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";

interface NavigationToggleProps {
    pageTitle: string,
    stackNavigation?: StackNavigationProp<ParamListBase>,
    drawerNavigation?: DrawerNavigationProp<any, any>
}

export default class NavigationToggle extends React.Component<NavigationToggleProps, any> {
    constructor(props: NavigationToggleProps) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <View style={{
                    backgroundColor: Colors.Charcoal,
                    elevation: 5,
                    padding: 12
                }}>
                { this.props.drawerNavigation != null &&
                    <TouchableOpacity onPress={_ => this.props.drawerNavigation?.toggleDrawer()}>
                        <Icon name="bars" size={35} color={Colors.Cultured}/>
                    </TouchableOpacity>
                }
                { this.props.stackNavigation != null &&
                    <TouchableOpacity onPress={_ => this.props.stackNavigation?.goBack()}>
                        <Icon name="arrow-left" size={35} color={Colors.Cultured}/>
                    </TouchableOpacity>
                }
                <View style={{ position: "absolute", alignItems: "center", alignSelf: "center", marginTop: 15 }}>
                    <Text style={[styles.textHeaderLight, styles.largeText]}>{ this.props.pageTitle ?? "" }</Text>
                </View>
            </View>
        );
    }
}
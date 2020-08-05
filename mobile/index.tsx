/**
 * @format
 */

import {AppRegistry, YellowBox} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { store } from './src/reducers/Reducers';
import React from 'react';
import { Provider } from 'react-redux';

AppRegistry.registerComponent(appName, () => Index);

YellowBox.ignoreWarnings(['VirtualizedList: missing keys for items, make sure to specify a key or id property on each item or provide a custom keyExtractor.', 'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.'])

class Index extends React.Component<any, any> {
    public render(): JSX.Element {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}
import React from 'react';
import {
  Text
} from 'react-native';
import { Quantity } from '../../model/Quantity';

interface QuantityDisplayProps {
  quantity: Quantity
}

class QuantityDisplay extends React.Component<QuantityDisplayProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
        <Text>{this.props.quantity.amount.toString()} {this.props.quantity.unit.toString()}</Text>
    );
  }
}

export default QuantityDisplay;

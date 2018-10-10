import React, { Component } from 'react';
import { Content, Grid, Col, Spinner } from "native-base";
import { WarmGray1, Teal } from '../colors';

export class Loading extends Component {
    render() {
        return (<Content contentContainerStyle={{ flex: 1 }} style={{ padding: 10, backgroundColor: WarmGray1  }}>
          <Grid style={{ alignItems: 'center' }}>
            <Col>
              <Spinner color={Teal} />
            </Col>
          </Grid>
        </Content>);
      }
}
export default Loading
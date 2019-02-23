import React from 'react';
import { connect } from 'react-redux';
import { updateStyle, resetStyle } from '../../actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TwitterPicker } from 'react-color';
import { fetchTranscript } from '../Dashboard/downloadTranscript';
import {
  Card,
  CardTitle,
  CardText,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
  UncontrolledDropdown,
  Button,
} from 'reactstrap';
import './index.css';

const mapStateToProps = state => {
  return {
    style: state.aloft_localstorage.style,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateStyle: (style) => dispatch(updateStyle(style)),
    resetStyle: () => dispatch(resetStyle()),
  };
};

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.onStyleChange = this.onStyleChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onBackgroundColorChange = this.onBackgroundColorChange.bind(this);
  }

  onColorChange(e) {
    let stylePayload = {
      id: 'color',
    };

    stylePayload.value = e.hex;
    return this.props.updateStyle(stylePayload);
  }

  onBackgroundColorChange(e) {
    let stylePayload = {
      id: 'backgroundColor',
    };

    stylePayload.value = e.hex;
    return this.props.updateStyle(stylePayload);
  }

  onStyleChange(e) {
    let stylePayload = {};
    let val;

    stylePayload.id = e.target.id;

    if (e.target.id === 'fontSize' || 'lineHeight' || 'margin') {
      val = Math.abs(e.target.value);
      if (e.target.value && e.target.value > -1 && e.target.value < 100) {
        val += 'em';
      } else {
        val = '1em';
      }
    }

    if (e.target.id === 'fontFamily') {
      val = e.target.value;
    }

    if (e.target.id === 'textShadow') {
      if (e.target.checked) {
        val = '2px 2px #474a4f';
      } else {
        val = 'unset';
      }
    }

    if (e.target.id === 'textTransform') {
      if (e.target.checked) {
        val = 'uppercase';
      } else {
        val = 'unset';
      }
    }

    stylePayload.value = val;
    return this.props.updateStyle(stylePayload);
  }

  render() {
    const { visibility, job } = this.props;
    library.add(faTimes);

    const {
            backgroundColor,
            color,
            fontSize,
            lineHeight,
            textTransform,
            textShadow,
            fontFamily,
          } = this.props.style;

    const { handleOpenMenu } = this.props;

    return (
      <div>
        {
          visibility
            ? <div className="flyoutMenu">
              <Container fluid className="mt-4">
                <Button type="button" className="close" aria-label="Close" onClick={ () => handleOpenMenu() }>
                  <span aria-hidden="true">&times;</span>
                </Button>
                <Row>
                  <Col lg={ 4 } sm={ 12 }>
                    <Card body className="no-bg">
                      <CardTitle>"{ job.title ? job.title : job.slug }"</CardTitle>
                      <CardText>
                        Speakers: <em>{ job.speakers ? job.speakers : 'None designated' }</em>
                        <br />
                        <br />
                      </CardText>
                    </Card>
                    <Card body className="no-bg">
                      <CardTitle>Your Stenographer</CardTitle>
                      <CardText>
                        <em>{ job.userFullName }</em>
                      </CardText>
                    </Card>
                  </Col>
                  <Col lg={ 4 } sm={ 12 }>
                    <Card body className="no-bg">
                      <CardTitle>FONT SETTINGS</CardTitle>
                      <Form>
                        <FormGroup row>
                          <Label for="fontFamily" sm={ 6 }>Font family</Label>
                          <Col sm={ 6 }>
                            <UncontrolledDropdown size="lg">
                              <DropdownToggle color="primary" caret block style={ { fontFamily: fontFamily } }>
                                { fontFamily.split(',')[0] }
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem style={ { fontFamily: 'Comfortaa, sansSerif' } }
                                              id="fontFamily"
                                              value="Comfortaa, sansSerif"
                                              onClick={ e => this.onStyleChange(e) }>Comfortaa</DropdownItem>
                                <DropdownItem style={ { fontFamily: 'Cousine, monospace' } }
                                              id="fontFamily"
                                              value="Cousine, monospace"
                                              onClick={ e => this.onStyleChange(e) }>Cousine</DropdownItem>
                                <DropdownItem style={ { fontFamily: 'Input Mono, sansSerif' } }
                                              id="fontFamily"
                                              value="Montserrat, sansSerif"
                                              onClick={ e => this.onStyleChange(e) }>Montserrat</DropdownItem>
                                <DropdownItem style={ { fontFamily: 'Montserrat, sansSerif' } }
                                              id="fontFamily"
                                              value="Montserrat, sansSerif"
                                              onClick={ e => this.onStyleChange(e) }>Montserrat</DropdownItem>
                                <DropdownItem style={ { fontFamily: 'Nunito, sansSerif' } }
                                              id="fontFamily"
                                              value="Nunito, sansSerif"
                                              onClick={ e => this.onStyleChange(e) }>Nunito</DropdownItem>
                                <DropdownItem style={ { fontFamily: 'Poppins, sansSerif' } }
                                              id="fontFamily"
                                              value="Poppins, sansSerif"
                                              onClick={ e => this.onStyleChange(e) }>Poppins</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem style={ { fontFamily: 'Inconsolata, monospace' } }
                                              id="fontFamily"
                                              value="Inconsolata, monospace"
                                              onClick={ e => this.onStyleChange(e) }>Inconsolata</DropdownItem>
                                <DropdownItem style={ { fontFamily: 'Input Mono, sansSerif' } }
                                              id="fontFamily"
                                              value="Input Mono, sansSerif"
                                              onClick={ e => this.onStyleChange(e) }>Input Mono</DropdownItem>
                                <DropdownItem style={ { fontFamily: 'Input Mono Light, sansSerif' } }
                                              id="fontFamily"
                                              value="Input Mono Light, sansSerif"
                                              onClick={ e => this.onStyleChange(e) }>Input Mono Light</DropdownItem>
                                <DropdownItem style={ { fontFamily: 'Ubuntu Mono, monospace' } }
                                              id="fontFamily"
                                              value="Ubuntu Mono, monospace"
                                              onClick={ e => this.onStyleChange(e) }>Ubuntu Mono</DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </Col>
                        </FormGroup>
                        {/*Font size*/ }
                        <FormGroup row>
                          <Label for="fontSize" sm={ 6 }>Font size</Label>
                          <Col sm={ 6 }>
                            <InputGroup>
                              <Input type="text"
                                     name="fontSize"
                                     id="fontSize"
                                     placeholder="(e.g. 3)"
                                     defaultValue={ fontSize && fontSize.split('em')[0] }
                                     onChange={ e => this.onStyleChange(e) }
                              />
                              <InputGroupAddon addonType="append">em</InputGroupAddon>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        {/*Font size end*/ }
                        {/*Line height*/ }
                        <FormGroup row>
                          <Label for="lineHeight" sm={ 6 }>Line Height</Label>
                          <Col sm={ 6 }>
                            <InputGroup>
                              <Input type="text"
                                     name="lineHeight"
                                     id="lineHeight"
                                     placeholder="(e.g. 1)"
                                     defaultValue={ lineHeight && lineHeight.split('em')[0] }
                                     onChange={ e => this.onStyleChange(e) } />
                              <InputGroupAddon addonType="append">em</InputGroupAddon>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        {/*Line height end*/ }
                        {/*All caps*/ }
                        <FormGroup row>
                          <Label for="textTransform" sm={ 6 } check>All Caps</Label>
                          <Col sm={ 6 }>
                            <Input
                              defaultChecked={ textTransform === 'uppercase' }
                              onChange={ e => this.onStyleChange(e) }
                              type="checkbox"
                              name="textTransform"
                              id="textTransform" />
                          </Col>
                        </FormGroup>
                        {/*All Caps*/ }
                        {/*Drop Shadow*/ }
                        <FormGroup row>
                          <Label for="textShadow" sm={ 6 } check>Text Shadow</Label>
                          <Col sm={ 6 }>
                            <Input
                              defaultChecked={ textShadow === true }
                              onChange={ e => this.onStyleChange(e) }
                              type="checkbox"
                              name="textShadow"
                              id="textShadow" />
                          </Col>
                        </FormGroup>
                      </Form>
                    </Card>
                    <Card body className="no-bg">
                      <CardTitle>Transcript Tools</CardTitle>
                      <Button
                        className="btn btn-primary btn-lg mt-4 mb-4"
                        type="button"
                        size="lg"
                        onClick={ () => fetchTranscript(job.username, job.slug) }>
                        Download Transcript
                      </Button>
                    </Card>
                  </Col>
                  <Col lg={ 4 } sm={ 12 }>
                    <Card body className="no-bg">
                      <CardTitle>Colors</CardTitle>
                      <div>
                        <Label for="textColor" className="mb-2" sm={ 12 }>Text</Label>
                        <TwitterPicker
                          color={ color }
                          colors={ [
                            '#FF6900',
                            '#FCB900',
                            '#ffd460',
                            '#DCE775',
                            '#7BDCB5',
                            '#37D67A',
                            '#00D084',
                            '#DFF1EA',
                            '#E2F4FF',
                            '#D9E3F0',
                            '#8ED1FC',
                            '#40AFBF',
                            '#0693E3',
                            '#ABB8C3',
                            '#F47373',
                            '#F78DA7',
                            '#EB144C',
                            '#D9B5ED',
                            '#9900EF',
                            '#2E2931',
                            '#083358',
                            '#072247',
                            '#635F47',
                            '#666666',
                            '#555555',
                            '#212529',
                            '#fff',
                            '#000'] }
                          id="color"
                          name="color"
                          onChangeComplete={ e => this.onColorChange(e) } />
                      </div>
                      <div className="mt-3">
                        <Label for="backgroundColor" className="mb-2" sm={ 12 }>Background</Label>
                        <TwitterPicker
                          color={ backgroundColor }
                          colors={ [
                            '#FF6900',
                            '#FCB900',
                            '#ffd460',
                            '#DCE775',
                            '#7BDCB5',
                            '#37D67A',
                            '#00D084',
                            '#DFF1EA',
                            '#E2F4FF',
                            '#D9E3F0',
                            '#8ED1FC',
                            '#40AFBF',
                            '#0693E3',
                            '#ABB8C3',
                            '#F47373',
                            '#F78DA7',
                            '#EB144C',
                            '#D9B5ED',
                            '#9900EF',
                            '#2E2931',
                            '#083358',
                            '#072247',
                            '#635F47',
                            '#666666',
                            '#555555',
                            '#212529',
                            '#fff',
                            '#000'] }
                          id="backgroundColor"
                          name="backgroundColor"
                          onChangeComplete={ e => this.onBackgroundColorChange(e) } />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
            : ''
        }
      </div>
    );
  }
}

const TranscriptViewMenu = connect(mapStateToProps, mapDispatchToProps)(Menu);
export default TranscriptViewMenu;


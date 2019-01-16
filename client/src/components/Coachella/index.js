import React from 'react';
import ShareDBBinding from '../ShareDB';
import IntersectionObserver from 'react-intersection-observer';
import IntersectionVisible from 'react-intersection-visible';
import FloatingButtons from '../TranscriptView/FloatingButtons';
import { animateScroll as scroll } from 'react-scroll';
import connection from '../ShareDB/connection';
import {
  Container,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown
} from 'reactstrap';
import PalmTree from '../../assets/images/hero-palm-2.png';
import BgVideoWebM from '../../assets/videos/bg-1000k.webm';
import BgVideoMp4 from '../../assets/videos/bg-1000k.mp4';
import './index.css';

class Coachella extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      menuVisible: false,
      style: {}
    };

    this.scrollDown = this.scrollDown.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
  }

  onScrollToBottom(atBottom) {
    if (!atBottom) {
      this.scrollDown();
    }
  }

  onLoaded() {
    this.setState({
      loading: false
    }, this.scrollDown);
  }

  scrollDown() {
    setTimeout(() => {
      scroll.scrollToBottom({
        delay: 0,
        duration: 200,
        isDynamic: true
      });
    }, 0);

    this.setState({
      menuVisible: false
    });
  }

  componentWillMount() {
    this.doc = connection.get('stanley', 'coachella');
    document.title = 'Coachella 2019 Realtime Captions';
  }

  componentWillUnmount() {
    this.doc.destroy();
  }

  render() {
    console.log(this.doc);
    const style = {
      backgroundColor: '#fff',
      color: '#000',
      fontSize: '3em',
      fontFamily: 'Poppins, sans-serif',
      lineHeight: '1.5em',
      margin: '0',
      textTransform: 'unset'
    };

    return (
      <>
        <NavBar />
        <div className="coachella-contentPanel">
          <Container className="coachella-caption__box" fluid>
          <h2 className="coachella-header">NOW LISTENING TO:</h2>
            <p className="coachella-header__small">Ellie Goulding, Diplo, Swae Lee</p>
            <p className="coachella-header__small">"Close To Me"</p>
          <div className="ResponsiveImage-slot">
            <img src={PalmTree} alt="Palm" />
          </div>
          <div className="liveTranscript"
               onClick={ () => {
                 this.setState({
                   menuVisible: true
                 });
               } }>
            <ShareDBBinding
              cssClass="liveTranscript--text-format"
              style={ style }
              doc={ this.doc }
              onLoaded={ this.onLoaded }
              flag='≈'
              elementType="div" />
          </div>
          <IntersectionObserver
            threshold={ .1 }
            onChange={ state => this.onScrollToBottom(state) }>
            { ({ inView, ref }) => (
              <div ref={ ref }
                   className="liveTranscript--container_observer"
                   style={ { backgroundColor: '#fff' } } />
            ) }
          </IntersectionObserver>
          </Container>
        </div>
        <BgVideo />
      </>
    );
  }
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md" fixed="true">
          <NavbarBrand href="/">
              <CoachellaLogo className="icon icon-coachella_nav" />
          </NavbarBrand>
          <NavbarToggler onClick={ this.toggle } />
          <Collapse isOpen={ this.state.isOpen } navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="#">MUSIC</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">PASSES</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  EXPERIENCE
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    Option 1
                  </DropdownItem>
                  <DropdownItem>
                    Option 2
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Reset
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink href="#">ACCESSIBILITY</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const BgVideo = () =>
  <div className="TheBackground">
    <video autoPlay
           playsInline="true"
           loop="loop"
           muted="muted"
           preload="none"
           aria-label=""
           className="TheBackgroundVideo">
              <source src={BgVideoWebM} type="video/webm" />
              <source src={BgVideoMp4} type="video/mp4" />
    </video>
  </div>;

  const CoachellaLogo = () =>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 90 15"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <path fill="nonzero"
            d="M23.989 1.254c.716-.135.937.407 1.12.95.533 1.57 1.047 3.14 1.525 4.728.238.795.293 1.648.973 2.229-.294.698.183 1.318.22 1.996.019.523.147 1.027.202 1.531.019.233.019.504-.037.736-.036.175-.202.388-.33.407-.147.02-.367-.135-.44-.29-.46-.97-.937-1.938-1.286-2.946-.22-.6-.368-.872-1.066-.736-1.193.252-2.424.31-3.636.523-.238.039-.496.368-.642.62-.368.62-.662 1.318-1.047 1.919-.129.193-.514.387-.698.33-.367-.117-.35-.466-.22-.854.348-1.046.716-2.093.991-3.158.404-1.531.698-3.101 1.084-4.652.165-.678.312-1.356.606-1.996.496-1.162 1.56-1.337 2.681-1.337zm-1.965 6.802c1.102.194 2.075.35 3.214.543-.441-.795-.772-1.473-1.176-2.093-.275-.407-.716-.484-1.028-.058-.367.465-.643.988-1.01 1.608zm35.44-4.831c-.845.113-1.71.208-2.555.36-.846.15-1.104.68-.901 1.588.147.682.607.947 1.397.757.717-.17 1.416-.397 2.115-.548.276-.057.772-.02.846.132.165.378.257.87.165 1.287-.037.208-.496.454-.772.492-.754.094-1.545.094-2.299.132-.956.057-1.268.473-1.03 1.438.185.7.405 1.4.626 2.081.257.795.79 1.117 1.636 1.041.846-.076 1.692-.132 2.52-.246 1.066-.132 1.47.227 1.378 1.362-.073.928-.367 1.25-1.232 1.192a13.069 13.069 0 0 1-2.408-.397c-1.38-.34-2.722-.776-4.1-1.154-.552-.151-.626-.511-.552-1.022.11-.7.184-1.4.33-2.081.13-.662.148-1.23-.422-1.76-.368-.36.018-.7.257-.946.846-.87.828-1.949-.073-2.725-.552-.454-.497-.813.128-1.116 1.361-.681 2.722-1.4 4.1-2.081 1.03-.511 2.06-.095 3.071.113.13.02.295.436.258.644a1.757 1.757 0 0 1-1.857 1.551l-.644-.057c.019 0 .019-.019.019-.037zM86.14 1.242c.402-.077.64.348.804.832.402 1.16.786 2.32 1.17 3.5.293.91.53 1.838.823 2.747a.927.927 0 0 0 .33.464c.328.213.53.406.219.793a.387.387 0 0 0-.037.252c.146.89.293 1.779.457 2.669.018.135.11.27.092.386-.092.33-.238.639-.348.948-.2-.193-.475-.348-.585-.58a49.375 49.375 0 0 1-1.298-2.843c-.165-.406-.238-.658-.805-.58-.73.116-1.48-.02-2.23-.058-1.152-.059-1.975.348-2.414 1.585-.2.6-.603 1.142-.969 1.664-.11.154-.457.29-.567.213-.164-.117-.31-.445-.274-.62.201-.831.512-1.624.732-2.456.457-1.76.895-3.52 1.316-5.28.201-.831.274-1.682.841-2.379.695-.812 1.554-1.16 2.743-1.257zm1.042 7.35c-.549-1.2-.97-2.244-1.481-3.25-.256-.502-.695-.406-.878.136-.292.85-.548 1.702-.84 2.61 1.041.156 2.01.31 3.199.504zM42.499.766c.152.424.305.732.343 1.04.152 1.52.267 3.06.362 4.581.02.366.133.482.515.52.972.058 1.964.116 2.917.327.61.135.762-.077.781-.596.039-1.232.039-2.484.134-3.716.038-.673.21-1.328.324-2.002h.362c.077.347.172.674.21 1.02.153 1.79.267 3.581.4 5.314.477.192.916.365 1.354.539v.25c-.381.134-.744.25-1.22.404.057.693.171 1.444.19 2.194.02.905 0 1.81-.057 2.695-.038.597-.4.944-.991.963-.648.02-.972-.27-.992-1.001-.038-1.367 0-2.734 0-4.081v-.616c-1.163.173-2.306.346-3.374.52v2.926c0 .365 0 .731-.038 1.078-.115.827-.515 1.174-1.278 1.155-.838-.02-1.124-.29-1.22-1.194-.171-2.002.02-3.985.286-5.967.21-1.444.21-2.926.305-4.39.02-.615 0-1.289.687-1.963zM12.26 3.267c-.111-.625.536-1.477 1.182-1.515.832-.056 1.718-.113 2.513.095.462.114.923.7 1.145 1.174.665 1.42 1.146 2.916.942 4.544-.203 1.61-.868 2.972-2.013 4.052-.813.757-1.885.833-2.938.814-1.145 0-1.884-.587-2.55-1.534C8.9 8.493 9.38 5.236 10.71 3.172c.018-.038.11-.038.351-.132-.074.454-.13.814-.203 1.174-.333 1.458-.388 2.896.48 4.222.74 1.155 2.217 1.495 3.362.776a3.457 3.457 0 0 0 1.552-3.503c-.11-.605-.203-1.23-.425-1.798-.498-1.23-1.792-1.629-2.9-.947-.222.095-.443.19-.665.303zM7.848 14.3c-3.21-.21-5.66-1.563-7.236-4.25-.57-.933-.76-1.981-.494-3.2C.555 4.847 1.6 3.247 2.853 1.761c.399-.477.93-.725 1.633-.705.874.019 1.748-.23 2.621-.286.38-.02 1.026.019 1.12.247.229.458-.284.705-.664.896-.627.343-1.253.667-1.842 1.048-1.026.667-2.032 1.315-2.678 2.44-.76 1.333-1.158 2.686-.779 4.21.038.153.057.305.152.438.969 1.525 2.184 2.687 4.084 2.859.683.057 1.367.152 2.032.267.19.038.531.285.512.362-.057.228-.227.514-.436.61-.228.133-.57.114-.76.152zM36.27.3c.51.096 1.02.154 1.494.29.164.038.42.309.383.406a.975.975 0 0 1-.4.541c-.274.155-.602.213-.912.31-2.88.889-4.284 2.957-4.52 5.953-.201 2.34 2.095 4.988 4.046 5.123.656.039 1.312.136 1.95.271.2.039.383.251.583.387-.145.212-.291.618-.455.638-.656.077-1.33.135-1.969 0-2.424-.503-4.338-1.876-5.632-4.137-.602-1.064-.602-2.282-.456-3.441.2-1.508.729-2.939 1.713-4.08.711-.85 1.531-1.643 2.625-1.952.474-.174 1.021-.213 1.55-.31zm32.026 13.53c-.27-.077-.702-.268-1.152-.363-1.17-.229-2.358-.42-3.528-.63-.45-.095-.9-.209-1.35-.362-.126-.038-.306-.228-.306-.343 0-.114.162-.286.288-.362.27-.172.72-.248.828-.496.198-.458.288-1.01.306-1.545.054-1.468.036-2.917.072-4.386.018-.896.018-1.792.054-2.689.018-.515.108-1.01.216-1.506.036-.153.234-.267.36-.382.126.134.324.248.36.42.144.839.252 1.678.342 2.517.198 1.907.36 3.814.558 5.721.036.324.126.649.216.973.27.839 1.044 1.201 1.836.877.27-.114.558-.248.846-.248.468 0 .792.229.792.82 0 .439.072.877.144 1.316.09.439-.162.706-.882.667zm3.614-1.466c.107-.21.16-.458.303-.61.696-.706.803-1.66.839-2.594.054-2.309.018-4.636.018-6.944 0-.381.071-.763.178-1.106.036-.153.25-.344.375-.344.125.02.34.23.357.382.125.706.214 1.412.268 2.117.196 2.194.375 4.388.571 6.581.107 1.088.429 1.355 1.678 1.431.41.02.84.02 1.214.153.607.19 1.16 1.43.928 2.04-.071.172-.392.363-.589.363-2.07-.038-4.016-.687-5.98-1.278a.606.606 0 0 0-.16-.19z" />
    </svg>;


export default Coachella;

// Component for each "particle" or category in menus.
import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardTitle,
} from 'reactstrap';

export const MenuParticle = (props) => {
  const { children,
          title,
        } = props;
  return (
    <Card body className="no-bg">
      { title
        ? <CardTitle>{ title }</CardTitle>
        : '' }
      { children
      ? children
      : '' }
    </Card>
  );
};

MenuParticle.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import labeling from '../../containers/labeling';
import { MenuItems } from './MyAccountMenu.const';

import {
  WrapStyled,
  HeadingStyled,
  ItemsStyled,
  ItemWrapStyled,
  ItemLinkStyled,
  ItemIconWrapStyled,
  ItemLabelStyled
} from './MyAccountMenuStyled';

class MyAccountMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      routeMatch: { url },
      t
    } = this.props;

    return (
      <WrapStyled>
        <HeadingStyled>{t('Category Shortcuts')}</HeadingStyled>
        <ItemsStyled>
          {MenuItems.map(menuItem => (
            <ItemWrapStyled
              key={menuItem.label}
              visibleOnDesktop={menuItem.visibleOnDesktop}
            >
              <ItemLinkStyled to={`${url}/${menuItem.link}`}>
                <ItemIconWrapStyled>
                  {menuItem.icon ? menuItem.icon.render() : null}
                </ItemIconWrapStyled>
                <ItemLabelStyled>{t(menuItem.label)}</ItemLabelStyled>
              </ItemLinkStyled>
            </ItemWrapStyled>
          ))}
        </ItemsStyled>
      </WrapStyled>
    );
  }
}

MyAccountMenu.propTypes = {
  routeMatch: PropTypes.objectOf(PropTypes.any),
  t: PropTypes.func
};

MyAccountMenu.defaultProps = {
  routeMatch: {},
  t: k => k
};

export default withTranslation()(labeling()(MyAccountMenu));

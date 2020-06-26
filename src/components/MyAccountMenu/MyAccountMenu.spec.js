import React from 'react';
import { shallow } from 'enzyme';
import { HeadingStyled, ItemsStyled } from './MyAccountMenuStyled';
import { PureMyAccountMenu } from './MyAccountMenu';

describe('<MyAccountMenu/>', () => {
  const wrapper = shallow(<PureMyAccountMenu />);

  describe('@renders', () => {
    it('should render initial state', () => {
      expect(wrapper.find(HeadingStyled)).toHaveLength(1);
      expect(wrapper.find(ItemsStyled)).toHaveLength(1);
    });
  });
});

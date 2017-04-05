import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import Game , {Square, Board} from '../src/Game';


test('Square value gets rendered', () => {
  const square = shallow(
    <Square value=""/>
  );
  expect(square.text()).toEqual('');

  const squareX = shallow(
    <Square value="X"/>
  );
  expect(squareX.text()).toEqual('X');
});

test('Square on click action gets called', () =>{
  const onClickAction = sinon.spy();

  const square = shallow(
    <Square value="" onClick={onClickAction}/>
  );
  square.find('button').simulate('click');
  expect(onClickAction.calledOnce).toEqual(true);
});


test('Board has 3 rows', ()=>{
  const board = shallow(
    <Board squares={ Array(9).fill(null)} />
  );

  expect(board.find('.board-row').length).toEqual(3);
});

// I use mount instead of shallow in order to child components to get rendered as well
test('Board has 9 squares', ()=>{
  const board = mount(
    <Board squares={ Array(9).fill(null)} />
  );

  expect(board.find('.square').length).toEqual(9);
});

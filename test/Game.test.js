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


////// TESTING THE WHOLE GAME : "Integration tests" //////
test('Can move to a position', () =>{
  const game = mount(
    <Game />
  );
  game.find('button#0').simulate('click');
  expect(game.find('button#0').text()).toEqual('X');
  expect(game.find('.nextPlayer').text()).toEqual("Next player: O");

});

test('Cannot move to a position', () =>{
  const game = mount(
    <Game />
  );
  game.find('button#4').simulate('click');
  game.find('button#4').simulate('click');

  expect(game.find('.errorMessage').text()).toEqual("Position taken");
  expect(game.find('button#4').text()).toEqual('X');
});


test('Cannot move to a position', () =>{
  const game = mount(
    <Game />
  );

  // X plays
  game.find('button#4').simulate('click');

  // O plays
  game.find('button#1').simulate('click');

  // X plays
  game.find('button#0').simulate('click');

  // O plays
  game.find('button#2').simulate('click');

  // X plays : X wins
  game.find('button#8').simulate('click');

  expect(game.find('.winner').text()).toEqual("Winner: X");
  expect(game.find('.games-played').text()).toEqual("Games played so far: 1");
  expect(game.find('.x-won-count').text()).toEqual("X Won Count: 1");
  expect(game.find('.o-won-count').text()).toEqual("O Won Count: 0");
});

test('Cannot play if the game is finished', () =>{
  const game = mount(
    <Game />
  );

  // X plays
  game.find('button#4').simulate('click');

  // O plays
  game.find('button#1').simulate('click');

  // X plays
  game.find('button#0').simulate('click');

  // O plays
  game.find('button#2').simulate('click');

  // X plays : X wins
  game.find('button#8').simulate('click');

  // O tries to play
  game.find('button#7').simulate('click');

  expect(game.find('.errorMessage').text()).toEqual("Game finished");
  expect(game.find('button#7').text()).toEqual('');
});

test('Should be able to start a new round when game finishes', () =>{
  const game = mount(
    <Game />
  );

  // X plays
  game.find('button#4').simulate('click');

  // O plays
  game.find('button#1').simulate('click');

  // X plays
  game.find('button#0').simulate('click');

  // O plays
  game.find('button#2').simulate('click');

  // X plays : X wins
  game.find('button#8').simulate('click');

  // Restart!
  game.find('button#next-round').simulate('click');

  // O can play
  game.find('button#0').simulate('click');

  expect(game.find('button#0').text()).toEqual('O');
});



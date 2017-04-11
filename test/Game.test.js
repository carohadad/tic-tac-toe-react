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

test('Cannot move to a taken position', () =>{
  var boardValues = Array(9).fill(null)
  boardValues[4] = "X"

  const game = mount(
    <Game squares={boardValues}/>
  );
  game.find('button#4').simulate('click');

  expect(game.find('.errorMessage').text()).toEqual("Position taken");
  expect(game.find('button#4').text()).toEqual('X');
});


test('Players can win the game', () =>{

  // X has to values in diagonal
  var boardValues =
    ["X", "O", "O",
    null, "X", null,
    null, null, null];

  const game = mount(
    <Game squares={boardValues}/>
  );

  // X plays and wins the game!
  game.find('button#8').simulate('click');

  expect(game.find('.winner').text()).toEqual("Winner: X");
  expect(game.find('.games-played').text()).toEqual("Games played so far: 1");
  expect(game.find('.x-won-count').text()).toEqual("X Won Count: 1");
  expect(game.find('.o-won-count').text()).toEqual("O Won Count: 0");
});

test('Cannot play if the game is finished', () =>{
  var boardValues =
    ["X", "O", "O",
    null, "X", null,
    null, null, null];

  const game = mount(
    <Game squares={boardValues}/>
  );

  // X plays and wins the game!
  game.find('button#8').simulate('click');

  // O tries to play
  game.find('button#7').simulate('click');

  expect(game.find('.errorMessage').text()).toEqual("Game finished");
  expect(game.find('button#7').text()).toEqual('');
});

test('If all the board is completed then it\'s a tie', () =>{
  var boardValues =
    ["X", "X", "O",
    "O", "O", "X",
    "X", "O", null];

  const game = mount(
    <Game squares={boardValues}/>
  );

  // X plays and it's a tie!
  game.find('button#8').simulate('click');

    expect(game.find('.winner').text()).toEqual("Winner: tie");

});

test('Should be able to start a new round when game finishes', () =>{

  var boardValues =
    ["X", "O", "O",
    null, "X", null,
    null, null, null];

  const game = mount(
    <Game squares={boardValues}/>
  );

  // X plays : X wins
  game.find('button#8').simulate('click');

  // Restart!
  game.find('button#next-round').simulate('click');

  // O can play
  game.find('button#0').simulate('click');

  expect(game.find('button#0').text()).toEqual('O');
});



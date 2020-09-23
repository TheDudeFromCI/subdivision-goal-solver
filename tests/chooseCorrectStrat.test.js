const { Solver } = require('subdivision-goal-solver');

class UpdateColor {
  constructor(state) {
    this.state = state;
    this.name = 'updateColor';
    this.taskType = 'setColor';
  }

  getHeuristic(task) {
    return {
      cost: 1,
      childTasks: []
    }
  }

  execute(task, solver, cb) {
    this.state.color = task.value;
    cb();
  }
}

class UpdateNumber {
  constructor(state) {
    this.state = state;
    this.name = 'updateNumber';
    this.taskType = 'setNumber';
  }

  getHeuristic(task) {
    return {
      cost: 0,
      childTasks: []
    }
  }

  execute(task, solver, cb) {
    this.state.number = task.value;
    cb();
  }
}

test('update the color', () => {
  const state = {
    color: 'red',
    number: 23
  }

  const solver = new Solver();
  solver.strategies.push(new UpdateColor(state));
  solver.strategies.push(new UpdateNumber(state));

  const task = {
    name: 'setColor',
    value: 'blue'
  }

  solver.handleTask(task, () => {
    expect(state.number).toBe(23);
    expect(state.color).toBe('blue');
  })
})
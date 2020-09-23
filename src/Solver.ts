import { Strategy, Callback, Task, Heuristic } from ".";

const UNLIKELY_TO_RESOLVE_COST = 1000000;

/**
 * A solver that attempts to handle a given task by procedurally generating
 * child task trees.
 */
export class Solver
{
    /**
     * The list of strategies the solve is allowed to pick from.
     */
    strategies: Strategy[] = [];

    /**
     * The maximum search depth to use when estimating heuristics.
     */
    searchDepth: number = 8;

    /**
     * Handles the given task using available stratagies.
     * 
     * @param task - The task to handle.
     * @param cb - The callback to be executed when finished.
     */
    handleTask(task: Task, cb: Callback): void
    {
        const strats = this.findSolutionsFor(task);

        const tryNext = (index: number) =>
        {
            if (index >= strats.length)
            {
                cb(new Error("No solution found!"));
                return;
            }

            strats[index][0].execute(task, this, err =>
            {
                if (err)
                    tryNext(index + 1);
                else
                    cb();
            });
        }

        tryNext(0);
    }

    /**
     * Searches through all available strategies to use for solving the given
     * task and estimates the best strategies to use.
     * 
     * @param task - The task.
     * 
     * @returns A list of all strategies that can be used to solve the given
     *          task, sorted by lowest estimated cost to highest. Each entry
     *          in the list is a tuple containing the strategy and the estimated
     *          total cost for chosing that strategy.
     */
    private findSolutionsFor(task: Task): [Strategy, number][]
    {
        const nodes: [Strategy, number][] = [];

        for (const strat of this.strategies)
        {
            const h = this.getHeuristicFor(task, strat);

            if (!h)
                continue;
            
            let cost = h.cost;

            for (const child of h.childTasks)
                cost += this.resolveCostFor(child, this.searchDepth - 1);

            nodes.push([strat, cost]);
        }

        nodes.sort((a, b) => a[1] - b[1]);
        return nodes;
    }

    private getHeuristicFor(task: Task, strategy: Strategy): Heuristic | null
    {
        if (task.name != strategy.taskType)
            return null;

        return strategy.getHeuristic(task);
    }

    /**
     * Resursively tests all strategies for the given task as well as child tasks that
     * may be created in up to the given depth to estimate the minimum cost that would
     * be required to solve the given task.
     * 
     * @param task - The task.
     * @param maxDepth - The maximum tree depth of child nodes to check.
     * 
     * @returns The estimated minimum cost to handle the given task.
     */
    private resolveCostFor(task: Task, maxDepth: number): number
    {
        let cost = UNLIKELY_TO_RESOLVE_COST

        for (const strat of this.strategies)
        {
            const h = this.getHeuristicFor(task, strat);

            if (!h)
                continue;

            let childCost = h.cost;

            if (maxDepth > 1)
            {
                for (const childTask of h.childTasks)
                    childCost += this.resolveCostFor(childTask, maxDepth - 1);
            }

            cost = Math.min(cost, childCost);
        }

        return cost;
    }
}
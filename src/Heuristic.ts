import { Task } from ".";

/**
 * An estimate for the cost for preforming a task as well as the estimated
 * child tasks to be executed.
 */
export interface Heuristic
{
    /**
     * The cost of solving the task with the given strategy.
     */
    cost: number;

    /**
     * A list of child task that are estimated to be generated during execution.
     */
    childTasks: Task[];
}
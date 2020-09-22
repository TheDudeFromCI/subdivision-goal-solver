import { Heuristic, Task, Solver } from ".";

/**
 * A callback when a strategy has finished being executed.
 * 
 * @param err - The error that was thrown during execution, or undefined if
 *              the task was resolved successfully.
 */
export type Callback = (err?: Error) => void;

/**
 * A handler for resolving a specific type of task.
 */
export interface Strategy
{
    /**
     * Gets the name of this strategy type.
     */
    readonly name: string;

    /**
     * Gets the type of task that this strategy attempts to handle.
     */
    readonly taskType: string;

    /**
     * Gets the heuristic estimate for resolving the given task.
     * 
     * @param task - The task.
     * @returns The heuristic object, or null if this strategy cannot handle
     *          the given task.
     */
    getHeuristic(task: Task): Heuristic | null;

    /**
     * Execute the given task.
     * 
     * @param task - The task to execute.
     * @param solver - The solver to use when creating child tasks.
     * @param cb - The callback to execute when finished.
     */
    execute(task: Task, solver: Solver, cb: Callback): void;
}
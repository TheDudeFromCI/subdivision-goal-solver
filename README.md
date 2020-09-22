# Subdivision Goal Solver

The purpose of this small library is to create a simple implementation tthat allows an artificial intelligence agent to preform a given task by subdiving that task into smaller tasks as needed based on the current world state. In essence, this module creates an infinite state machine that generates new nodes procedurally based on the current environment around the agent.

This algorithm works on the princple of resolving "dependency" tasks as needed in order to complete higher level tasks. These smaller tasks can then create and resolve their own dependency tasks as needed to be completed.